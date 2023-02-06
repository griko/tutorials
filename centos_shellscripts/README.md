# CentOS-minimal - docker, python, postgres, git, tmux scripts

We will install python 3.10, git, docker. Run PostgreSQL container and execute python code in tmux envionment.

<details>
<summary>install_python3.sh</summary>
    ```bash
    yum install -y python3
    yum install gcc gcc-c++ make kernel-devel openssl-devel bzip2-devel libffi-devel libpq-devel -y
    yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel -y
    yum install postgresql postgresql-devel python-devel -y

    wget https://www.openssl.org/source/openssl-1.1.1s.tar.gz --no-check-certificate
    tar zxvf openssl-1.1.1s.tar.gz
    cd openssl-1.1.1s/
    ./config --prefix=/root/openssl --openssldir=/root/openssl no-ssl2
    make
    make install

    cat <<EOT >> ~/.bash_profile
    export PATH=$HOME/openssl/bin:$PATH
    export LD_LIBRARY_PATH=$HOME/openssl/lib
    export LC_ALL="en_US.UTF-8"
    export LDFLAGS="-L /root/openssl/lib -Wl,-rpath,/root/openssl/lib"
    EOT

    . ~/.bash_profile

    curl -O https://www.python.org/ftp/python/3.10.9/Python-3.10.9.tgz
    tar -xzf Python-3.10.9.tgz
    cd ../Python-3.10.9/
    ./configure --enable-optimizations --with-openssl=/root/openssl
    make
    make install
    ```
</details>

The **.sh** files in the repository contain the code, give it execution ability with *chmod*. Also, we assume here that the system user with root priviledges, which is a bad practice, and you shall avoid it and add `sudo` wherever required.

<details>
<summary>install_docker.sh</summary>
    ```bash
    yum install -y yum-utils
    yum-config-manager \
        --add-repo \
        https://download.docker.com/linux/centos/docker-ce.repo
    yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
    ```
</details>

<details>
<summary>install_git.sh</summary>
    ```bash
    yum install git -y
    git config --global user.name "YourName"
    git config --global user.email "Name@Domain.com"
    ```
</details>

Start docker daemon with `# systemctl start docker`

<details>
<summary>run_postgres_docker.sh < db_password ></summary>
    ```bash
    mkdir -p /var/lib/postgresql/data/pgdata
    docker run -d \
        --name postgres_db \
        --rm -p 5433:5432 \
        -e POSTGRES_PASSWORD=$1 \
        -e PGDATA=/var/lib/postgresql/data/pgdata \
        -v /custom/mount:/var/lib/postgresql/data \
        postgres
    ```
</details>

You can test connection with `# docker exec -it postgres_db psql -U postgres -W`

Now, create an [ssh key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) and add a public key to your GitHub account.

Clone the repository `# git clone git@github.com:<your_repository>.git`.

Add virtual environment with `# python3.10 -m venv <venv_path>`

If you want to run python application even when yoou disconnect from the SSH, use **tmux**.

- start tmux by typing `tmux` into the shell
- start the process you want inside the started tmux session
  - source ../venv/bin/activate
  - python --version (3.10)
  - python main.py
- leave/detach the tmux session by typing `Ctrl+b` and then `d`
- connect t tmux with `tmux attach`




