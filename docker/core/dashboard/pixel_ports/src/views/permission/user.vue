<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t('user.addUser') }}
    </el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="User Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="User email" width="220">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t('permission.editPermission') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t('permission.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit User':'New User'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="Username">
          <el-input v-model="user.username" placeholder="User username" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input
            v-model="user.email"
            type="text"
            placeholder="User email"
          />
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            v-model="user.password"
            type="password"
            :placeholder="placeholderPassword"
          />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="user.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="User Description"
          />
        </el-form-item>
        <el-form-item label="Roles">
          <el-select v-model="userRoles" multiple placeholder="Select roles">
            <el-option
              v-for="item in listRoles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import _ from 'lodash'
import { createUser, deleteUser, getUsers, updateUser, getRoles, getRolesUser, addRolesUser, deleteRolesUser } from '@/api/role'

const defaultRole = {
  id: '',
  username: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      user: Object.assign({}, defaultRole),
      routes: [],
      userList: [],
      userRoles: [],
      listRoles: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    },
    placeholderPassword() {
      return this.dialogType === 'new' ? 'Password' : 'New password. Leave empty to not change'
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getUsers()
    this.getRoles()
  },
  methods: {
    async getUsers() {
      const res = await getUsers()
      this.userList = res.data.users
    },
    async getRoles() {
      const res = await getRoles()
      this.listRoles = res.data.roles
    },
    handleAddRole() {
      this.user = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
      //  this.$refs.tree.setCheckedNodes([])
      }
      this.userRoles = []
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = null
      this.userRoles = []
      this.user = deepClone(scope.row)

      var userActual = await getRolesUser(this.user.id)
      this.userRoles = userActual.data.role_user_assignments.map(item => {
        return item.role_id
      })

      this.user.rolesOriginal = this.userRoles
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.id)
          this.userList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // this.user.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        const diff = (a, b) => _.differenceBy(a, b)
        const changedRoles = { remove: diff(this.user.rolesOriginal, this.userRoles), add: diff(this.userRoles, this.user.rolesOriginal) }

        await updateUser(this.user, this.user.id)
        for (let index = 0; index < this.userList.length; index++) {
          if (this.userList[index].id === this.user.id) {
            this.userList.splice(index, 1, Object.assign({}, this.user))
            break
          }
        }
        for (let i = 0; i < changedRoles.remove.length; i++) {
          const roleID = changedRoles.remove[i]
          await deleteRolesUser(this.user.id, roleID)
        }

        for (let i = 0; i < changedRoles.add.length; i++) {
          const roleID = changedRoles.add[i]
          await addRolesUser(this.user.id, roleID)
        }
      } else {
        const { data } = await createUser(this.user)
        this.user.email = data.user.email
        this.user.id = data.user.id
        this.userList.push(this.user)

        for (let i = 0; i < this.userRoles.length; i++) {
          const roleId = this.userRoles[i]
          await addRolesUser(this.user.id, roleId)
        }
      }

      const { email, username } = this.user
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>User Email: ${email}</div>
            <div>User Name: ${username}</div>
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
