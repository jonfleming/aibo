<template>
    <div class="container">
        <div class="row text-center">
          <div class="col-sm-5">
            <button style="width:150px">Sit</button>
            <button style="width:150px">Stand</button>
            <button style="width:150px">Sing</button>
            <button style="width:150px">Dance</button>
            <button style="width:150px">Charge</button>
          </div>
            <div class="col-sm-5">
              <aiboimage/>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-sm-3">
                <aiboaction @myresponse="saveServerResponse" @logMsg="saveLogMessage"/>
            </div>
            <div class="form-group col-sm-2">
                <span></span>
            </div>
            <div class="form-group col-sm-7">
                <aiboresponse :responses="responses"/>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-sm-12">
                <aibolog :logMessages="logMessages"/>
            </div>
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
      responses: '',
      logMessages: '',
    }
  },
  methods: {
    saveServerResponse(text) {
      this.responses = text;
    },
    saveLogMessage(text) {
      this.logMessages = text;
    },
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
