# K8S Diagnostics Script

Shell scripts I use to help manage and diagnose the home lab.

Collects a snapshot of the cluster state and saves it to a local folder.

Useful when something is broken and you want to capture everything before it changes or gets cleaned up.

```bash
chmod +x k8s-diag.sh
./k8s-diag.sh
```

Output goes to a timestamped folder so you can run it multiple times without overwriting anything.