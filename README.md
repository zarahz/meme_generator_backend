# Meme Generator Backend 

### Run project with
```
yarn serve
```
or
```
nodemon ./src/app.js
```

### Prerequisite
Install and run mongoDB (see: https://docs.mongodb.com/manual/administration/install-community/ )

#### MongoDB cheatsheet for Ubuntu based Linux

Install it with these commands
```
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install -y mongodb-org
```
Start, Stop Restart it with these commands
```
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl restart mongod

```
