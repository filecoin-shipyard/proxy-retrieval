## How to configure Caddy reverse proxy from port 443 to 1234

### Steps to install Caddy to your ubuntu machine

```
$ git clone "https://github.com/caddyserver/caddy.git"
$ cd caddy/cmd/caddy/
$ go build
$ sudo mv caddy /usr/bin/

Test that it worked: $ caddy version

$ sudo groupadd --system caddy
$ sudo useradd --system \
    --gid caddy \
    --create-home \
    --home-dir /var/lib/caddy \
    --shell /usr/sbin/nologin \
    --comment "Caddy web server" \
    caddy
```

### Create a caddy file

`sudo vim /etc/caddy/Caddyfile`

### Caddy file example

```
https://domain {
  @options {
        method OPTIONS
  }

  handle @options {
        header Access-Control-Allow-Origin *
        header Access-Control-Allow-Headers *
        header Access-Control-Request-Method *
        header Access-Control-Allow-Credentials true
        respond 204
  }

  log
  route * {
   reverse_proxy /* :3000
  }
}
```

### Create a caddy service

```
$ sudo vim /etc/systemd/system/caddy.service

In this file you should copy paste this: https://github.com/caddyserver/dist/blob/master/init/caddy.service

After saving your service file, you can start the service for the first time with the usual systemctl dance:
$ sudo systemctl daemon-reload
$ sudo systemctl enable caddy
$ sudo systemctl start caddy

$ systemctl status caddy
```
