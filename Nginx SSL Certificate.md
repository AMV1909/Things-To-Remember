# Nginx SSL Certicate

> Steps to deploy a Node.js app to DigitalOcean using PM2, NGINX as a reverse proxy and an SSL from LetsEncrypt

## 1. Sign up for Digital Ocean

Create an account in Digital Ocean or any other platform to get virtual machines

## 2. Create a droplet and log in via ssh

I will be using the root user, but would suggest creating a new user

## 3. Install Node/NPM

```
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt install nodejs

node --version
```

## 4. Clone your project from Github

There are a few ways to get your files on to the server, I would suggest using Git

```
git clone your_project.git
```

## 5. Install dependencies and test app

```
cd your_project
npm i
npm start (or whatever your start command)
# stop app
ctrl+C
```

## 6. Setup PM2 process manager to keep your app running

```
sudo npm i pm2 -g
pm2 start app (or whatever your file name)

# Other pm2 commands
pm2 show app
pm2 status
pm2 restart app
pm2 stop app
pm2 logs (Show log stream)
pm2 flush (Clear logs)

# To make sure app starts when reboot
pm2 startup ubuntu
```

### You should now be able to access your app using your IP and port. Now we want to setup a firewall blocking that port and setup NGINX as a reverse proxy so we can access it directly using port 80 (http)

## 7. Setup ufw firewall

