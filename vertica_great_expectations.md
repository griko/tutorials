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

By default, Vertica creates VMart database, which is great playground for Great Expectations.

## Test connection inside container's bash / DBeaver
- `$ /opt/vertica/bin/vsql`
- `=> \c VMart`
- `=> \dt`
- `=> select * from public.product_dimension limit 5;`

<img width="679" alt="image" src="https://user-images.githubusercontent.com/1709151/216827595-0218524b-df2d-48d0-bbc6-9bfe9ea7ab56.png">

## Run notebook and connect tot Vertica with SQLAlchemy
USe [this](https://github.com/griko/tutorials/blob/master/jupyter-notebook-docker.md) tutorial to run a jupyter/minimal-notebook container.

**Be sure to open 8888:8888 and 8889:8889 ports** e.g.

```
> docker run  --rm -p 8888:8888 -p 8889:8889 --name notebook  -v C:\grisha\src\jupyter-minimal:/home/jovyan/work -v notebook_libraries:/opt/conda/lib/python3.10/site-packages -v notebook_kernels:/opt/conda/envs -e JUPYTER_ENABLE_LAB=yes -it jupyter/minimal-notebook
```

Install `sqlalchemy-vertica` and `vertica-python`. 

Check vertica's container IP with `$ docker container inspect vertica_ce | grep IP`. In my case it is 172.17.0.2.

Check that you can establish connection from the notebook to vertica using SQLAlchemy.

<img width="523" alt="image" src="https://user-images.githubusercontent.com/1709151/216829240-a7634890-a5a5-4ecb-9101-af33b2b8c030.png">

## Enter Great Expectations

### Installation and data connection
[Tutorial APIv3](https://docs.greatexpectations.io/docs/)

From terminal (opened in jupyter-lab):
- `pip install great_expectations`
- `great_expectations -y init`
- `great_expectations datasource new` -> 2. "Relational database (SQL)" -> 7. "other - Do you have a working SQLAlchemy connection string?"

This opens another jupyter notebook server (inside jupyter lab... inception) on 8889 port. That's why you should 8889 when running the container.

Replace values in cells as you wish. The impportant cell is the one that declares the connection string, schema and table. For example we might ad the shipment_dimension table as a new datasource. E.g.:

```python
# The url/connection string for the sqlalchemy connection
# (reference: https://docs.sqlalchemy.org/en/latest/core/engines.html#database-urls)
connection_string = 'vertica+vertica_python://dbadmin:""@172.17.0.2:5433/VMart'

# If schema_name is not relevant to your SQL backend (i.e. SQLite),
# please remove from the following line and the configuration below
schema_name = "public"

# A table that you would like to add initially as a Data Asset
table_name = "shipping_dimension"
```
Then run all cells. You don't need the inner jupyter notebook anymore, unless you want to add more sources.

### Creating expectations

In terminal run `$ great_expectations suite new` -> 3. "Automatically, using a Data Assistant" -> 3. "default_configured_data_connector_name" -> 1. "shipping_dimension" -> <Enter> -> "y"
           
This will run another jupyter notebook on port 8890. Even though, the contents of ther server will be the same as for 8889. 
Open *edit_shipping_dimension.warning*. In the `exclude_column_names` is the list of columns we want Great Expections to ignore. For now, let's keep it as it is.

### Validating the data

In terminal run `$ great_expectations checkpoint new getting_started_checkpoint`.
This will run another jupyter notebook on port 8891. Even though, the contents of ther server will be the same as for 8889. 

Open the *edit_checkpoint_getting_started_checkpoint.ipynb*. Uncomment the last cell and run all of the cells.
If nothing opens up, navigate to *http://127.0.0.1:8889/view/data_docs/local_site/index.html*
           
<img width="940" alt="image" src="https://user-images.githubusercontent.com/1709151/216836074-d256e927-7d94-484e-9555-4f0d51541615.png">
           
<img width="907" alt="image" src="https://user-images.githubusercontent.com/1709151/216836373-59666a98-34e5-4f99-8f3c-5396fb8b7756.png">



