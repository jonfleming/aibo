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
import axios from "axios";

const aiboActions = require('./aiboActionList');

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
      response: ''
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
    async send(event) {
      let args = { };
      
      console.log(`Action: ${this.selected.action}`);
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
          console.log(`arg: ${name} = ${isNaN(value) ? '"' + value + '"' : value}`);
        }
      });

      const options = {
        method: 'post',
        url: 'https://aibo.jonfleming.net/action',
        headers: {'x-security-token': 'abc123'},
        data: {
          apiName: this.selected.action,
          arguments: args,
        },
      };

      const { data }  = await axios(options);
      this.response += `${data.text}\n`;
      this.$emit('myresponse', this.response);
      // console.log("Response:", this.response, "Done.");
    },
    actionSelected() {
      this.arguments = this.selected.arguments;
    },
  },
};
</script>
