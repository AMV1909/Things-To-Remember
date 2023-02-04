# How To Config A MongoDB Database In Linux?

> Steps to config a MongoDB Database in a virtual machine with Ubuntu

## 1. Install MongoDB

```
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

## 2. Run MongoDB Community Edition

```
sudo systemctl start mongod
sudo systemctl status mongod
mongosh
```

## 3. Create a password for the Database

```
use admin
db.createUser(
	{
		user: "admin",
		pwd: "DevLog",
		roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ],
		passwordDigestor: "server"
	}
)
```

## 4. Enable Config

```
sudo nano /etc/mongod.conf
```

Scroll down to find the commented-out net section:

```
net:
 port: 27017
 bindIp: 127.0.0.1
```

Change the net section like this:

```
net:
 port: 27017
 bindIp: 127.0.0.1,your_IP_address
```

Scroll down to find the commented-out security section:

```
#security:

#operationProfiling:
```

Change the security section like this:

```
security:
  authorization: enabled

#operationProfiling:
```

Save the file and restart the service

```
sudo systemctl restart mongod
sudo systemctl status mongod
```

## 5. Log into the Database

Check the database is OK and then exit

```
mongo -u your_username -p --authenticationDatabase admin

exit
```

## 6. Allow the port 27017 in the Firewall of Linux

```
ufw allow 27017
```