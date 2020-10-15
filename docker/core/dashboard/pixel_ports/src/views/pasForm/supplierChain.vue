<template>
  <div class="app-container" :style="bgc">
    <el-row>
      <h1 class="headerView">{{ $t('common.supplierChain') }}</h1>
    </el-row>
    <el-row class="filter-container">
      <el-input v-model="searchText" :placeholder="$t('resources.fileName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('resources.search') }}
      </el-button>

      <el-button
        style="float:right;"
        class="filter-item exportToIH"
        :disabled="!allowExportToIH"
        @click="newExportToIH()"
      >
        {{ $t("common.btnExportToIH") }}
      </el-button>

      <el-button
        class="filter-item"
        style="float:right;"
        type="primary"
        icon="el-icon-plus"
        @click="addSupplierChain"
      >
        {{ $t("supplierChain.btnAddNewSupplierChain") }}
      </el-button>
    </el-row>

    <el-row style="background:#fff;margin-bottom:3px;">
      <el-table
        v-loading="listLoading"
        :data="filteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('resources.emptyTable')"
      >
        <el-table-column :label="$t('supplierChain.name')" align="center" :sortable="true" sort-by="name">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('supplierChain.description')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('supplierChain.creation')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column :label="$t('resources.elasticIndex')" align="center">
          <template slot-scope="{row}">
            <span>{{ buildIndexName(row.name) }}</span>
          </template>
        </el-table-column>-->
        <el-table-column
          :label="$t('rules.actions')"
          align="center"
          class-name="small-padding fixed-width"
          min-width="100"
        >
          <template slot-scope="{ row }">
            <!--<el-button
              size="small"
              class="exportToIH"
              :disabled="!row.exportToIH_pending"
              @click="exportToIH(row)"
            >
              {{ $t("common.btnExportToIH") }}
            </el-button>
            <span style="padding-left:10px" />-->
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

    <!-- DIALOG TO ADD NEW SUPPLY CHAIN FILE -->
    <el-dialog
      :title="$t('supplierChain.create_SC')"
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
              :label="$t('supplierChain.name_')"
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
              :label="$t('supplierChain.description_')"
            >
              <el-input ref="description" v-model="dataForm.description" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" style="width:100%" />
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
    <el-dialog :visible.sync="viewResultDialog" :title="$t('scheduledExecutionsList.exportDone')">
      <el-card class="box-card">
        <json-editor ref="jsonEditor" v-model="result" />
        <!--<el-input v-model="result" :autosize="{ minRows: 3, maxRows: 20}" type="textarea" style="width:95%" />-->
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="updateSupplierChainStatus()">
          {{ $t('common.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import JsonEditor from '@/components/JsonEditor'
import { supplierChainFetchList, supplierChainCreate, supplierChainDelete, supplierChainUpdate } from '@/api/supplierChain'
import { existIndex, deleteIndex, createIndex, insertDocument } from '@/api/PAS_IH'
import { stepFilterBySC, stepDelete } from '@/api/step'
import { detailFilterBySC, detailDelete } from '@/api/detail'
import { compatibilityFilterBySC, compatibilityDelete } from '@/api/compatibility'
import pixelConstants from '@/utils/constants' // import class for constants
import pixelCommon from '@/utils/common'
import Pagination from '@/components/Pagination' // secondary package based on
import supplierChainSchema from './schema/SUPPLYCHAIN_schema.json'
import waves from '@/directive/waves' // waves directive
import { cargoCategoryFetchList } from '@/api/cargoCategory'
export default {
  name: 'SupplierChain',
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
      viewResultDialog: false,
      result: null,
      searchText: '',
      dialogFormVisible: false,
      labelColumn: '110px',
      dataForm: {
        id: null,
        name: '',
        description: '',
        creation: null,
        exportToIH_pending: false
      },
      listLoading: false,
      list: [],
      nameFiltered: '',
      listQuery: {
        text: undefined,
        type: undefined
      },
      page: 1,
      limit: 10,
      formRules: {
        name: [
          {
            required: true,
            message: this.$t('supplierChain.errSC_NameRequired'),
            trigger: 'blur'
          }
        ]
      },
      allowExportToIH: false
    }
  },
  computed: {
    filteredBySearchText() {
      return this.list.filter(itemSC => itemSC.name.toLowerCase().includes(this.searchText.toLowerCase()) || itemSC.description.toLowerCase().includes(this.searchText.toLowerCase()))
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
    // this.list = supplierChainMockup
  },
  methods: {
    updateSupplierChainStatus() {
      this.viewResultDialog = false
      this.getList()
    },
    buildIndexName(SC_Name) {
      var deleteSpaces = SC_Name.split(' ').join('')
      return 'sc_' + deleteSpaces.toLowerCase()
    },
    gotoListOfItems(idSC) {
      this.$router.push({ name: 'Supplier Chain List', params: { id: idSC }})
      // this.$router.push({ name: 'generic dashboard', params: { id: row._id }})
    },
    getList() {
      this.listLoading = true
      // sustituirlo por "supplierChainFetchList"
      this.allowExportToIH = false
      supplierChainFetchList(this.listQuery).then(response => {
        var data = response.data
        data.forEach(element => {
          const idSC = element._id
          if (element.exportToIH_pending) {
            this.allowExportToIH = true
          }
          stepFilterBySC(idSC).then(response => {
            var stepsList = response.data
            element.steps_list = stepsList
          })
          detailFilterBySC(idSC).then(response => {
            var detailsList = response.data
            element.details = detailsList
          })
          compatibilityFilterBySC(idSC).then(response => {
            var compatibilityList = response.data
            element.compatibility = compatibilityList
          })
        })
        console.log('GET LIST SUPPLIER CHAIN')
        console.log(data)
        this.list = data
        this.total = data.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(err => {
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
    handleFilter() {},
    addSupplierChain() {
      this.resetdataForm()
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
          console.log('Create Supply Chain')
          console.log(this.dataForm)
          supplierChainCreate(this.dataForm).then(response => {
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
    },
    new_deleteRegister(SC_row) {
      // var indexName = this.buildIndexName(SC_row.name)
      if (SC_row.steps_list.length > 0 || SC_row.details.length > 0 || SC_row.compatibility.length > 0) {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.deleteBeforeEntitiesRelated')
        })
      } else {
        supplierChainDelete(SC_row._id).then(response => {
          this.listLoading = true
          //
          this.allowExportToIH = false
          supplierChainFetchList(this.listQuery).then(response => {
            var data = response.data
            data.forEach(element => {
              const idSC = element._id
              if (element.exportToIH_pending) {
                this.allowExportToIH = true
              }
              stepFilterBySC(idSC).then(response => {
                var stepsList = response.data
                element.steps_list = stepsList
              })
              detailFilterBySC(idSC).then(response => {
                var detailsList = response.data
                element.details = detailsList
              })
              compatibilityFilterBySC(idSC).then(response => {
                var compatibilityList = response.data
                element.compatibility = compatibilityList
              })
            })
            // console.log('Obtengo la lista')
            // console.log(data)
            this.list = data
            this.total = data.length
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
            this.$message({
              type: pixelConstants.SUCCESS_MESSAGE_TYPE,
              message: this.$t('common.deleteSucced')
            })
            // this.newExportToIH()
            setTimeout(() => { this.ExportToIH_afterDelete(this.list) }, 1000)
          }).catch(err => {
            console.error(err)
            this.listLoading = false
          })
        })
      }
    },
    deleteRegister(SC_row) {
      // Antes de borrar debo comprobar que el registro de SupplierChain no este asociado a un CargoCategory
      // console.log(SC_row)
      var indexName = this.buildIndexName(SC_row.name)
      var scName = SC_row.name
      var supplierToDelete = true
      console.log(scName)
      cargoCategoryFetchList(this.listQuery).then(response => {
        var cargoCategoryList = response.data
        console.log('Cargo categories')
        console.log(cargoCategoryList)
        cargoCategoryList.forEach(cargo => {
          cargo.assignation_preference.forEach(preference => {
            if (preference.supply_chain_ID === scName) {
              supplierToDelete = false
            }
          })
        })
        if (supplierToDelete) {
          if (
            SC_row.steps_list.length > 0 || SC_row.details.length > 0
          ) {
            this.$confirm(
              this.$t('common.SC_WithEntities'),
              this.$t('common.deleteSC'),
              {
                confirmButtonText: this.$t('common.confirm'),
                cancelButtonText: this.$t('common.cancel'),
                type: pixelConstants.WARNING_MESSAGE_TYPE
              }
            ).then(async() => {
              SC_row.steps_list.forEach(step => {
                const id = step._id
                stepDelete(id)
              })
              SC_row.details.forEach(step => {
                const id = step._id
                detailDelete(id)
              })
              SC_row.compatibility.forEach(step => {
                const id = step._id
                compatibilityDelete(id)
              })
              supplierChainDelete(SC_row._id)
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
              this.$t('common.removeSC'),
              this.$t('common.deleteSC'),
              {
                confirmButtonText: this.$t('common.confirm'),
                cancelButtonText: this.$t('common.cancel'),
                type: pixelConstants.WARNING_MESSAGE_TYPE
              }
            ).then(async() => {
              supplierChainDelete(SC_row._id)
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
        } else {
          this.$message({
            type: pixelConstants.ERROR_MESSAGE_TYPE,
            message: this.$t('common.supplierChainRelatedToCargoCategory')
          })
        }
      })
    },
    newExportToIH() {
      console.log('Voy a exportar el listado de filas existente')
      var data = this.list

      console.log('Numero de filas existentes: ' + data.length)
      var indexName = 'supplier_chain'
      var wrap_jsonFile = []
      console.log('Construyo el json a exportar')

      /* console.log('Muestro el objeto')
      console.log(data)
      console.log(data.details.length)*/
      data.forEach(item => {
        var jsonFile = {
          'ID': '',
          'label': '',
          'comment': '',
          'compatibility': {},
          'steps_list': []
        }
        if (item.details.length > 0) {
          jsonFile.ID = item.details[0].idDetail
          jsonFile.label = item.details[0].label
          jsonFile.comment = item.details[0].comment
        }
        if (item.compatibility.length > 0) {
          jsonFile.compatibility.cargoes_category = item.compatibility[0].cargoes_category
          jsonFile.compatibility.directions_nature = item.compatibility[0].directions_Nature
          jsonFile.compatibility.areas_ID = item.compatibility[0].areas_ID
          jsonFile.compatibility.shiftworks_ID = item.compatibility[0].shiftworks_ID
        }

        item.steps_list.forEach(step => {
          var itemStep = {
            'ID': step.idStep,
            'label': step.label,
            'comment': step.comment,
            'category': step.category,
            'scheduling': step.scheduling,
            'work': step.work
          }
          jsonFile.steps_list.push(itemStep)
        })
        wrap_jsonFile.push(jsonFile)
      })
      // Show jsonFile
      console.log('JSON FILE:  ')
      console.log(wrap_jsonFile)

      var error = false
      var index = 1
      wrap_jsonFile.forEach(item => {
        if (item.steps_list.length === 0) {
          this.$message({
            type: pixelConstants.WARNING_MESSAGE_TYPE,
            // steps not implemented
            message: this.$t('common.stepsNotImplemented') + index
          })
          error = true
        }
        //
        if (!item.ID) {
          this.$message({
            type: pixelConstants.WARNING_MESSAGE_TYPE,
            // Supply Chain Name missing
            message: this.$t('common.SC_NameNotImplemented') + index
          })
          error = true
        }
        index = index + 1
      })
      //
      var schema = supplierChainSchema
      var Validator = require('jsonschema').Validator
      var v = new Validator()
      if (!error) {
        console.log('Valido mi fichero')
        var validado = v.validate(wrap_jsonFile, schema)
        console.log(validado)
        if (validado.valid) {
          // Si es valido inserto en elasticsearch en el indice correspondiente
          // this.result = jsonFile
          // Muestro el cuadro de dialogo
          // this.viewResultDialog = true
          // Si el JSON se valida correctamente. Debo comprobar que el indice exista en Elasticsearch
          console.log('Check supply chain')
          existIndex(indexName).then(response => {
            console.log('Obtengo un codigo 200: índice existe')
            console.log('Tengo que borrar el indice')
            deleteIndex(indexName).then(response => {
              console.log('Borro el índice')
              console.log('Voy a crear el índice')
              createIndex(indexName).then(response => {
                console.log('Creo el índice')
                console.log('Inserto el documento')
                wrap_jsonFile = {
                  'supplier_chain': wrap_jsonFile
                }
                insertDocument(indexName, wrap_jsonFile).then(response => {
                  if (response.result === 'created') {
                    this.result = response
                    // Muestro el cuadro de dialogo
                    this.viewResultDialog = true
                    data.forEach(item => {
                      var updatedSupplierChain = {
                        id: item._id,
                        name: item.name,
                        description: item.description,
                        creation: item.createdAt,
                        exportToIH_pending: false
                      }
                      supplierChainUpdate(item._id, updatedSupplierChain).then(response => {
                        console.log('Registro actualizado')
                        console.log(response)
                      })
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
              // console.log(wrap_jsonFile)
              wrap_jsonFile = {
                'supplier_chain': wrap_jsonFile
              }
              console.log(wrap_jsonFile)
              insertDocument(indexName, wrap_jsonFile).then(response => {
                if (response.result === 'created') {
                  this.result = response
                  // Muestro el cuadro de dialogo
                  this.viewResultDialog = true
                  data.forEach(item => {
                    var updatedSupplierChain = {
                      id: item._id,
                      name: item.name,
                      description: item.description,
                      creation: item.createdAt,
                      exportToIH_pending: false
                    }
                    supplierChainUpdate(item._id, updatedSupplierChain).then(response => {
                      console.log('Registro actualizado')
                      console.log(response)
                    })
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
    ExportToIH_afterDelete(data) {
      console.log('Voy a exportar el listado de filas existente after delete')

      var indexName = 'supplier_chain'
      var wrap_jsonFile = []

      data.forEach(item => {
        var jsonFile = {
          'ID': '',
          'label': '',
          'comment': '',
          'compatibility': {},
          'steps_list': []
        }

        if (item.details.length > 0) {
          console.log('Estoy dentro')
          jsonFile.ID = item.details[0].idDetail
          jsonFile.label = item.details[0].label
          jsonFile.comment = item.details[0].comment
        }
        if (item.compatibility.length > 0) {
          jsonFile.compatibility.cargoes_category = item.compatibility[0].cargoes_category
          jsonFile.compatibility.directions_nature = item.compatibility[0].directions_Nature
          jsonFile.compatibility.areas_ID = item.compatibility[0].areas_ID
          jsonFile.compatibility.shiftworks_ID = item.compatibility[0].shiftworks_ID
        }
        console.log('Llego aqui')
        console.log(item.steps_list)
        item.steps_list.forEach(step => {
          var itemStep = {
            'ID': step.idStep,
            'label': step.label,
            'comment': step.comment,
            'category': step.category,
            'scheduling': step.scheduling,
            'work': step.work
          }
          jsonFile.steps_list.push(itemStep)
        })
        wrap_jsonFile.push(jsonFile)
      })
      // Show jsonFile
      console.log('JSON FILE:  ')
      console.log(wrap_jsonFile)

      var error = false
      var index = 1
      wrap_jsonFile.forEach(item => {
        if (item.steps_list.length === 0) {
          this.$message({
            type: pixelConstants.WARNING_MESSAGE_TYPE,
            // steps not implemented
            message: this.$t('common.stepsNotImplemented') + index
          })
          error = true
        }
        //
        if (!item.ID) {
          this.$message({
            type: pixelConstants.WARNING_MESSAGE_TYPE,
            // Supply Chain Name missing
            message: this.$t('common.SC_NameNotImplemented') + index
          })
          error = true
        }
        index = index + 1
      })
      //
      var schema = supplierChainSchema
      var Validator = require('jsonschema').Validator
      var v = new Validator()
      if (!error) {
        console.log('Valido mi fichero')
        var validado = v.validate(wrap_jsonFile, schema)
        console.log(validado)
        if (validado.valid) {
          // Si es valido inserto en elasticsearch en el indice correspondiente
          // this.result = jsonFile
          // Muestro el cuadro de dialogo
          // this.viewResultDialog = true
          // Si el JSON se valida correctamente. Debo comprobar que el indice exista en Elasticsearch
          console.log('Check supply chain')
          existIndex(indexName).then(response => {
            console.log('Obtengo un codigo 200: índice existe')
            console.log('Tengo que borrar el indice')
            deleteIndex(indexName).then(response => {
              console.log('Borro el índice')
              console.log('Voy a crear el índice')
              createIndex(indexName).then(response => {
                console.log('Creo el índice')
                console.log('Inserto el documento')
                wrap_jsonFile = {
                  'supplier_chain': wrap_jsonFile
                }
                insertDocument(indexName, wrap_jsonFile).then(response => {
                  if (response.result === 'created') {
                    this.result = response
                    // Muestro el cuadro de dialogo
                    this.viewResultDialog = false
                    data.forEach(item => {
                      var updatedSupplierChain = {
                        id: item._id,
                        name: item.name,
                        description: item.description,
                        creation: item.createdAt,
                        exportToIH_pending: false
                      }
                      supplierChainUpdate(item._id, updatedSupplierChain).then(response => {
                        console.log('Registro actualizado')
                        console.log(response)
                      })
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
              // console.log(wrap_jsonFile)
              wrap_jsonFile = {
                'supplier_chain': wrap_jsonFile
              }
              console.log(wrap_jsonFile)
              insertDocument(indexName, wrap_jsonFile).then(response => {
                if (response.result === 'created') {
                  this.result = response
                  // Muestro el cuadro de dialogo
                  this.viewResultDialog = false
                  data.forEach(item => {
                    var updatedSupplierChain = {
                      id: item._id,
                      name: item.name,
                      description: item.description,
                      creation: item.createdAt,
                      exportToIH_pending: false
                    }
                    supplierChainUpdate(item._id, updatedSupplierChain).then(response => {
                      console.log('Registro actualizado')
                      console.log(response)
                    })
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
          this.viewResultDialog = false
        }
      }
    },
    exportToIH(row) {
      // alert('Implementar exportación al IH...')
      var indexName = this.buildIndexName(row.name)
      var wrap_jsonFile = []
      var jsonFile = {
        'ID': '',
        'label': '',
        'comment': '',
        'compatibility': {},
        'steps_list': []
      }
      if (row.details.length > 0) {
        jsonFile.ID = row.details[0].idDetail
        jsonFile.label = row.details[0].label
        jsonFile.comment = row.details[0].comment
      }

      if (row.compatibility.length > 0) {
        jsonFile.compatibility.cargoes_category = row.compatibility[0].cargoes_category
        jsonFile.compatibility.directions_nature = row.compatibility[0].directions_Nature
        jsonFile.compatibility.areas_ID = row.compatibility[0].areas_ID
        jsonFile.compatibility.shiftworks_ID = row.compatibility[0].shiftworks_ID
      }

      row.steps_list.forEach(step => {
        var itemStep = {
          'ID': step.idStep,
          'label': step.label,
          'comment': step.comment,
          'category': step.category,
          'scheduling': step.scheduling,
          'work': step.work
        }
        jsonFile.steps_list.push(itemStep)
      })

      wrap_jsonFile.push(jsonFile)
      console.log('JSON FILE:  ')
      console.log(jsonFile)
      // this.result = jsonFile
      // this.viewResultDialog = true
      var error = false
      if (jsonFile.steps_list.length > 0 && jsonFile.ID) {
        /* this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.functionalityNotImplemented')
        }) */
        error = false
      } else if (jsonFile.steps_list.length === 0 && jsonFile.ID) {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          // steps not implemented
          message: this.$t('common.stepsNotImplemented')
        })
        error = true
      } else if (jsonFile.steps_list.length > 0 && !jsonFile.ID) {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          // Supply Chain Name missing
          message: this.$t('common.SC_NameNotImplemented')
        })
        error = true
      } else {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          // Steps and Supply Chain Name missing
          message: this.$t('common.stepsAndSC_NameNotImplemented')
        })
        error = true
      }
      var schema = supplierChainSchema
      var Validator = require('jsonschema').Validator
      var v = new Validator()
      if (!error) {
        console.log('Valido mi fichero')
        var validado = v.validate(wrap_jsonFile, schema)
        console.log(validado)
        if (validado.valid) {
          // Si es valido inserto en elasticsearch en el indice correspondiente
          // this.result = jsonFile
          // Muestro el cuadro de dialogo
          // this.viewResultDialog = true
          // Si el JSON se valida correctamente. Debo comprobar que el indice exista en Elasticsearch
          console.log('Check supply chain')
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
                    var updatedSupplierChain = {
                      id: row._id,
                      name: row.name,
                      description: row.description,
                      creation: row.createdAt,
                      exportToIH_pending: false
                    }
                    supplierChainUpdate(row._id, updatedSupplierChain).then(response => {
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
                  var updatedSupplierChain = {
                    id: row._id,
                    name: row.name,
                    description: row.description,
                    creation: row.createdAt,
                    exportToIH_pending: false
                  }
                  supplierChainUpdate(row._id, updatedSupplierChain).then(response => {
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
