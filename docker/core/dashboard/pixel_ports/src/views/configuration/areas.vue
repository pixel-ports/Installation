<template>
  <div class="app-container">
    <el-tabs type="card">
      <el-tab-pane :label="$t('area.area')">
        <el-form ref="dataForm" :rules="rules" :model="dataForm" :label-position="labelPosition" label-width="100px">
          <el-row align="center">
            <!--<h2 align="center">{{ $t('area.identification') }}</h2>-->
            <!--<hr>-->
            <el-col :span="11" style="margin-right:10px;margin-left:50px;">
              <!--<h2 align="center">{{ $t('area.identification') }}</h2>-->
              <el-form-item :label="$t('area.id')" :label-position="labelPosition" prop="area.id">
                <el-input v-model="dataForm.area.id" />
              </el-form-item>
              <el-form-item :label="$t('area.areaType')" :label-position="labelPosition">
                <!--prop="type"-->
                <el-select v-model="dataForm.area.type" class="filter-item" :placeholder="$t('area.selectType')" style="width:100%">
                  <el-option
                    v-for="item in typeArea"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    multiple
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('area.terminal')" :label-position="labelPosition">
                <!--prop="terminal"-->
                <el-input v-model="dataForm.area.terminal" />
              </el-form-item>
            </el-col>
            <el-col :span="11" style="margin-left:10px;">
              <el-form-item :label="$t('area.label')" :label-position="labelPosition">
                <!--prop="label"-->
                <el-input v-model="dataForm.area.label" />
              </el-form-item>
              <el-form-item :label="$t('area.owner')" :label-position="labelPosition">
                <!--prop="owner"-->
                <el-input v-model="dataForm.area.owner" />
              </el-form-item>
            </el-col>
            <!--<el-col :span="8">
          <el-form-item :label="$t('area.suitableCargoType')" :label-position="labelPosition" label-width="170px" prop="type" style="margin-left:10px">
            <el-tree ref="tree" :check-strictly="checkStrictly" :data="cargosType" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
          </el-form-item>
        </el-col>-->
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('area.machine')">
        <el-form ref="dataForm" :rules="rules" :model="dataForm" :label-position="labelPosition" label-width="100px">
          <el-row align="center">
            <!--<h2 align="center">{{ $t('area.identification') }}</h2>-->
            <hr>
            <el-col :span="11" style="margin-right:10px;margin-left:50px;">
              <!--<h2 align="center">{{ $t('area.identification') }}</h2>-->
              <el-form-item :label="$t('area.id')" :label-width="labelWidthMachine" :label-position="labelPosition" prop="machine.id">
                <el-input v-model="dataForm.machine.id" />
              </el-form-item>
              <el-form-item :label="$t('area.type')" :label-width="labelWidthMachine" :label-position="labelPosition" prop="machine.type">
                <el-select v-model="dataForm.machine.type" class="filter-item" :placeholder="$t('models.selectType')" style="width:100%">
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
              <el-form-item :label="$t('area.owner')" :label-width="labelWidthMachine" :label-position="labelPosition">
                <!--prop="owner"-->
                <el-input v-model="dataForm.machine.owner" />
              </el-form-item>
              <el-container>
                <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.throughput') }}</div>
              </el-container>
              <el-container>
                <!--<el-aside width="150px">{{ $t('area.throughput') }}</el-aside>-->
                <el-container>
                  <el-main>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.value')" prop="machine.throughput.value">
                      <el-input-number v-model.number="dataForm.machine.throughput.value" :min="0" @change="changeThroughput" />
                    </el-form-item>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.unit')" prop="machine.throughput.unit">
                      <el-input v-model="dataForm.machine.throughput.unit" />
                    </el-form-item>
                  </el-main>
                </el-container>
              </el-container>

            </el-col>
            <!--<el-col :span="2" />-->
            <el-col :span="11" style="margin-left:10px;">
              <el-form-item :label="$t('area.label')" :label-width="labelWidthMachine" :label-position="labelPosition">
                <!--prop="label"-->
                <el-input v-model="dataForm.machine.label" />
              </el-form-item>
              <el-form-item :label="$t('area.group')" :label-width="labelWidthMachine" :label-position="labelPosition">
                <!--prop="group"-->
                <el-input v-model="dataForm.machine.group" />
              </el-form-item>
              <el-form-item :label="$t('area.shiftID')" :label-width="labelWidthMachine" :label-position="labelPosition">
                <!--prop="shiftID"-->
                <el-input v-model="dataForm.machine.shiftID" />
              </el-form-item>
              <el-container>
                <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.consumptions') }}</div>
              </el-container>
              <el-container>
                <!--<el-aside width="150px">{{ $t('area.consumptions') }}</el-aside>-->
                <el-container>
                  <el-main>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.nature')" prop="machine.consumptions.nature">
                      <el-input v-model="dataForm.machine.consumptions.nature" />
                    </el-form-item>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.value')" prop="machine.consumptions.value">
                      <el-input-number v-model.number="dataForm.machine.consumptions.value" :min="0" @change="changeConsumption" />
                    </el-form-item>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.unit')" prop="machine.consumptions.unit">
                      <el-input v-model="dataForm.machine.consumptions.unit" />
                    </el-form-item>
                  </el-main>
                </el-container>
              </el-container>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="success" @click="dialogStatus===$t('models.createModel')?createData('dataForm'):updateData()">
        {{ $t('common.confirm') }}
      </el-button>
      <el-button type="danger" @click="dialogFormVisible = false">
        {{ $t('common.cancel') }}
      </el-button>
    </div>
  </div>
</template>

<script>
// Importing sample JSON data for the state
import cargoTypes from './cargoType.json'
import areaType from './areaType.json'
import machineType from './machineType.json'
export default {
  name: 'DashboardTable',
  data() {
    return {
      labelPosition: 'left',
      labelWidthMachine: '',
      labelWidthMachine_Groups: '80px',
      activeName: 'first',
      dataForm: {
        area: {
          id: 'Dock1',
          label: '',
          type: '',
          owner: '',
          terminal: ''
        },
        machine: {
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
        }
      },
      rules: {
        'area.id': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'machine.id': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'machine.type': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'machine.throughput.value': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'machine.throughput.unit': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'machine.consumptions.nature': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'machine.consumptions.value': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'machine.consumptions.unit': [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }]
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
    typeArea() {
      return areaType
    },
    typeMachine() {
      return machineType
    }
  },
  created() {},
  methods: {
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
