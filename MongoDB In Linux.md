# How To Config A MongoDB Database In Linux?

> Steps to config a MongoDB Database in a virtual machine with Ubuntu

## 1. Install MongoDB

### 1.1 Import the public key used by the package management system.

```
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
```

### 1.2 Create a list file for MongoDB.

```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

### 1.3 Reload local package database.

```
sudo apt-get update
```

### 1.4 Install the MongoDB packages.

```
sudo apt-get install -y mongodb-org
```

### 2. Run MongoDB Community Edition

