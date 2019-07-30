<template>
  <div class="bindphone user-container">
    <v-form>
      <div class="form-item-list" slot="main">
        <div class="item" v-show="noe">
          <input type="text" @blur="validatePhone" :maxlength="11" placeholder="请输入需要绑定的手机号" v-model="phone">
          <p class="pwd-rule">首次登录请先绑定手机号</p>
          <span class="error-msg">{{errorMsg.phone}}</span>
        </div>
        <div class="item" v-show="noe">
          <input type="text" @blur="validateCode" class="txt-code" placeholder="请输入验证码" v-model="code">
          <div class="code-view">
            <span class="error-msg-code">{{errorMsg.code}}</span>
            <span :class="['send-code', { disable: isDisable }]" @click="sendCodeSms" v-html="timerCodeMsg"></span>
          </div>
        </div>
        <div class="register-success" v-show="tow">
          <div class="bind-phone-info">
            <p>已成功绑定手机号</p>
            <em>130****2201</em>
          </div>
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
    name: 'bindphone',
    data() {
      return {
      }
    },
    mixins: [ validateMixin ],
    created() {
      document.onkeydown = e =>{
        if(this.$route.name != 'bindphone')
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
              this.errorMsg.code = '';
              this.bindPhone();
            }
          }
          return;
        }
        if(this.tow){
          //执行登录操作
          this.$router.push({ path: '/' })
        }
      },
      async bindPhone(){
        const d = await this.post(this.$api.bindPhone, {
          phone: this.phone,
          openId: '',
          smsVerifyCode: this.code,
        })
        if(d.code === 0){
          this.noe = false;
          this.tow = true;
          this.btnText = '进入管理后台';
          // this.$router.push({ path: '/login' })
        }
      },
      getCode(){
        this.isDisable = true;
        let count = 59;
        this.isGetCode = true
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
          verifyCodeType: 4
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
  .txt-code{
    padding-right: 250px !important;
  }

  .bind-phone-info{
    padding-top: 48px;

    p{
      font-size: 20px;
      color: #999;
    }
    em{
      font-size: 32px;
      color: #333;
    }
  }
</style>
