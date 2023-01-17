import axios from "axios";

// const AiboCommand = require('./aiboCommand'); 
// const command = new AiboCommand(this.baseUrl, this.selected.action, args, this.getResult, 5);
// command.sendAction();

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

  log(message, object) {
    // eslint-disable-next-line
    console.log(message + JSON.stringify(object, null, 4));
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

    this.log('sendAction Options', options);
    const result = await this.send(options);    
    this.log('sendAction result', result);
    if (result.executionId && result.executionId !== 'undefined') {
      this.executionId = result.executionId;
      this.log(`setting execution id=${this.executionId}`, {});
      this.interval = setInterval(() => { this.getResult(this); }, 3500);
    }
    
    return result;
  }

  async getResult(aibo) {
    this.log('getResult triggered', aibo);
    let done = false;
    let response = '';

    if (aibo.timeout > 0) {
      aibo.timeout--;
      const options = {
        method: 'get',
        url: `${aibo.baseUrl}/api/result/${aibo.executionId}`,
        headers: { 'x-security-token': 'abc123' },
      };

      const result = await aibo.send(options);
      aibo.log(`Status: ${result.status}`, result);
      switch (result.status) {
        case 'ACCEPTED':
          response = `Status: Action accepted\n`;
          done = false;
          break;
        case 'IN_PROGRESS':
          response = `Status: Action in progress\n`;
          done = false;
          break;
        case 'SUCCEEDED':
          response = `Status: Action succeeded\n`;
          done = true;
          break;
        default:
          done = true;
          response = `Status: Action failed - ${result.status}\n`;
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
