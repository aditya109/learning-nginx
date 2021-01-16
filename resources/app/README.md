# Docker + NodeJS + .envs

## Getting Started

To build image of this application locally, type the following :

```powershell
docker build -t nodeapp:0.1 .
```

To run an instances of this app, type:

```powershell
docker container run --detach -e APPID=2222 -p 2222:8080 nodeapp:0.1
```

Change the APPID env and type again to get multiple containers running locally:

```powershell
🐳 » docker container run --detach -e APPID=2222 -p 2222:8080 nodeapp:0.1
159b0647d45ac08d3d38462d6970a3905d6317fb32dea8361ab7e67269f80d26
🐳 » docker container run --detach -e APPID=3333 -p 3333:8080 nodeapp:0.1
ef639a8895db21c1ff4acafd3df2103f5b13e646db0825aac461fb2eacc13e65
🐳 » docker container run --detach -e APPID=4444 -p 4444:8080 nodeapp:0.1
661045e8033040419852ba3b962acb3d498059de61d0711ec031cac3785c2d49
```

To view containers running, type:

```powershell
🐳 » docker container ls -a
CONTAINER ID   IMAGE         COMMAND            CREATED          STATUS          APPIDS                              NAMES
d17a4a94c459   nodeapp:0.1   "node server.js"   10 seconds ago   Up 8 seconds    9999/tcp, 0.0.0.0:2222->8080/tcp   jovial_heyrovsky
0ca1ce0c01a2   nodeapp:0.1   "node server.js"   24 seconds ago   Up 22 seconds   9999/tcp, 0.0.0.0:3333->8080/tcp   trusting_euclid
6935f1071265   nodeapp:0.1   "node server.js"   29 seconds ago   Up 28 seconds   9999/tcp, 0.0.0.0:4444->8080/tcp   musing_brown
```
