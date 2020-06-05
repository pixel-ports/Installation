<template>
  <div :style="getStyle">
    <div v-if="!preview" class="preview" @click="changeWidthIframe">
      <!--<div v-if="!preview" class="preview" @click="editImage = !editImage">-->
      <el-tooltip v-if="!editImage" class="item" effect="dark" :content="$t('dashboard.editURL')" placement="top-start">
        <i class="el-icon-edit" />
      </el-tooltip>
      <i v-else class="el-icon-close" />
      <!--<i v-else="!editImage" class="el-icon-close" />-->
    </div>
    <input v-if="editImage" v-model="item.location" type="text" class="edit" @blur="save">
    <iframe ref="iframeWidget" :src="item.location" style="width:100%;height:100%;padding-top:15px;padding-bottom:15px;border:none;" />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  /*eslint-disable */
  props: ['preview', 'contenteditable', 'item', 'itemIndex'],
  /*eslint -enable */
  data() {
    return {
      editImage: false
    }
  },
  computed: {
    getStyle() {
      return 'height: 100%;'
      // border: 1px solid #000000; border-radius: 5px; // para borde negro se lo he quitado!!
    }
  },
  created() {
    // console.log(this.item.location)
  },
  methods: {
    ...mapActions([
      'saveItem'
    ]),
    save(e) {
      console.log('Save')
      console.log(e)
      this.item.location = e.target.value
      this.saveItem({ item: this.item, index: this.itemIndex })
    },
    changeWidthIframe() {
      this.editImage = !this.editImage
      if (this.editImage) {
        console.log('Editando')
        this.$refs.iframeWidget.style="width:100%;height:85%;padding-top:15px;padding-bottom:15px;border:none;"
      } else {
        this.$refs.iframeWidget.style="width:100%;height:100%;padding-top:15px;padding-bottom:15px;border:none;"
      }
    }
  }
}
</script>

<style scoped>
  .preview {
    position: absolute;
    left: 4px;
    top: 2px;
  }
  .edit {
    padding-left: 20px;
    width: 100%;
  }
   [contenteditable]:focus {
    outline: 0px solid transparent;
  }
</style>
