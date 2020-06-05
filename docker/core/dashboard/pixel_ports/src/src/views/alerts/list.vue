<template>
  <div class="app-container" :style="bgc">

    <div class="filter-container">
      <h2 level="Main Title">{{ $t('alerts.listOfAlerts') }}</h2>

      <el-input v-model="searchText" :placeholder="$t('alerts.searchAlert')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('models.search') }}
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        {{ $t('widget.headerButtonAdd') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="filteredByPagination"
      border
      fit
      style="width: 100%;"
      :empty-text="$t('alerts.emptyAlerts')"
    >
      <el-table-column :label="$t('alerts.alertTitle')" min-width="50px" prop="title" sortable />
      <el-table-column :label="$t('alerts.alertDescription')" min-width="100px" prop="description" sortable />
      <el-table-column :label="$t('alerts.alertType')" min-width="50px" prop="type" sortable />
      <el-table-column :label="$t('alerts.alertSuscriptions')" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-switch
            :value="row.subscribed"
            active-color="green"
            inactive-color="red"
            @change="handleSubscription(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>
<script>
import { alertFetchList, alertUpdate } from '@/api/alert'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on

export default {
  name: 'List',
  components: { Pagination },
  directives: { waves },
  props: {},
  data() {
    return {
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
      return this.list.filter(alert => alert.description.toLowerCase().includes(this.searchText.toLowerCase()) || alert.type.toLowerCase().includes(this.searchText.toLowerCase()))
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
  },
  mounted() {},
  methods: {
    getList() {
      this.listLoading = true
      alertFetchList()
        .then(response => {
          console.log('ALERTAS DE MONGODB')
          // console.log(response.data.all)
          // console.log(response.data.suscribed)
          this.list = []
          const listWithNoSubscription = response.data.all
          const subscribedIdList = response.data.suscribed.map(item => item._id)
          this.list = listWithNoSubscription.map(item => {
            if (subscribedIdList.some(subsId => subsId === item._id)) {
              item.subscribed = true
            } else {
              item.subscribed = false
            }
            return item
          })
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
      this.$message({
        message: 'A Form will be implemented to allow users to add new Alerts',
        // type: 'success',
        duration: 5000,
        showClose: true
      })
    },
    handleFilter() {
      // alert(event)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
