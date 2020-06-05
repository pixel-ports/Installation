<template>
  <iframe :src="definition.url" frameborder="0" />
</template>

<script>
export default {
  props: {
    definition: {
      type: Object,
      default: function() {
        return {
          url: 'https://cdn4.iconfinder.com/data/icons/internet-seo-and-online-activity/400/Internet_online_world_wide_web_globe_network-512.png'
        }
      }
    }
  },
  data() {
    return {
      url: null
    }
  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
iframe {
    width: 100%;
    height: 100%;
}
</style>
