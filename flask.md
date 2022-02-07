## Running simple Flask server with self-signed sertificate:

Based on this [great tutorial](https://blog.miguelgrinberg.com/post/running-your-flask-application-over-https)

Make sure there is flask and pyopenssl installed: `pip install Flask pyopenssl`

Create a sertificate and key with following command: `openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365`

Place the *cert.pem* and *key.pem* in *cert/* directory. 

Write an *app.py*:
```
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(ssl_context=('cert/cert.pem', 'cert/key.pem'))
```

<img width="959" alt="image" src="https://user-images.githubusercontent.com/1709151/152783410-ccb73de1-bb70-4d07-a8f1-1ee4a056acf9.png">

You also could use `app.run(ssl_context='adhoc')`, but this mean that new certificate will be created every time you run the application.
We are running the server to experiment with Java application SSL requests, so static certificate is more preferable.
