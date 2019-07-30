<template>
  <div class="admin-index">
    <el-container class="view">
      <el-aside width="240px" style="background-color: rgb(255, 255, 255)">
        <v-menu></v-menu>
     </el-aside>
      <el-main>
        <v-header></v-header>
        <transition name="slide-fade-right" mode="out-in">
          <router-view classs="router-view" class="index-router-view"></router-view>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>
<style media="screen" lang="scss" scoped>
  .admin-index{
    height: 100%;
  }
  .view{
    height: 100%;
  }
  .el-aside{
    z-index: 99;
    box-shadow: 2px 0 2px #F0F0F0;
  }
  .el-main{
    padding: 60px 50px 50px 310px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .index-router-view{
    // z-index: 9;
  }

</style>
<script>
  import vMenu from 'components/menu';
  import vHeader from 'components/header';
  export default {
  	name: "admin-index",
  	data(){
  		return {
  			//Component Data
        example: true,
        foo: "bar"
  		}
  	},

    components: {
      vMenu,
      vHeader
    },
  	created(){

  	},

  	methods: {
  	}
  }
</script>
