<template>
    <div class="form-group">
        <div class="input" v-for="(argument, index) in arguments"
          :key="index"
          :value="argument.text">
            <p v-if="argument" class="text-left pt-3 mb-1 ml-2"><b>{{argument.text}}</b></p>
            <div v-if="isNaN(argument.input)">
              <select v-if="argument" class="selectpicker form-control mt-2 p-0" 
                  :name="argument.name">
                  <option v-for="(item, position) in handleValueArray(argument.values)"
                      :key="position"
                      :value="argument.name + '|' + (cat(item))">
                      {{item.description || item}}
                  </option>
              </select>
            </div>
            <div v-else>
              <input class="m-2 p-1" type="text" 
              :name="argument.name"
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
  methods: {
    handleValueArray(value) {
      if (value[0] && value[0].Category) {
        return value.reduce((r, e) => { 
          if(e.Mode) {
            e.Mode.split('|').forEach(mode => {
              r.push({Category: e.Category + '|' + mode, description: e.description + '|' + mode});
            }); // for each
          } else {
            r.push({Category: e.Category, description: e.description });
          }

          return r;
        }, []);
      } else {
        return value;
      }
    },
    cat(thing) {
      if (thing.Category) {
        return thing.Category;
      }
      return thing;
    }
  }
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
