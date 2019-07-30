<template>
  <div class="vheader">
    <div class="header-container">
      <el-breadcrumb separator="/">
        <template v-for="(item, index) in $store.state.menu.activeMenu.breadcrumbArr">
          <el-breadcrumb-item v-if="item.path" :to="item.path">{{item.text}}</el-breadcrumb-item>
          <el-breadcrumb-item v-else>{{item.text}}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>

      <div class="right-view">
        <div class="user-info" @click.stop="isShowOperating = !isShowOperating">
          <i class="lazyimg" :style="`background-image: url('${$store.state.userInfo.data.headIcon}')`"></i>
          <span>{{$store.state.userInfo.data.userName}}</span>
        </div>
        <div class="badge">
          <span>10</span>
        </div>
        <div class="search">
          <input type="text" placeholder="搜索所需功能" />
          <i class="i-search"></i>
        </div>
      </div>
      <transition name="slide-fade-top" mode="out-in">
        <div class="operating" v-show="isShowOperating">
          <div class="info" @click="$router.push({ path: '/userInfo' }), isShowOperating = false">个人资料</div>
          <div class="out" @click="$fetch.loginOut">退出登录</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vheader',
  data () {
    return {
      isShowOperating: false,
      userInfo: {
        userName: '',
        headIcon: ''
      }
    }
  },
  mounted(){
    document.onclick = () =>{
      this.isShowOperating && (this.isShowOperating = false);
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo(){
      const d = await this.post(this.$api.user.getTeacherInfo)
      if(d.code === 0){
        var headIcon = d.data.headIcon;
        d.data.headIcon = (headIcon == '' || headIcon == null) ? require('@/assets/images/default-avatar.jpg') : headIcon;
        this.$store.dispatch('setUserInfo', d.data);
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .vheader{
    height: 60px;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding-left: 240px;
    z-index: 10;

    .header-container{
      box-shadow: 0px 2px 2px #F0F0F0;
      height: inherit;
      padding: 10px 20px;
      width: 100%;
      background: #fff;
      color: #808080;
      font-size: 16px;
      line-height: 40px;

      .el-breadcrumb{
        line-height: 40px;
        float: left;
      }

      .right-view{
        float: right;
        height: 100%;

        .search{
          float: right;
          width: 360px;
          height: 100%;
          background: #eeeff0;
          border-radius: 20px;
          padding-left: 28px;

          input{
            background: none;
            width: 282px;
            height: 100%;
            float: left;
            font-size: 14px;
          }
          .i-search{
            float: right;
            width: 50px;
            height: 100%;
            background: url('~@/assets/images/search.png') no-repeat center center;
            cursor: pointer;
          }
        }
        .badge{
          width: 26px;
          height: 100%;
          background: url('./images/1.png') no-repeat center center;
          float: right;
          margin-left: 50px;
          cursor: pointer;

          span{
            background-color: #f56c6c;
            border-radius: 10px;
            color: #fff;
            display: inline-block;
            font-size: 12px;
            height: 18px;
            line-height: 18px;
            padding: 0 6px;
            text-align: center;
            white-space: nowrap;
            border: 1px solid #fff;
            position: absolute;
            left: 20px;
            top: 0;
          }
        }
        .user-info{
          float: right;
          height: 100%;
          margin-left: 50px;
          cursor: pointer;

          i{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            float: left;
          }
          span{
            color: #606266;
            font-size: 14px;
            padding: 0 20px 0 10px;
            background: url('./images/2.png') right center no-repeat
          }
        }
      }
      .user-phone{
        float: right;
      }
    }
  }

  .operating{
    border-radius: 3px;
    width: 152px;
    height: 108px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    position: absolute;
    right: 30px;
    bottom: -122px;
    background: #fff;
    z-index: 999;
    padding: 0 10px;

    &:after{
      content: '';
      position: absolute;
      right: 35px;
      top: -6px;
      width: 14px;
      height: 6px;
      background-image: url('~@/assets/images/triangle.png');
    }
    div{
      height: 54px;
      line-height: 54px;
      font-size: 14px;
      color: #333;
      padding-left: 54px;
      cursor: pointer;

      &.info{
        background: url('./images/3.png') no-repeat 28px center;
        border-bottom: 1px solid #eee;
      }
      &.out{
        background: url('./images/4.png') no-repeat 28px center;
      }
    }
  }

  .slide-fade-top-enter-active,
  .slide-fade-top-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-top-enter,
  .slide-fade-top-leave-active {
    transform: translateY(10px);
    opacity: 0;
  }
</style>
