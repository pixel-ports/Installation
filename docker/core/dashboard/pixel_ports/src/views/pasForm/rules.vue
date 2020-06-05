<template>
  <div class="app-container" :style="bgc">
    <el-row>
      <h1 class="headerView">{{ $t('common.rules') }}</h1>
    </el-row>
    <el-row class="filter-container">
      <el-input v-model="searchText" :placeholder="$t('resources.fileName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('resources.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="float:right;"
        type="primary"
        icon="el-icon-plus"
        @click="addRule"
      >
        {{ $t("rules.btnAddNewRule") }}
      </el-button>
    </el-row>
    <el-row style="background:#fff;margin-bottom:3px;">
      <!--padding:16px;-->
      <el-table
        v-loading="listLoading"
        :data="filteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('common.emptyTable')"
      >
        <el-table-column
          :label="$t('rules.ruleName')"
          align="center"
          :sortable="true"
          sort-by="name"
        >
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('rules.description')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('rules.creation')" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.createdAt | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.elasticIndex')" align="center">
          <template slot-scope="{row}">
            <span>{{ buildIndexName(row.name) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('rules.actions')"
          align="center"
          class-name="small-padding fixed-width"
          min-width="100"
        >
          <template slot-scope="{ row }">
            <!-- <el-button-group> -->
            <el-button
              size="small"
              class="exportToIH"
              :disabled="!row.exportToIH_pending"
              @click="exportToIH(row)"
            >
              {{ $t("common.btnExportToIH") }}
            </el-button>
            <span style="padding-left:10px" />
            <!--<router-link :to="{name:'Resources List', params: {model: row, id: row._id}}">-->
            <el-button
              size="small"
              class="editBtn"
              @click="gotoListOfItems(row._id)"
            >
              <i class="el-icon-edit">
                {{ $t("common.btnEdit") }}
              </i>
            </el-button>
            <!--</router-link>-->
            <span style="padding-left:10px" />
            <el-button
              size="small"
              class="deleteBtn"
              @click="new_deleteRegister(row)"
            >
              <i class="el-icon-delete-solid">
                {{ $t("common.btnDelete") }}
              </i>
            </el-button>
            <!-- </el-button-group> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="page" :limit.sync="limit" @pagination="getList" />

    <!-- DIALOG TO ADD NEW RULE FILE -->
    <el-dialog
      :title="$t('rules.createRule')"
      :visible.sync="dialogFormVisible"
      width="60%"
      hide-overlay
      transition="dialog-bottom-transition"
      :before-close="handleClose"
    >
      <el-form
        ref="refDataForm"
        :rules="formRules"
        :model="dataForm"
        label-position="left"
        label-width="70px"
        style="margin-left:50px;"
      >
        <el-row align="center">
          <el-col :span="24">
            <el-form-item
              :label-width="labelColumn"
              :label="$t('rules.name')"
              prop="name"
            >
              <el-input ref="name" v-model="dataForm.name" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="24">
            <el-form-item
              :label-width="labelColumn"
              :label="$t('rules.description')"
            >
              <el-input
                v-model="dataForm.description"
                :autosize="{ minRows: 3, maxRows: 5 }"
                type="textarea"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">
          {{ $t("common.cancel") }}
        </el-button>
        <el-button type="success" @click="addItem('refDataForm')">
          {{ $t("common.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <!-- DIALOG TO SHOW THE JSON FILE THAT WE WILL INSERT IN THE IH -->
    <el-dialog
      :visible.sync="viewResultDialog"
      :title="$t('scheduledExecutionsList.viewExecution')"
    >
      <el-card class="box-card">
        <json-editor ref="jsonEditor" v-model="result" />
        <!--<el-input v-model="result" :autosize="{ minRows: 3, maxRows: 20}" type="textarea" style="width:95%" />-->
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="updateRuleStatus()">
          {{ $t("common.close") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import { ruleFetchList, ruleCreate, ruleDelete, ruleUpdate } from '@/api/rule'
import { existIndex, deleteIndex, createIndex, insertDocument } from '@/api/PAS_IH'
import { cargoCategoryFilterByRule, cargoCategoryDelete } from '@/api/cargoCategory'
import { shiftWorkFilterByRule, shiftWorkDelete } from '@/api/shiftWork'
import { priorityFilterByRule, priorityDelete } from '@/api/priority'
// import { validityFilterByRule, validityDelete } from '@/api/validity' // not required
// import { assignmentFilterByRule, assignmentDelete } from '@/api/assignment' // not required
import pixelConstants from '@/utils/constants' // import class for constants
import pixelCommon from '@/utils/common'
import waves from '@/directive/waves' // waves directive
import rulesSchema from './schema/RULES_schema.json'
import Pagination from '@/components/Pagination' // secondary package based on
export default {
  name: 'Rules',
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
      searchText: '',
      viewResultDialog: false,
      result: null,
      dialogFormVisible: false,
      // dialogTitle: '',
      labelColumn: '110px',
      dataForm: {
        id: null,
        name: '',
        description: '',
        creation: null,
        exportToIH_pending: false
      },
      listQuery: {
        text: undefined,
        type: undefined
      },
      page: 1,
      limit: 10,
      listLoading: true,
      list: [],
      links: [], // need for autocomplete
      nameFiltered: '',
      total: 0,
      formRules: {
        name: [
          {
            required: true,
            message: this.$t('rules.errRuleNameRequired'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    filteredBySearchText() {
      return this.list.filter(rule => rule.name.toLowerCase().includes(this.searchText.toLowerCase()) || rule.description.toLowerCase().includes(this.searchText.toLowerCase()))
    },
    filteredBySearchTextLength() {
      return this.filteredBySearchText.length
    },
    filteredByPagination() {
      const page = this.page
      const limit = this.limit

      if (Math.ceil(this.filteredBySearchTextLength / limit) >= page) {
        return this.filteredBySearchText.slice((page - 1) * limit, page * limit)
      } else {
        return this.filteredBySearchText.slice(0, limit)
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    updateRuleStatus() {
      this.viewResultDialog = false
      this.getList()
    },
    buildIndexName(ruleName) {
      var deleteSpaces = ruleName.split(' ').join('')
      return 'rule_' + deleteSpaces.toLowerCase()
    },
    gotoListOfItems(idRule) {
      this.$router.push({ name: 'Rules List', params: { id: idRule }})
      // this.$router.push({ name: 'generic dashboard', params: { id: row._id }})
    },
    getList() {
      this.listLoading = true
      ruleFetchList(this.listQuery)
        .then(response => {
          var rules = response.data
          rules.forEach(rule => {
            const idRule = rule._id
            cargoCategoryFilterByRule(idRule).then(response => {
              var listCargoCategories = response.data
              rule.cargoes_categories = listCargoCategories
            })
            shiftWorkFilterByRule(idRule).then(response => {
              var listShiftWorks = response.data
              rule.shiftworks = listShiftWorks
            })
            priorityFilterByRule(idRule).then(response => {
              var listPriority = response.data
              rule.priority = listPriority
            })
            // validityFilterByRule(idRule).then(response => {
            //   var listValidity = response.data
            //   rule.validity = listValidity
            // })
            // assignmentFilterByRule(idRule).then(response => {
            //   var listAssignment = response.data
            //   rule.assignment = listAssignment
            // })
          })

          console.log(rules)
          this.list = rules
          this.total = rules.length
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(err => {
          console.error(err)
          this.listLoading = false
        })
    },
    querySearch(queryString, cb) {
      var links = this.links
      var results = queryString
        ? links.filter(pixelCommon.createFilter(queryString))
        : links
      cb(pixelCommon.createRegister(results))
    },
    handleSelect(item) {
      console.log('HANDLE SELECT')
      console.log(item)
      this.listQuery.id = item.id
      this.listQuery.page = 1
      this.getListFiltered()
      this.nameFiltered = ''
      this.listQuery.id = undefined
    },
    getListFiltered() {
      this.listLoading = true
      var resource = []
      if (this.listQuery.id === 1) {
        resource.push({
          id: 1,
          name: 'Resources_test1.json',
          description: 'Description 1',
          creation: 1583836858,
          exportToIH_pending: true
        })
      } else {
        resource.push({
          id: 2,
          name: 'Resources_test2.json',
          description: 'Description 2',
          creation: 1583836858,
          exportToIH_pending: false
        })
      }
      this.list = resource
      this.links = this.list
      this.total = this.list.length
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
    handleFilter() {

    },
    new_deleteRegister(ruleRow) {
      console.log(ruleRow)
      var indexName = this.buildIndexName(ruleRow.name)
      if (ruleRow.cargoes_categories.length > 0 || ruleRow.shiftworks.length > 0 || ruleRow.priority.length > 0) {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.deleteBeforeEntitiesRelated')
        })
      } else {
        ruleDelete(ruleRow._id)
        this.getList()
        this.$message({
          type: pixelConstants.SUCCESS_MESSAGE_TYPE,
          message: this.$t('common.deleteSucced')
        })
        existIndex(indexName).then(response => {
          console.log('Obtengo un codigo 200: índice existe')
          console.log('Tengo que borrar el indice')
          deleteIndex(indexName).then(response => {
            console.log('Indice borrado')
            console.log(response)
          })
        })
      }
    },
    deleteRegister(ruleRow) {
      var indexName = this.buildIndexName(ruleRow.name)
      console.log(indexName)
      if (
        ruleRow.cargoes_categories.length > 0 ||
        ruleRow.shiftworks.length > 0 ||
        ruleRow.priority.length > 0
      ) {
        this.$confirm(
          this.$t('common.ruleWithEntities'),
          this.$t('common.deleteRule'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: pixelConstants.WARNING_MESSAGE_TYPE
          }
        )
          .then(async() => {
            ruleRow.cargoes_categories.forEach(cargoCategory => {
              const id = cargoCategory._id
              cargoCategoryDelete(id)
            })
            ruleRow.shiftworks.forEach(shiftWork => {
              const id = shiftWork._id
              shiftWorkDelete(id)
            })
            ruleRow.priority.forEach(priority => {
              const id = priority._id
              priorityDelete(id)
            })
            // ruleRow.validities.forEach(validity => {
            //   const id = validity._id
            //   validityDelete(id)
            // })
            // ruleRow.assignments.forEach(assignment => {
            //   const id = assignment._id
            //   assignmentDelete(id)
            // })
            ruleDelete(ruleRow._id)
            this.getList()
            this.$message({
              type: pixelConstants.SUCCESS_MESSAGE_TYPE,
              message: this.$t('common.deleteSucced')
            })
            deleteIndex(indexName).then(response => {
              console.log('Indice borrado')
              console.log(response)
            })
          }).catch(err => {
            console.error(err)
          })
      } else {
        this.$confirm(
          this.$t('common.removeRule'),
          this.$t('common.deleteRule'),
          {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: pixelConstants.WARNING_MESSAGE_TYPE
          }
        ).then(async() => {
          ruleDelete(ruleRow._id)
          this.getList()
          this.$message({
            type: pixelConstants.SUCCESS_MESSAGE_TYPE,
            message: this.$t('common.deleteSucced')
          })
          deleteIndex(indexName).then(response => {
            console.log('Indice borrado')
            console.log(response)
          })
        }).catch(err => {
          console.error(err)
        })
      }
    },
    exportToIH(row) {
      // console.log(row)
      var indexName = this.buildIndexName(row.name)
      var jsonFile = {
        'cargoes_categories': [],
        'shiftworks': [],
        'priority': [],
        'validity': {},
        'assignment': {}
      }
      // var rangeAmount = []

      row.cargoes_categories.forEach(cargoCategory => {
        // rangeAmount.push(cargoCategory.typical_amount_range[0])
        // rangeAmount.push(cargoCategory.typical_amount_range[1])
        var itemCargo = {
          'ID': cargoCategory.idCargoCategory,
          'segment': cargoCategory.segment,
          'unit': cargoCategory.unit,
          'typical_amount_range': [],
          'assignation_preference': []
        }
        cargoCategory.typical_amount_range.forEach(range => {
          itemCargo.typical_amount_range.push(range)
        })
        cargoCategory.assignation_preference.forEach(assignation => {
          var itemAssignation = {
            'priority': assignation.priority,
            'direction': assignation.direction,
            'dock_ID': assignation.dock_ID,
            'supply_chain_ID': assignation.supply_chain_ID
          }
          itemCargo.assignation_preference.push(itemAssignation)
        })
        jsonFile.cargoes_categories.push(itemCargo)
      })
      row.shiftworks.forEach(shiftWork => {
        var itemShiftWork = {
          'ID': shiftWork.idShiftWork,
          'value': shiftWork.value
        }
        jsonFile.shiftworks.push(itemShiftWork)
      })
      if (row.priority.length > 0) {
        row.priority[0].priority.forEach(priorityName => {
          jsonFile.priority.push(priorityName)
        })
      }
      // row.priority.forEach(priorityItem => {
      //   priorityItem.priority.forEach(priorityName => {
      //     jsonFile.priority.push(priorityName)
      //   })
      // })

      console.log(jsonFile)
      var error = false
      if (jsonFile.cargoes_categories.length > 0 && jsonFile.shiftworks.length > 0 && jsonFile.priority.length > 0) {
        error = false
      } else if (jsonFile.cargoes_categories.length === 0 && jsonFile.shiftworks.length > 0 && jsonFile.priority.length > 0) {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.cargoCategoryNotImplemented')
        })
        error = true
      } else if (jsonFile.shiftworks.length === 0 && jsonFile.cargoes_categories.length > 0 && jsonFile.priority.length > 0) {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.shiftWorkNotImplemented')
        })
        error = true
      } else if (jsonFile.priority.length === 0 && jsonFile.cargoes_categories.length > 0 && jsonFile.shiftworks.length > 0) {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.priorityNotImplemented')
        })
        error = true
      } else {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.ruleNotImplemented')
        })
        error = true
      }
      var schema = rulesSchema
      var Validator = require('jsonschema').Validator
      var v = new Validator()
      if (!error) {
        console.log('Valido mi fichero')
        console.log(v.validate(jsonFile, schema))
        var validado = v.validate(jsonFile, schema)
        if (validado.valid) {
          // Si es valido inserto en elasticsearch en el indice correspondiente
          // this.result = jsonFile
          // Muestro el cuadro de dialogo
          // this.viewResultDialog = true
          // Si el JSON se valida correctamente. Debo comprobar que el indice exista en Elasticsearch
          console.log('Check rules')
          existIndex(indexName).then(response => {
            console.log('Obtengo un codigo 200: índice existe')
            console.log('Tengo que borrar el indice')
            deleteIndex(indexName).then(response => {
              console.log('Borro el índice')
              console.log('Voy a crear el índice')
              createIndex(indexName).then(response => {
                console.log('Creo el índice')
                console.log('Inserto el documento')
                insertDocument(indexName, jsonFile).then(response => {
                  if (response.result === 'created') {
                    this.result = response
                    // Muestro el cuadro de dialogo
                    this.viewResultDialog = true
                    var updatedRule = {
                      id: row._id,
                      name: row.name,
                      description: row.description,
                      creation: row.createdAt,
                      exportToIH_pending: false
                    }
                    ruleUpdate(row._id, updatedRule).then(response => {
                      console.log('Registro actualizado')
                      console.log(response)
                    })
                  }
                }).catch(err => { console.log(err) })
              }).catch(err => {
                console.log('Error al crear el índice')
                console.log(err)
              })
            }).catch(err => {
              console.log('Error al borrar el índice')
              console.log(err)
            })
          }).catch(err => {
            console.log('Devuelve un 404. No existe el indice. Hay que crearlo')
            console.log(err)
            createIndex(indexName).then(response => {
              console.log('Creo el índice')
              console.log('Inserto el documento')
              insertDocument(indexName, jsonFile).then(response => {
                if (response.result === 'created') {
                  this.result = response
                  // Muestro el cuadro de dialogo
                  this.viewResultDialog = true
                  var updatedRule = {
                    id: row._id,
                    name: row.name,
                    description: row.description,
                    creation: row.createdAt,
                    exportToIH_pending: false
                  }
                  ruleUpdate(row._id, updatedRule).then(response => {
                    console.log('Registro actualizado')
                    console.log(response)
                  })
                }
              }).catch(err => { console.log(err) })
            }).catch(err => {
              console.log('Error al crear el índice')
              console.log(err)
            })
          })
        } else {
          // Si falla muestro los errores.
          this.result = validado
          // Muestro el cuadro de dialogo
          this.viewResultDialog = true
        }
      }
    },
    addRule() {
      this.resetdataForm()
      // this.dialogTitle = this.$t('rules.createRule')
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['refDataForm'].clearValidate()
        this.$refs.name.focus() // Put focus over the first input control
      })
    },
    resetdataForm() {
      this.dataForm = {
        name: '',
        description: '',
        creation: null,
        exportToIH_pending: false
      }
    },
    addItem(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('Create Rule')
          console.log(this.dataForm)
          ruleCreate(this.dataForm).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.createdSuccessfully'),
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
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
.exportToIH {
  color: #fff;
  background-color: #409167;
  border-color: #409167;
}
.headerView {
  margin:0px 0px 10px 0px !important;
  font-size:18px;
  color:#303030 !important;
  font-family:'Lato', sans-serif;
  font-weight:400
}
</style>
