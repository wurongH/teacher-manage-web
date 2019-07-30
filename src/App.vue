<template>
  <div id="app">
    <transition name="fade"  mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import vMenu from './components/menu';
export default {
  name: 'App',
  components: {
    vMenu
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="scss">
  @import './assets/css/common.scss';
  @import './assets/font/iconfont.css';
  .el-container{
    height: 100%;
  }
  .el-header{
    padding: 0 15px;width:100%;
    border-bottom: 1px solid #e6e6e6;
    position: fixed;
  }
  #app{
    height: 100%;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .demo-ruleForm .el-form-item__label{
    // color: red
  }
</style>
