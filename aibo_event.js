const fs = require("fs");
const http = require("http");
const https = require("https");
const util = require("util");

const credentials = {
  key: fs.readFileSync("certificates/key.pem"),
  cert: fs.readFileSync("certificates/cert.pem"),
};

const express = require("express");
const app = express();

app.use(express.json());

app.post("/aibo", (req, res) => {
  log('Body', req.body);
  log('Headers', req.headers);
  if (req.headers['x-security-token'] != 'abc123') {
    res.status(403).send('Bad security token');
    return;
  }

  body = req.body;
  if (body.eventId) {
    if (body.eventId === 'endpoint_verification') {
      const reply = { challenge: body.challenge };
      res.json(reply);  
    } else {
      res.send('OK');
    }
    
  } else {
    res.send("No event");
  }

});

app.get("/", (req, res) => {
  res.sendFile('/index.html', {root: __dirname });
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile('/favicon.ico', {root: __dirname });
});

app.get("/stub_status", (req, res) => {
  res.send('You asked for stub_status');
});

app.get("/status", (req, res) => {
  res.send('You asked for stub_status');
});

function log(message, object) {
  console.log(message + ': ' + JSON.stringify(object));
}
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
console.log('Listening on 80 and 443\n');