# Beszel

Beszel is the monitoring for the lab. It is light enough that I don't notice it
running, and it gives me one page with every machine on it.

It has two parts:

- **The hub** is the web UI. It keeps the history, the alerts and the list of
  machines in a built in database. There is one hub, on `ansible-cp`.
- **The agent** is a single binary that runs on every machine I want to watch.
  It reports CPU, memory, disk, network and temperatures, plus Docker
  containers if there are any.

The hub connects to each agent on port 45876 with a key the hub generates, so
that port has to be open to `ansible-cp`. Agents can also connect out to the
hub with a token instead, which is handy for a machine the hub can't reach.

On top of that, agents can run network monitors: ping, TCP, HTTP or DNS checks
against a target, every so many seconds. That is how I watch the router and
anything else that can't run an agent. Running the same check from more than
one agent tells me whether the target is down or just one machine's path to it.

What it does not do is custom dashboards or SNMP. You get the charts Beszel
gives you, and a switch only shows up as a target of a network monitor, not as
a machine with its own stats.

## How it is set up here

`beszel-hub.yml` installs the hub on `ansible-cp` with the `community.beszel.hub`
role. It runs as the `beszel-hub` systemd service, as the `beszel` user, with
its data in `/var/lib/beszel`. The UI is at `http://192.168.0.120:8090`.

```bash
ansible-galaxy collection install -r requirements.yml
ansible-playbook beszel-hub.yml -K
```

The version is pinned in the playbook. To upgrade, bump `hub_version` and run
it again.

Agents are not in Ansible. I add each machine from the UI with Add System,
which gives me an install command with the key and token already in it, and I
run that on the machine.

If the hub is acting up:

```bash
systemctl status beszel-hub
journalctl -u beszel-hub -n 50
```
