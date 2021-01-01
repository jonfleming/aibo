<template>
    <div class="form-group">
        <div class="input" v-for="(argument, index) in arguments"
          :key="index"
          :value="argument.text">
            <p v-if="argument" class="text-left pt-3 mb-1 ml-2"><b>{{argument.text}}</b></p>
            <div v-if="isNaN(argument.input)">
              <select v-if="argument" class="selectpicker form-control mt-2 p-0" :name="argument.name"
                  v-model="values[index]" @change="argumentSelected">
                  <option v-for="(item, position) in argument.values"
                      :key="position"
                      :value="{arg: argument.name, value: item}">
                      {{item}}
                  </option>
              </select>
            </div>
            <div v-else>
              <input class="m-2 p-1" type="text" :name="argument.name"
                @change="argumentInput" 
                v-model="argument.input">
                <i>{{argument.units}}</i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'aibotarget',
  props: {
    arguments: Array,
  },
  data() {
    return {
      selected: '',
      values: {},
    };
  },
  methods: {
    init() {

    },
    argumentSelected() {
      this.$emit('mychange', this.values);
      Object.keys(this.values).forEach((key) => {
        // eslint-disable-next-line
        console.log(`Selected ${key}: ${this.values[key].arg} = ${this.values[key].value}`); 
        // Selected 0: TargetType = aibone 
      });
    },
    argumentInput(e) {
      // eslint-disable-next-line
      console.dir(e);
      //console.log(JSON.stringify(e, null, 4));
      // set this.values[argument.index].arg = arguments[argument.index].name
      //     this.values[argument.index].value = arguments[argument.index].input
    }
  },
};
</script>
<style scoped>
.input {
  width: 300px; overflow:hidden;
}

select {
  width: 300px;
}
</style>
