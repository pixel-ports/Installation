<template>
  <div class="dashboard-editor-container">
    <form-wizard shape="square" color="#20a0ff" error-color="#ff4949" @on-complete="onComplete">
      <tab-content title="Personal details" icon="ti-user" :before-change="validateAreas">
        <el-form ref="dtFormAreas" :model="dtFormAreas" :rules="rules">
          <el-row align="center">
            <el-col :span="11" style="margin-right:10px;margin-left:50px;">
              <el-form-item :label="$t('area.id')" :label-position="labelPosition" prop="id">
                <el-input v-model="dtFormAreas.id" />
              </el-form-item>
              <el-form-item :label="$t('area.areaType')" :label-position="labelPosition">
                <el-select v-model="dtFormAreas.type" class="filter-item" :placeholder="$t('area.selectType')" style="width:100%">
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
                <el-input v-model="dtFormAreas.terminal" />
              </el-form-item>
            </el-col>
            <el-col :span="11" style="margin-left:10px;">
              <el-form-item :label="$t('area.label')" :label-position="labelPosition">
                <el-input v-model="dtFormAreas.label" />
              </el-form-item>
              <el-form-item :label="$t('area.owner')" :label-position="labelPosition">
                <el-input v-model="dtFormAreas.owner" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </tab-content>
      <tab-content title="Additional Info" icon="ti-settings" :before-change="validateMachines">
        <el-form ref="dtFormMachines" :model="dtFormMachines" :rules="rules">
          <el-row align="center">
            <el-col :span="11" style="margin-right:10px;margin-left:50px;">
              <el-form-item :label="$t('area.id')" :label-width="labelWidthMachine" :label-position="labelPosition" prop="id">
                <el-input v-model="dtFormMachines.id" />
              </el-form-item>
              <el-form-item :label="$t('area.type')" :label-width="labelWidthMachine" :label-position="labelPosition" prop="type">
                <el-select v-model="dtFormMachines.type" class="filter-item" :placeholder="$t('models.selectType')" style="width:100%">
                  <el-option
                    v-for="item in typeMachine"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    multiple
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('area.owner')" :label-width="labelWidthMachine" :label-position="labelPosition">
                <el-input v-model="dtFormMachines.owner" />
              </el-form-item>
              <el-container>
                <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.throughput') }}</div>
              </el-container>
              <el-container>
                <el-container>
                  <el-main>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.value')" prop="throughput.value">
                      <el-input-number v-model.number="dtFormMachines.throughput.value" :min="0" @change="changeThroughput" />
                    </el-form-item>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.unit')" prop="throughput.unit">
                      <el-input v-model="dtFormMachines.throughput.unit" />
                    </el-form-item>
                  </el-main>
                </el-container>
              </el-container>

            </el-col>
            <el-col :span="11" style="margin-left:10px;">
              <el-form-item :label="$t('area.label')" :label-width="labelWidthMachine" :label-position="labelPosition">
                <el-input v-model="dtFormMachines.label" />
              </el-form-item>
              <el-form-item :label="$t('area.group')" :label-width="labelWidthMachine" :label-position="labelPosition">
                <el-input v-model="dtFormMachines.group" />
              </el-form-item>
              <el-form-item :label="$t('area.shiftID')" :label-width="labelWidthMachine" :label-position="labelPosition">
                <el-input v-model="dtFormMachines.shiftID" />
              </el-form-item>
              <el-container>
                <div style="background-color: #B3C0D1;color: #333;text-align: center;line-height: 30px !important;border-radius: 3px;padding: 0 20px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">{{ $t('area.consumptions') }}</div>
              </el-container>
              <el-container>
                <el-container>
                  <el-main>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.nature')" prop="consumptions.nature">
                      <el-input v-model="dtFormMachines.consumptions.nature" />
                    </el-form-item>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.value')" prop="consumptions.value">
                      <el-input-number v-model.number="dtFormMachines.consumptions.value" :min="0" @change="changeConsumption" />
                    </el-form-item>
                    <el-form-item :label-width="labelWidthMachine_Groups" :label-position="labelPosition" :label="$t('area.unit')" prop="consumptions.unit">
                      <el-input v-model="dtFormMachines.consumptions.unit" />
                    </el-form-item>
                  </el-main>
                </el-container>
              </el-container>
            </el-col>
          </el-row>
        </el-form>
      </tab-content>

      <el-button slot="prev" type="primary">Back</el-button>
      <el-button slot="next" type="primary">Next</el-button>
      <el-button slot="finish" type="primary">Finish</el-button>
    </form-wizard>
  </div>
</template>

<script>
// Vue.use(VueFormWizard)
import areaType from './areaType.json'
import machineType from './machineType.json'
export default {
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      labelPosition: 'left',
      labelWidthMachine: '',
      labelWidthMachine_Groups: '80px',
      dtFormAreas: {
        id: 'Dock1',
        label: '',
        type: '',
        owner: '',
        terminal: ''
      },
      dtFormMachines: {
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
        user: [{
          required: true,
          message: 'Please input Activity name',
          trigger: 'blur'
        }, {
          min: 3,
          max: 5,
          message: 'Length should be 3 to 5',
          trigger: 'blur'
        }],
        region: [{
          required: true,
          message: 'Please select Activity zone',
          trigger: 'change'
        }]
      }
    }
  },
  computed: {
    typeArea() {
      return areaType
    },
    typeMachine() {
      return machineType
    }
  },
  methods: {
    onComplete: function() {
      alert('Yay. Done!')
    },
    validateAreas() {
      /* return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          resolve(valid)
        })
      }) */
      return true
    },
    validateMachines() {

    },
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
.dashboard-editor-container {
  // padding: 32px;
  background-color: rgb(240, 242, 245);
  // position: relative;
}

</style>
