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

