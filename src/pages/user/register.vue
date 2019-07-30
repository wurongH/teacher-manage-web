<template>
  <div class="register user-container">
    <v-form>
      <div class="form-item-list" slot="main">
        <div class="item" v-show="noe">
          <input type="text" @blur="validatePhone" :maxlength="11" placeholder="请输入需要注册的手机号" v-model="phone">
          <span class="error-msg">{{errorMsg.phone}}</span>
        </div>
        <div class="item" v-show="noe">
          <input type="text" @blur="validateCode" class="txt-code" placeholder="请输入验证码" v-model="code">
          <div class="code-view">
            <span class="error-msg-code">{{errorMsg.code}}</span>
            <span :class="['send-code', { disable: isDisable }]" @click="sendCodeSms" v-html="timerCodeMsg"></span>
          </div>
        </div>
        <div class="item" v-show="tow">
          <input type="password" @blur="passwordBlur" placeholder="请输入密码" v-model="password">
          <p class="pwd-rule">密码由字母或数字组成，不含特殊字符，至少设置5位</p>
          <span class="error-msg">{{errorMsg.password}}</span>
        </div>
        <div class="item" v-show="tow">
          <input type="password" @blur="validateCheckPass" placeholder="请再次输入密码" v-model="checkPass">
          <span class="error-msg">{{errorMsg.checkPass}}</span>
        </div>
        <div class="register-success" v-show="three">
          <span class="text">恭喜您，注册成功</span>
        </div>
        <p class="submit-btn" @click="submit">{{btnText}}</p>
      </div>
    </v-form>
  </div>
</template>

<script>
  import vForm from './form'
  import validateMixin from './validate'
  export default {
    name: 'register',
    data() {
      return {
      }
    },
    mixins: [ validateMixin ],
    created() {
      document.onkeydown = e =>{
        if(this.$route.name != 'register')
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
    components: {
      vForm
    },
    methods: {
      async submit(){
        if(this.noe){
          var status = this.validatePhone();
              status = this.validateCode();
          if(!status)
            return;
          const d = await this.post(this.$api.preliminarySubmitVerifyCode, {
            telephone: this.phone,
            smsVerifyCode: this.code,
            verifyCodeType: 1
          })
          if(d.code === 0){
            if(d.data === 3 || d.data === 1){
              this.errorMsg.code = '验证码错误';
            }else if(d.data === 2){
              this.errorMsg.code = '验证码已过期';
            }else{
              this.noe = false;
              this.tow = true;
              this.errorMsg.code = ''
            }
          }
          return;
        }
        if(this.tow){
          var status = this.validatePassword();
              status = this.validatePasswordRule();
              status = this.validateCheckPass();
          if(status)
            this.register();
          return;
        }
        if(this.three){
          const d = await this.post(this.$api.login, {
            pwd: this.password,
            uid: this.phone,
            uniqueCode: ''
          })
          if(d.code === 0){
            // this.$store.dispatch('setUserInfo', d.data)
            this.$common.setLocalStorage('userInfo', d.data)
            this.$router.push({ path: '/' })
          }
        }
      },
      async register(){
        const d = await this.post(this.$api.register, {
          pwd: this.password,
          uid: this.phone,
          smsVerifyCode: this.code,
          verifyCodeType: 1
        })
        if(d.code === 0){
          this.tow = false;
          this.three = true;
          this.btnText = '进入管理后台';
          // this.$router.push({ path: '/login' })
        }
      },
      passwordBlur(){
        this.validatePassword();
        this.validatePasswordRule();
      },
      getCode(){
        this.isDisable = true;
        let count = 59;
        for(let i = 0; i <= count; i++){
         setTimeout(() =>{
           if (count != 0) {
             this.timerCodeMsg =  `<em style="color: #0099ff">${count}s</em>后可重新发送`;
             count--;
           } else {
             this.isDisable = false;
             this.timerCodeMsg =  "发送验证码" ;
           }
         }, i * 1000)
        }
      },
      async sendCodeSms(){
        if(this.timerCodeMsg != '发送验证码'){
          return;
        }
        if(!this.validatePhone()){
          return;
        }
        const d = await this.post(this.$api.sendVerifyCode, {
          telephone: this.phone,
          templateCode: 'SMS_VERIFY_CODE',
          verifyCodeType: 1
        })
        if(d.code === 0){
          this.getCode();
          this.$message({
            message: '短信发生成功',
            type: 'success'
          });
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import './style';

  .submit-btn{
    margin-top: 56px;
  }

  .code-view{
    position: absolute;
    bottom: 0;
    right: 0;
    line-height: 47px;
    height: 47px;
    text-align: right;

    .send-code{
      color: #0099ff;
      font-size: 16px;
      cursor: pointer;

      &.disable{
        color: #999;
      }
    }
    .error-msg-code{
      padding-right: 10px;
      color: #ff3333;
      font-size: 16px;
    }
  }
  .pwd-rule{
    font-size: 14px;
    color: #ccc;
    position: absolute;
    left: 0;
    top: 15px;
  }
  .txt-code{
    padding-right: 250px !important;
  }
  .register-success{
    .text{
      line-height: 156px;
      font-size: 32px;
      color: #333;
    }
  }
</style>
