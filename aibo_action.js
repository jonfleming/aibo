const axios = require('axios');
const { HttpsProxyAgent } = require('hpagent');

const basePath = 'https://public.api.aibo.com/v1';
const { deviceId, accessToken } = process.env;

const timeout = 50;
const argv = process.argv.slice(2);

async function request(url, method, args) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  const options = {
    method,
    url,
    responseType: 'json',
    headers,
    httpsAgent: new HttpsProxyAgent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 256,
      maxFreeSockets: 256,
      scheduling: 'lifo',
      proxy: 'http://localhost:8888',
      rejectUnauthorized: false,
    }),
  };

  if (args) {
    options.data = {
      arguments: args,
    };
  }

  // eslint-disable-next-line
  console.log(url);
  try {
    const response = await axios(options);
    // console.dir(response);
    return response;
  } catch (error) {
    // eslint-disable-next-line
    console.log(error.name, error.message);
    process.exit(3);
    return null;
  }
}

(async (apiName, args) => {
  const url = `${basePath}/devices/${deviceId}/capabilities/${apiName}/execute`;
  const { data } = await request(url, 'POST', args);

  // eslint-disable-next-line
  console.log(JSON.stringify(data, null, 4));
  const { executionId } = data;
  const resultUrl = `${basePath}/executions/${executionId}`;
  let t = 0;
  while (t < timeout) {
    // eslint-disable-next-line
    const { data } = await request(resultUrl, 'GET', null);

    // eslint-disable-next-line
    console.log(data.status);
    if (data.status === 'SUCCEEDED') {
      process.exit(0);
    }
    if (data.status === 'FAILED') {
      process.exit(1);
    }
    t += 1;
  }
  process.exit(2);
})(argv[0], JSON.parse(argv[1]));
