<template>
  <div class="login user-container">
    <v-form>
      <div class="form-item-list" slot="main">
        <div class="item">
          <input type="text" @blur="validatePhone" :maxlength="11" placeholder="请输入手机号码" v-model="phone">
          <span class="error-msg">{{errorMsg.phone}}</span>
        </div>
        <div class="item">
          <input type="password" @blur="validatePassword" placeholder="请输入密码" v-model="password">
          <span class="error-msg">{{errorMsg.password}}</span>
        </div>
        <div class="no-user-pwd">
          <router-link class="no-user" :to="{ name: 'register' }">没有账号?</router-link>
          <router-link class="no-pwd" :to="{ name: 'updatapwd' }">忘记密码?</router-link>
        </div>
        <p class="submit-btn" @click="submit">登录</p>
      </div>
    </v-form>
  </div>
</template>

<script>
  import vForm from './form'
  import validateMixin from './validate'
  export default {
    name: 'login',
    data() {
      return {
      }
    },
    components: {
      vForm
    },
    mixins: [ validateMixin ],
    created() {
      document.onkeydown = e =>{
        if(this.$route.name != 'login')
          return;
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
          this.submit();
          return false;
        }
        return true;
      };
    },
    methods: {
      async submit(){
        var status = this.validatePhone();
            status = this.validatePassword();
        if(!status)
          return;
        const d = await this.post(this.$api.login, {
          pwd: this.password,
          uid: this.phone,
          uniqueCode: ''
        })
        if(d.code === 0){
          this.$message({
            message: '登录成功',
            type: 'success'
          });
          this.$common.setLocalStorage('userInfo', d.data)
          this.$router.push({ path: '/' })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import './style';

  .submit-btn{
    margin-top: 12px;
  }
</style>
