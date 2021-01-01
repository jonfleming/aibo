const http = require('http');
const cors = require('cors');
const path = require('path');
const express = require('express');
const AiboAction = require('./AiboAction');

const corsOptions = {
  origin: ['http://jonfleming.net', 'https://jonfleming.net:81', 'http://localhost:8080'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const staticFiles = path.join(__dirname, 'client', 'dist');

function log(message, object) {
  // eslint-disable-next-line
  console.log(message + ': ' + JSON.stringify(object));
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static(staticFiles));

app.post('/action', (req, res) => {
  log('Action Headers:', req.headers);
  log('Body:', JSON.stringify(req.body, null, 4));

  const aibo = new AiboAction(req.body.apiName, req.body.arguments);
  aibo.sendRequest()
    .then((result) => {
      if (result.error) {
        res.status(200).send({ text: `${result.text} Error: ${result.error}` });
      } else {
        res.status(200).send(result);
      }
    });
});

app.post('/aibo', (req, res) => {
  // eslint-disable-next-line
  log('Aibo Headers:', req.headers, 'Body:', JSON.stringify(req.body, null, 4));
  if (req.headers['x-security-token'] !== 'abc123') {
    res.status(403).send('Bad security token');
    return;
  }

  const { body } = req;
  if (body.eventId) {
    if (body.eventId === 'endpoint_verification') {
      const reply = { challenge: body.challenge };
      res.json(reply);
    } else {
      res.send('OK');
    }
  } else {
    res.send('No event');
  }
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile('/favicon.ico', { root: __dirname });
});

const httpServer = http.createServer(app);
httpServer.listen(80);

// eslint-disable-next-line
console.log('Listening on 80');