## Running Jenkins in Docker (without maven)
1. `docker pull jenkins/jenkins`
2. `docker run -p 8081:8080 --name=jenkins-master -d jenkins/jenkins`
3. goto http://localhost:8081/
4. from the docker desktop, open the CLI of the container (or `winpty docker exec -it <container name> /bin/bash`) and see the content of `/var/jenkins_home/secrets/initialAdminPassword`

## Jenkins for maven builds on Windows (based on [this](https://www.jenkins.io/doc/tutorials/build-a-java-app-with-maven/) tutorial)
1. `docker network create jenkins`
2. run a jenkins container (from the `cmd`, not `git bash`)
```
docker run --name jenkins-docker --rm --detach ^
  --privileged --network jenkins --network-alias docker ^
  --env DOCKER_TLS_CERTDIR=/certs ^
  --volume jenkins-docker-certs:/certs/client ^
  --volume jenkins-data:/var/jenkins_home ^
  --publish 3000:3000 --publish 2376:2376 ^
  docker:dind
```
3. Create Dockerfile with the following content:
```
  FROM jenkins/jenkins:2.319.3-jdk11
  USER root
  RUN apt-get update && apt-get install -y lsb-release
  RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
    https://download.docker.com/linux/debian/gpg
  RUN echo "deb [arch=$(dpkg --print-architecture) \
    signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
    https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
  RUN apt-get update && apt-get install -y docker-ce-cli
  USER jenkins
  RUN jenkins-plugin-cli --plugins "blueocean:1.25.2 docker-workflow:1.28"
```
4. run `docker build -t myjenkins-blueocean:2.319.3-1 .`
5. run the modified jenkins image:
```
docker run --name jenkins-blueocean --rm --detach ^
  --network jenkins --env DOCKER_HOST=tcp://docker:2376 ^
  --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 ^
  --volume jenkins-data:/var/jenkins_home ^
  --volume jenkins-docker-certs:/certs/client:ro ^
  --volume "%HOMEDRIVE%%HOMEPATH%":/home ^
  --publish 8080:8080 --publish 50000:50000 myjenkins-blueocean:2.319.3-1
```
6. goto `http://localhost:8080`, enter the admin password and click on "Install suggested plugins". hit retry if any failed.
7. define "new item" as pipline, clone the [example repository](https://github.com/griko/tutorials/tree/master/app-maven-example) to "%HOMEDRIVE%%HOMEPATH%/Documents/tutorials" (or other mentioned previously "/home" directory).
Make sure that "app-maven-example" dir is git inited (or run `git init`).
As a path to repository, insert "/home/Documents/tutorials/app-maven-example"

<img width="859" alt="jenkins" src="https://user-images.githubusercontent.com/1709151/155532009-dfd00506-6b1f-4baa-8ba4-acd48e8bdb75.png">

8. Create a Jenkinsfile in the "app-maven-example" path (don't forget to git-commit if any changes are made):
```
pipeline {
    agent {
        docker {
            image 'maven:3.8.1-adoptopenjdk-11' 
            args '-v /root/.m2:/root/.m2' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'mvn -B -DskipTests clean package' 
            }
        }
    }
    stage('Deliver') {
            steps {
                sh './jenkins/scripts/deliver.sh'
            }
        }
}
```

9. goto Blue Ocean and run the pipeline. If you get a `ca.pem` error, pull the docker image on the machine by running `docker pull maven:3.8.1-adoptopenjdk-11`

<img width="949" alt="blue_ocean" src="https://user-images.githubusercontent.com/1709151/155550766-17981139-0af3-455a-a0ac-553d3a49dd71.png">

10. if getting "Permission denied" on running the `deliver.sh`, run `git update-index --add --chmod=+x jenkins/scripts/deliver.sh` and commit

<img width="929" alt="blue_ocean2" src="https://user-images.githubusercontent.com/1709151/155559467-37e46e5f-88b4-4bb1-9c31-65341e61481b.png">

11. notice that there is a `maven-jar-plugin` that generates the MANIFEST and `maven-dependency-plugin` that downloads dependencies if are not present (like *log4j* in our case)

