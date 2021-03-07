<template>
    <div class="container">
        <div class="row">
          <div class="col-sm-2">
            Name:{{nickname}}
          </div>
          <div class="col-sm-8">
            Aibo:{{deviceId}}
          </div>
          <div class="col-sm-2">
            <a href="#">Unlink App</a>
          </div>
        </div>
        <hr/>
        <div v-if="authenticated">
          <div class="row text-center">
            <div class="col-sm-3">
              <button v-on:click="action_sit" style="width:150px">Sit</button>
              <button v-on:click="action_stand" style="width:150px">Stand</button>
              <button v-on:click="action_sing" style="width:150px">Sing</button>
              <button v-on:click="action_dance" style="width:150px">Dance</button>
              <button v-on:click="action_charge" style="width:150px">Charge</button>
            </div>
            <div class="col-sm-6">
              <aiboimage/>
            </div>
            <div class="col-sm-3">
              <button v-on:click="logout()">
              Logout
              </button>
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
    </div>
</template>

<script>
//import {io} from 'socket.io-client';
import aiboimage from '@/components/aiboimage.vue';
import aiboaction from '@/components/aiboaction.vue';
import aiboresponse from '@/components/aiboresponse.vue';
import aibolog from '@/components/aibolog.vue';
import AiboCommand from '@/components/aiboCommand';

const TIMEOUT = 5;

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
      baseUrl: process.env.VUE_APP_AIBO_URL,
      deviceId: '',
      nickname: '',
      authenticated: false,
//      socket: io(),
    }
  },
  methods: {
    saveServerResponse(text) {
      this.responses = text;
    },
    saveLogMessage(text) {
      this.logMessages = text;
    },
    action_sit() {
      this.send({apiName: "change_posture", arguments: {FinalPosture: "sit"}});
    },
    action_stand() {
      this.send({apiName: "change_posture", arguments: {FinalPosture: "sit_and_raise_both_hands"}});
    },
    action_sing() {
      this.send({apiName: "play_motion", arguments: {Category: "sing", Mode: "NONE"}});
    },
    action_dance() {
      this.send({apiName: "play_motion", arguments: {Category: "dance", Mode: "NONE"}});
    },
    action_charge() {
      this.send({apiName: "move_to_position", arguments: {TargetType: "charging_station"}});
    },
    async send(action) {
      const command  = new AiboCommand(this.baseUrl, action.apiName, action.arguments, this.getResult, TIMEOUT);
      const response = await command.sendAction();
      this.responses += `${response.text}\n`;
    },
    async getResult(response) {
      this.responses += response;
    },
    async logout () {
      document.cookie = 'session=';
      window.location.href = `/logout`;
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split( `; ${name}=`);
      if(parts.length ===2) return unescape(parts.pop().split(';').shift());
    }
  },
  mounted: function () {
    const session = this.getCookie('session').substr(2);
    const session_parsed = JSON.parse(session);
    this.nickname = session_parsed.nickname;
    this.deviceId = session_parsed.deviceId;
    this.authenticated = session_parsed.authenticated;
  }
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
