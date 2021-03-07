# Sony Aibo Web Control

This is a node.js app with a Vue.js front end. To run:

```
git clone https://github.com/jonfleming/aibo
cd aibo
npm install
node server.js
```

Before running you will need to set a few environment variables or create a .env file.  Get an access token from https://developer.aibo.com/us/settings/token
Once you have an access token you can get the device ID for your Aibo using curl:

```
curl -X GET https://public.api.aibo.com/v1/devices -H "Authorization:Bearer ${accessToken}" 
```

## Environment Variables
```
set accessToken=<access-token>
set deviceId=<aibo-device-id>
set NODE_PORT=<port-for-web-app | 81>
set VUE_APP_AIBO_URL=<URL-for-web-app | http://localhost:81>
set AIBO_CLIENT_ID=<client-id>
set AIBO_CLIENT_SECRET=<client-secret>
```

The Sony Authorization/Authentication is not working but, you can take your access token from the Aibo developer site and add it to your URL to authenticate yourself.

Example:
```
http://localhost:81?token=<access-token>
```
This will bypass the Sony login page and take you directly into the app.