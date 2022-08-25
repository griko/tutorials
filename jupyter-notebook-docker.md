## Creating a volume
We will use two types of volumes. One that is binded to the local Windows directory for storing the notebooks and the other for 
the dependencies packages installed with *pip/conda* and new environments for kernels.

Volume to store the pip/conda dependencies:

`docker volume create notebook_libraries`

This will be mounted to */opt/conda/lib/python3.10/site-packages* which was found by bashing to the container (`docker exec -it <container name> /bin/bash`) 
and finding the path to the installed dependencies (`pip list`, `pip show <packade from list>`)

Volume to store conda environments for kernels:
`docker volume create notebook_kernels`

<details>
  <summary>More information about the volumes</summary> 
  To show volume config:
`docker inspect notebook_volume`
</details>


## Running the docker with a mounted volume
```bash
docker run --rm -p 8888:8888 --name notebook 
           -v C:\grisha\src\jupyter-minimal:/home/jovyan/work 
           -v notebook_libraries:/opt/conda/lib/python3.10/site-packages 
           -v notebook_kernels:/opt/conda/envs
           -e JUPYTER_ENABLE_LAB=yes -it jupyter/minimal-notebook
```

Pay attention that the binding for the notebook storage is to the local Windows directory *C:\grisha\src\jupyter-minimal*.

<details>
  <summary>More information about the volumes</summary> 
To see the bindings of volumes and their locations we may run

`docker inspect -f '{{ .Mounts }}' <container_id>`
  
<img width="664" alt="image" src="https://user-images.githubusercontent.com/1709151/186663569-1990a327-0aa7-4474-b47d-bb1341b741ec.png">
</details>

At last, we see that removing the container and starting it with the same command allows us to open a locally saved notebook and 
also we don't have to run the `%pip install ...` on already installed libraries.

<img width="756" alt="image" src="https://user-images.githubusercontent.com/1709151/186664275-e44f3324-e319-44ae-a894-def7ec1907f0.png">

## Creating a new kernel
From inside the **jupyter-lab**, run new terminal.

Grant the user **jovyan** previlages to write to the externam mounted kernel volumes: `docker exec -u 0:0 <container_id> chown -R jovyan /opt/conda/envs`

We can list the environments with `conda info --envs`

Create a new *conda* environment: `conda create --name new_env` or clone with `conda create --name new_env --clone base`

Activate the environment: `conda activate new_env`

Create kernel: `ipython kernel install --name "my_new-kernel" --user`

Relogin to Notebook by File->Log out and then reenter the URI with the token from the *docker run* terminal. 

<img width="739" alt="image" src="https://user-images.githubusercontent.com/1709151/186708784-bad25661-3dff-43ed-9db6-6c029949aee1.png">

You now may install the dependencies into the selected kernel by running `%pip install ...` 
  ([colab](https://colab.research.google.com/) users, pay attention, it is an ***%*** sign before the **pip install** command and not ***!***)




