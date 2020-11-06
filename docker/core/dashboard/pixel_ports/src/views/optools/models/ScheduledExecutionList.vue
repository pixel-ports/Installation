<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-row style="margin-bottom:10px;">
        <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfModels">
          {{ $t('resources.back') }}
        </el-link>
      </el-row>
      <el-input v-model="searchText" :placeholder="$t('models.searchScheduledExecution')" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('models.search') }}
      </el-button>
      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="createScheduledInstance">
        {{ $t('scheduledExecutionsList.addNewScheduleExecution') }}
      </el-button>
    </div>
    <el-row style="margin-bottom:30px;">
      <el-table
        v-loading="listLoading"
        :data="filteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('scheduledExecutionsList.noScheduledExecutionsAvailable')"
      >
        <el-table-column :label="$t('scheduledExecutionsList.name')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('scheduledExecutionsList.lastExecution')">
          <template slot-scope="{row}">
            <span>{{ convertDate(row.lastEnd) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('scheduledExecutionsList.lastStatus')" align="center">
          <template slot-scope="{row}">
            <span>{{ textMapForStatus[row.otStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('scheduledExecutionsList.actions')" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="small" class="viewBtn" @click="viewJSON(row)">
              <i class="el-icon-view">
                {{ $t('executionsList.viewResult') }}
              </i>
            </el-button>
            <span style="padding-left:20px" />
            <el-button size="small" :disabled="row.otStatus=='deleted'" class="editBtn" @click="editScheduledInstance(refId, row)">
              <i class="el-icon-edit">
                {{ $t('models.editModel') }}
              </i>
            </el-button>
            <!--<router-link v-if="row.status=='success'" :to="{name:'Edit Model Scheduled Execution', params: {modelId: refId, scheduledExecutionId: row.id}}">
            <el-tooltip class="item" effect="dark" :content="$t('scheduledExecutionsList.editScheduledExecution')" placement="top-start">
              <i class="el-icon-edit" />
            </el-tooltip>
          </router-link>-->
            <!--<router-link v-if="row.status=='success' && $route.name.includes('Model')" :to="{name:'ViewScheduledExecution', params: {modelId: refId, executionId: row.id}}">
            <el-tooltip class="item" effect="dark" :content="$t('scheduledExecutionsList.viewScheduledExecution')" placement="top-start">
              <i class="el-icon-view" />
            </el-tooltip>
          </router-link>-->
            <span style="padding-left:20px" />
            <el-button v-if="row.otStatus != 'stopped'" size="small" :disabled="row.otStatus=='deleted'" class="scheduleBtn" @click="updateStatus_ScheduledInstance(row.id, 'stopped')">
              <!-- @click="deleteScheduledExecution(row.id)" -->
              <!--:disabled="row.otStatus=='running'"-->
              <i class="el-icon-video-pause">
                {{ $t('models.stopModel') }}
              </i>
            </el-button>
            <el-button v-else size="small" :disabled="row.otStatus=='deleted'" class="scheduleBtn" @click="updateStatus_ScheduledInstance(row.id, 'running')">
              <!-- @click="deleteScheduledExecution(row.id)" -->
              <!--:disabled="row.otStatus=='running'"-->
              <i class="el-icon-video-play">
                {{ $t('models.playModel') }}
              </i>
            </el-button>
            <span style="padding-left:20px" />
            <el-button size="small" :disabled="row.otStatus=='deleted'" class="deleteBtn" @click="updateStatus_ScheduledInstance(row.id, 'deleted')">
              <!-- @click="deleteScheduledExecution(row.id)" -->
              <!--:disabled="row.otStatus=='running'"-->
              <i class="el-icon-delete-solid">
                {{ $t('models.deleteModel') }}
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getScheduledExecutionList" />

    <el-dialog :visible.sync="viewResultDialog" :title="$t('scheduledExecutionsList.viewExecution')">
      <el-card class="box-card">
        <json-editor ref="jsonEditor" v-model="result" />
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="viewResultDialog = false">
          {{ $t('common.close') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="scheduledExecutionTitle" :visible.sync="scheduledExecutionDialog" width="80%" hide-overlay transition="dialog-bottom-transition" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-row align="center">
          <el-col :span="12">
            <el-form-item :label-width="labelFirstColumn" :label="$t('models.name')" prop="name">
              <el-input ref="name" v-model="dataForm.name" style="width:95%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="labelSecondColumn" :label="$t('models.idRef')">
              <el-input v-model="dataForm.idRef" :disabled="true" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label-width="labelFirstColumn" :label="$t('models.description')" prop="description">
              <el-input v-model="dataForm.description" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="dataForm.input.length > 0">
          <el-collapse v-model="activeInput" @change="handleChangeInput">
            <el-collapse-item name="1">
              <template slot="title">
                <h3>{{ $t('executionsList.input') }}</h3>
              </template>
              <div v-for="(item,indexInput) in dataForm.input" :key="indexInput">
                <el-collapse v-model="activeInputSection" accordion @change="handleChangeInputSection">
                  <el-collapse-item :title="item.name" :name="item.name">
                    <div v-for="(option,index) in item.options" :key="index">
                      <div v-if="option.name === 'start' || option.name === 'end'">
                        <el-form-item
                          :label-width="labelFirstColumn"
                          :label="option.name"
                          :prop="'input.' + indexInput + '.options.' + index + '.value'"
                          :rules="{ required: true, message: option.name + requiredText, trigger: 'change' }"
                        >
                          <el-select v-model="dataForm.input[indexInput].options[index].value" :placeholder="$t('scheduledExecutionsList.selectValue')" style="width:95%">
                            <el-option
                              v-for="register in Dates"
                              :key="register.value"
                              :label="register.label"
                              :value="register.value"
                            />
                          </el-select>
                        </el-form-item>
                      </div>
                      <div v-else>
                        <el-form-item
                          v-if="option.required"
                          :label-width="labelFirstColumn"
                          :label="option.name"
                          :prop="'input.' + indexInput + '.options.' + index + '.value'"
                          :rules="{ required: true, message: option.name + requiredText, trigger: 'blur' }"
                        >
                          <el-input v-model="dataForm.input[indexInput].options[index].value" style="width:95%" />
                        </el-form-item>
                        <el-form-item v-else :label-width="labelFirstColumn" :label="option.name">
                          <el-input v-model="dataForm.input[indexInput].options[index].value" style="width:95%" />
                        </el-form-item>
                      </div>

                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-if="dataForm.output.length > 0">
          <el-collapse v-model="activeOutput" @change="handleChangeOutput">
            <el-collapse-item name="1">
              <template slot="title">
                <h3>{{ $t('executionsList.output') }}</h3>
              </template>
              <div v-for="(item,indexOutput) in dataForm.output" :key="indexOutput">
                <el-collapse v-model="activeOutputSection" accordion @change="handleChangeOutputSection">
                  <el-collapse-item :title="item.name" :name="item.name">
                    <div v-for="(option,index) in item.options" :key="index">
                      <el-form-item
                        v-if="option.required"
                        :label-width="labelFirstColumn"
                        :label="option.name"
                        :prop="'output.' + indexOutput + '.options.' + index + '.value'"
                        :rules="{ required: true, message: option.name + requiredText, trigger: 'blur' }"
                      >
                        <el-input v-model="dataForm.output[indexOutput].options[index].value" style="width:95%" />
                      </el-form-item>
                      <el-form-item v-else :label-width="labelFirstColumn" :label="option.name">
                        <el-input v-model="dataForm.output[indexOutput].options[index].value" style="width:95%" />
                      </el-form-item>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-if="dataForm.logging.length > 0">
          <el-collapse v-model="activeLogging" @change="handleChangeLogging">
            <el-collapse-item name="1">
              <template slot="title">
                <h3>{{ $t('executionsList.logging') }}</h3>
              </template>
              <div v-for="(item,indexLogging) in dataForm.logging" :key="indexLogging">
                <el-collapse v-model="activeLoggingSection" accordion @change="handleChangeLoggingSection">
                  <el-collapse-item :title="item.name" :name="item.name">
                    <div v-for="(option,index) in item.options" :key="index">
                      <el-form-item
                        v-if="option.required"
                        :label-width="labelFirstColumn"
                        :label="option.name"
                        :prop="'logging.' + indexLogging + '.options.' + index + '.value'"
                        :rules="{ required: true, message: option.name + requiredText, trigger: 'blur' }"
                      >
                        <el-input v-model="dataForm.logging[indexLogging].options[index].value" style="width:95%" />
                      </el-form-item>
                      <el-form-item v-else :label-width="labelFirstColumn" :label="option.name">
                        <el-input v-model="dataForm.logging[indexLogging].options[index].value" style="width:95%" />
                      </el-form-item>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <h3>{{ $t('scheduledExecutionsList.scheduledInfo') }}</h3>
        <el-row align="center">
          <el-col :span="12" align-self="start">
            <el-form-item :label-width="labelFirstColumn" :label="$t('scheduledExecutionsList.startDate')" class="drag-select" required>
              <!--prop="date"-->
              <el-date-picker
                v-model="date"
                style="width:95%"
                type="date"
                :placeholder="$t('scheduledExecutionsList.chooseDate')"
              />
              <div v-if="viewDateRequired" style="color:red;width=100%">
                {{ $t('scheduledExecutionsList.startDateRequired') }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="labelSecondColumn" :label="$t('scheduledExecutionsList.startTime')" class="drag-select" required>
              <!--prop="time"-->
              <el-time-picker
                v-model="time"
                style="width:95%"
                :placeholder="$t('scheduledExecutionsList.chooseTime')"
              />
              <div v-if="viewTimeRequired" style="color:red;width=100%">
                {{ $t('scheduledExecutionsList.startTimeRequired') }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="12">
            <el-form-item :label-width="labelFirstColumn" :label="$t('scheduledExecutionsList.unit')" class="drag-select" prop="scheduleInfo.unit">
              <el-select v-model="dataForm.scheduleInfo.unit" :placeholder="$t('scheduledExecutionsList.selectUnit')" style="width:95%">
                <el-option
                  v-for="item in timeUnits"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label-width="labelSecondColumn" :label="$t('scheduledExecutionsList.value')" prop="scheduleInfo.value">
              <el-input-number v-model.number="dataForm.scheduleInfo.value" :min="0" style="width:95%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="closeDialog()">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="success" @click="scheduledExecutionTitle===$t('scheduledExecutionsList.createScheduledExecution')?createData('dataForm'):updateData()">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <div class="filter-container" style="margin-top:10px;">
      <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfModels">{{ $t('resources.back') }}</el-link>
    </div>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import { updateStatusScheduledInstance, addScheduledInstance, getScheduledInstancesByIdRef, removeScheduledInstance, getModel, getPAlgorithm, getScheduledInstance, updateScheduledInstance, updateModel } from '@/api/otools' // eslint-disable-line no-unused-vars
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on
import pixelConstants from '@/utils/constants' // import class for constants

export default {
  name: 'ScheduledExecutionList',
  components: { JsonEditor, Pagination },
  directives: { waves },
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      },
      viewDateRequired: false,
      viewTimeRequired: false,
      requiredText: '',
      Dates: pixelConstants.Dates,
      activeInput: ['0'], // id del elemento activo. 0 para colapsado
      activeOutput: ['0'],
      activeLogging: ['0'],
      activeInputSection: ['0'],
      activeOutputSection: ['0'],
      activeLoggingSection: ['0'],
      result: null,
      searchText: '',
      modelRef: {},
      initialDataForm: {},
      executionsList: [],
      date: null,
      time: null,
      timeUnits: pixelConstants.timeUnits,
      ref: {
        inputDatasources: []
      },
      resetData: {
        idRef: '',
        name: '',
        description: '',
        mode: '',
        user: '',
        input: [],
        forceinput: [],
        output: [],
        logging: [],
        creation: null,
        start: null,
        active: false,
        // otStatus: null,
        dockerId: '',
        scheduleInfo: {},
        lastEnd: 0 // ,
        // date: null,
        // time: null
      },
      dataForm: {
        idRef: '',
        name: '',
        description: '',
        mode: '',
        user: '',
        input: [],
        forceinput: [],
        output: [],
        logging: [],
        creation: null,
        start: null,
        active: false,
        // otStatus: null,
        dockerId: '',
        scheduleInfo: {},
        lastEnd: 0// ,
        // date: null,
        // time: null
      },
      listQuery: {
        page: 1,
        limit: 5,
        refId: undefined,
        id: undefined
      },
      labelFirstColumn: '115px',
      labelSecondColumn: '100px',
      scheduledExecutionTitle: '',
      viewResultDialog: false,
      scheduledExecutionsList: [],
      scheduledExecutionDialog: false,
      executionResult: null,
      listLoading: true,
      total: 0,
      textMapForStatus: {
        deleted: this.$t('models.deleted'),
        running: this.$t('models.running'),
        error: this.$t('models.error'),
        success: this.$t('models.success'),
        created: this.$t('models.created'),
        stopped: this.$t('models.stopped')
      },
      rules: {
        name: [{ required: true, message: this.$t('models.errNameRequired'), trigger: 'blur' }],
        description: [{ required: true, message: this.$t('models.errDescriptionRequired'), trigger: 'blur' }],
        'scheduleInfo.unit': [{ required: true, message: this.$t('scheduledExecutionsList.errUnitRequired'), trigger: 'change' }],
        'scheduleInfo.value': [{ required: true, message: this.$t('scheduledExecutionsList.errValueRequired'), trigger: 'blur' }],
        time: [{ required: true, message: this.$t('scheduledExecutionsList.errTimeRequired'), trigger: 'change' }],
        date: [{ required: true, message: this.$t('scheduledExecutionsList.errDateRequired'), trigger: 'change' }]
      }
    }
  },
  computed: {
    refId() {
      var id = this.$route.params.id
      this.obtainRow(id)
      return id
    },
    type() {
      if (this.$route.name.includes('Model')) return 'model'
      else if (this.$route.name.includes('Predictive Algorithm')) return 'pa'
      else return 'undefined'
    },
    filteredBySearchText() {
      return this.scheduledExecutionsList.filter(scheduledExecution => scheduledExecution.name.toLowerCase().includes(this.searchText.toLowerCase()))
      // || model.dockerInfo.label.toLowerCase().includes(this.searchText.toLowerCase())
    },
    filteredBySearchTextLength() {
      return this.filteredBySearchText.length
    },
    filteredByPagination() {
      const page = this.listQuery.page
      const limit = this.listQuery.limit

      if (Math.ceil(this.filteredBySearchTextLength / limit) >= page) {
        return this.filteredBySearchText.slice((page - 1) * limit, page * limit)
      } else {
        return this.filteredBySearchText.slice(0, limit)
      }
    }
  },
  watch: {
    lang() {
      this.commonTranslation()
    }
  },
  created() {
    this.getScheduledExecutionList()
    this.commonTranslation()
  },
  methods: {
    updateStatus_ScheduledInstance(id, status) {
      this.listQuery.id = id
      console.log(status)
      updateStatusScheduledInstance(this.listQuery, status).then(response => {
        this.$notify({
          title: this.$t('common.success'),
          message: this.$t('common.updateSuccessfull'),
          type: 'success',
          duration: 2000
        })
        this.getScheduledExecutionList()
      }).catch(error => {
        this.$notify({
          title: this.$t('common.error'),
          message: error.response.data,
          type: 'success',
          duration: 2000
        })
      })
    },
    commonTranslation() {
      this.requiredText = this.$t('common.requiredText')
    },
    closeDialog() {
      this.dataForm = this.resetData
      this.buildDataForm()
      this.initializeCollapseObject()
      this.scheduledExecutionDialog = false
      this.viewDateRequired = false
      this.viewTimeRequired = false
    },
    gotoListOfModels() {
      this.$router.push({ name: 'models' })
      // this.$router.push({ name: 'generic dashboard', params: { id: row._id }})
    },
    handleChangeLogging(val) {
      console.log(val)
    },
    handleChangeOutput(val) {
      console.log(val)
    },
    handleChangeInput(val) {
      console.log(val)
    },
    handleChangeInputSection(val) {
      console.log(val)
    },
    handleChangeOutputSection(val) {
      console.log(val)
    },
    handleChangeLoggingSection(val) {
      console.log(val)
    },
    initializeCollapseObject() {
      this.activeInput = ['0']
      this.activeOutput = ['0']
      this.activeLogging = ['0']
      this.activeInputSection = ['0']
      this.activeOutputSection = ['0']
      this.activeLoggingSection = ['0']
    },
    obtainRow(id) {
      this.listQuery.id = id
      getModel(this.listQuery).then(response => {
        this.modelRef = response
        this.buildDataForm()
      })
    },
    buildDataForm() {
      console.log(' BUILDDATAFORM')
      console.log(this.modelRef)
      this.initialDataForm = this.dataForm
      this.initialDataForm.idRef = this.modelRef.id
      if (this.modelRef.generalInfo.supportExecSync) {
        this.initialDataForm.mode = 'ExecSync'
      } else {
        this.initialDataForm.mode = 'ExecAsync'
      }
      this.initialDataForm.user = null
      // Start input section
      this.modelRef.generalInfo.input.forEach(input => {
        var itemInput = JSON.parse(JSON.stringify(input));
		var cat = input.supportedConnectors && input.supportedConnectors.length ? input.supportedConnectors[0] : null
		itemInput.category = cat
		itemInput.metadata = {}
		itemInput.metadata.usage = "optional, future use or extra logic for each model, no specific structure"
		itemInput.options = []


        input.options.forEach(options => {
		          var itemOption = options
                  itemOption.value = ''
          itemInput.options.push(itemOption)
        })
		
	    var connectors = this.AddElementConnectors(cat)
        connectors.forEach(conn => {
          itemInput.options.push(conn)
        })
		
		this.initialDataForm.input.push(itemInput)
      })
      // End input section
      // Start output section
      this.modelRef.generalInfo.output.forEach(output => {

			  var itemOutput = JSON.parse(JSON.stringify(output));

			  var cat = output.supportedConnectors && output.supportedConnectors.length ? output.supportedConnectors[0] : null
		
	  		itemOutput.category = cat
		itemOutput.metadata = {}
		itemOutput.metadata.usage = "optional, future use or extra logic for each model, no specific structure"
		itemOutput.options = []
	  
	  


        output.options.forEach(options => {
		          var itemOption = options
                  itemOption.value = ''
  
          itemOutput.options.push(itemOption)
        })
		
		var connectors = this.AddElementConnectors(cat)
        connectors.forEach(conn => {
          itemOutput.options.push(conn)
        })
		
		this.initialDataForm.output.push(itemOutput)
      })
      // End output section
      // Start logging section
	  	  if(!this.modelRef.generalInfo.logging){
	  this.modelRef.generalInfo.logging = []
	  }
      this.modelRef.generalInfo.logging.forEach(logging => {
	    var itemLogging = JSON.parse(JSON.stringify(logging));
	
		var cat = logging.supportedConnectors && logging.supportedConnectors.length ? logging.supportedConnectors[0] : null
		itemLogging.category = cat
		itemLogging.metadata = {}
		itemLogging.metadata.usage = "optional"
		itemLogging.options = []


        logging.options.forEach(options => {
		          var itemOption = options
                  itemOption.value = ''
          itemLogging.options.push(itemOption)
        })
		
		var connectors = this.AddElementConnectors(cat)
        connectors.forEach(conn => {
          itemLogging.options.push(conn)
        })
		
		this.initialDataForm.logging.push(itemLogging)
      })
      // End logging section
      this.initialDataForm.creation = 0
      this.initialDataForm.start = 0
      // this.initialDataForm.otStatus = ''
      this.initialDataForm.dockerId = ''
      // this.initialDataForm.date = null
      // this.initialDataForm.time = null
      this.dataForm = this.initialDataForm
      console.log('current dataform')
      console.log(this.dataForm)
    },
    AddElementConnectors(itemConnector) {
      var connectors = []
      this.modelRef.generalInfo.system.connectors.forEach(connector => {
        if (connector.type === itemConnector) {
          connector.options.forEach(option => {
		          var item = option
                  item.value = ''
            connectors.push(item)
          })
        }
      })
      return connectors
    },
    createScheduledInstance() {
      this.resetdataForm()
      this.scheduledExecutionTitle = this.$t('scheduledExecutionsList.createScheduledExecution')
      this.scheduledExecutionDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetdataForm() {
      this.dataForm = this.initialDataForm
      this.date = null
      this.time = null
    },
    handleFilter() {

    },
    viewJSON(row) {
      this.viewResultDialog = true
      this.result = row
    },
    editScheduledInstance(refId, row) {
      // 1er parametro es la referencia del modelo o p.a.
      // 2o parametro es la fila de la instancia planificada seleccionada
      // console.log(refId)
      // console.log(row.id)
      this.dataForm = Object.assign({}, row) // copy object
      this.getDateTime(this.dataForm.scheduleInfo.start)
      console.log(this.dataForm)
      this.scheduledExecutionTitle = this.$t('scheduledExecutionsList.editScheduledExecution')
      this.scheduledExecutionDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    getDateTime(timestamp) {
      const date = new Date(timestamp)
      this.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.time = new Date(date.getFullYear(), (date.getMonth() + 1), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
    },
    convertDate(inputFormat) {
      function pad(s) {
        return s < 10 ? '0' + s : s
      }
      var d = new Date(inputFormat)
      return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/') + ' ' + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':')
    },
    getScheduledExecutionList() {
      this.listQuery.refId = this.refId
      this.listLoading = true
      getScheduledInstancesByIdRef(this.listQuery).then(response => {
        this.scheduledExecutionsList = response
        console.log(response)
        this.links = this.scheduledExecutionsList
        this.total = this.scheduledExecutionsList.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    convertNumber() {
      this.dataForm.input.forEach(input => {
        input.options.forEach(option => {
          if (option.type !== 'string' && option.type !== 'headersObject' && option.value !== '') {
            option.value = parseInt(option.value)
          } else if (option.type !== 'string' && option.type !== 'headersObject' && option.value === '') {
            option.value = parseInt(0)
          }
        })
      })
    },
    deleteScheduledInfo() {
      delete this.dataForm.date
      delete this.dataForm.time
    },
    deleteRequired() {
      this.dataForm.input.forEach(input => {
        input.options.forEach(option => {
          delete option['required']
        })
      })
      this.dataForm.output.forEach(output => {
        output.options.forEach(option => {
          delete option['required']
        })
      })
      this.dataForm.logging.forEach(logging => {
        logging.options.forEach(option => {
          delete option['required']
        })
      })
    },
    checkDateTime() {
      if (this.date === '' || this.date === null) {
        this.viewDateRequired = true
      } else {
        this.viewDateRequired = false
      }
      if (this.time === '' || this.time === null) {
        this.viewTimeRequired = true
      } else {
        this.viewTimeRequired = false
      }

      if (this.viewDateRequired || this.viewTimeRequired) {
        return false
      } else {
        return true
      }
    },
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.checkDateTime() && valid) {
          console.log('Paso validación')
          console.log(this.date)
          console.log(this.time)
          // Start Date
          const date = new Date(this.date)
          var timestamp = this.time.getTime()
          const dt = new Date(timestamp)
          var timeToSave = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
          const time = timeToSave.split(':')
          const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time[0], time[1], time[2])
          this.dataForm.scheduleInfo.start = Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds())
          console.log('Dataform previo crear scheduled instance')
          console.log(this.dataForm)
          // this.convertNumber()
          this.deleteRequired()
          // this.deleteScheduledInfo()
          addScheduledInstance(this.dataForm).then(response => {
            this.scheduledExecutionDialog = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.createdSuccessfully'),
              type: 'success',
              duration: 2000
            })
            this.getScheduledExecutionList()
            this.dataForm = this.resetData
            this.buildDataForm()
            this.initializeCollapseObject()
          }).catch(error => {
            console.log('Error instancia: ' + error.response.data)
            this.$notify({
              title: this.$t('common.error'),
              message: error.response.data,
              type: 'success',
              duration: 2000
            })
          })
        } else {
          // Review the mandatory fields in the different sections!!
          this.$message({
            type: pixelConstants.WARNING_MESSAGE_TYPE,
            message: this.$t('common.reviewMandatoryFields')
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        // console.log(this.time)
        // console.log(this.date)
        if (valid) {
          const tempData = Object.assign({}, this.dataForm)
          // Start date & time
          const date = new Date(this.date)
          var timestamp = this.time.getTime()
          const dt = new Date(timestamp)
          var timeToSave = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
          const time = timeToSave.split(':')
          const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time[0], time[1], time[2])
          tempData.scheduleInfo.start = Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds())
          // this.scheduledExecution.scheduleInfo.start = Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds())
          console.log('tempData')
          console.log(tempData)
          // delete tempData.date
          // delete tempData.time
          updateScheduledInstance(tempData).then(response => {
            this.scheduledExecutionDialog = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.updateSuccessfull'),
              type: 'success',
              duration: 2000
            })
            this.getScheduledExecutionList()
            this.initializeCollapseObject()
            /* updateModel(tempData.idRef).then(response => {
            }).catch(error => {
              console.log('Error update Model:' + error)
            }) */
          }).catch(error => {
            this.$notify({
              title: this.$t('common.error'),
              message: error.response.data,
              type: 'success',
              duration: 2000
            })
          })
        } else {
          // Review the mandatory fields in the different sections!!
          this.$message({
            type: pixelConstants.WARNING_MESSAGE_TYPE,
            message: this.$t('common.reviewMandatoryFields')
          })
        }
      })
    },
    deleteScheduledExecution(idExecution) {
      this.listQuery.id = idExecution
      this.$confirm(this.$t('common.removeExecutionModel'), this.$t('common.warning'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      }).then(async() => {
        await removeScheduledInstance(this.listQuery)
        this.getScheduledExecutionList()
        this.$message({
          type: pixelConstants.SUCCESS_MESSAGE_TYPE,
          message: this.$t('common.deleteSucced')
        })
      }).catch(err => { console.error(err) })
    }
  }
}
</script>

<style lang="scss" scoped>
  .editBtn {
    background-color: #e8f4ff;
    border-color: #d1e9ff;
    color: #1890ff;
  }
  .deleteBtn {
    color: #fff;
    background-color: #ff4949;
    border-color: #ff4949;
  }
  .viewBtn {
    color: #fff;
    background-color: #9da408;
    border-color: #9da408;
  }
  .scheduleBtn {
    color: #fff;
    background-color: #909399;
    border-color: #909399;
  }
</style>
