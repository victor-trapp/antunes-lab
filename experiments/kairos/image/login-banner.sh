#!/bin/sh

# Only show the banner in interactive shells.
case "$-" in
    *i*) ;;
    *) return 0 2>/dev/null || exit 0 ;;
esac
[ -t 1 ] || { return 0 2>/dev/null || exit 0; }

if [ -t 1 ] && [ "${TERM:-dumb}" != "dumb" ]; then
    M='\033[95m'
    Y='\033[93m'
    C='\033[96m'
    D='\033[90m'
    R='\033[0m'
else
    M=''; Y=''; C=''; D=''; R=''
fi

printf "%b" "${M}"
cat <<'TRAPPOS_ART'

  ████████╗██████╗  █████╗ ██████╗ ██████╗        ██████╗ ███████╗
  ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗      ██╔═══██╗██╔════╝
     ██║   ██████╔╝███████║██████╔╝██████╔╝█████╗██║   ██║███████╗
     ██║   ██╔══██╗██╔══██║██╔═══╝ ██╔═══╝ ╚════╝██║   ██║╚════██║
     ██║   ██║  ██║██║  ██║██║     ██║           ╚██████╔╝███████║
     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝            ╚═════╝ ╚══════╝
TRAPPOS_ART
printf "%b" "${R}"

_host=$(hostname 2>/dev/null)
_kairos=$(. /etc/kairos-release 2>/dev/null; echo "${KAIROS_VERSION:-unknown}")
_ip=$(ip -4 -o addr show scope global 2>/dev/null | awk '{print $4}' | cut -d/ -f1 | paste -sd, -)
_k3s=$(systemctl is-active k3s 2>/dev/null || systemctl is-active k3s-agent 2>/dev/null || echo "n/a")

printf "  ${Y}%-10s${R} %s\n" "node"   "${_host:-unknown}"
printf "  ${Y}%-10s${R} %s\n" "kairos" "${_kairos}"
printf "  ${Y}%-10s${R} %s\n" "addr"   "${_ip:-none}"
printf "  ${Y}%-10s${R} %s\n" "k3s"    "${_k3s}"
echo

unset _host _kairos _ip _k3s M Y C D R
