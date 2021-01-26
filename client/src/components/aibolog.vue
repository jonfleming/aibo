<template>
    <div>
        <p class="text-left"><b>Log</b></p>
        <textarea class="form-control" rows="10" :value="logMessages"></textarea>
    </div>
</template>

<script>
export default {
  name: 'aibolog',
  props: {
    logMessages: String
  },
};
</script>
