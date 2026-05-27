# experiments/kube-aliases.sh

This is an experiment, not a recommendation.

I wanted to try an idea I have seen in other places, where people make Kubernetes feel a little bit closer to normal Linux troubleshooting. Because most of my troubleshooting experience is around Linux commands like `journalctl`, `systemctl`, and service restarts, I wanted to see if I could map some of that muscle memory into `kubectl`.

The idea was simple: when I type something that looks like a Kubernetes workload, the wrapper runs `kubectl` underneath. When I type a normal Linux command, it should fall back to the real `journalctl` or `systemctl`.

I kept this inside `experiments/` because it is useful for learning, but I would not wire this into a real machine. Shadowing standard Linux commands can be risky, especially if someone does not realise that `systemctl restart` is actually changing a Kubernetes deployment.

## What it does

The script defines shell functions called `journalctl` and `systemctl`.

If the target contains a `/`, the script treats it as a Kubernetes workload.

The format I tested is:

```text
<namespace>/<deployment-name>
```

For example:

```bash
journalctl -u mender/mender-gui
```

gets translated into:

```bash
kubectl -n mender logs deploy/mender-gui --tail=200
```

The `/` is the safety check.

If there is no `/`, the command goes to the real Linux binary instead. So normal commands like these still work:

```bash
journalctl -u k0scontroller
systemctl status sshd
```

That was important to me because I did not want the experiment to break normal Linux troubleshooting.

## Command mapping

| What I type | What actually runs |
|---|---|
| `journalctl -u mender/mender-gui` | `kubectl -n mender logs deploy/mender-gui --tail=200` |
| `journalctl -u mender/mender-gui -f` | `kubectl -n mender logs deploy/mender-gui --tail=200 -f` |
| `systemctl status mender/mender-gui` | `kubectl -n mender describe deploy/mender-gui` |
| `systemctl restart mender/mender-gui` | `kubectl -n mender rollout restart deploy/mender-gui` |
| `systemctl stop mender/mender-gui` | `kubectl -n mender scale deploy/mender-gui --replicas=0` |
| `systemctl start mender/mender-gui` | `kubectl -n mender scale deploy/mender-gui --replicas=1` |

## Important notes before using it

The read-only commands are the safer ones:

```bash
journalctl -u mender/mender-gui
systemctl status mender/mender-gui
```

These only read logs or describe the deployment.

The commands below change the cluster:

```bash
systemctl restart mender/mender-gui
systemctl stop mender/mender-gui
systemctl start mender/mender-gui
```

They are not just cosmetic commands.

`restart` really runs a Kubernetes rollout restart.

`stop` really scales the deployment down to zero.

`start` scales it back to one replica.

One limitation I noticed is that the wrapper does not remember the previous replica count. So if a deployment had three replicas, and I run:

```bash
systemctl stop mender/mender-gui
systemctl start mender/mender-gui
```

it will come back with one replica, not three.

Another thing to be careful with is the current Kubernetes context. The wrapper uses whatever `kubectl` is currently pointing at.

So before using it, I should always check:

```bash
kubectl config current-context
```

This matters because if the wrong context is loaded, the command could affect the wrong cluster.

## Installing it

The script needs to be sourced, not executed.

If I run it like this:

```bash
./experiments/kube-aliases.sh
```

it runs in a separate shell and then exits. That means the functions disappear straight away.

The correct way is:

```bash
source ~/antunes-lab/labs/mender-lab/experiments/kube-aliases.sh
```

To check if it loaded properly:

```bash
type journalctl
type systemctl
```

I should see something like:

```text
journalctl is a function
systemctl is a function
```

If I see this instead:

```text
journalctl is /usr/bin/journalctl
```

then the wrapper was not loaded into the current shell.

To load it automatically in every new shell, I can add this to `~/.bashrc`:

```bash
source ~/antunes-lab/labs/mender-lab/experiments/kube-aliases.sh
```

Then reload the shell:

```bash
source ~/.bashrc
```

## Testing it

First I tested the Kubernetes path:

```bash
journalctl -u mender/mender-api-gateway
journalctl -u mender/mender-deviceconfig -f
systemctl status mender/mender-inventory
```

Then I tested a workload that does not exist:

```bash
journalctl -u mender/does-not-exist
```

If the wrapper is working, I should get a Kubernetes-style error, something like:

```text
Error from server (NotFound)
```

That tells me the wrapper did run `kubectl`.

Then I tested normal Linux commands to make sure I had not broken the real tools:

```bash
journalctl -u k0scontroller --no-pager -n 10
systemctl is-active k0scontroller
systemctl status sshd
```

Because these targets do not contain `/`, they should go to the real `journalctl` and `systemctl`.

## Where the abstraction leaks

This was the most useful part of the experiment for me.

At first it feels like this maps quite nicely:

```text
journalctl -u service
systemctl status service
systemctl restart service
```

to:

```text
kubectl logs
kubectl describe
kubectl rollout restart
```

But Kubernetes does not work exactly like systemd.

The wrapper assumes that everything is a Kubernetes `Deployment`.

That is not always true.

For example, if Traefik is running as a `DaemonSet`, this will fail:

```bash
journalctl -u traefik/traefik
```

with something like:

```text
Error from server (NotFound): deployments.apps "traefik" not found
```

The problem is not that Traefik does not exist. The problem is that the wrapper asked Kubernetes for a Deployment called `traefik`, but Traefik might be a DaemonSet instead.

The same thing can happen with a StatefulSet pod:

```bash
journalctl -u mender/mender-nats-0
```

That fails because `mender-nats-0` is a pod name, not a deployment name.

So if I see this kind of error:

```text
deployments.apps "<name>" not found
```

it means the wrapper probably worked, but I pointed it at the wrong Kubernetes object type.

To check what actually exists, I can run:

```bash
kubectl get all -n mender
```

A better version of this script would need to detect the workload type first and support:

```text
Deployments
DaemonSets
StatefulSets
Jobs
Pods
```

But at that point I would probably be rebuilding tools that already exist.

## What this taught me

The main thing I learned is that the Linux/systemd model and the Kubernetes model are similar in some places, but they are not the same.

With systemd, I usually think about one service unit:

```bash
systemctl status nginx
journalctl -u nginx
systemctl restart nginx
```

With Kubernetes, there are more layers:

```text
Deployment
  creates ReplicaSet
    creates Pod
      runs Container
```

So when I run:

```bash
systemctl restart mender/mender-gui
```

I am not restarting a service in the same way systemd would.

What I am really doing is asking Kubernetes to restart the Deployment rollout. Kubernetes then creates replacement pods and manages that process for me.

## Final note

I am keeping this in the lab because it helped me understand the mapping between Linux troubleshooting and Kubernetes troubleshooting.

It also showed me where the mapping breaks.