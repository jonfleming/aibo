const store = {
  debug: true,
  state: {
    response: ''
  },
  setResponse(text) {
    this.state.resonse = text;
  },
  addResponse(text) {
    this.state.response += `\n${text}`;
  }
}

module.exports = store;