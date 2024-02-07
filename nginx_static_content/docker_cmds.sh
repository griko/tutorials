docker build -t my-nginx .
docker run -p 80:80 my-nginx
docker image rm -f my-nginx