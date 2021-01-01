<template>
    <div class="container">
        <div class="row text-center">
            <aiboimage/>
        </div>
            <div class="form-group col-sm-3">
                <aiboaction @myresponse="saveServerResponse" />
            </div>
        <div class="form-group col-sm-2">
          <span></span>
        </div>
        <div class="form-group col-sm-7">
            <aiboresponse :responses="responses"/>
        </div>
        <div class="form-group col-sm-12">
          <aibolog/>
        </div>
    </div>
</template>

<script>
import aiboimage from '@/components/aiboimage.vue';
import aiboaction from '@/components/aiboaction.vue';
import aiboresponse from '@/components/aiboresponse.vue';
import aibolog from '@/components/aibolog.vue';

export default {
  name: 'App',
  components: {
    aiboimage,
    aiboaction,
    aiboresponse,
    aibolog,
  },
  data() {
    return {
      responses: ''
    }
  },
  methods: {
    saveServerResponse(text) {
      this.responses = text;
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
