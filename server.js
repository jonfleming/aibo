const http = require('http');
const cors = require('cors');
const path = require('path');
const express = require('express');
const AiboAction = require('./AiboAction');

const corsOptions = {
  origin: ['https://jonfleming.net', 'https://jonfleming.net:81', 'https://aibo.jonfleming.net', 'http://localhost:8080', 'http://localhost'],
  optionsSuccessStatus: 200,
};

const app = express();
const staticFiles = path.join(__dirname, 'client', 'dist');

function log(message, object) {
  // eslint-disable-next-line
  console.log(message + ': ' + JSON.stringify(object, null, 4));
}

console.log('here');
app.use(express.json());
app.use(cors());
app.use(express.static(staticFiles));

app.options('/action', cors());
app.post('/action', (req, res) => {
  log('Action Headers:', req.headers);
  log('Body:', req.body);

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
  log('Aibo Headers:', req.headers);
  log('Body:', req.body);
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
httpServer.listen(81);

// eslint-disable-next-line
log(`Listening on ${httpServer.address().port}`,{});