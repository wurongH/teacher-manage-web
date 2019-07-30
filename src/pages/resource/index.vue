<template>
  <div class="resource">
    <div class="main-view mt">
      <div class="el-menu-item-view">
        <el-menu :default-active="activeIndex" @select="selectMenu" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">公共库</el-menu-item>
          <el-menu-item index="2">个人库</el-menu-item>
        </el-menu>
        <div class="btn-list">
          <el-button>新建教学资源</el-button>
          <el-button>导入教学资源</el-button>
        </div>
      </div>
      <!-- <component :is="components[this.activeIndex - 1]" :ref="components[this.activeIndex - 1]"></component> -->
    </div>
  </div>
</template>

<script>
  // import personInfo from './components/personInfo';
  // import accountInfo from './components/accountInfo'
  export default {
    name: 'resource',
    data() {
      return {
        // components: [ 'personInfo', 'accountInfo' ],

        activeIndex: '1',
      }
    },
    created() {
    },
    components: {
      // personInfo,
      // accountInfo,
    },
    methods: {
      selectMenu(index){
        this.activeIndex = index;
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
