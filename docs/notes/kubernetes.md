# Kubernetes Notes

Notes I keep as I learn Kubernetes in the lab.

## Basic commands I use regularly

```bash
# see what is running
kubectl get pods -A
kubectl get nodes -o wide

# check a specific namespace
kubectl -n trapp-lab get pods
kubectl -n trapp-lab get all

# check pod details and events
kubectl -n trapp-lab describe pod <pod-name>

# check logs
kubectl -n trapp-lab logs <pod-name>

# watch a rollout
kubectl -n trapp-lab rollout status deploy/edge-status-api

# apply manifests
kubectl apply -f k8s/

# delete everything in a namespace
kubectl -n trapp-lab delete all --all
```

## Namespaces

Namespaces are a way to group resources inside the cluster. I use `trapp-lab` as my main namespace for lab workloads.

```bash
kubectl get namespaces
kubectl apply -f k8s/namespace.yaml
```

## Deployments

A Deployment manages a set of pods. It keeps the desired number of replicas running and handles rolling updates.

Key fields I use:

- `replicas` — how many pods to run
- `selector` and `labels` — how the Deployment finds its pods
- `containers` — what image to run and what ports, env, and resources it needs
- `livenessProbe` / `readinessProbe` — how Kubernetes checks if the pod is healthy

## Probes

Probes are how Kubernetes knows if your pod is working.

**Liveness probe** — if this fails, Kubernetes restarts the pod

**Readiness probe** — if this fails, Kubernetes stops sending traffic to the pod but does not restart it

I use HTTP GET probes on `/health` and `/ready` in `edge-status-api`.

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: http
  initialDelaySeconds: 10
  periodSeconds: 20

readinessProbe:
  httpGet:
    path: /ready
    port: http
  periodSeconds: 10
```

## ConfigMaps

ConfigMaps store configuration that gets injected into containers as env vars.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: status-config
data:
  ENVIRONMENT: "home-lab"
  SITE_NAME: "trapp-lab"
```

Then in the deployment:

```yaml
envFrom:
  - configMapRef:
      name: status-config
```

## Services

Services expose pods to the network. Types I have used:

- `ClusterIP` — internal to the cluster only
- `NodePort` — accessible from outside the cluster on a specific port on the node

```yaml
spec:
  type: NodePort
  ports:
    - port: 8080
      targetPort: http
      nodePort: 30080
```

## Resource limits

Setting CPU and memory limits prevents one pod from eating all the resources on a node.

```yaml
resources:
  requests:
    cpu: 50m
    memory: 64Mi
  limits:
    cpu: 250m
    memory: 128Mi
```

`requests` is what Kubernetes uses for scheduling. `limits` is the ceiling the pod cannot go past.
