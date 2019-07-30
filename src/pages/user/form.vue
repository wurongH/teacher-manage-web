<template>
  <div class="form">
    <h1>教师管理系统</h1>
    <div class="from-view">
      <i class="i-logo"></i>
      <slot name="main"></slot>
      <div class="third-party-login">
        <a href="#" class="wx"></a>
        <a href="#" class="qq"></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-form',
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .form{
    width: 502px;
    margin: 90px auto;

    h1{
      display: block;
      text-align: center;
      line-height: 126px;
      color: #fff;
      font-size: 36px;
    }
    .from-view{
      box-shadow: 0 0 20px rgba(0, 0, 0, .5);
      border-radius: 4px;
      background: #fff;
      height: auto;
      padding: 0 56px;
      overflow: hidden;
    }
  }
  .i-logo{
    display: block;
    margin: 62px auto 0;
    background: url('./images/logo.png');
    width: 72px;
    height: 71px;
  }
  .form-item-list{

    .item{
      height: 78px;
      padding-top: 30px;
      width: 100%;
      border-bottom: 1px solid #eee;

      input{
        float: left;
        width: 100%;
        height: 47px;
        font-size: 16px;
        // color: #999;
        padding-right: 120px;
        background: none;
      }
      .pwd-rule{
        font-size: 14px;
        color: #ccc;
        position: absolute;
        left: 0;
        top: 15px;
      }
      .error-msg{
        position: absolute;
        right: 0;
        bottom: 0;
        line-height: 47px;
        height: 47px;
        color: #ff3333;
        font-size: 16px;
      }
    }
    .register-success{
      height: 156px;
      background: url('./images/success.png') no-repeat 0 center;
      padding-left: 68px;
      width: 325px;
      margin: 0 auto;

      .text{
        line-height: 156px;
        font-size: 32px;
        color: #333;
      }
    }
    .no-user-pwd{
      height: 55px;
      line-height: 55px;
      font-size: 16px;

      .no-user{
        color: #0099ff;
        float: left;
      }
      .no-pwd{
        color: #999;
        float: right;
      }
      a:hover{
        text-decoration: underline;
      }
    }

    .submit-btn{
      width: 100%;
      height: 55px;
      text-align: center;
      line-height: 55px;
      border-radius: 4px;
      background: #0099ff;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
    }
  }
  .third-party-login{
    height: 45px;
    width: 190px;
    margin: 36px auto 45px;

    a{
      width: 45px;
      height: 45px;

      &.wx{
        float: left;
        background: url('./images/wx.png');
      }
      &.qq{
        float: right;
        background: url('./images/qq.png');
      }
    }
  }
</style>
