<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfResources">{{ $t('common.back') }}</el-link>
    </div>
    <!-- TABLE FOR AREAS -->
    <div style="font-size: 35px;height:45px;color: #333;text-align: left;line-height: 45px !important;border-radius: 3px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">
      <span class="subTitle">{{ $t('resources.area') }}</span>
      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="addArea">
        {{ $t('resources.addArea') }}
      </el-button>
    </div>
    <el-row style="background:#fff;margin-bottom:3px;">
      <el-table
        v-loading="listLoading"
        :data="areaFilteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('resources.emptyTable')"
      >
        <el-table-column :label="$t('resources.id')" align="center" :sortable="true" sort-by="idArea">
          <template slot-scope="{row}">
            <span>{{ row.idArea }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.label')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.type')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.owner')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.owner }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.terminal')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.terminal }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.actions')" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="small" class="editBtn" @click="editArea(row)">
              <i class="el-icon-edit">
                {{ $t('common.btnEdit') }}
              </i>
            </el-button>
            <span style="padding-left:10px" />
            <el-button size="small" class="deleteBtn" @click="deleteArea(row)">
              <i class="el-icon-delete-solid">
                {{ $t('common.btnDelete') }}
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination v-show="areaFilteredBySearchTextLength>0" style="margin-bottom:20px;" :total="areaFilteredBySearchTextLength" :page.sync="listQueryArea.page" :limit.sync="listQueryArea.limit" @pagination="getListAreaByResource" />
    <!-- TABLE FOR MACHINES -->
    <div style="font-size: 35px;height:45px;color: #333;text-align: left;line-height: 45px !important;border-radius: 3px;-webkit-box-sizing: border-box;box-sizing: border-box;-ms-flex-negative: 0;flex-shrink: 0;display: block;width:100%">
      <span class="subTitle">{{ $t('resources.machine') }}</span>
      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="addMachine">
        {{ $t('resources.addMachine') }}
      </el-button>
    </div>
    <el-row style="background:#fff;margin-bottom:3px;">
      <el-table
        v-loading="listLoading"
        :data="machineFilteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('resources.emptyTable')"
      >
        <el-table-column :label="$t('resources.id')" align="center" :sortable="true" sort-by="id">
          <template slot-scope="{row}">
            <span>{{ row.idMachine }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.type')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.owner')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.owner }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.group')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.group }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.actions')" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="small" class="editBtn" @click="editMachine(row)">
              <i class="el-icon-edit">
                {{ $t('common.btnEdit') }}
              </i>
            </el-button>
            <span style="padding-left:10px" />
            <el-button size="small" class="deleteBtn" @click="deleteMachine(row)">
              <i class="el-icon-delete-solid">
                {{ $t('common.btnDelete') }}
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination v-show="machineFilteredBySearchTextLength>0" :total="machineFilteredBySearchTextLength" :page.sync="listQueryMachine.page" :limit.sync="listQueryMachine.limit" @pagination="getListMachineByResource" />
    <!-- DIALOG FOR EDIT / UPDATE AREA -->
    <el-dialog :title="dialogTitleArea" :visible.sync="dialogFormAreaVisible" width="60%" hide-overlay transition="dialog-bottom-transition" :before-close="handleClose">
      <el-form ref="dataFormArea" :rules="rulesArea" :model="dataFormArea" :label-position="labelPosition" label-width="100px">
        <el-row align="center">
          <el-form-item :label="$t('area.id')" :label-position="labelPosition" prop="idArea">
            <el-input v-if="dialogTitleArea===$t('resources.createArea')" v-model="dataFormArea.idArea" />
            <el-input v-else v-model="dataFormArea.idArea" :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('area.areaType')" :label-position="labelPosition">
            <el-select v-model="dataFormArea.type" class="filter-item" :placeholder="$t('area.selectType')" style="width:100%">
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
            <el-input v-model="dataFormArea.terminal" />
          </el-form-item>
          <!--</el-col>-->
          <!--<el-col :span="11" style="margin-left:10px;">-->
          <el-form-item :label="$t('area.label')" :label-position="labelPosition">
            <!--prop="label"-->
            <el-input v-model="dataFormArea.label" />
          </el-form-item>
          <el-form-item :label="$t('area.owner')" :label-position="labelPosition">
            <!--prop="owner"-->
            <el-input v-model="dataFormArea.owner" />
          </el-form-item>
          <!--</el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormAreaVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="success" @click="dialogTitleArea===$t('resources.createArea')?preValidateNameArea('dataFormArea'):updateArea()">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- DIALOG FOR EDIT / UPDATE MACHINE -->
    <el-dialog :title="dialogTitleMachine" :visible.sync="dialogFormMachineVisible" width="60%" hide-overlay transition="dialog-bottom-transition" :before-close="handleCloseMachine">
      <el-form ref="dataFormMachine" :rules="rulesMachine" :model="dataFormMachine" :label-position="labelPosition" label-width="100px">
        <el-container>
          <el-header height="100px">
            <el-steps :active="active" finish-status="success" :align-center="true" style="margin-top: 20px">
              <el-step :title="$t('area.general')" />
              <el-step :title="$t('area.throughput')" />
              <el-step :title="$t('area.consumptions')" />
            </el-steps>
          </el-header>

          <el-main>
            <el-row v-if="active == 0">
              <el-col :span="24">
                <el-form-item :label="$t('area.id')" :label-width="labelWidthMachine" :label-position="labelPosition" prop="idMachine">
                  <el-input v-if="dialogTitleMachine===$t('resources.createMachine')" v-model="dataFormMachine.idMachine" />
                  <el-input v-else v-model="dataFormMachine.idMachine" :disabled="true" />
                  <!--<el-input v-model="dataFormMachine.idMachine" />-->
                </el-form-item>
                <el-form-item :label="$t('area.label')" :label-width="labelWidthMachine" :label-position="labelPosition">
                  <el-input v-model="dataFormMachine.label" />
                </el-form-item>
                <el-form-item :label="$t('area.type')" :label-width="labelWidthMachine" :label-position="labelPosition" prop="type">
                  <el-select v-model="dataFormMachine.type" class="filter-item" :placeholder="$t('models.selectType')" style="width:100%">
                    <el-option
                      v-for="item in typeMachine"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      multiple
                    />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('area.group')" :label-width="labelWidthMachine" :label-position="labelPosition">
                  <el-input v-model="dataFormMachine.group" />
                </el-form-item>
                <el-form-item :label="$t('area.owner')" :label-width="labelWidthMachine" :label-position="labelPosition">
                  <el-input v-model="dataFormMachine.owner" />
                </el-form-item>
                <el-form-item :label="$t('area.shiftID')" :label-width="labelWidthMachine" :label-position="labelPosition">
                  <!--<el-input v-model="dataFormMachine.shiftID" />-->
                  <el-select v-model="dataFormMachine.shiftID" clearable class="filter-item" :placeholder="$t('models.selectType')" style="width:100%">
                    <el-option
                      v-for="item in shiftWorkList"
                      :key="item.idShiftWork"
                      :label="item.idShiftWork"
                      :value="item.idShiftWork"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="active == 1">
              <el-form-item :label-width="labelWidthMachine" :label-position="labelPosition" :label="$t('area.value')" prop="throughput.value">
                <el-input-number v-model.number="dataFormMachine.throughput.value" :min="0" @change="changeThroughput" />
              </el-form-item>
              <el-form-item :label-width="labelWidthMachine" :label-position="labelPosition" :label="$t('area.unit')" prop="throughput.unit">
                <!-- <el-input v-model="dataFormMachine.throughput.unit" /> -->
                <el-select v-model="dataFormMachine.throughput.unit" class="filter-item" :placeholder="$t('models.selectUnit')" filterable allow-create style="width:100%">
                  <el-option
                    v-for="item in typeThrouhgput"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-row>

            <el-row v-if="active == 2">
              <el-row style="background:#fff;margin-bottom:30px;margin-top:10px;">
                <el-form
                  ref="refDataFormMachineConsumption"
                  :rules="rulesMachineConsumption"
                  :model="dataFormMachineConsumption"
                  :label-position="labelPosition"
                  label-width="100px"
                >
                  <el-form-item
                    :label-width="labelWidthMachine_Groups"
                    :label-position="labelPosition"
                    :label="$t('area.nature')"
                    prop="nature"
                  >
                    <el-input v-model="dataFormMachineConsumption.nature" />
                  </el-form-item>
                  <el-form-item
                    :label-width="labelWidthMachine_Groups"
                    :label-position="labelPosition"
                    :label="$t('area.value')"
                    prop="value"
                  >
                    <el-input-number v-model.number="dataFormMachineConsumption.value" :min="0" @change="changeConsumption" />
                  </el-form-item>
                  <el-form-item
                    :label-width="labelWidthMachine_Groups"
                    :label-position="labelPosition"
                    :label="$t('area.unit')"
                    prop="unit"
                  >
                    <!-- <el-input v-model="dataFormMachineConsumption.unit" /> -->
                    <el-select v-model="dataFormMachineConsumption.unit" class="filter-item" :placeholder="$t('models.selectUnit')" filterable allow-create style="width:100%">
                      <el-option
                        v-for="item in typeConsumption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-button type="danger" @click="cancelMachineConsumption">
                  {{ $t('common.cancel') }}
                </el-button>
                <el-button v-if="!editConsumption" class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="addConsumption">
                  {{ $t('resources.addConsumption') }}
                </el-button>
                <el-button v-if="editConsumption" class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="updateConsumption">
                  {{ $t('resources.update') }}
                </el-button>
              </el-row>
              <el-row style="background:#fff;margin-bottom:30px;margin-top:10px;">
                <el-table
                  v-loading="listLoading"
                  :data="listConsumption"
                  border
                  fit
                  style="width: 100%;"
                  :empty-text="$t('resources.emptyTable')"
                >
                  <el-table-column :label="$t('area.nature')" align="center" :sortable="true" sort-by="nature">
                    <template slot-scope="{row}">
                      <span>{{ row.nature }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('area.value')" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.value }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('area.unit')" align="center">
                    <template slot-scope="{row}">
                      <span>{{ row.unit }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('resources.actions')" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="{row}">
                      <el-button size="small" class="editBtn" @click="editMachineConsumption(row.$index, row)">
                        <i class="el-icon-edit">
                          {{ $t('common.btnEdit') }}
                        </i>
                      </el-button>
                      <span style="padding-left:10px" />
                      <el-button size="small" class="deleteBtn" @click="deleteMachineConsumption(row)">
                        <i class="el-icon-delete-solid">
                          {{ $t('common.btnDelete') }}
                        </i>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row>
                {{ $t('common.messageValidation') }}
              </el-row>
            </el-row>

          </el-main>
        </el-container>
      </el-form>
      <el-row>
        <el-button style="float:left;" :disabled="active < 1" @click="active--">
          {{ $t('widget.buttonPrevius') }}
        </el-button>
        <el-button v-if="active<2" style="float:right;" type="primary" @click="validateStep();"><!--active++-->
          {{ $t('widget.buttonNext') }}
        </el-button>
        <el-button v-else type="success" style="float:right;" @click="dialogTitleMachine===$t('resources.createMachine')?preValidateNameMachine('dataFormMachine'):updateMachine()">
          {{ $t('common.confirm') }}
        </el-button>
      </el-row>
    </el-dialog>
    <div class="filter-container" style="margin-top:20px;">
      <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfResources">{{ $t('common.back') }}</el-link>
    </div>
  </div>
</template>

<script>
import { areaFetchList, areaFilterByResource, areaCreate, areaDelete, areaUpdate } from '@/api/area'
import { machineFetchList, machineFilterByResource, machineCreate, machineDelete, machineUpdate } from '@/api/machine'
import { resourceGet, resourceUpdate } from '@/api/resource'
import { shiftWorkFetchList } from '@/api/shiftWork'
import { stepFetchList } from '@/api/step'
import { compatibilityFetchList } from '@/api/compatibility'
import Pagination from '@/components/Pagination' // secondary package based on
// areaCreate, areaDelete
import pixelConstants from '@/utils/constants' // import class for constants
import waves from '@/directive/waves' // waves directive
import areaType from './files/areaType.json'
import machineType from './files/machineType.json'
import throughputUnitType from './files/throughputUnitType.json'
import consumptionUnitType from './files/consumptionUnitType.json'
export default {
  name: 'ResourcesList',
  components: { Pagination },
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
      active: 0,
      editConsumption: false,
      indexConsumption: 0,
      labelPosition: 'left',
      dialogFormAreaVisible: false,
      dialogFormMachineVisible: false,
      dialogTitleArea: '',
      dialogTitleMachine: '',
      labelColumn: '110px',
      labelWidthMachine: '',
      labelWidthMachine_Groups: '80px',
      dataFormArea: {
        idArea: '',
        idResource: null,
        label: '',
        type: '',
        owner: '',
        terminal: ''
      },
      dataFormMachine: {
        id: '',
        idResource: null,
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
      dataFormMachineConsumption: {
        nature: '',
        value: '',
        unit: ''
      },
      listQueryArea: {
        page: 1,
        limit: 5,
        text: undefined,
        type: undefined,
        idResource: undefined
      },
      listQueryMachine: {
        page: 1,
        limit: 5,
        text: undefined,
        type: undefined,
        idResource: undefined
      },
      listQueryCompatibility: {
        text: undefined,
        type: undefined
      },
      listLoading: true,
      listArea: [],
      listMachine: [],
      shiftWorkList: [],
      listConsumption: null,
      links: [], // need for autocomplete
      nameFiltered: '',
      totalArea: 0,
      totalMachine: 0,
      totalConsumption: 0,
      rulesArea: {
        'idArea': [{ required: true, message: this.$t('resources.errIDRequired'), trigger: 'blur' }]
      },
      rulesMachine: {
        'idMachine': [{ required: true, message: this.$t('resources.errIDRequired'), trigger: 'blur' }],
        'type': [{ required: true, message: this.$t('models.errTypeRequired'), trigger: 'blur' }],
        'throughput.value': [{ required: true, message: this.$t('models.errValueRequired'), trigger: 'change' }],
        'throughput.unit': [{ required: true, message: this.$t('scheduledExecutionsList.errUnitRequired'), trigger: 'blur' }]
      },
      rulesMachineConsumption: {
        'nature': [{ required: true, message: this.$t('resources.errNatureRequired'), trigger: 'blur' }],
        'value': [{ required: true, message: this.$t('models.errValueRequired'), trigger: 'change' }],
        'unit': [{ required: true, message: this.$t('scheduledExecutionsList.errUnitRequired'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    idResource() {
      console.log(this.$route.params.id)
      return this.$route.params.id
    },
    typeArea() {
      return areaType
    },
    typeMachine() {
      return machineType
    },
    typeThrouhgput() {
      return throughputUnitType
    },
    typeConsumption() {
      return consumptionUnitType
    },
    areaFilteredBySearchText() {
      return this.listArea
    },
    areaFilteredBySearchTextLength() {
      // console.log('Length area')
      // console.log(this.areaFilteredBySearchText.length)
      return this.areaFilteredBySearchText.length
    },
    areaFilteredByPagination() {
      const page = this.listQueryArea.page
      const limit = this.listQueryArea.limit

      if (Math.ceil(this.areaFilteredBySearchTextLength / limit) >= page) {
        return this.areaFilteredBySearchText.slice((page - 1) * limit, page * limit)
      } else {
        return this.areaFilteredBySearchText.slice(0, limit)
      }
    },
    machineFilteredBySearchText() {
      return this.listMachine
    },
    machineFilteredBySearchTextLength() {
      return this.machineFilteredBySearchText.length
    },
    machineFilteredByPagination() {
      const page = this.listQueryMachine.page
      const limit = this.listQueryMachine.limit

      if (Math.ceil(this.machineFilteredBySearchTextLength / limit) >= page) {
        return this.machineFilteredBySearchText.slice((page - 1) * limit, page * limit)
      } else {
        return this.machineFilteredBySearchText.slice(0, limit)
      }
    }
  },
  created() {
    // this.getListArea()
    // this.getListMachine()
    this.getListAreaByResource()
    this.getListMachineByResource()
    this.recoverShiftWork()
    // console.log(this.active)
  },
  methods: {
    gotoListOfResources() {
      this.$router.push({ name: 'Resources' })
      // this.$router.push({ name: 'generic dashboard', params: { id: row._id }})
    },
    recoverShiftWork() {
      shiftWorkFetchList(this.listQuery).then(response => {
        this.shiftWorkList = response.data
        console.log(this.shiftWorkList)
      }).catch(err => {
        console.error(err)
      })
    },
    validateStep() {
      return new Promise((resolve, reject) => {
        this.$refs.dataFormMachine.validate((valid) => {
          // resolve(valid)
          if (valid) {
            this.active++
          }
        })
      })

      // if (this.active === 0) {
      // Mandatory ID and Type

      // } else if (this.active === 1) {
      // Mandatory value and Unit (Throughput)
      // } else {
      // Mandatory nature, value and Unit (Consumptions)
      // }
    },
    getListMachineByResource() {
      this.listLoading = true
      machineFilterByResource(this.idResource).then(response => {
        console.log('MACHINES DE MONGODB')
        console.log(response.data)
        this.listMachine = response.data
        this.totalMachine = response.data.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(err => { console.error(err) })
    },
    getListAreaByResource() {
      this.listLoading = true
      areaFilterByResource(this.idResource).then(response => {
        console.log('AREAS DE MONGODB')
        console.log(response.data)
        this.listArea = response.data
        this.totalArea = response.data.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(err => { console.error(err) })
    },
    getListArea() {
      this.listLoading = true
      this.listQuery.idResource = this.idResource
      areaFetchList(this.listQuery).then(response => {
        console.log('AREAS DE MONGODB')
        console.log(response.data)
        this.listArea = response.data
        this.totalArea = response.data.length
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      }).catch(err => { console.error(err) })
      /* this.listQuery.id = this.idResource
      this.listLoading = true
      this.listArea = [
        { id: 1, label: 'MC1', type: 'Berth', owner: 'Port Authority', terminal: 'COSCO Shipping' },
        { id: 2, label: 'MC2', type: 'Berth', owner: 'Port Authority', terminal: 'MSC' }
      ]
      this.totalArea = this.listArea.length
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000) */
    },
    getListMachine() {
      this.listQuery.id = this.idResource
      this.listLoading = true
      this.listMachine = [
        { id: 1, label: 'MC1', type: 'Fixed Crane', group: 'GC1', owner: 'Port Authority', shiftID: 'sh1', throughput: { value: 45, unit: '45m3' }, consumptions: { nature: 'Left', value: '45', unit: 'kw/h' }},
        { id: 2, label: 'MC2', type: 'Fixed Crane', group: 'GC2', owner: 'Port Authority', shiftID: 'sh2', throughput: { value: 45, unit: '45m3' }, consumptions: { nature: 'Right', value: '54', unit: 'kw/h' }}
      ]
      this.totalMachine = this.listMachine.length
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
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
    handleCloseMachine(done) {
      this.$confirm(this.$t('common.closeDialog'), this.$t('common.warning'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      })
        .then(_ => {
          done()
          this.active = 0
        })
        .catch(_ => {})
    },
    deleteArea(areaRow) {
      var idArea = areaRow.idArea
      console.log(idArea)
      compatibilityFetchList(this.listQueryCompatibility).then(response => {
        var compatibilityList = response.data
        console.log(compatibilityList)
        if (compatibilityList.length > 0) {
          compatibilityList.forEach(cmp => {
            if (cmp.areas_ID.includes(idArea)) {
            // console.log('Lo incluye')
              this.$message({
                type: pixelConstants.ERROR_MESSAGE_TYPE,
                message: this.$t('common.compatibilityRelatedToAreas')
              })
            } else {
              this.$confirm(this.$t('common.removeArea'), this.$t('common.deleteArea'), {
                confirmButtonText: this.$t('common.confirm'),
                cancelButtonText: this.$t('common.cancel'),
                type: pixelConstants.WARNING_MESSAGE_TYPE
              }).then(async() => {
                await areaDelete(areaRow._id)
                this.getListAreaByResource()
                this.updateResourceItem()
                this.$message({
                  type: pixelConstants.SUCCESS_MESSAGE_TYPE,
                  message: this.$t('common.deleteSucced')
                })
              }).catch(err => { console.error(err) })
            }
          })
        } else {
          this.$confirm(this.$t('common.removeArea'), this.$t('common.deleteArea'), {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: pixelConstants.WARNING_MESSAGE_TYPE
          }).then(async() => {
            await areaDelete(areaRow._id)
            this.getListAreaByResource()
            this.updateResourceItem()
            this.$message({
              type: pixelConstants.SUCCESS_MESSAGE_TYPE,
              message: this.$t('common.deleteSucced')
            })
          }).catch(err => { console.error(err) })
        }
      })
      //
    },
    deleteMachine(machineRow) {
      var idMachine = machineRow.idMachine
      var machineToDelete = true
      stepFetchList(this.listQuery).then(response => {
        var stepList = response.data
        // var name = []
        if (stepList.length > 0) {
          stepList.forEach(workItem => {
            workItem.work.machines.forEach(machineItem => {
              if (machineItem.includes(idMachine)) {
                machineToDelete = false
              }
            })
          })
          if (machineToDelete) {
            this.$confirm(this.$t('common.removeMachine'), this.$t('common.deleteMachine'), {
              confirmButtonText: this.$t('common.confirm'),
              cancelButtonText: this.$t('common.cancel'),
              type: pixelConstants.WARNING_MESSAGE_TYPE
            }).then(async() => {
              await machineDelete(machineRow._id)
              this.getListMachineByResource()
              this.updateResourceItem()
              this.$message({
                type: pixelConstants.SUCCESS_MESSAGE_TYPE,
                message: this.$t('common.deleteSucced')
              })
            }).catch(err => { console.error(err) })
          } else {
            this.$message({
              type: pixelConstants.ERROR_MESSAGE_TYPE,
              message: this.$t('common.machineRelatedToStep')
            })
          }
        } else {
          // No hay Steps relacionados
          this.$confirm(this.$t('common.removeMachine'), this.$t('common.deleteMachine'), {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: pixelConstants.WARNING_MESSAGE_TYPE
          }).then(async() => {
            await machineDelete(machineRow._id)
            this.getListMachineByResource()
            this.updateResourceItem()
            this.$message({
              type: pixelConstants.SUCCESS_MESSAGE_TYPE,
              message: this.$t('common.deleteSucced')
            })
          }).catch(err => { console.error(err) })
        }
      })
    },
    addArea() {
      this.resetdataFormArea()
      this.dialogTitleArea = this.$t('resources.createArea')
      this.dialogFormAreaVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormArea'].clearValidate()
        // this.$refs.name.focus()// Put focus over the first input control
      })
    },
    addMachine() {
      if (this.shiftWorkList.length > 0) {
        this.resetdataFormMachine()
        this.dialogTitleMachine = this.$t('resources.createMachine')
        this.dialogFormMachineVisible = true
        this.listConsumption = []
        this.$nextTick(() => {
          this.$refs['dataFormMachine'].clearValidate()
        // this.$refs.name.focus()// Put focus over the first input control
        })
      } else {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.messageNoShiftWork')
        })
      }
    },
    resetdataFormArea() {
      this.dataFormArea = {
        idArea: '',
        idResource: null,
        label: '',
        type: '',
        owner: '',
        terminal: ''
      }
    },
    resetdataFormMachine() {
      this.dataFormMachine = {
        id: '',
        idResource: null,
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
      this.active = 0
    },
    changeThroughput(value) {
      // console.log(value)
    },
    changeConsumption(value) {
      // console.log(value)
    },
    editArea(area) {
      this.dataFormArea = Object.assign({}, area) // copy object
      this.dialogTitleArea = this.$t('resources.editArea')
      this.dialogFormAreaVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormArea'].clearValidate()
      })
    },
    editMachine(machine) {
      // this.dataFormMachine = Object.assign({}, machine) // copy object
      this.dataFormMachine = JSON.parse(JSON.stringify(machine)) // deep copy
      this.dialogTitleMachine = this.$t('resources.editMachine')
      // this.listConsumption = [...machine.consumptions] // shallow copy
      this.listConsumption = JSON.parse(JSON.stringify(machine.consumptions)) // deep copy
      this.totalConsumption = machine.consumptions.length
      this.dialogFormMachineVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormMachine'].clearValidate()
      })
    },
    cancelMachineConsumption() {
      this.$refs.refDataFormMachineConsumption.clearValidate()
      this.dataFormMachineConsumption.nature = ''
      this.dataFormMachineConsumption.value = 0
      this.dataFormMachineConsumption.unit = ''
      this.editConsumption = false
    },
    editMachineConsumption(index, rowConsumption) {
      this.indexConsumption = this.listConsumption.indexOf(rowConsumption)
      this.dataFormMachineConsumption = Object.assign({}, rowConsumption) // copy object
      this.editConsumption = true
    },
    updateConsumption() {
      this.$refs.refDataFormMachineConsumption.validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.dataFormMachineConsumption)
          /* console.log('TEMPDATA')
          console.log(tempData.nature)
          console.log(this.indexConsumption) */
          this.listConsumption[this.indexConsumption].nature = tempData.nature
          this.listConsumption[this.indexConsumption].value = tempData.value
          this.listConsumption[this.indexConsumption].unit = tempData.unit
          this.cancelMachineConsumption()
        }
      })
    },
    addConsumption() {
      this.$refs.refDataFormMachineConsumption.validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.dataFormMachineConsumption)
          this.listConsumption.push(tempData)
          this.cancelMachineConsumption()
        }
      })

      // if (this.dataFormMachineConsumption.nature !== '' && this.dataFormMachineConsumption.unit !== '') {
      //   const tempData = Object.assign({}, this.dataFormMachineConsumption)
      //   this.listConsumption.push(tempData)
      //   this.cancelMachineConsumption()
      // } else {
      //   this.$message({
      //     type: pixelConstants.WARNING_MESSAGE_TYPE,
      //     message: this.$t('common.completeRequiredFields')
      //   })
      // }
    },
    deleteMachineConsumption(rowConsumption) {
      this.indexConsumption = this.listConsumption.indexOf(rowConsumption)
      this.listConsumption.splice(this.indexConsumption, 1)
    },
    preValidateNameMachine(formName) {
      var name = this.dataFormMachine.idMachine
      var createNewMachine = true
      machineFetchList(this.listQuery).then(response => {
        var listMachine = response.data
        if (listMachine.length > 0) {
          // Compruebo los nombres para evitar repetidos
          listMachine.forEach(machine => {
            if (machine.idMachine === name) {
              createNewMachine = false
            }
          })
          if (createNewMachine) {
            // Procedo a crear el nuevo area
            this.createMachine(formName)
          } else {
            // Mensaje indicando que debe de cambiar el nombre asignado al area
            this.$message({
              type: pixelConstants.ERROR_MESSAGE_TYPE,
              message: this.$t('common.noValidNameForMachine')
            })
            console.log('Existe un area con ese nombre por favor cambie el nombre')
          }
        } else {
          // Creo el area
          this.createMachine(formName)
        }
      })
    },
    preValidateNameArea(formName) {
      var name = this.dataFormArea.idArea
      var createNewArea = true
      areaFetchList(this.listQuery).then(response => {
        var listArea = response.data
        if (listArea.length > 0) {
          // Compruebo los nombres para evitar repetidos
          listArea.forEach(area => {
            if (area.idArea === name) {
              createNewArea = false
            }
          })
          if (createNewArea) {
            // Procedo a crear el nuevo area
            this.createArea(formName)
          } else {
            // Mensaje indicando que debe de cambiar el nombre asignado al area
            this.$message({
              type: pixelConstants.ERROR_MESSAGE_TYPE,
              message: this.$t('common.noValidNameForArea')
            })
            console.log('Existe un area con ese nombre por favor cambie el nombre')
          }
        } else {
          // Creo el area
          this.createArea(formName)
        }
      })
    },
    //
    /* miCodeWay(response) {

    },*/
    //
    createArea(formName) {
      // this.recoverAllAreas().then(this.miCodeWay)
      console.log('CREATE AREA')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('Create area')
          this.dataFormArea.idResource = this.idResource
          console.log(this.dataFormArea)
          areaCreate(this.dataFormArea).then(response => {
            this.dialogFormAreaVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.createdSuccessfully'),
              type: 'success',
              duration: 2000
            })
            this.getListAreaByResource()
            this.updateResourceItem()
          })
        }
      })
    },
    createMachine(formName) {
      if (this.listConsumption.length > 0) {
        console.log('CREATE MACHINE')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('Create machine')
            this.dataFormMachine.idResource = this.idResource
            this.dataFormMachine.consumptions = []
            console.log(this.dataFormMachine)
            this.listConsumption.forEach(element => {
              var itemConsumption = {
                'nature': element.nature,
                'value': element.value,
                'unit': element.unit
              }
              this.dataFormMachine.consumptions.push(itemConsumption)
            })
            machineCreate(this.dataFormMachine).then(response => {
              this.dialogFormMachineVisible = false
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('common.createdSuccessfully'),
                type: 'success',
                duration: 2000
              })
              this.getListMachineByResource()
              this.updateResourceItem()
              this.listConsumption = null
              this.active = 0
            }).catch(() => {
              console.log('Error')
            })
          }
        })
      } else {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.messageValidation')
        })
      }
    },
    updateResourceItem() {
      // Recupero el recurso por su ID
      resourceGet(this.idResource).then(response => {
        var resource = response.data
        resource.exportToIH_pending = true
        resourceUpdate(this.idResource, resource).then(response => {
          console.log('RESOURCE UPDATED')
        }).catch(err => { console.error(err) })
      }).catch(() => {
        console.log('Error')
      })
    },
    updateArea() {
      console.log('UPDATE AREA')
      this.$refs['dataFormArea'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dataFormArea)
          this.dialogFormAreaVisible = false
          areaUpdate(this.dataFormArea._id, tempData).then(response => {
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.updateSuccessfull'),
              type: 'success',
              duration: 2000
            })
            this.getListAreaByResource()
            this.updateResourceItem()
          }).catch(() => {
            console.log('Error')
          })
        }
      })
    },
    updateMachine() {
      if (this.listConsumption.length > 0) {
        console.log('UPDATE MACHINE')
        this.$refs['dataFormMachine'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.dataFormMachine)
            this.dialogFormMachineVisible = false
            tempData.consumptions = []
            this.listConsumption.forEach(element => {
              var itemConsumption = {
                'nature': element.nature,
                'value': element.value,
                'unit': element.unit
              }
              tempData.consumptions.push(itemConsumption)
            })
            machineUpdate(this.dataFormMachine._id, tempData).then(response => {
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('common.updateSuccessfull'),
                type: 'success',
                duration: 2000
              })
              this.getListMachineByResource()
              this.updateResourceItem()
              this.listConsumption = null
              this.active = 0
            }).catch(() => {
              console.log('Error')
            })
          }
        })
      } else {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.messageValidation')
        })
      }
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
  .subTitle {
    margin:0px 0px 10px 0px !important;
    font-size:16px;
    color:#303030 !important;
    font-family:'Lato',sans-serif;
    font-weight:400
  }
</style>
