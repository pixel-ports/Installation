<template>
  <form-wizard shape="circle" color="#20a0ff" error-color="#ff4949" @on-complete="onComplete">
    <tab-content title="Personal details" icon="ti-user" :before-change="validateFirstStep">
      <el-form ref="ruleForm" :inline="true" :model="formInline" class="demo-form-inline" :rules="rules">
        <el-form-item label="Approved by" prop="user">
          <el-input v-model="formInline.user" placeholder="Approved by" />
        </el-form-item>
        <el-form-item label="Activity zone" prop="region">
          <el-select v-model="formInline.region" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>

    </tab-content>
    <tab-content title="Additional Info" icon="ti-settings">
      Second tab
    </tab-content>
    <tab-content title="Last step" icon="ti-check">
      Yuhuuu! This seems pretty damn simple
    </tab-content>

    <el-button slot="prev" type="primary">Back</el-button>
    <el-button slot="next" type="primary">Next</el-button>
    <el-button slot="finish" type="primary">Finish</el-button>
  </form-wizard>

</template>

<script>
// Vue.use(VueFormWizard)
export default {
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      rules: {
        user: [{
          required: true,
          message: 'Please input Activity name',
          trigger: 'blur'
        }, {
          min: 3,
          max: 5,
          message: 'Length should be 3 to 5',
          trigger: 'blur'
        }],
        region: [{
          required: true,
          message: 'Please select Activity zone',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    onComplete: function() {
      alert('Yay. Done!')
    },
    validateFirstStep() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          resolve(valid)
        })
      })
    }
  }
}
</script>
