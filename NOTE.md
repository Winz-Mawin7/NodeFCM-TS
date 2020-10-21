Run `yarn build` before docker

Run `docker build --tag winz7/node-fcm .` before stack deploy

`docker stack deploy --compose-file docker-compose.yml stack-fcm`

`docker service create --replicas 2 --name node-fcm-stack -p 8088:8088 winz7/node-fcm`

`docker stack deploy -c docker-compose.yml stack-fcm-monitoring`

Caution !! `docker system prune -a`

`docker stack ls`

`docker stack ps stack-fcm-monitoring`

`docker stack services stack-fcm-monitoring`

`docker stack rm stack-fcm-monitoring`
