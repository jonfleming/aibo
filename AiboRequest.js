const got = require('got');
//const { deviceId, accessToken } = process.env;

const BASE_URL = 'https://public.api.aibo.com';

class AiboRequest {
  constructor(session, apiName, data) {
    if (apiName) {
      this.apiName = apiName;
      this.data = data;
    }
    
    this.deviceId = session.deviceId;
    this.accessToken = session.accessToken;
  }

  log(message, object) {
    // eslint-disable-next-line
    console.log(`${message}: ${object ? JSON.stringify(object, null, 4) : ''}`);
  }
  
  async request(url, method) {
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const options = {
      method,
      responseType: 'json',
      headers,
    };

    if (method === 'POST') {
      options.json = {
        arguments: this.data,
      };
    }

    try {
      this.log('aiboRequest options', options);
      const response = await got(url, options);
      this.log(`aiboRequest response ${response.statusCode} data:\n`, response.body);
      return response;
    } catch (error) {
      this.log('request Error', error);
      return { error };
    }
  }

  async sendRequest() {
    const url = `${BASE_URL}/v1/devices/${this.deviceId}/capabilities/${this.apiName}/execute`;
    let data;


    try {
      this.log(`sendRequest to ${url}`);
      const response = await this.request(url, 'POST');
      this.log(`POST Request Response: ${response.statusCode}`, response.data);

      if (response.error) {
        return  { text: `failed request: ${error.message} `, error };
      }

      data = response.body;
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

    // {statusCode: 200, statusText:'OK', config: {url:...},
    //   body: { executionId: '...', status: 'IN_PROGRESS', result: null }
    //   headers: {content-type: 'application/json'}
    //   request: ... }
    return result.body || { text: 'Error calling getResult' };
  }
}

module.exports = AiboRequest;
