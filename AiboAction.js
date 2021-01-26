const axios = require('axios');
// const { HttpsProxyAgent } = require('hpagent');

const basePath = 'https://public.api.aibo.com/v1';
const { deviceId, accessToken } = process.env;

class AiboAction {
  constructor(apiName, data) {
    if (apiName) {
      this.apiName = apiName;
      this.data = data;
    }
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
      data = response.data;
    } catch (error) {
      return { text: 'failed', error };
    }

    const { executionId } = data;

    return { text: 'sent', executionId };
  }

  async getResult(executionId) {
    const resultUrl = `${basePath}/executions/${executionId}`;
    const result = await this.request(resultUrl, 'GET');

    // {status: 200, statusText:'OK', config: {url:...},
    //   data: { executionId: '...', status: 'IN_PROGRESS', result: null }
    //   headers: {content-type: 'application/json'}
    //   request: ... }
    return result.data || { text: 'Error calling getResult' };
  }
}

module.exports = AiboAction;
