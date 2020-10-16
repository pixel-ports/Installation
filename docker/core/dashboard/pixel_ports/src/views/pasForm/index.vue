<template>
  <div class="app-container" :style="bgc">
    <el-row>
      <h1 class="headerView">{{ $t('common.resources') }}</h1>
    </el-row>
    <el-row class="filter-container">
      <!--<el-autocomplete v-model="nameFiltered" style="width: 300px;" class="filter-item" :fetch-suggestions="querySearch" :placeholder="$t('resources.fileName')" :trigger-on-focus="false" @select="handleSelect" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('resources.search') }}
      </el-button>-->
      <el-input v-model="searchText" :placeholder="$t('resources.fileName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('resources.search') }}
      </el-button>
      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="addResource">
        {{ $t('resources.addNewResource') }}
      </el-button>
    </el-row>
    <!-- Resources Table -->
    <el-row style="background:#fff;margin-bottom:3px;">
      <!--padding:16px;-->
      <el-table
        v-loading="listLoading"
        :data="filteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('resources.emptyTable')"
      >
        <el-table-column :label="$t('resources.fileName')" align="center" :sortable="true" sort-by="name">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.description')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.creation')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.elasticIndex')" align="center">
          <template slot-scope="{row}">
            <span>{{ buildIndexName(row.name) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resources.actions')" align="center" class-name="small-padding fixed-width" min-width="100">
          <template slot-scope="{row}">
            <el-button size="small" class="exportToIH" :disabled="!row.exportToIH_pending" @click="exportToIH(row)">
              {{ $t('common.btnExportToIH') }}
            </el-button>
            <span style="padding-left:10px" />
            <!--<router-link :to="{name:'Resources List', params: {model: row, id: row._id}}">-->
            <el-button size="small" class="editBtn" @click="gotoListOfItems(row, row._id)">
              <i class="el-icon-edit">
                {{ $t('common.btnEdit') }}
              </i>
            </el-button>
            <!--</router-link>-->
            <span style="padding-left:10px" />
            <el-button size="small" class="deleteBtn" @click="new_deleteRegister(row)">
              <i class="el-icon-delete-solid">
                {{ $t('common.btnDelete') }}
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="page" :limit.sync="limit" @pagination="getList" />

    <!-- dialog for Save File -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="60%" hide-overlay transition="dialog-bottom-transition" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="70px" style="margin-left:50px;">
        <el-row align="center">
          <el-col :span="24">
            <el-form-item :label-width="labelColumn" :label="$t('resources.name')" prop="name">
              <el-input ref="name" v-model="dataForm.name" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="24">
            <el-form-item :label-width="labelColumn" :label="$t('models.description')">
              <el-input v-model="dataForm.description" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="success" @click="addItem('dataForm')">
          {{ $t('common.confirm') }}
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
        <el-button type="success" @click="updateResourceStatus()">
          {{ $t('common.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import { resourceFetchList, resourceCreate, resourceDelete, resourceUpdate } from '@/api/resource'
import { existIndex, deleteIndex, createIndex, insertDocument } from '@/api/PAS_IH'
import { areaFilterByResource, areaDelete } from '@/api/area'
import { machineFilterByResource, machineDelete } from '@/api/machine'
import pixelConstants from '@/utils/constants' // import class for constants
import pixelCommon from '@/utils/common'
import waves from '@/directive/waves' // waves directive
import resourcesSchema from './schema/RESOURCES_schema.json'
import Pagination from '@/components/Pagination' // secondary package based on
export default {
  name: 'Resources',
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
      dialogTitle: '',
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
      rules: {
        name: [{ required: true, message: this.$t('resources.errFileNameRequired'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    filteredBySearchText() {
      return this.list.filter(resource => resource.name.toLowerCase().includes(this.searchText.toLowerCase()) || resource.description.toLowerCase().includes(this.searchText.toLowerCase()))
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
    updateResourceStatus() {
      this.viewResultDialog = false
      this.getList()
    },
    buildIndexName(resourceName) {
      var deleteSpaces = resourceName.split(' ').join('')
      return 'resource_' + deleteSpaces.toLowerCase()
    },
    gotoListOfItems(rowResource, idResource) {
      this.$router.push({ name: 'Resources List', params: { id: idResource }})
      // this.$router.push({ name: 'generic dashboard', params: { id: row._id }})
    },
    getList() {
      this.listLoading = true
      resourceFetchList(this.listQuery).then(response => {
        var data = response.data
        console.log(data)
        data.forEach(element => {
          const idResource = element._id
          areaFilterByResource(idResource).then(response => {
            var listArea = response.data
            element.areas = listArea
          })
          machineFilterByResource(idResource).then(response => {
            var listMachine = response.data
            element.machines = listMachine
          })
        })
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
      var results = queryString ? links.filter(pixelCommon.createFilter(queryString)) : links
      cb(pixelCommon.createRegister(results))
    },
    /* handleSelect(item) {
      console.log('HANDLE SELECT')
      console.log(item)
      this.listQuery.id = item.id
      this.listQuery.page = 1
      this.getListFiltered()
      this.nameFiltered = ''
      this.listQuery.id = undefined
    },*/
    getListFiltered() {
      this.listLoading = true
      var resource = []
      if (this.listQuery.id === 1) {
        resource.push({ id: 1, name: 'Resources_test1.json', description: 'Description 1', creation: 1583836858, exportToIH_pending: true })
      } else {
        resource.push({ id: 2, name: 'Resources_test2.json', description: 'Description 2', creation: 1583836858, exportToIH_pending: false })
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
    handleFilter_old() {
      this.listQuery.page = 1
      if (this.listQuery.id !== undefined) {
        this.getListFiltered()
        this.nameFiltered = ''
        this.listQuery.id = undefined
      } else {
        this.getList()
        this.nameFiltered = ''
        this.categoryFiltered = ''
      }
    },
    new_deleteRegister(resourceRow) {
      console.log(resourceRow)
      var indexName = this.buildIndexName(resourceRow.name)
      if (resourceRow.areas.length > 0 || resourceRow.machines.length > 0) {
        this.$message({
          type: pixelConstants.ERROR_MESSAGE_TYPE,
          message: this.$t('common.deleteBeforeEntitiesRelated')
        })
      } else {
        resourceDelete(resourceRow._id)
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
    deleteRegister(resourceRow) {
      console.log(resourceRow)
      var indexName = this.buildIndexName(resourceRow.name)
      if (resourceRow.areas.length > 0 || resourceRow.machines.length > 0) {
        this.$confirm(this.$t('common.resourceWithEntities'), this.$t('common.deleteResource'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: pixelConstants.WARNING_MESSAGE_TYPE
        }).then(async() => {
          resourceRow.areas.forEach(area => {
            const id = area._id
            areaDelete(id)
          })
          resourceRow.machines.forEach(machine => {
            const id = machine._id
            machineDelete(id)
          })
          resourceDelete(resourceRow._id)
          this.getList()
          this.$message({
            type: pixelConstants.SUCCESS_MESSAGE_TYPE,
            message: this.$t('common.deleteSucced')
          })
          deleteIndex(indexName).then(response => {
            console.log('Indice borrado')
            console.log(response)
          })
        }).catch(err => { console.error(err) })
      } else {
        this.$confirm(this.$t('common.removeResource'), this.$t('common.deleteResource'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: pixelConstants.WARNING_MESSAGE_TYPE
        }).then(async() => {
          resourceDelete(resourceRow._id)
          this.getList()
          this.$message({
            type: pixelConstants.SUCCESS_MESSAGE_TYPE,
            message: this.$t('common.deleteSucced')
          })
          deleteIndex(indexName).then(response => {
            console.log('Indice borrado')
            console.log(response)
          })
        }).catch(err => { console.error(err) })
      }
    },
    exportToIH(row) {
      // console.log(row)
      var indexName = this.buildIndexName(row.name)
      var jsonFile = {
        'areas': [],
        'machines': [],
        'others': [{}]
      }
      row.areas.forEach(area => {
        var itemArea = {
          'ID': area.idArea,
          'label': area.label,
          'type': area.type,
          'owner': area.owner,
          'terminal': area.terminal
        }
        jsonFile.areas.push(itemArea)
      })
      row.machines.forEach(machine => {
        var itemMachine = {
          'ID': machine.idMachine,
          // 'machine.idMachine': {
          'label': machine.label,
          'type': machine.type,
          'group': [machine.group],
          'owner': machine.owner,
          'shift_ID': machine.shiftID,
          'throughput': {
            'Value': machine.throughput.value,
            'Unit': machine.throughput.unit
          },
          'consumptions': []
          // }
        }
        machine.consumptions.forEach(consumption => {
          var consumptionItem = {
            'nature': consumption.nature,
            'value': consumption.value,
            'unit': consumption.unit
          }
          itemMachine.consumptions.push(consumptionItem)
        })
        jsonFile.machines.push(itemMachine)
      })
      console.log(jsonFile)
      var error = false
      if (jsonFile.areas.length > 0 && jsonFile.machines.length > 0) {
        /* this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.functionalityNotImplemented')
        }) */
        error = false
      } else if (jsonFile.areas.length === 0 && jsonFile.machines.length > 0) {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.areasNotImplemented')
        })
        error = true
      } else if (jsonFile.machines.length === 0 && jsonFile.areas.length > 0) {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.machinesNotImplemented')
        })
        error = true
      } else {
        this.$message({
          type: pixelConstants.WARNING_MESSAGE_TYPE,
          message: this.$t('common.machinesAndAreaNotImplemented')
        })
        error = true
      }
      var schema = resourcesSchema
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
          console.log('Check resources')
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
                    var updatedResource = {
                      id: row._id,
                      name: row.name,
                      description: row.description,
                      creation: row.createdAt,
                      exportToIH_pending: false
                    }
                    resourceUpdate(row._id, updatedResource).then(response => {
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
                  var updatedResource = {
                    id: row._id,
                    name: row.name,
                    description: row.description,
                    creation: row.createdAt,
                    exportToIH_pending: false
                  }
                  resourceUpdate(row._id, updatedResource).then(response => {
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
    addResource() {
      this.resetdataForm()
      this.dialogTitle = this.$t('resources.createResource')
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.name.focus()// Put focus over the first input control
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
          console.log('Create resource')
          console.log(this.dataForm)
          resourceCreate(this.dataForm).then(response => {
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
