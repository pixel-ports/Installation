<template>
  <div class="app-container" :style="bgc">

    <div class="filter-container">
      <h2>{{ $t('alerts.myAlerts') }}</h2>

      <el-input v-model="searchText" :placeholder="$t('alerts.searchAlert')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;border-color: #1890ff;color: #1890ff;backgroundColor: rgb(240,242,245);" icon="el-icon-search" @click="handleFilter">
        {{ $t('models.search') }}
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        {{ $t('widget.headerButtonAdd') }}
      </el-button> -->
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
      <el-table-column :label="$t('alerts.alertFecha')" min-width="180px" sortable>
        <template slot-scope="{row}">
          <el-badge value="new" class="redBadge" :hidden="oldAlert(row.createdAt)">
            <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column :label="$t('alerts.alertTitle')" min-width="50px" prop="notification.title" sortable />
      <el-table-column :label="$t('alerts.alertDescription')" min-width="100px" prop="notification.description" sortable />
      <!-- <el-table-column :label="$t('alerts.alertType')" min-width="50px" property="notification.type" /> -->
    </el-table>
    <pagination v-show="filteredBySearchTextLength>0" :total="filteredBySearchTextLength" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getMyAlerts" />

  </div>
</template>
<script>
import { alertFetchSubscriptionLog } from '@/api/alert'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'MyAlerts',
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
      myAlerts: [],
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
      return this.myAlerts.filter(alert => alert.notification.description.toLowerCase().includes(this.searchText.toLowerCase()) || alert.notification.type.toLowerCase().includes(this.searchText.toLowerCase()))
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
    this.getMyAlerts()
  },
  mounted() {},
  destroyed() {
    window.localStorage.setItem('lastVisitedStamp', Date.now())
  },
  methods: {
    getMyAlerts() {
      this.listLoading = true
      alertFetchSubscriptionLog()
        .then(response => {
          console.log(response.data)
          this.myAlerts = response.data
        })
        .catch(error => console.log(error))
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    // handleCreate() {
    //   alert('crear...')
    // },
    handleFilter() {
      this.$message({
        message: 'Buscar...',
        // type: 'success',
        duration: 5000,
        showClose: true
      })
    },
    oldAlert(rowCreatedAt) {
      const lastVisitTS = window.localStorage.getItem('lastVisitedStamp')
      const alertTS = Date.parse(rowCreatedAt)
      let hidden
      lastVisitTS === null ? hidden = false : hidden = alertTS < lastVisitTS
      return hidden
    }
  }
}
</script>

<style lang="scss" scoped>
.redBadge {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
