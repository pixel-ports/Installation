/* eslint-disable vue/no-side-effects-in-computed-properties */
<template>
  <div class="app-container" :style="bgc">

    <div class="filter-container">
      <h2 level="Main Title">{{ $t('alert.listOfAlerts') }}</h2>

      <el-input v-model="searchText" :placeholder="$t('alert.searchAlert')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('models.search') }}
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        {{ $t('alert.headerButtonAdd') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="filteredByPagination"
      border
      fit
      style="width: 100%;"
      :empty-text="$t('alert.emptyAlerts')"
    >
      <el-table-column :label="$t('alert.alertName')" min-width="50px" prop="name" sortable />
      <el-table-column :label="$t('alert.alertActions')" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="small" class="deleteBtn" @click="handleModifyStatus(row,'deleted')">
            <i class="el-icon-delete-solid">
              {{ $t('models.deleteModel') }}
            </i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-container>
        <el-header height="100px">
          <el-steps :active="active" finish-status="success" :align-center="true" style="margin-top: 20px">
            <el-step :title="$t('alert.dialogSource')" />
            <el-step :title="$t('alert.dialogConfigure')" />
          </el-steps>
        </el-header>

        <el-main>
          <el-row v-if="active == 0">

            <el-col :span="24">
              <el-row :gutter="20">
                <el-col v-for="(template,index) in formConfig" :key="index" :span="8">
                  <div @click="selectSource = template.source">
                    <el-card :header="template.title" :class="{'selected-card': selectSource == template.source}" shadow="hover" center>
                      {{ template.description }}
                    </el-card>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row v-if="active == 1">

            <el-row :gutter="20">
              <el-col :span="24">
                <el-form ref="dataForm" label-position="left" label-width="120px">
                  <el-form-builder :model="formValues" :config="getFormTypeTemplate(selectSource)" label-width="120px" @input="dataChanged" />
                </el-form>
              </el-col>
            </el-row>
          </el-row>
        </el-main>
      </el-container>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="active==0" @click="active=0">
          {{ $t('alert.buttonPrevius') }}
        </el-button>
        <el-button v-if="active==0" type="primary" :disabled=" active == 0 && !selectSource" @click="active=1">
          {{ $t('alert.buttonNext') }}
        </el-button>
        <el-button
          v-else
          type="primary"
          :disabled="selectSource == null "
          @click="createData()"
        >
          {{ $t('alert.buttonDone') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { alertUpdate } from '@/api/alert'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on
import { unFlatten } from '@/utils/common'
// eslint-disable-next-line no-unused-vars
import { alertFetchAll, alertCreate, alertDelete, fetchIndices, fetchMappingIndex } from '@/api/alert'
import { alertTemplateFetchList } from '@/api/alert-template'

export default {
  name: 'List',
  components: { Pagination },
  directives: { waves },
  props: {},
  data() {
    return {
      active: 0,
      selectSource: null,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogTitle: '',
      formValues: null,
      formValuesDefinition: null,
      formConfig: [],
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      },
      tableKey: 0,
      list: [],
      listLoading: true,
      searchText: '',
      listQuery: {
        page: 1,
        limit: 10
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      }
    }
  },
  computed: {
    filteredBySearchText() {
      return this.list.filter(alert => alert.name.toLowerCase().includes(this.searchText.toLowerCase()))
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
  created() {
    this.getList()
    this.getAlertTemplate()
  },
  mounted() {},
  methods: {
    createData() {
      console.log('-- DATOS 1 -')
      console.log(this.formValues)
      var values = unFlatten(this.formValues)
      console.log('-- DATOS 2 -')
      console.log(values)
      console.log('CREATE DATA')
      alertCreate(values, this.selectSource).then((data) => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        console.error(error)
      })
    },
    getList() {
      this.listLoading = true
      alertFetchAll()
        .then(response => {
          this.listLoading = false
          console.log('ALERTAS DE API ELASTALERT')
          // console.log(response.data.all)
          // console.log(response.data.suscribed)
          this.list = response.data
          // console.log(this.list)
        })
        .catch((error) => {
          console.log(error)
        })
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    handleSubscription(row) {
      const clicked = this.list.find(item => item._id === row._id)
      clicked.subscribed = !clicked.subscribed
      const updateIdList = this.list.filter(item => item.subscribed).map(item => item._id)
      const dataParam = { notifications: updateIdList }
      console.log(dataParam.notifications)
      alertUpdate(dataParam)
        .then(response => {
          console.log('SUBSCRIPTION UPDATED TO MONGODB')
        })
        .catch(error => console.log(error))
    },
    handleCreate() {
    //   alert('crear...')
      this.dialogFormVisible = true
    },
    handleFilter() {
      // alert(event)
    },
    getAlertTemplate() {
      alertTemplateFetchList().then(response => {
        this.formConfig = response.data
      })
    },
    getFormTypeTemplate(key) {
      var toReturn = null
      for (var i = 0; i < this.formConfig.length; i++) {
        if (this.formConfig[i].source === key) {
          toReturn = this.formConfig[i].template
        }
      }
      return toReturn
    },
    dataChanged(data) {
      this.formValues = data
      console.log(this.formValues)
      // this.formValuesDefinition = data.definition
      return null
    },
    handleModifyStatus(row, status) {
      switch (status) {
        case 'deleted':
          row.status = status
          this.handleDelete(row)
          break
      }
    },
    handleDelete(row) {
      alertDelete(row._id).then((data) => {
        this.dialogFormVisible = false
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(console.error)
    }
  }
}
</script>

<style lang="scss" scoped>
.selected-card{
  border: 1px solid #0dea4c;
}
.el-tag-white {
  color: white;
}

.el-card{
  min-height: 150px;
}

.mark-red {
  background-color: #ff3d3d;
  color: black;
}

.mark-green {
  background-color: rgb(158, 255, 67);
  color: black;
}

.el-col {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .scheduleBtn {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
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
</style>

