# edge-status-api

Tiny Go HTTP service I use to test workloads on my Talos K8s home lab (learning purpose).

Five endpoints, all return JSON:

- `/` - basic up message
- `/health` - liveness
- `/ready` - readiness
- `/version` - service name, version, hostname, timestamp
- `/info` - env vars loaded into the container

Info comes from env vars: `PORT`, `APP_VERSION`, `ENVIRONMENT`, `SITE_NAME`, `MESSAGE`.

## Run locally

```bash
go run .
curl localhost:8080/health
curl localhost:8080/version
```

Override defaults:

```bash
PORT=9090 APP_VERSION=0.1.0 SITE_NAME=trapp-lab go run .
```

## Build the image

```bash
docker build -t edge-status-api:0.1.0 .
```

Or from repo root:

```bash
docker build -t edge-status-api:0.1.0 apps/edge-status-api
```

## Deploy to the cluster

Helm chart lives in `chart/`.

```bash
helm install edge-status-api ./chart -n trapp-lab --create-namespace
kubectl -n trapp-lab get pods -o wide
kubectl -n trapp-lab rollout status deploy/edge-status-api
```

Upgrade after changing the chart or `values.yaml`:

```bash
helm upgrade edge-status-api ./chart -n trapp-lab
```

Service is NodePort 30080:

```bash
curl http://<worker-ip>:30080/version
curl http://<worker-ip>:30080/info
```