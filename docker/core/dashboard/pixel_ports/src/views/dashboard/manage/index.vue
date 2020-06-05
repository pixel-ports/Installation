<template>
  <div class="app-container" :style="bgc">
    <div class="filter-container">
      <el-input v-model="searchText" :placeholder="$t('dashboard.searchDashboard')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('models.search') }}
      </el-button>

      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-plus" @click="handleCreate">
        {{ $t('widget.headerButtonAdd') }}
      </el-button>
    </div>
    <el-row style="background:#fff;margin-bottom:30px;">
      <el-table
        v-loading="listLoading"
        :data="filteredByPagination"
        border
        fit
        style="width: 100%;"
        :empty-text="$t('dashboard.emptyDashboards')"
      >
        <el-table-column :label="$t('widget.listTitle')" align="center" :sortable="true" sort-by="title">
          <template slot-scope="{row}">
            <span class="link-type" @click="viewDashboard(row)">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('widget.listDescription')" align="center">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('widget.listActions')" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="small" class="editBtn" @click="handleModifyStatus(row,'edit')">
              <i class="el-icon-edit">
                {{ $t('widget.buttonEdit') }}
              </i>
            </el-button>
            <span style="padding-left:10px" />
            <el-button size="small" class="deleteBtn" @click="handleModifyStatus(row,'deleted')">
              <i class="el-icon-delete-solid">
                {{ $t('widget.buttonDelete') }}
              </i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="paginationParameters.page" :limit.sync="paginationParameters.limit" @pagination="getList" />

  </div>
</template>
<script>
import { dashboardFetchList, dashboardDelete, dashboardGet } from '@/api/dashboard'
import pixelConstants from '@/utils/constants' // import class for constants
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on

export default {
  name: 'DashboardTable',
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
      list: [],
      listLoading: true,
      searchText: '',
      paginationParameters: {
        page: 1,
        limit: 5
      },
      listQuery: {
        id: undefined,
        name: undefined
      },
      total: 0,
      links: [], // need for autocomplete
      nameFiltered: ''
    }
  },
  computed: {
    filteredBySearchText() {
      return this.list.filter(dashboard => dashboard.title.toLowerCase().includes(this.searchText.toLowerCase()) || dashboard.description.toLowerCase().includes(this.searchText.toLowerCase()))
    },
    filteredBySearchTextLength() {
      return this.filteredBySearchText.length
    },
    filteredByPagination() {
      const page = this.paginationParameters.page
      const limit = this.paginationParameters.limit

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
    getList() {
      this.listLoading = true
      dashboardFetchList(this.listQuery).then(response => {
        console.log('DASHBOARDS DE MONGODB')
        console.log(response.data)
        this.list = response.data
        this.total = response.data.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {

    },
    handleFilter_old() {
      Object.keys(this.listQuery).forEach(key => {
        if (!this.listQuery[key]) {
          this.listQuery[key] = null
        }
      })
      this.getList()
    },
    handleModifyStatus(row, status) {
      switch (status) {
        case 'edit':
          this.handleEdit(row)
          break
        case 'deleted':
          this.handleDelete(row)
          break
        /* case 'publish':
          this.handlePublish(row, true)
          break
        case 'unpublish':
          this.handlePublish(row, false)
          break */
      }
    },
    handleCreate() {
      this.$store.commit('setisEditable', true)
      this.$store.commit('setResources', [])
      this.$store.commit('setisNewDashboard', true)
      this.$router.push({ name: 'new dashboard' })
    },
    viewDashboard(row) {
      this.$store.commit('setisEditable', false)
      var idDashboard = row._id
      this.$store.commit('setisNewDashboard', false)
      dashboardGet(idDashboard).then(response => {
        console.log('GET DASHBOARD')
        console.log(response.data.definition.dashboard)
        this.$store.commit('setResources', response.data.definition.dashboard)
        this.$store.commit('setTitleDashboard', response.data.title)
        this.$store.commit('setCurrentDashboard', response.data)
      }).catch(() => {
        console.log('Error')
      })
      this.$router.push({ name: 'generic dashboard', params: { id: row._id }})
    },
    handleEdit(row) {
      // console.log(row)
      this.$store.commit('setisEditable', true)
      var idDashboard = row._id
      this.$store.commit('setisNewDashboard', false)
      dashboardGet(idDashboard).then(response => {
        console.log('GET DASHBOARD')
        console.log(response.data.definition.dashboard)
        this.$store.commit('setResources', response.data.definition.dashboard)
        this.$store.commit('setTitleDashboard', response.data.title)
        this.$store.commit('setCurrentDashboard', response.data)
      }).catch(() => {
        console.log('Error')
      })
      this.$router.push({ name: 'generic dashboard', params: { id: row._id }})
    },
    handleDelete(row) {
      console.log(row)
      this.$confirm(this.$t('common.removeModel'), this.$t('common.deleteModel'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: pixelConstants.WARNING_MESSAGE_TYPE
      }).then(async() => {
        dashboardDelete(row._id)
        this.getList()
        this.$message({
          type: pixelConstants.SUCCESS_MESSAGE_TYPE,
          message: this.$t('common.deleteSucced')
        })
      }).catch(err => { console.error(err) })
      /* dashboardDelete(row._id).then((data) => {
        this.dialogFormVisible = false
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(console.error) */
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
</style>
