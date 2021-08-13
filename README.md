# BBDN-UEF-Python

This project is set up to demonstrate the use of the Ultra Extension Framework with LTI 1.3 in Python.

To configure:

## /app/ConfigTemplate.py

In the `app` directory, copy `ConfigTemplate.py` to `Config.py` and fill in your information:

```
config = {
    "verify_certs" : "True",
    "learn_rest_url" : "YOURLEARNSERVERNOHTTPS",
    "learn_rest_key" : "YOURLEARNRESTKEY",
    "learn_rest_secret" : "YOURLEARNRESTSECRET",
    "app_url" : "YOURAPPURLWITHHTTPS"
}
```
* **learn_rest_url** should be set to your learn instances domain. Be sure to avoid the request scheme, i.e. `mylearn.blackboard.edu`
* **app_url** should be set to the FQDN of your application, i.e. `https://myapp.herokuapp.com`


## /app/lti-template.json

In the `app` directory, copy `lti-template.json` to `lti.json` and add your client Id (application ID from the developer portal), and your deployment ID (given to you in Learn when you register your LTI application).

## To Run

First build your Docker image:
```
docker build -t uef-examples:0.1 .
```

Then run your Docker image:
```
docker run -p 5000:5000 --name uef-examples uef-examples:0.1
```

Now using NGrok, expose your port to the world:
```
ngrok http 5000 --hostname <unique-value>.ngrok.io
```

Of course it is docker, so you can deploy this just about anywhere and provide any hostname you desire. 
