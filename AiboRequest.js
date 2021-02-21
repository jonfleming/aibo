const axios = require('axios');
const { deviceId, accessToken } = process.env;

const BASE_URL = 'https://myaibo.aibo.com';

class AiboRequest {
  constructor(apiName, data) {
    if (apiName) {
      this.apiName = apiName;
      this.data = data;
    }
  }

  log(message, object) {
    // eslint-disable-next-line
    console.log(`${message}: ${object ? JSON.stringify(object, null, 4) : ''}`);
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
      this.log('aiboRequest options', options);
      const response = await axios(options);
      this.log(`aiboRequest response ${response.status} data:\n`, response.data);
      return response;
    } catch (error) {
      this.log('request Error', error);
      return { error };
    }
  }

  async sendRequest() {
    const url = `${BASE_URL}/v1/devices/${deviceId}/capabilities/${this.apiName}/execute`;
    let data;


    try {
      this.log(`sendRequest to ${url}`);
      const response = await this.request(url, 'POST');
      this.log(`POST Request Response: ${response.status}`, response.data);

      if (response.error) {
        return  { text: `failed request: ${error.message} `, error };
      }

      data = response.data;
    } catch (error) {
      return { text: 'failed Response', error };
    }

    const { executionId } = data;

    return { text: 'sent', executionId };
  }

  async getResult(executionId) {
    this.log(`getResult executionId: ${executionId}`);
    const resultUrl = `${BASE_URL}/v1/executions/${executionId}`;
    const result = await this.request(resultUrl, 'GET');

    // {status: 200, statusText:'OK', config: {url:...},
    //   data: { executionId: '...', status: 'IN_PROGRESS', result: null }
    //   headers: {content-type: 'application/json'}
    //   request: ... }
    return result.data || { text: 'Error calling getResult' };
  }
}

module.exports = AiboRequest;
