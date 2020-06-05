<template>
  <div class="app-container">
    <el-form ref="scheduledExecution" :rules="rules" :model="scheduledExecution" label-position="left" label-width="70px" style="margin-left:50px;">
      <el-row align="center">
        <h3>{{ $t('scheduledExecutionsList.frequency') }}</h3>
        <el-col :span="6" align-self="start">
          <el-form-item label-width="60px" :label="$t('scheduledExecutionsList.date')" class="drag-select" prop="date">
            <el-date-picker
              v-model="date"
              style="width:60%"
              type="date"
              :placeholder="$t('scheduledExecutionsList.chooseDate')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="60px" :label="$t('scheduledExecutionsList.time')" class="drag-select" prop="time">
            <el-time-picker
              v-model="time"
              style="width:60%"
              :placeholder="$t('scheduledExecutionsList.chooseTime')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="60px" :label="$t('scheduledExecutionsList.unit')" class="drag-select" prop="scheduleInfo.unit">
            <el-select v-model="scheduledExecution.scheduleInfo.unit" :placeholder="$t('scheduledExecutionsList.selectUnit')" style="width:60%">
              <el-option
                v-for="item in timeUnits"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="60px" :label="$t('scheduledExecutionsList.value')" prop="scheduleInfo.value">
            <el-input-number v-model.number="scheduledExecution.scheduleInfo.value" :min="0" style="width:60%" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- Menu Buttons -->
    <div slot="footer" class="dialog-footer">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-back" @click="$router.go(-1)">
        {{ $t('scheduledExecutionsList.back') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" @click="Save('scheduledExecution')">
        {{ $t('scheduledExecutionsList.save') }}
      </el-button>
    </div>
  </div>
</template>

<script>

import { getModel, getPAlgorithm, getScheduledInstance, updateScheduledInstance, updateModel } from '@/api/otools'
import waves from '@/directive/waves' // waves directive
// import pixelCommon from '@/utils/common'
import pixelConstants from '@/utils/constants' // import class for constants

export default {
  name: 'EditScheduledExecution',
  directives: { waves },
  data() {
    return {
      executionsList: null,
      date: null,
      time: null,
      timeUnits: pixelConstants.timeUnits,
      ref: {
        inputDatasources: []
      },
      scheduledExecution: {
        scheduleInfo: {}
      },
      listQuery: {
        id: undefined
      },
      rules: {
        name: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        'scheduleInfo.unit': [{ required: true, message: this.$t('scheduledExecutionsList.errUnitRequired'), trigger: 'change' }],
        'scheduleInfo.value': [{ required: true, message: this.$t('scheduledExecutionsList.errValueRequired'), trigger: 'blur' }],
        time: [{ required: true, message: this.$t('scheduledExecutionsList.errTimeRequired'), trigger: 'blur' }],
        date: [{ required: true, message: this.$t('scheduledExecutionsList.errDateRequired'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    refId() {
      if (this.$route.name.includes('Model')) return this.$route.params.modelId
      else return this.$route.params.paId
    }
  },
  created() {
    this.getRef(this.refId)
    this.getScheduledExecutionList(this.$route.params.scheduledExecutionId)
  },
  methods: {
    getDateTime(timestamp) {
      const date = new Date(timestamp)
      this.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.time = new Date(date.getFullYear(), (date.getMonth() + 1), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
      // this.time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    getRef(id) {
      this.listQuery.id = id
      var self = this
      if (this.$route.name.includes('Model')) {
        getModel(this.listQuery).then(response => {
          self.ref = response
        })
      } else {
        getPAlgorithm(this.listQuery).then(response => {
          self.ref = response
        })
      }
    },
    getScheduledExecutionList(id) {
      this.listQuery.id = id
      var self = this
      getScheduledInstance(this.listQuery).then(response => {
        self.scheduledExecution = response
        self.getDateTime(self.scheduledExecution.scheduleInfo.start)
      })
    },
    Save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const date = new Date(this.date)
          var timestamp = this.time.getTime()
          const dt = new Date(timestamp)
          var timeToSave = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
          const time = timeToSave.split(':')
          const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time[0], time[1], time[2])
          this.scheduledExecution.scheduleInfo.start = Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds())
          var self = this
          updateScheduledInstance(self.scheduledExecution).then(response => {
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.updateSuccessfull'),
              type: 'success',
              duration: 2000
            })
            updateModel(self.ref).then(response => {
              // Update entidad model
            }).catch(error => {
              console.log('Error update Model:' + error)
            })
          }).catch(error => {
            this.$notify({
              title: this.$t('common.error'),
              message: error.response.data,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog {
    width:75% !important;
  }
</style>
