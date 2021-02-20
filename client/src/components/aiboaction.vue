<template>
  <div>
    <form class="form-horizontal row p-2" @submit.prevent="send">
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
import AiboCommand from '@/components/aiboCommand';
import aiboActions from '@/components/aiboActionList';

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
    async send(event) {
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

      console.log(`BaseUrl: ${this.baseUrl} `);
      const command  = new AiboCommand(this.baseUrl, this.selected.action, args, this.getResult, TIMEOUT);
      const result = await command.sendAction();
      this.response += `${result.text}\n`;
      this.$emit('myresponse', this.response);      
      this.timeout = TIMEOUT;
    },
    async getResult(response) {
      this.response += response;
      this.$emit('myresponse', this.response);
    },
    actionSelected() {
      this.arguments = this.selected.arguments;
    },
  },
};
</script>
