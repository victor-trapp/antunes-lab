#!/usr/bin/env bash
KUBE_LOG_TAIL="${KUBE_LOG_TAIL:-200}"

journalctl() {
  if [[ "$1" == "-u" && "$2" == */* ]]; then
    local target="$2"
    shift 2

    local namespace="${target%/*}"
    local deployment="${target##*/}" 

    kubectl -n "$namespace" logs "deploy/$deployment" --tail="$KUBE_LOG_TAIL" "$@"
    return
  fi

  command journalctl "$@"
}

systemctl() {
  local action="$1"
  local target="$2"

  if [[ -n "$action" && "$target" == */* ]]; then
    shift 2

    local namespace="${target%/*}"  
    local deployment="${target##*/}"

    case "$action" in
      status)
        kubectl -n "$namespace" describe "deploy/$deployment" "$@"
        ;;
      restart)
        kubectl -n "$namespace" rollout restart "deploy/$deployment" "$@"
        ;;
      stop)
        kubectl -n "$namespace" scale "deploy/$deployment" --replicas=0 "$@"
        ;;
      start)
        kubectl -n "$namespace" scale "deploy/$deployment" --replicas=1 "$@"
        ;;
      *)
        command systemctl "$action" "$target" "$@"
        ;;
    esac

    return
  fi

  command systemctl "$@"
}
