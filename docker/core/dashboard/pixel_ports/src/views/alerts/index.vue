<template>
  <iframe
    ref="praeco"
    src="https://praeco.demo.pixel-ports.eu/"
    frameborder="0"
    height="100%"
    width="100%"
  />
</template>
<script>
export default {
  name: 'Alerts',
  props: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
iframe {
    width: 100%;
    height: 100%;
    display:block;
    border:none;
    position: absolute;
}
</style>
