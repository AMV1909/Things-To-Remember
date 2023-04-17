# Deploy React Application With Github Actions In Virtual Machine

> Steps to deploy a React App to a Virtual Machine using Github Actions and Nginx as a reverse proxy

## 1. Create a virtual machine

Create a virtual machine in whatever platform you want. I'm gonna be using Azure. (Be sure to open the port 22 for ssh)

## 2. Log in the virtual machine via ssh

Log in the virtual machine via ssh. In Azure and other services, you can set up a ssh key in the virtual machine settings or use a password. I'm gonna be using a password. To log in, use the following command in your terminal:

```
ssh username@ip
```

Then, you will be asked for the password. Enter it and you will be logged in.

## 3. Create a folder for your project

Create a folder for your project in the Virtual Machine. I'm gonna be using the folder `my-project` in the home directory, and a Frontend folder inside it. To create the folders, use the following command in the terminal:

```
mkdir my-project
cd my-project
```

## 4. Create a workflow for Github Actions

Create a workflow for Github Actions. To do this, go to the repository where you have your React App and click on Actions Tab. You can set up a workflow using the templates or creating a new one. I'm gonna create a new one. To do this, click in the button Set up a workflow yourself and copy the following code:

```
name: Deploy React App

on:
  push:
    branches: [ "master" ]

jobs:
  build:

    runs-on: self-hosted

    strategy:
      matrix:
        node-version: [18.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test --if-present
```

Click in the button Start commit and then in the button Commit new file. Now, you have a workflow that will run every time you push to the master branch.

## 5. Create a runner for Github Actions

Create a runner for Github Actions. To do this, go to the repository where you have your React App and click on Settings Tab. Search for Code and automation section and click in the Action option and Runners. Click in the button New self-hosted runner and follow the instructions. All this next steps are based on the instructions of Github below the button. You can also follow the next steps on this section.

## 6. Install the runner in the virtual machine

1. Select the operating system of your virtual machine. In my case, I'm using Ubuntu 20.04. If you are using a different operating system, you can find the instructions [here](https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners).

2. Go to the virtual machine and download the latest runner package. To do this, go to the terminal and use the following command:

```
curl -o actions-runner-linux-x64-2.303.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.303.0/actions-runner-linux-x64-2.303.0.tar.gz
```

3. This step is optional. You can check the integrity of the downloaded package. To do this, use the following command:

```
echo "<sha256 checksum>  actions-runner-linux-x64-2.303.0.tar.gz" | shasum -a 256 -c
```

If the integrity is correct, the output should be: `actions-runner-linux-x64-2.303.0.tar.gz: OK`

4. Extract the installer. To do this, use the following command:

```
tar xzf ./actions-runner-linux-x64-2.303.0.tar.gz
```

You won't get any output, but you will see a new folder called `actions-runner`.

5. This step is optional. You can delete the downloaded package, since we don't need it anymore. To do this, use the following command:

```
rm actions-runner-linux-x64-2.303.0.tar.gz
```

## 7. Configure the runner

1. Create the runner and start the configuration experience

```
./config.sh --url https://github.com/<username>/<repository> --token <token>
```

It will ask you for some information about your company and other things. You can leave the default options just pressing enter in each question.

2. Run the runner `./run.sh`

Once you run the runner, it will keep running in the terminal. You can close the terminal and the runner will keep running. If you want to stop the runner, do `Ctrl + C` in the terminal. If you want to run the runner in the background, use the following command instead: `./run.sh &`

Once the runner finishes the configuration and runs all the steps in our workflow, you will find a new folder called `_work` or the name you set up for the folder for the project when you configured the runner. In this folder, you will find different folders with files for the configuration of the runner, the repository, the workflow, the steps, etc. Navigate inside the folders that have the name of your repository and you will find finally all the files of your React App including the `dist` folder.

## 8. Install Nginx

To show the React App in the browser, we need a web server. We are gonna use Nginx. To install it, use the following command:

```
sudo apt update
sudo apt install nginx
```

## 9. Open the port 80 (http)

Open the port 80 in the virtual machine. In Azure, you can do this in the Network Security Group. In other services, you can do this in the firewall settings of the virtual machine. I'm gonna use the terminal because is quicker. To do this, use the following command:

Check the status of the firewall:

```
sudo ufw status
```

If the firewall is inactive, you can activate it with the following command:

```
sudo ufw enable
```

Then, you can open the port 80 with the following command:

```
sudo ufw allow http
```

Also open the port 22 for ssh, if you haven't done it yet and close the terminal, you won't be able to log in again because port 22 is closed.

```
sudo ufw allow ssh
```

If you search the ip of the virtual machine in the browser, you will see the default page of Nginx.

## 10. Configure Nginx

Configure Nginx to show the React App. To do this, go to the folder where you have the React App and copy the route of the `dist` folder to the virtual machine. To do this, go to the `dist` folder and use the command `pwd`.

Now open the file `/etc/nginx/sites-available/default` with nano or whatever text editor you want. Remember use sudo to opens the file, because you need to have permissions to edit it.

```
sudo nano /etc/nginx/sites-available/default
```

You will see something like this:

```
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;

    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Change the root folder to the route of the `dist` folder. The file should look like this:

```
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /home/<username>/<repository>/_work/<repository>/dist;

    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Save the file and close the terminal. Restart Nginx with the following command:

```
sudo systemctl restart nginx
```

Now, if you search the ip of the virtual machine in the browser, you will see the React App.

If you wanna set up a domain name with SSL Certification, you can follow the instructions in the Nginx SSL Certificate file in this repository.
