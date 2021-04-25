const http = require('http');
const got = require('got');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const AiboRequest = require('./AiboRequest');

const CLIENT_ID = process.env.AIBO_CLIENT_ID;
const CLIENT_SECRET = process.env.AIBO_CLIENT_SECRET;
const REDIRECT_URI = 'https://aibo.jonfleming.net/auth';
const BASE_URL = 'https://public.api.aibo.com';
const AUTH_URL = 'https://myaibo.aibo.com';

const corsOptions = {
  origin: ['https://jonfleming.net', 'https://jonfleming.net:81', 'https://aibo.jonfleming.net', 'http://localhost:8080', 'http://localhost:81'],
  optionsSuccessStatus: 200,
};

const staticFiles = path.join(__dirname, 'client', 'dist');

function log(message, object) {
  // eslint-disable-next-line
  console.log(`${message}: ${object ? JSON.stringify(object, null, 4) : ''}`);
}

function randomGenerate(len) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < len; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function getAccessToken(code) {
  const url = `${BASE_URL}/v1//oauth2/token`;
  const response = await got(url, {
    retry: 0,
    method: 'POST',  
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${code}`
  });
  if (response.status === 200) {
    const json = JSON.parse(response.body);
    return json;
  }
  return { error: response.StatusText, status: response.status };
}

async function getDeviceId(req) {
  const url = `${BASE_URL}/v1/devices`;
  const response = await got(url, {
    method: 'GET',
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${req.session.accessToken}`,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });
  if (response.statusCode === 200) {
    const json = JSON.parse(response.body).devices[0];
    return json;
  }
  return { error: response.statusText, status: response.statusCode };
}

app.use(express.json());
app.use(cors(corsOptions));
app.options('/action', cors());
app.set('trust proxy', 1);

app.use(session({
  secret: 'qsxrfvuk,',
  resave: false,
  saveUninitialized: false,
  cookie: { path: '/', httpOnly: true, secure: true, maxAge: null },
}));

app.get('/', async (req, res, next) => {
  log('root', req.query);
  const { token } = req.query;

  if(token) {
    req.session.authenticated = true;
    Object.assign(req.session, {accessToken: token });    
    log('session before getDeviceId', req.session);
    const deviceResponse = await getDeviceId(req);
    Object.assign(req.session, deviceResponse); // deviceId, nickname
    res.cookie('session', req.session);
    req.session.save();
    log('session after save', req.session);
    return next();
  }

  if(!req.session.authenticated) {
    req.session.state = randomGenerate(12);
    log(`state: ${req.session.state}`);
    const url = `${AUTH_URL}/account_link.html?state=${req.session.state}&` +
    `client_id=${CLIENT_ID}&scope=pub&redirect_uri=${REDIRECT_URI}&response_type=code`;

    log(`URL: ${url}`);
    res.send(`<html><body><a href="${url}">Sign In</a></body></html>`);
    //res.send(`<html><meta http-equiv="Refresh" content="0; URL=${url}"></html>`);
    //res.redirect(url);
  } else {
    res.cookie('session', req.session);
    next();
  }
});

app.use(express.static(staticFiles));

app.get('/auth', async (req, res, next) => {
  const { code, state } = req.query;
  log(`code: ${code} state: ${state} token: ${token}`);
  log('query',  req.query);
  log('session', req.session);

  if (state && state === req.session.state) {
    const tokenResponse = await getAccessToken(code);
    Object.assign(req.session, tokenResponse);
    req.session.authenticated = true;

    const deviceResponse = await getDeviceId(req);
    Object.assign(req.session, deviceResponse);
    //io.emit('auth', req.session);
  }

  res.status(403).send('Not logged in');
});

app.post('/action', (req, res) => {
  log('Body', req.body);

  const aibo = new AiboRequest(req.session, req.body.apiName, req.body.arguments);
  aibo.sendRequest()
    .then((result) => {
      log('/action send res 200');
      res.status(200).send(result);
    });
});

app.get('/result/:executionId', (req, res) => {
  log(`/result/${req.params.executionId}`);

  if (req.params.executionId && req.params.executionId !== 'undefined') {
    const aibo = new AiboRequest(req.session);
    aibo.getResult(req.params.executionId)
      .then((result) => {
        log('/result send res 200');
        res.status(200).send(result);
      });
  } else {
    log('/result send res 200 no executionId');
    res.status(200).send({text: 'missing executionId'});
  }
});

app.post('/event', (req, res) => {
  // eslint-disable-next-line
  log('Aibo Headers:', req.headers);
  log('Body:', req.body);
  if (req.headers['x-security-token'] !== 'abc123') {
    log('/event send res 403');
    res.status(403).send('Bad security token');
    return;
  }

  const { body } = req;
  if (body.eventId) {
    if (body.eventId === 'endpoint_verification') {
      const reply = { challenge: body.challenge };
      log('/event send json');
      res.json(reply);
    } else {
      log('/event send OK');
      res.send('OK');
    }
  } else {
    log('/event send No event');
    res.send('No event');
  }
});

app.get('/favicon.ico', (req, res) => {
  log('/favicon send file');
  res.sendFile('/favicon.ico', { root: __dirname });
});

const port=process.env.NODE_PORT || 81;
log(`Port set to ${port}`);

httpServer.listen(port);
log(`Listening on ${httpServer.address().port}`);
