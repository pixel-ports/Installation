<template>
  <div>
    <!--<div v-if="isEditable" class="site-title">{{ titleDashboard }} </div>-->
    <div v-if="isEditable" style="width:90%;margin:0 auto;margin-top:15px;">
      <div style="height:60px; margin-bottom:10px;background-color:#fafafa;padding:10px;border-radius:5px;display:block;text-align:center;">
        <span v-if="!preview">
          <el-tooltip class="item" effect="dark" :content="$t('dashboard.ToolBarHeader')" placement="top-start">
            <el-button size="small" class="btn" @click="addTitleGridItem">
              {{ $t('dashboard.header') }}
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('dashboard.ToolBarText')" placement="top-start">
            <el-button size="small" class="btn" @click="addContentGridItem">
              {{ $t('dashboard.text') }}
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('dashboard.ToolBarImage')" placement="top-start">
            <el-button size="small" class="btn" @click="addImageGridItem">
              {{ $t('dashboard.image') }}
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('dashboard.ToolBarWidget')" placement="top-start">
            <el-button size="small" class="btn" @click="addVisualizationItem">
              {{ $t('dashboard.visualization') }}
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('dashboard.ToolBarIframe')" placement="top-start">
            <el-button size="small" class="btn" @click="addIframeGridItem">
              {{ $t('dashboard.iframe') }}
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('dashboard.ToolBarClearLayout')" placement="top-start">
            <el-button size="small" class="btn" @click="clearLayout">
              {{ $t('dashboard.clearLayout') }}
            </el-button>
          </el-tooltip>
        </span>
        <el-button size="small" class="btn" @click="disableGrid">
          <span v-if="preview">{{ $t('dashboard.edit') }}</span>
          <span v-else>
            <!--<span v-else="preview">-->
            <svg-icon icon-class="eye-open" />
            {{ $t('dashboard.preview') }}
          </span>
        </el-button>
        <el-tooltip class="item" effect="dark" :content="$t('dashboard.ToolBarSave')" placement="top-start">
          <el-button v-if="!preview" size="small" class="btn" @click="saveLayout">
            <span>{{ $t('dashboard.save') }}</span>
          </el-button>
        </el-tooltip>
        <!--<el-button v-if="!preview & storedLayout !== null" size="small" class="btn" @click="load">
          <span>{{ $t('dashboard.load') }}</span>
        </el-button>-->
      </div>
      <hr>
    </div>
    <!--<div style="text-align: center;">
      <div class="site-title"> Dashboard</div>
      <span v-if="!preview">
        <el-button size="small" type="info" @click="addTitleGridItem">
          {{ $t('dashboard.title') }}
        </el-button>
        <el-button size="small" type="info" @click="addContentGridItem">
          {{ $t('dashboard.text') }}
        </el-button>
        <el-button size="small" type="info" @click="addImageGridItem">
          {{ $t('dashboard.image') }}
        </el-button>
        <el-button size="small" type="info" @click="addVisualizationItem">
          {{ $t('dashboard.visualization') }}
        </el-button>
        <el-button size="small" type="info" @click="addIframeGridItem">
          {{ $t('dashboard.iframe') }}
        </el-button>
        <el-button size="small" type="info" @click="clearLayout">
          {{ $t('dashboard.clearLayout') }}
        </el-button>
      </span>
      <el-button size="small" type="info" @click="disableGrid">
        <span v-if="preview">{{ $t('dashboard.edit') }}</span>
        <span v-else="preview">{{ $t('dashboard.preview') }}</span>
      </el-button>
      <el-button v-if="!preview" size="small" type="info" @click="saveLayout">
        <span>{{ $t('dashboard.save') }}</span>
      </el-button>
      <el-button v-if="!preview & storedLayout !== null" size="small" type="info" @click="load">
        <span>{{ $t('dashboard.load') }}</span>
      </el-button>
    </div>
    <hr>-->
    <grid-layout
      ref="grid"
      :layout="getResources"
      :col-num="12"
      :row-height="30"
      :is-draggable="isDraggable"
      :is-resizable="isResizable"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
      @layout-created="layoutCreatedEvent"
      @layout-before-mount="layoutBeforeMountEvent"
      @layout-mounted="layoutMountedEvent"
      @layout-ready="layoutReadyEvent"
      @layout-updated="layoutUpdatedEvent"
    >
      <grid-item
        v-for="(item, index) in getResources"
        :key="index"
        :class="{ 'editMode' : !preview }"
        :auto-size="true"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resize="resizeEvent"
        @move="moveEvent"
        @resized="resizedEvent"
        @container-resized="containerResizedEvent"
        @moved="movedEvent"
      >
        <div v-if="!preview" style="position: absolute; bottom: 0px; left: 4px;" @click="removeItem({key: index})">
          <el-tooltip class="item" effect="dark" :content="$t('dashboard.delete')" placement="top-start">
            <i class="el-icon-delete" />
          </el-tooltip>
          <!--<i class="fa fa-trash" aria-hidden="true" />-->
        </div>
        <text-widget
          v-if="item.type == 'title'"
          :preview="preview"
          :contenteditable="contenteditable"
          :item="item"
          :item-index="index"
        />

        <text-area-widget
          v-if="item.type == 'content'"
          :preview="preview"
          :contenteditable="contenteditable"
          :item="item"
          :item-index="index"
        />

        <image-widget
          v-if="item.type == 'image'"
          :preview="preview"
          :contenteditable="contenteditable"
          :item="item"
          :item-index="index"
        />

        <visualization-widget
          v-if="item.idType == 'visualization'"
          :item="item"
          :item-index="index"
        />

        <iframe-widget
          v-if="item.type == 'iframe'"
          :preview="preview"
          :contenteditable="contenteditable"
          :item="item"
          :item-index="index"
        />

      </grid-item>
    </grid-layout>
    <el-dialog :title="$t('dashboard.listVisualizations')" :visible.sync="selectWidget" width="60%" hide-overlay transition="dialog-bottom-transition">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        :empty-text="$t('dashboard.emptyWidgets')"
      >
        <el-table-column :label="$t('widget.listTitle')">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('widget.listDescription')">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('widget.listDate')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('widget.listSource')" class-name="status-col">
          <template slot-scope="{row}">
            <el-tag size="mini" :color="getColorTag(row.source.substring(row.source.length - 4, row.source.length))" effect="light" class="el-tag-white">
              {{ row.source }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('widget.listType')" class-name="status-col">
          <template slot-scope="{row}">
            <el-tag size="mini" :color="getColorTag(row.type.substring(row.type.length - 4, row.type.length))" effect="light" class="el-tag-white">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('dashboard.action')" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-row type="flex" class="row-bg" justify="center" :gutter="20">
              <el-col>
                <el-button size="small" type="info" @click="addVisualization(row)">
                  {{ $t('dashboard.add') }}
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--</div>-->
    <!-- dialog for Save Dashboard -->
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" width="60%" hide-overlay transition="dialog-bottom-transition" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-row align="center">
          <el-col :span="24">
            <el-form-item :label-width="labelColumn" :label="$t('dashboard.title')" prop="title">
              <el-input ref="name" v-model="dataForm.title" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="24">
            <el-form-item :label-width="labelColumn" :label="$t('models.description')" prop="description">
              <el-input v-model="dataForm.description" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="success" @click="dialogStatus===$t('dashboard.createDashboard')?createDashboard('dataForm'):updateDashboard()">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/*eslint-disable */
import { mapGetters, mapActions } from 'vuex'
/*eslint -enable */
import TextWidget from './TextWidget'
import TextAreaWidget from './TextAreaWidget'
import ImageWidget from './ImageWidget'
import VisualizationWidget from './VisualizationWidget'
import IframeWidget from './IframeWidget'
// import Toolbar from './DashboardToolbar'
import { GridLayout, GridItem } from 'vue-grid-layout'
import { widgetFetchList } from '@/api/widget'
import { dashboardCreate, dashboardUpdate } from '@/api/dashboard'
import { getColor } from '@/utils/common'
import pixelConstants from '@/utils/constants' // import class for constants
export default {
  name: 'Gridview',
  components: { GridLayout, GridItem, TextWidget, TextAreaWidget, ImageWidget, VisualizationWidget, IframeWidget },
  data() {
    return {
      isDraggable: false,
      isResizable: false,
      preview: true,
      contenteditable: false,
      storedLayout: null,
      selectWidget: false,
      list: null,
      listLoading: true,
      listQuery: {
        text: undefined,
        type: undefined
      },
      isEditable: true,
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        title: [{ required: true, message: this.$t('dashboard.errTitleRequired'), trigger: 'blur' }],
        description: [{ required: true, message: this.$t('models.errDescriptionRequired'), trigger: 'blur' }]
      },
      dataForm: {
        title: '',
        description: '',
        definition: []
      },
      labelColumn: '110px',
      titleDashboard: '',
      isNewDashboard: false
    }
  },
  computed: {
    ...mapGetters([
      'getResources'
    ])//,
    /*getResources() {
      var idDashboard = this.$store.getters.getIdDashboard
      this.isEditable = this.$store.getters.getisEditable
      var resources = []
      if (idDashboard != null) {
          console.log('Edición / Visualización de un dashboard existente')
          this.$store.commit('setisNewDashboard', false)
          dashboardGet(idDashboard).then(response => {
            console.log('GET DASHBOARD')
            console.log(response.data.definition.dashboard)
            resources = response.data.definition.dashboard
            this.titleDashboard = this.$t('dashboard.edit') + ' ' + response.data.title
            this.$store.commit('setCurrentDashboard', response.data)
          }).catch(() => {
            console.log('Error')
          })
      } else {
        console.log('Creación de un nuevo dashboard')
          resources = []
          this.titleDashboard = this.$t('dashboard.createNewDashboard')
      }
      return resources
    }*/
  },
  /*created() {
    var resources = this.getResources
  },*/
  created() {
    console.log('CREATED GRIDVIEW VIEW')
    this.isEditable = this.$store.getters.getisEditable
    console.log('Is Editable? ' + this.isEditable)
    var resources = this.$store.getters.getResources
    console.log('resources: ' + resources)
    this.isNewDashboard = this.$store.getters.getisNewDashboard
    if (this.isNewDashboard) {
      console.log('Creación dashboard')
      this.titleDashboard = this.$t('dashboard.createNewDashboard')
    } else {
      console.log('Edición dashboard')
      this.titleDashboard = this.$t('dashboard.edit') + ' ' + this.$store.getters.getTitleDashboard
    }
  },
  methods: {
    ...mapActions([
      'addTitleGridItem',
      'addContentGridItem',
      'addImageGridItem',
      'addVisualizationGridItem',
      'addIframeGridItem',
      'removeItem'
    ]),
    disableGrid() {
      this.isDraggable = !this.isDraggable
      this.isResizable = !this.isResizable
      this.preview = !this.preview
      this.contenteditable = !this.contenteditable
    },
    layoutCreatedEvent(newLayout) {
      console.log('Created layout: ', newLayout)
    },
    layoutBeforeMountEvent(newLayout) {
      console.log('beforeMount layout: ', newLayout)
    },
    layoutMountedEvent(newLayout) {
      console.log('Mounted layout: ', newLayout)
    },
    layoutReadyEvent(newLayout) {
      console.log('Ready layout: ', newLayout)
    },
    layoutUpdatedEvent(newLayout) {
      console.log('Updated layout: ', newLayout)
      var i = 0
      for (i = 0; i <= newLayout.length - 1; i++) {
        console.log(newLayout[i].type)
      }
    },
    moveEvent(i, newX, newY) {
      console.log('MOVE i=' + i + ', X=' + newX + ', Y=' + newY)
    },
    resizeEvent(i, newH, newW, newHPx, newWPx) {
      console.log('RESIZE i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx)
    },
    movedEvent(i, newX, newY) {
      console.log('MOVED i=' + i + ', X=' + newX + ', Y=' + newY)
    },
    containerResizedEvent() {

    },
    resizedEvent() {

    },
    load() {
      this.$store.commit('setResources', JSON.parse(this.storedLayout))
      console.log('LOAD')
      console.log(JSON.parse(this.storedLayout))
    },
    saveLayout() {
      if (this.isNewDashboard) {
        this.dialogStatus = this.$t('dashboard.createDashboard')
      } else {
        this.dialogStatus = this.$t('dashboard.editDashboard')
        this.dataForm = Object.assign({}, this.$store.getters.getCurrentDashboard) // copy object current Dashboard
      }
      this.dialogFormVisible = true
      /* var saveLayout = this.$refs.grid.layout
      this.storedLayout = saveLayout
      this.storedLayout = JSON.stringify(saveLayout)
      console.log(this.storedLayout) */
    },
    clearLayout() {
      this.$store.commit('setResources', [])
    },
    addVisualizationItem() {
      this.getList()
      this.selectWidget = true
    },
    getColorTag(color) {
      return getColor(color)
    },
    addVisualization(row) {
      this.selectWidget = false
      this.addVisualizationGridItem(row)
    },
    getList() {
      this.listLoading = true
      widgetFetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.length
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleClose(done) {
      this.$confirm(this.$t('common.closeDialog'), this.$t('common.warning'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      })
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    createDashboard(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('Create')
          this.dataForm.definition = {
            'dashboard': this.save()
          }
          dashboardCreate(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.createdSuccessfully'),
              type: 'success',
              duration: 2000
            })
            this.disableGrid()
          })
        }
      })
    },
    updateDashboard() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('Update')
          this.dataForm.definition = {
            'dashboard': this.save()
          }
          console.log('Id: ' + this.$route.params.id)
          dashboardUpdate(this.$route.params.id, this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.createdSuccessfully'),
              type: 'success',
              duration: 2000
            })
            this.disableGrid()
          })
        }
      })
    },
    save() {
      var saveLayout = this.$refs.grid.layout
      this.storedLayout = saveLayout
      // this.storedLayout = JSON.stringify(saveLayout)
      // console.log(this.storedLayout)
      return this.storedLayout
    }
  }
}
</script>
<style>
.editMode {
  background-color: #fafafa;
  border-radius: 5px;
}
.site-title {
  font-family: 'Lilita One', cursive;
  font-size: 50px;
  /* color: #F48FB1; */
  text-align: center;
}
.heading1 {
  font-family: 'Cambria', cursive;
  font-size: 30px;
  border: 0;
  border-bottom: 1px solid #8c8c8c;
  /* font-family: 'Crushed', cursive;
  font-size: 35px;
  border: none;
  color: #2196F3; */
}
.heading2 {
  font-family: 'Cambria';
  font-weight: bold;
  font-size: 20px;
  padding: 10px 5px;
  /* font-family: 'Patrick Hand', cursive;
  font-size: 20px;
  border: none;
  color: #3096f3;
  background-color: #FFF9C4;
  width: 100%;
  padding: 10px 5px; */
}
.heading3 {
  font-family: 'Cambria';
  font-style: italic;
  font-size: 16px;
  padding: 0 7px;
  /* font-family: 'Homemade Apple', cursive;
  font-size: 20px;
  border: none;
  color: #66d2b3;
  padding: 0 7px; */
}
.content {
  font-family: 'Times New Roman';
  font-size: 16px;
  /* color: #2196F3; */
}
i:hover {
  cursor:pointer;
}
.el-tag-white {
  color: white;
}
</style>
