[Reference](https://andyreagan.medium.com/great-expectations-of-vertica-99a2c886cd58)

To work with windows docker in cli, run `$ "C:\Program Files\Docker\Docker\DockerCli.exe" -SwitchDaemon`


## Pulling and running vertica container
`$ docker pull vertica/vertica-ce:12.0.2-0`

```
$ docker run -p 5433:5433 -p 5444:5444 \
           --mount type=volume,source=vertica-data,target=//c/grisha/src/vertica-db \
           --name vertica_ce \
           vertica/vertica-ce:12.0.2-0
```
## Test connection inside container's bash / DBeaver
- `$ /opt/vertica/bin/vsql`
- `=> \c VMart`
- `=> \dt`
- `=> select * from public.product_dimension limit 5;`

<img width="679" alt="image" src="https://user-images.githubusercontent.com/1709151/216827595-0218524b-df2d-48d0-bbc6-9bfe9ea7ab56.png">

## Run notebook and connect tot Vertica with SQLAlchemy
USe [this](https://github.com/griko/tutorials/blob/master/jupyter-notebook-docker.md) tutorial to run a minimal/notebook container.

Install `sqlalchemy-vertica` and `vertica-python`. 

Check vertica's container IP with `$ docker container inspect vertica_ce | grep IP`. In my case it is 172.17.0.2.

Check that you can establish connection from the notebook to vertica using SQLAlchemy.

<img width="523" alt="image" src="https://user-images.githubusercontent.com/1709151/216829240-a7634890-a5a5-4ecb-9101-af33b2b8c030.png">


