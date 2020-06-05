<template>
  <div class="app-container">
    <div style="font-size: 40px;height:45px;background-color: #B3C0D1;color: #333;text-align: center;line-height: 45px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.rules') }}</div>
    <el-form ref="dataForm" :rules="rules" :model="dataForm" :label-position="labelPosition" label-width="100px">
      <el-row align="center">
        <!--<h2 align="center">{{ $t('area.identification') }}</h2>-->
        <hr>
        <el-col :span="11" style="margin-right:10px;">
          <el-container>
            <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.cargoCategories') }}</div>
          </el-container>
          <el-container>
            <!--<el-aside width="150px">{{ $t('area.throughput') }}</el-aside>-->
            <el-container>
              <el-main>
                <el-form-item :label-width="labelWidth" :label-position="labelPosition" :label="$t('area.id')" prop="id">
                  <el-input v-model="dataForm.id" />
                </el-form-item>
                <el-form-item :label-width="labelWidth" :label-position="labelPosition" :label="$t('area.segment')" prop="segment">
                  <el-input v-model="dataForm.segment" />
                </el-form-item>
                <el-form-item :label-width="labelWidth" :label-position="labelPosition" :label="$t('area.unit')" prop="unit">
                  <el-input v-model="dataForm.unit" />
                </el-form-item>

                <el-form-item :label-width="labelWidth" :label-position="labelPosition" :label="$t('area.typicalAmountRange')" prop="typicalAmount">
                  <el-input-number v-model.number="dataForm.typicalAmount" :min="0" @change="changeAmountRange" />
                </el-form-item>
              </el-main>
            </el-container>
          </el-container>

          <el-container>
            <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.assignationPreference') }}</div>
          </el-container>
          <el-container>
            <!--<el-aside width="150px">{{ $t('area.throughput') }}</el-aside>-->
            <el-container>
              <el-main>
                <el-form-item :label-width="labelWidth" :label-position="labelPosition" :label="$t('area.priority')" prop="assignationPreference.priority">
                  <el-input v-model="dataForm.assignationPreference.priority" />
                </el-form-item>
                <el-form-item :label-width="labelWidth" :label-position="labelPosition" :label="$t('area.direction')" prop="assignationPreference.direction">
                  <el-input v-model="dataForm.assignationPreference.direction" />
                </el-form-item>
                <el-form-item :label-width="labelWidth" :label-position="labelPosition" :label="$t('area.dock_ID')" prop="assignationPreference.dock_ID">
                  <el-input v-model="dataForm.assignationPreference.dock_ID" />
                </el-form-item>

                <el-form-item :label-width="labelWidth" :label-position="labelPosition" :label="$t('area.supplyChain_ID')" prop="assignationPreference.supplyChain_ID">
                  <el-input v-model="dataForm.assignationPreference.supplyChain_ID" />
                </el-form-item>
              </el-main>
            </el-container>
          </el-container>

        </el-col>
        <el-col :span="11" style="margin-left:10px;">
          <el-container>
            <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.shiftworks') }}</div>
          </el-container>
          <el-container>
            <!--<el-aside width="150px">{{ $t('area.consumptions') }}</el-aside>-->
            <el-container>
              <el-main>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.id')" prop="shiftworks.nature">
                  <el-input v-model="dataForm.shiftworks.id" />
                </el-form-item>
                <el-form-item label-width="138px" :label-position="labelPosition" :label="$t('area.value')" prop="shiftworks.value">
                  <el-input-number v-model.number="dataForm.shiftworks.value" :min="0" @change="changeConsumption" />
                </el-form-item>
              </el-main>
            </el-container>
          </el-container>
        </el-col>
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
      labelWidth: '180px',
      dataForm: {
        id: '',
        segment: '',
        unit: '',
        typicalAmount: 0,
        assignationPreference: {
          priority: '',
          direction: '',
          dock_ID: '',
          supplyChain_ID: ''
        },
        shiftworks: {
          id: '',
          value: ''
        },
        consumptions: {
          nature: '',
          value: '',
          unit: ''
        }
      },
      rules: {
        id: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        segment: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
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
    changeAmountRange(value) {
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
