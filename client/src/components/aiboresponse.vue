<template>
    <div>
        <p class="text-left"><b>API Response</b>s</p>
        <textarea class="ml-0" rows="15" :value="responses"></textarea>
    </div>
</template>

<script>
export default {
  name: 'aiboresponse',
  props: {
    responses: String
  }
};
</script>
<style scoped>
textarea {
  width: 100%;
}
</style>
