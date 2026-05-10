#!/usr/bin/env bash
# k8s-diag.sh- capture a Kubernetes cluster snapshot for diagnostics.

set -euo pipefail

# args

NAMESPACE=""

usage() {
    cat <<EOF
usage: $(basename "$0") [-n <namespace>] [-h]

  -n <namespace>   target namespace (prompts if not set)
  -h               show this help
EOF
    exit 0
}

while getopts ":n:h" opt; do
    case "$opt" in
        n) NAMESPACE="$OPTARG" ;;
        h) usage ;;
        :)  echo "error: -$OPTARG requires an argument" >&2; exit 2 ;;
        \?) echo "error: unknown flag -$OPTARG" >&2; exit 2 ;;
    esac
done

# pre error handling

if ! command -v kubectl >/dev/null; then
    echo "error: kubectl not found in PATH" >&2
    exit 1
fi

if ! kubectl version --request-timeout=5s >/dev/null 2>&1; then
    echo "error: cluster unreachable - check your kubeconfig" >&2
    exit 1
fi

if [[ -z "$NAMESPACE" ]]; then
    read -rp "namespace [default]: " NAMESPACE
    NAMESPACE="${NAMESPACE:-default}"
fi

if ! kubectl get namespace "$NAMESPACE" >/dev/null 2>&1; then
    echo "error: namespace '$NAMESPACE' does not exist" >&2
    exit 1
fi

# setup output and directory

OUTDIR="/var/log/k8s-diag/k8s-diag-$(date +%Y%m%d-%H%M%S)"
CONTEXT="$(kubectl config current-context 2>/dev/null || echo unknown)"

if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
    BOLD=$'\033[1m'; CYAN=$'\033[0;36m'; GREEN=$'\033[0;32m'; DIM=$'\033[2m'; RESET=$'\033[0m'
else
    BOLD=""; CYAN=""; GREEN=""; DIM=""; RESET=""
fi

step() { printf "  ${CYAN}>${RESET} %-20s" "$1..."; }
ok()   { echo "${GREEN}ok${RESET}"; }

mkdir -p "$OUTDIR"

echo
echo "${BOLD}${CYAN}k8s diagnostics${RESET}"
echo "  ${DIM}context  :${RESET} $CONTEXT"
echo "  ${DIM}namespace:${RESET} $NAMESPACE"
echo "  ${DIM}output   :${RESET} $OUTDIR"
echo

# collect data

step "versions"
kubectl version > "$OUTDIR/versions.txt" 2>&1
ok

step "nodes"
kubectl get nodes -o wide  > "$OUTDIR/nodes.txt"          2>&1
kubectl describe nodes     > "$OUTDIR/nodes-describe.txt" 2>&1
ok

step "cluster pods"
kubectl get pods -A -o wide > "$OUTDIR/pods-all.txt" 2>&1
ok

step "namespace state"
kubectl -n "$NAMESPACE" get all,ingress,configmap,secret,pvc -o wide > "$OUTDIR/ns-resources.txt" 2>&1
kubectl -n "$NAMESPACE" describe pods > "$OUTDIR/ns-pods-describe.txt" 2>&1
ok

# summary and archive folder creation

DIRNAME="$(basename "$OUTDIR")"
tar -czf "${OUTDIR}.tar.gz" -C "$(dirname "$OUTDIR")" "$DIRNAME"

count=$(find "$OUTDIR" -type f | wc -l | tr -d ' ')
size=$(du -h "${OUTDIR}.tar.gz" | cut -f1)

echo
echo "${GREEN}${BOLD}done${RESET} - $count files in $OUTDIR"
echo "       archive: ${OUTDIR}.tar.gz ($size)"
echo