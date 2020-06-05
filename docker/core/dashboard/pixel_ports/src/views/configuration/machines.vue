<template>
  <div class="app-container">
    <div style="font-size: 40px;height:45px;background-color: #B3C0D1;color: #333;text-align: center;line-height: 45px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.machine') }}</div>
    <el-form ref="dataForm" :rules="rules" :model="dataForm" :label-position="labelPosition" label-width="100px">
      <el-row align="center">
        <!--<h2 align="center">{{ $t('area.identification') }}</h2>-->
        <hr>
        <el-col :span="11" style="margin-right:10px;">
          <!--<h2 align="center">{{ $t('area.identification') }}</h2>-->
          <el-form-item :label="$t('area.id')" label-width="155px" :label-position="labelPosition" prop="id">
            <el-input v-model="dataForm.id" />
          </el-form-item>
          <el-form-item :label="$t('area.type')" label-width="155px" :label-position="labelPosition" prop="type">
            <el-select v-model="dataForm.type" class="filter-item" :placeholder="$t('models.selectType')" style="width:100%">
              <el-option
                v-for="item in typeMachine"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                multiple
              />
            </el-select>
            <!--<el-input v-model="dataForm.type" />-->
          </el-form-item>
          <el-form-item :label="$t('area.owner')" label-width="155px" :label-position="labelPosition">
            <!--prop="owner"-->
            <el-input v-model="dataForm.owner" />
          </el-form-item>
          <el-container>
            <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.throughput') }}</div>
          </el-container>
          <el-container>
            <!--<el-aside width="150px">{{ $t('area.throughput') }}</el-aside>-->
            <el-container>
              <el-main>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.value')" prop="throughput.unit">
                  <el-input-number v-model.number="dataForm.throughput.value" :min="0" @change="changeThroughput" />
                </el-form-item>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.unit')" prop="throughput.value">
                  <el-input v-model="dataForm.throughput.unit" />
                </el-form-item>
              </el-main>
            </el-container>
          </el-container>

        </el-col>
        <el-col :span="11" style="margin-left:10px;">
          <el-form-item :label="$t('area.label')" label-width="155px" :label-position="labelPosition">
            <!--prop="label"-->
            <el-input v-model="dataForm.label" />
          </el-form-item>
          <el-form-item :label="$t('area.group')" label-width="155px" :label-position="labelPosition">
            <!--prop="group"-->
            <el-input v-model="dataForm.group" />
          </el-form-item>
          <el-form-item :label="$t('area.shiftID')" label-width="155px" :label-position="labelPosition">
            <!--prop="shiftID"-->
            <el-input v-model="dataForm.shiftID" />
          </el-form-item>
          <el-container>
            <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.consumptions') }}</div>
          </el-container>
          <el-container>
            <!--<el-aside width="150px">{{ $t('area.consumptions') }}</el-aside>-->
            <el-container>
              <el-main>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.nature')" prop="consumptions.nature">
                  <el-input v-model="dataForm.consumptions.nature" />
                </el-form-item>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.value')" prop="consumptions.unit">
                  <el-input-number v-model.number="dataForm.consumptions.value" :min="0" @change="changeConsumption" />
                </el-form-item>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.unit')" prop="consumptions.value">
                  <el-input v-model="dataForm.consumptions.unit" />
                </el-form-item>
              </el-main>
            </el-container>
          </el-container>
        </el-col>
        <!--<el-col :span="6">
          <el-form-item :label="$t('area.suitableArea')" :label-position="labelPosition" label-width="170px" prop="type" style="margin-left:10px">
            <el-select v-model="dataForm.name" class="filter-item" :placeholder="$t('models.selectCategory')" style="width:100%">
              <el-select v-model="dataForm.name" :placeholder="$t('models.selectCPU')" style="width:85%">
                <el-option
                  v-for="item in areasType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  multiple
                />
              </el-select>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('area.suitableCargoType')" :label-position="labelPosition" label-width="170px" prop="type" style="margin-left:10px">
            <el-tree ref="tree" :check-strictly="checkStrictly" :data="cargosType" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
          </el-form-item>
        </el-col>-->
      </el-row>
    </el-form>
  </div>
</template>

<script>
// Importing sample JSON data for the state
import cargoTypes from './cargoType.json'
import machineType from './machineType.json'
export default {
  name: 'DashboardTable',
  data() {
    return {
      labelPosition: 'left',
      dataForm: {
        id: '',
        label: '',
        type: '',
        group: '',
        owner: '',
        shiftID: '',
        throughput: {
          value: '',
          unit: ''
        },
        consumptions: {
          nature: '',
          value: '',
          unit: ''
        }
      },
      rules: {
        id: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        label: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        type: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        group: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        owner: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        shiftID: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'throughput.value': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'throughput.unit': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'consumptions.nature': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'consumptions.value': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'consumptions.unit': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }]
      },
      checkStrictly: false,
      cc: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    cargosType() {
      // this.cc = cargoTypes
      console.log('computed')
      console.log(cargoTypes)
      return cargoTypes
    },
    typeMachine() {
      return machineType
    }
  },
  created() {},
  mehtods: {
    changeThroughput(value) {
      // console.log(value)
    },
    changeConsumption(value) {
      // console.log(value)
    }
  }
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
