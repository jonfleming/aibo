const http = require('http');
const cors = require('cors');
const path = require('path');
const express = require('express');
const session = require('express-session');
const AiboRequest = require('./AiboRequest');

const CLIENT_ID = process.env.AIBO_CLIENT_ID;
const CLIENT_SECRET = process.env.AIBO_CLIENT_SECRET;
const REDIRECT_URI= 'https://aibo.jonfleming.net/auth';

const corsOptions = {
  origin: ['https://jonfleming.net', 'https://jonfleming.net:81', 'https://aibo.jonfleming.net', 'http://localhost:8080', 'http://localhost:81'],
  optionsSuccessStatus: 200,
};

const app = express();
const staticFiles = path.join(__dirname, 'client', 'dist');

function log(message, object) {
  // eslint-disable-next-line
  console.log(`${message}: ${object ? JSON.stringify(object, null, 4) : ''}`);
}

function randomGenerate(len) {
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  
  return text;
}

app.use(express.json());
app.use(cors(corsOptions));
app.options('/action', cors());
app.set('trust proxy', 1);

app.use(session({
  secret: 'qsxrfvuk,',
  resave: false,
  saveUninitialized: false,
  cookie: { path: '/', httpOnly: true, secure: true, maxAge: null }
}))

app.get('/', (req, res, next) => {
  log('root', req.query);
  log('session', req.session);
  if(!req.session.authenticated) {
    req.session.state = randomGenerate(12);
    log(`state: ${req.session.state}`);
    const url = `https://myaibo.aibo.com/account_link.html?state=${req.session.state}&` +
    `client_id=${CLIENT_ID}&scope=pub&redirect_uri=${REDIRECT_URI}&response_type=code`;

    log(`URL: ${url}`);
    res.send(`<html><body><a href="${url}">Sign In</a></body></html>`);
    // res.redirect(url);
  } else {
    next();
  }
});

app.use(express.static(staticFiles));

app.get('/auth', (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (state === req.session.state) {
    // request access token
    // get deviceId
    // update header
    req.session.authenticated = true;
    res.send('Connected');
  }
  log(`authenticated`, req.session);
  log(`auth params`, req.params);
  log(`auth query`, req.query);
});

app.post('/action', (req, res) => {
  log('Body', req.body);

  const aibo = new AiboRequest(req.body.apiName, req.body.arguments);
  aibo.sendRequest()
    .then((result) => {
      log(`/action send res 200`);
      res.status(200).send(result);
    });
});

app.get('/result/:executionId', (req, res) => {
  log(`/result/${req.params.executionId}`);

  if (req.params.executionId && req.params.executionId !== 'undefined') {
    const aibo = new AiboRequest();
    aibo.getResult(req.params.executionId)
      .then((result) => {
        log(`/result send res 200`);
        res.status(200).send(result);
      });
  } else {
    log(`/result send res 200 no executionId`);
    res.status(200).send({text: 'missing executionId'});
  }
});

app.post('/event', (req, res) => {
  // eslint-disable-next-line
  log('Aibo Headers:', req.headers);
  log('Body:', req.body);
  if (req.headers['x-security-token'] !== 'abc123') {
    log(`/event send res 403`);
    res.status(403).send('Bad security token');
    return;
  }

  const { body } = req;
  if (body.eventId) {
    if (body.eventId === 'endpoint_verification') {
      const reply = { challenge: body.challenge };
      log(`/event send json`);
      res.json(reply);
    } else {
      log(`/event send OK`);
      res.send('OK');
    }
  } else {
    log(`/event send No event`);
    res.send('No event');
  }
});

app.get('/favicon.ico', (req, res) => {
  log(`/favicon send file`);
  res.sendFile('/favicon.ico', { root: __dirname });
});

const httpServer = http.createServer(app);
httpServer.listen(process.env.NODE_PORT || 81);

// eslint-disable-next-line
log(`Listening on ${httpServer.address().port}`);
