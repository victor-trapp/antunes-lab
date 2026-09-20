#!/usr/bin/env bash

# Build the Kairos ISO.
set -euo pipefail

cd "$(dirname "$(readlink -f "$0")")"

# Choose the base image and ISO builder.
readonly BASE_IMAGE="quay.io/kairos/ubuntu:24.04-standard-amd64-generic-v3.6.0-k3s-v1.33.5-k3s1"
readonly AURORABOOT="quay.io/kairos/auroraboot:latest"

# Use the control plane config unless another file is passed.
readonly NODES_DIR="nodes"
readonly IMAGE_DIR="image"
readonly NODE_CONFIG="${1:-control-plane.yaml}"
readonly NODE_CONFIG_PATH="$NODES_DIR/$NODE_CONFIG"

readonly ARTIFACTS="artifacts"

# Print progress and error messages.
log() { printf '\033[96m==>\033[0m %s\n' "$*"; }
die() { printf '\033[91mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

# Copy a file to its location in the image.
stage_file() {
    local src=$1 tree=$2 dest=$3
    [ -f "$src" ] || die "missing source file: $src"
    mkdir -p "$STAGE/$tree/$(dirname "$dest")"
    cp -p "$src" "$STAGE/$tree/$dest"
}

# Add the boot menu and login banner.
stage_overlays() {
    stage_file "$IMAGE_DIR/boot-menu.cfg"    iso     boot/grub2/grub.cfg
    stage_file "$IMAGE_DIR/login-banner.sh"  rootfs  etc/profile.d/00-trapp-os-banner.sh
    chmod 0755 "$STAGE/rootfs/etc/profile.d/00-trapp-os-banner.sh"
}

# Check the config and Docker before building.
[ "$NODE_CONFIG" = "$(basename "$NODE_CONFIG")" ] \
    || die "pass just the filename, not a path: $NODE_CONFIG (configs live in $NODES_DIR/)"
[ -f "$NODE_CONFIG_PATH" ] \
    || die "no such node config: $NODE_CONFIG_PATH  (have: $(ls "$NODES_DIR" | tr '\n' ' '))"
[ -d "$IMAGE_DIR" ]          || die "$IMAGE_DIR/ is missing"
command -v docker >/dev/null || die "docker not found"

# Check that the file has one cloud-config header.
headers=$(grep -c '^#cloud-config' "$NODE_CONFIG_PATH" || true)
[ "$headers" -eq 1 ] \
    || die "$NODE_CONFIG_PATH has $headers '#cloud-config' headers, expected exactly 1"

# Keep staging here so snap Docker can read it.
readonly STAGE="$ARTIFACTS/staging"

# Prepare staging and remove it when the script exits.
mkdir -p "$ARTIFACTS"
rm -rf "$STAGE"
trap 'rm -rf "$STAGE"' EXIT
stage_overlays

# Check that Docker can read the staged files.
docker run --rm -v "$PWD":/output alpine:3.20 \
    test -f "/output/$STAGE/iso/boot/grub2/grub.cfg" \
    || die "staged overlays are not visible inside the container - check docker bind-mount confinement"

log "base image   $BASE_IMAGE"
log "node config  $NODE_CONFIG_PATH"
log "output       $ARTIFACTS/"

# Download the base image and build the ISO.
log "pulling base image"
docker pull --quiet "$BASE_IMAGE" >/dev/null

log "building ISO (a few minutes, ~1.2 GB)"
docker run --rm --privileged \
  -v "$PWD":/output \
  "$AURORABOOT" \
  build-iso \
  --output "/output/$ARTIFACTS" \
  -c "/output/$NODE_CONFIG_PATH" \
  --overlay-iso "/output/$STAGE/iso" \
  --overlay-rootfs "/output/$STAGE/rootfs" \
  "$BASE_IMAGE"

# Give the build files back to the current user.
if [ "$(id -u)" -ne 0 ]; then
    sudo -n chown -R "$(id -u):$(id -g)" "$ARTIFACTS" 2>/dev/null \
        || log "note: artifacts are root-owned; 'sudo chown -R $(id -un): $ARTIFACTS' to fix"
fi

# Find the newest ISO.
iso=$(ls -t "$ARTIFACTS"/*.iso 2>/dev/null | head -1) || die "build produced no ISO"
log "built $iso"

# Check the ISO against its checksum.
log "verifying checksum"
( cd "$ARTIFACTS" && sha256sum -c "$(basename "$iso").sha256" >/dev/null ) \
    || die "checksum mismatch on $iso"

# Check that the config, menu and banner made it into the ISO.
log "verifying ISO contents"
docker run --rm --privileged -v "$PWD":/w alpine:3.20 sh -c "
set -e
apk add --no-cache squashfs-tools >/dev/null 2>&1 \
    || { echo 'FAIL: could not install squashfs-tools to inspect the image'; exit 1; }
mkdir -p /mnt/iso
mount -t iso9660 -o loop,ro '/w/$ARTIFACTS/$(basename "$iso")' /mnt/iso

cmp -s /mnt/iso/config.yaml '/w/$NODE_CONFIG_PATH' \
    || { echo 'FAIL: baked config.yaml does not match $NODE_CONFIG_PATH'; exit 1; }
echo '  ok  baked config matches $NODE_CONFIG_PATH'

cmp -s /mnt/iso/boot/grub2/grub.cfg /w/$IMAGE_DIR/boot-menu.cfg \
    || { echo 'FAIL: boot menu on ISO does not match $IMAGE_DIR/boot-menu.cfg'; exit 1; }
echo '  ok  boot menu matches $IMAGE_DIR/boot-menu.cfg'

for cfg in /mnt/iso/EFI/BOOT/grub.cfg /mnt/iso/boot/grub/grub.cfg; do
    grep -q 'boot/grub2' \"\$cfg\" \
        || { echo \"FAIL: \$cfg does not chain to the branded menu\"; exit 1; }
done
echo '  ok  UEFI and BIOS both chain to the branded menu'

unsquashfs -q -d /tmp/rfs /mnt/iso/rootfs.squashfs \
    etc/profile.d/00-trapp-os-banner.sh >/dev/null 2>&1 || true
cmp -s /tmp/rfs/etc/profile.d/00-trapp-os-banner.sh /w/$IMAGE_DIR/login-banner.sh \
    || { echo 'FAIL: login banner missing from the OS image'; exit 1; }
echo '  ok  login banner baked into the OS image'

umount /mnt/iso
"

log "done: $iso"
echo
echo "  Next: upload via terraform (proxmox-lab/), or write to USB."
echo "  Read the USB safety note in README.md before going near real hardware."
