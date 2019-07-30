<template>
  <div class="menu">
    <div class="logo"></div>
    <!-- <el-button @click="activeIndex = '404'">默认按钮</el-button></br>
    default-active值：{{activeIndex}} -->
    <el-menu
     :default-active="$store.state.menu.activeMenu.activeIndex"
     class="el-menu-vertical-demo"
     text-color="#606266"
     active-text-color="#409EFF"
     router>
      <template v-for="(item, index) in menu">
        <el-submenu v-if="item.child.length" :key="index" :index="index + ''">
          <template slot="title">
            <span :class="['icon', 'iconfont', item.icon]"></span>
            <span>{{item.title}}</span>
          </template>
          <el-menu-item v-for="(v, i) in item.child" :key="i" :index="v.path">{{v.title}}</el-menu-item>
        </el-submenu>
        <el-menu-item :index="item.path" v-else>
          <span :class="['icon', 'iconfont', item.icon]"></span>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </template>
   </el-menu>

   <p class="company-name">青创未来(福建)科技有限公司</p>
  </div>
</template>

<script>
  import menus from './menu'
  export default {
    name: 'vMenu',
    data () {
      return {
        menu: [],
        activeIndex: '404'
      }
    },
    watch: {
      '$route'(n) {
      },
    },
    created(){
      this.setMenu();
  	},
    methods: {
      async setMenu(){
        const dev = process.env.NODE_ENV == 'development'
        if (dev) {
          this.menu = menus;
          return
        }
        const d = await this.post(this.$api.listSubMenu, {
          parentCode: 'ZS_PARENT',
        })
        if(d.code === 0){
          d.data.map(v =>{
            var parent = { title: v.menuName, icon: v.menuIcon, path: v.menuUrl, child: [] };
            v.subMenuDto.map(d =>{
              parent.child.push({ title: d.menuName, path: d.menuUrl },)
            })
            this.menu.push(parent)
          })
        }
      },
      setActiveName(n) {
        var is = true;
        debugger
        this.menu.map(v =>{
          if(v.child.length){
            v.child.map(item =>{
              if(n.fullPath == item.path){
                this.activeName = item.path;
                is = false;
              }
            })
          }else{
            if(n.fullPath == v.path){
              this.activeName = v.path;
              is = false;
            }
          }
        })
        is && (this.activeName = '')
      },
    }
  }
</script>

<style scoped>
  .menu{
    height: 100%;
  }
  .el-menu{
    border-right-width: 0;
    z-index: 10
  }
  .company-name{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 64px;
    font-size: 14px;
    color: #768387;
    text-align: center;
  }
  .logo{
    height: 60px;
    background: url('./images/logo.png') no-repeat center center #3399ff;
  }
</style>
