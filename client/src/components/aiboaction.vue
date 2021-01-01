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
        <aibotarget @mychange="getValues" :arguments="arguments"/>
      </div>
      <button class="form-control">Send</button>
    </form>
  </div>
</template>

<script>
import aibotarget from '@/components/aibotarget.vue';
import axios from "axios";
const aiboActions = require('./aiboActions');

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
    async send(e) {
      e.target.elements.forEach((element) => {
        console.log 
        if (element.localName === 'select') {
          console.log(element.selectedOptions[0].text);
        } else {
          console.log(element.value);
        }
      });

      let args = { };

      Object.keys(this.values).forEach((key) => {
        // eslint-disable-next-line
        console.log(`Send ${key}: ${this.values[key].arg} = ${this.values[key].value}`);
        args[this.values[key].arg] = this.values[key].value;
      });

      const options = {
        method: 'post',
        url: 'https://jonfleming.net/action',
        headers: {'x-security-token': 'abc123'},
        data: {
          apiName: this.selected.action,
          arguments: args,
        }
      };

      const { data }  = await axios(options);
      this.response += `${data.text}\n`;
      this.$emit('myresponse', this.response);
      console.log("Response:", this.response, "Done.");
    },
    actionSelected() {
      this.arguments = this.selected.arguments;
      Object.keys(this.arguments).forEach((key) => {
        // eslint-disable-next-line
        console.log(`Key: ${key} Name: ${this.arguments[key].name} ${''
          }Text: ${this.arguments[key].text} Values: ${JSON.stringify(this.arguments[key].values)}`); 
        // Key: 0 Name: TargetType Text: Target Type Values: ['aibo','aibone','dice','pinkball']
      });
    },
  },
};
</script>
