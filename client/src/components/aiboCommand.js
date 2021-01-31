import axios from "axios";

// const sendAction = require('./sendAction'); 
// sendAction(this.baseUrl, this.selected.action, args, this.getResult, 5);

// eslint-disable-next-line no-unused-vars
let interval;

export default class AiboCommand {
  constructor(baseUrl, action, args, resultHandler, timeout) {
    this.baseUrl = baseUrl;
    this.action = action;
    this.args = args;
    this.resultHandler = resultHandler;
    this.timeout = timeout;
    this.executionId;
  }

  log(msg) {
    console.log(`AiboCommand: ${msg}`);
  }

  async send(options) {
    const { data } = await axios(options);
    return data
  }

  async sendAction() {
    const options = {
      method: 'post',
      url: `${this.baseUrl}/action`,
      headers: { 'x-security-token': 'abc123' },
      data: {
        apiName: this.action,
        arguments: this.args,
      },
    };

    const result = await this.send(options);    
    this.executionId = result.executionId;
    this.interval = setInterval(() => { this.getResult(this); }, 3500);
    return result;
  }

  async getResult(aibo) {
    let done = false;
    let response = '';

    if (aibo.timeout > 0) {
      aibo.timeout--;
      const options = {
        method: 'get',
        url: `${aibo.baseUrl}/result/${aibo.executionId}`,
        headers: { 'x-security-token': 'abc123' },
      };

      const result = await aibo.send(options);
      aibo.log(`Status: ${result.status}`);
      switch (result.status) {
        case 'ACCEPTED':
          response = `Action accepted\n`;
          done = false;
          break;
        case 'IN_PROGRESS':
          response = `Action in progress\n`;
          done = false;
          break;
        case 'SUCCEEDED':
          response = `Action succeeded\n`;
          done = true;
          break;
        default:
          done = true;
          response = `Action failed\n`;
          break;
            
      }
    } else {
      done = true;
      response += `Timed out waiting for result\n`;
    }

    if (done) {
      clearInterval(aibo.interval);
    }

    aibo.resultHandler(response);
  }
}
