<template>
  <div class="app-container">
    <div style="font-size: 40px;height:45px;background-color: #B3C0D1;color: #333;text-align: center;line-height: 45px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.supplierChain') }}</div>
    <el-form ref="dataForm" :rules="rules" :model="dataForm" :label-position="labelPosition" label-width="100px">
      <el-row align="center">
        <!--<h2 align="center">{{ $t('area.identification') }}</h2>-->
        <hr>
        <el-col :span="11" style="margin-right:10px;">
          <!--<h2 align="center">{{ $t('area.identification') }}</h2>-->
          <el-form-item :label="$t('area.id')" :label-position="labelPosition" prop="id">
            <el-input v-model="dataForm.name" />
          </el-form-item>
          <el-form-item :label="$t('area.label')" :label-position="labelPosition">
            <!--prop="label"-->
            <el-input v-model="dataForm.label" />
          </el-form-item>
          <el-form-item :label="$t('area.comment')" :label-position="labelPosition">
            <el-input v-model="dataForm.comment" :autosize="{ minRows: 3, maxRows: 8}" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="11" style="margin-left:10px;">
          <!--<el-form-item :label="$t('area.suitableCargoType')" :label-position="labelPosition" label-width="170px" prop="type" style="margin-left:10px">
            <el-tree ref="tree" :check-strictly="checkStrictly" :data="cargosType" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
          </el-form-item>-->
          <el-container>
            <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.compatibility') }}</div>
          </el-container>
          <el-container>
            <!--<el-aside width="150px">{{ $t('area.consumptions') }}</el-aside>-->
            <el-container>
              <el-main>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.cargoCategory')">
                  <el-select v-model="dataForm.compatibility.cargoCategory" class="filter-item" :placeholder="$t('area.selectType')" style="width:100%">
                    <el-option
                      v-for="item in cargoType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      multiple
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.directionNature')">
                  <el-select v-model="dataForm.compatibility.directionNature" class="filter-item" :placeholder="$t('area.selectType')" style="width:100%">
                    <el-option
                      v-for="item in directionType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      multiple
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.areaID')">
                  <el-select v-model="dataForm.compatibility.areaID" class="filter-item" :placeholder="$t('area.selectType')" style="width:100%">
                    <el-option
                      v-for="item in areaType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      multiple
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.shiftwork_ID')">
                  <el-input v-model="dataForm.compatibility.shiftwork_ID" />
                </el-form-item>
              </el-main>
            </el-container>
          </el-container>
        </el-col>
      </el-row>
      <form-wizard shape="circle" width="60%" color="#20a0ff" error-color="#ff4949" @on-complete="onComplete">
        <tab-content title="Personal details" icon="ti-user" :before-change="validateFirstStep">
          <el-form ref="ruleForm" :inline="true" :model="formInline" class="demo-form-inline" :rules="rules">
            <el-form-item label="Approved by" prop="user">
              <el-input v-model="formInline.user" placeholder="Approved by" />
            </el-form-item>
            <el-form-item label="Activity zone" prop="region">
              <el-select v-model="formInline.region" placeholder="Activity zone">
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select>
            </el-form-item>
          </el-form>

        </tab-content>
        <tab-content title="Additional Info" icon="ti-settings">
          Second tab
        </tab-content>
        <tab-content title="Last step" icon="ti-check">
          Yuhuuu! This seems pretty damn simple
        </tab-content>

        <el-button slot="prev" type="primary">Back</el-button>
        <el-button slot="next" type="primary">Next</el-button>
        <el-button slot="finish" type="primary">Finish</el-button>
      </form-wizard>
    </el-form>
  </div>
</template>

<script>
// Importing sample JSON data for the state
import typeCargo from './cargoType.json'
import typeDirection from './directionType.json'
import typeArea from './areaType.json'
export default {
  name: 'DashboardTable',
  data() {
    return {
      labelPosition: 'left',
      dataForm: {
        id: '',
        label: '',
        comment: '',
        compatibility: {
          cargoCategory: '',
          directionNature: '',
          areaID: '',
          shiftwork_ID: ''
        }
      },
      rules: {
        id: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        label: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        type: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        user: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ],
        region: [{
          required: true,
          message: 'Please select Activity zone',
          trigger: 'change'
        }]
      },
      formInline: {
        user: '',
        region: ''
      }
    }
  },
  computed: {
    directionType() {
      return typeDirection
    },
    cargoType() {
      return typeCargo
    },
    areaType() {
      return typeArea
    }
  },
  created() {},
  mehtods: {}
}
</script>
<style lang="scss" scoped>
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 30px !important;
    border-radius: 3px;
  }
  element.style{
      height: 60px !important;
  }
  .titleForm {
    font-family: 'Lilita One', cursive;
    font-size: 40px;
    text-align: center;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
  .el-form-item--label-top .el-form-item__label {
  width: auto!important;
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0 0 10px;
}

.el-form-item--label-top .el-form-item__content {
  margin-left: 0!important;
}
</style>
