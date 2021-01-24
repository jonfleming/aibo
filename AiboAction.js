const axios = require('axios');
// const { HttpsProxyAgent } = require('hpagent');

const basePath = 'https://public.api.aibo.com/v1';
const { deviceId, accessToken } = process.env;
const timeout = 50;

class AiboAction {
  constructor(apiName, data) {
    this.apiName = apiName;
    this.data = data;
  }

  async request(url, method) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // const agent = new HttpsProxyAgent({
    //   keepAlive: true,
    //   keepAliveMsecs: 1000,
    //   maxSockets: 256,
    //   maxFreeSockets: 256,
    //   proxy: 'http://localhost:8888',
    // });

    const options = {
      method,
      url,
      responseType: 'json',
      headers,
      // httpsAgent: agent,
    };

    if (method === 'POST') {
      options.data = {
        arguments: this.data,
      };
    }

    try {
      const response = await axios(options);
      //console.dir(response);
      return response;
    } catch (error) {
      return { error };
    }
  }

  async sendRequest() {
    const url = `${basePath}/devices/${deviceId}/capabilities/${this.apiName}/execute`;
    let data;

    try {
      const response = await this.request(url, 'POST');
      console.dir(response);
      data = response.data;
    } catch (error) {
      return { result: 'failed', error };
    }

    const { executionId } = data;
    const resultUrl = `${basePath}/executions/${executionId}`;
    let t = 0;
    while (t < timeout) {
      // eslint-disable-next-line
      const result = await this.request(resultUrl, 'GET');
      data = result.data;

      if (data.status === 'SUCCEEDED') {
        return { text: 'success' };
      }
      if (data.status === 'FAILED') {
        return { text: 'failed', error: 'api.aibo failed' };
      }
      t += 1;
    }
    return { text: 'failed', error: 'timed out waiting for success' };
  }
}

module.exports = AiboAction;
