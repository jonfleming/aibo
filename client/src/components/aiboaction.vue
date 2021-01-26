<template>
  <div>
    <form class="form-horizontal row p-2" @submit.prevent="sendAction">
      <p class="text-left"><b>Action</b></p>
      <select class="form-control" v-model="selected" @change="actionSelected">
        <option v-for="(item, index) in actions"
          :key="index"
          :value="{action: item.action, arguments: item.arguments}">
          {{item.text}}
        </option>
      </select>
      <div v-if="selected">
        <aibotarget :arguments="arguments"/>
      </div>
      <button v-if="selected" class="form-control">Send</button>
    </form>
  </div>
</template>

<script>
import aibotarget from '@/components/aibotarget.vue';
import axios from "axios";

const aiboActions = require('./aiboActionList');
const TIMEOUT = 5;

export default {
  name: 'aiboaction',
  components: {
    aibotarget,
  },
  data() {
    return {
      selected: '',
      arguments: [],
      values: {},
      actions: aiboActions,
      response: '',
      logMessages: '',
      executionId: '',
      timeout: TIMEOUT,
      interval: null,
      baseUrl: process.env.VUE_APP_AIBO_URL,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

    },
    getValues(values) {
      this.values = values;
    },
    log(message) {
      this.logMessages += `${message}\n`;
      this.$emit('logMsg', this.logMessages);
    },
    async send(options) {
      const { data }  = await axios(options);
      return data
    },
    async sendAction(event) {
      let args = { };
      
      this.log(`Action: ${this.selected.action}`)
      event.target.elements.forEach((element) => {
        if (element.attributes['name']) {
          // element.value = 'value' or 'Category|value|Mode'
          let options = element.value.split('|');
          let value = options[1] || options[0];
          let name = element.attributes['name'].value;

          args[name] = isNaN(value) ? value : Number(value);
          if (this.selected.action === 'play_motion') {
            args['Mode'] = options[2] || 'NONE';
          }
          this.log(`arg: ${name} = ${isNaN(value) ? '"' + value + '"' : value}`);
        }
      });

      const options = {
        method: 'post',
        url: `${this.baseUrl}/action`,
        headers: {'x-security-token': 'abc123'},
        data: {
          apiName: this.selected.action,
          arguments: args,
        },
      };

      const result = await this.send(options);
      this.response += `${result.text}\n`;
      this.$emit('myresponse', this.response);      
      this.executionId = result.executionId;
      this.timeout = TIMEOUT;
      this.interval = setInterval(this.getResult, 3500);

    },
    async getResult() {
      let done = false;

      if (this.timeout > 0) {
        this.timeout--;
        const options = {
          method: 'get',
          url: `${this.baseUrl}/result/${this.executionId}`,
          headers: {'x-security-token': 'abc123'},
        };

        const result = await this.send(options);
        this.log(`Status: ${result.status}`);
        switch(result.status) {
          case 'ACCEPTED':
            this.response += `Action accepted\n`;
            done = false;
            break;
          case 'IN_PROGRESS':
            this.response += `Action in progress\n`;
            done = false;
            break;
          case 'SUCCEEDED':
            this.response += `Action succeeded\n`;
            done = true;
            break;
          default:
            done = true;
            this.response += `Action failed\n`;
            break;
            
        }
      } else {
        done = true;
        this.response += `Timed out waiting for result\n`;
      }

      if (done) {        
        clearInterval(this.interval);
      }

      this.$emit('myresponse', this.response);
    },
    actionSelected() {
      this.arguments = this.selected.arguments;
    },
  },
};
</script>
