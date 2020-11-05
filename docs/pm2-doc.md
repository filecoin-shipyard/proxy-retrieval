## How to configure pm2

#### Steps to install pm2 to your ubuntu machine

```
$ npm install -g pm2
```

#### How to start your app with pm2

```
Start by navigating to your project directory.
$ cd /root/project

To start your app with pm2 use this command.
$ pm2 start npm --name "app name"  -- start

To check your running apps with pm2.
$ pm2 list

To restart an app.
$ pm2 restart "app name"

To stop your app.
$ pm2 delete "app name"
```
