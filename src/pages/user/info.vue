<template>
  <div class="user-info">
    <div class="main-view mt">
      <div class="el-menu-item-view">
        <el-menu :default-active="activeIndex" @select="selectMenu" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">个人信息</el-menu-item>
          <el-menu-item index="2">账号信息</el-menu-item>
        </el-menu>
        <div class="btn-list">
          <template v-if="activeIndex == 1">
            <el-button @click="_ =>{ this.$refs.personInfo.getTeacherInfo() }">重置</el-button>
            <el-button type="primary" @click="_ =>{ this.$refs.personInfo.submitForm('ruleForm') }">保存</el-button>
          </template>
          <template v-if="activeIndex == 2">
            <el-button type="danger" @click="loginOut">退出账号</el-button>
          </template>
        </div>
      </div>
      <component :is="components[this.activeIndex - 1]" :ref="components[this.activeIndex - 1]"></component>
    </div>
  </div>
</template>

<script>
  import personInfo from './components/personInfo';
  import accountInfo from './components/accountInfo'
  export default {
    name: 'userInfo',
    data() {
      return {
        components: [ 'personInfo', 'accountInfo' ],

        activeIndex: '1',
      }
    },
    created() {
    },
    components: {
      personInfo,
      accountInfo,
    },
    methods: {
      selectMenu(index){
        this.activeIndex = index;
      },
      loginOut(name){
        this.$confirm('是否退出当前账号?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$fetch.loginOut();
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
