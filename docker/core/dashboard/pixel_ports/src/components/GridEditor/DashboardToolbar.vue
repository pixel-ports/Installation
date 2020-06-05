<template>
  <div style="width:90%;margin:0 auto;margin-top:10px;">
    <div style="height:60px; margin-bottom:10px;background-color:#fafafa;padding:10px;border-radius:5px;display:block;text-align:center;">
      <span v-if="!preview">
        <el-tooltip class="item" effect="dark" :content="$t('models.scheduleModel')" placement="top-start">
          <el-button size="small" class="btn" @click="addTitleGridItem">
            {{ $t('dashboard.title') }}
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('models.scheduleModel')" placement="top-start">
          <el-button size="small" class="btn" @click="addContentGridItem">
            {{ $t('dashboard.text') }}
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('models.scheduleModel')" placement="top-start">
          <el-button size="small" class="btn" @click="addImageGridItem">
            {{ $t('dashboard.image') }}
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('models.scheduleModel')" placement="top-start">
          <el-button size="small" class="btn" @click="addVisualizationItem">
            {{ $t('dashboard.visualization') }}
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('models.scheduleModel')" placement="top-start">
          <el-button size="small" class="btn" @click="addIframeGridItem">
            {{ $t('dashboard.iframe') }}
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('models.scheduleModel')" placement="top-start">
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
      <el-tooltip class="item" effect="dark" :content="$t('models.scheduleModel')" placement="top-start">
        <el-button v-if="!preview" size="small" class="btn" @click="saveLayout">
          <span>{{ $t('dashboard.save') }}</span>
        </el-button>
      </el-tooltip>
      <el-button v-if="!preview & storedLayout !== null" size="small" class="btn" @click="load">
        <!--<el-button v-if="preview & storedLayout !== null" size="small" type="info" @click="load">-->
        <span>{{ $t('dashboard.load') }}</span>
      </el-button>
    </div>
    <hr>
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
  </div>
</template>
<script>
export default {
  name: 'ToolBar',
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {}
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
.btn-outline-primary {
    background-color: transparent;
    background-image: none;
    border-color: #007bff;
}
</style>
