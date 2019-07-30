const form = {
  data () {
    return {
      timerCodeMsg: '发送验证码',
      phone: '',
      code: '',
      password: '',
      checkPass: '',

      //是否正在发送验证码
      isDisable: false,

      errorMsg: {
        phone: '',
        code: '',
        password: '',
        checkPass: '',
      },

      //第一步
      noe: true,
      //第二步
      tow: false,
      //第三步
      three: false,
      btnText: '下一步'
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    validatePhone(){
      if (this.phone === '') {
        this.errorMsg.phone = '请输入手机号';
        return false;
      }
      if(!(/^1[34578]\d{9}$/.test(this.phone))){
        this.errorMsg.phone = '手机格式错误';
        return false
      }
      this.errorMsg.phone = '';
      return true;
    },
    validatePassword(){
      if (this.password === '') {
        this.errorMsg.password = '请输入密码';
        return false;
      }
      if (this.password.length < 6) {
        this.errorMsg.password = '密码长度至少6位数';
        return false;
      }
      this.errorMsg.password = '';
      return true;
    },
    validatePasswordRule(){
      var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
          pwdArr = this.password.split('');
      if(!pwdArr.length){
        return false;
      }
      for(var i = 0; i < pwdArr.length; i++){
        if(str.indexOf(pwdArr[i]) < 0){
          this.errorMsg.password = '密码格式错误';
          return false;
          break;
        }
      }
      return true;
    },
    validateCode(){
      if (this.code === '') {
        this.errorMsg.code = '请输入验证码';
        return false;
      }
      this.errorMsg.code = '';
      return true;
    },
    validateCheckPass(){
      if (this.checkPass === '') {
        this.errorMsg.checkPass = '请再次输入密码';
        return false;
      }
      if(this.password !== this.checkPass){
        this.errorMsg.checkPass = '两次输入的密码不一致';
        return false;
      }
      this.errorMsg.checkPass = '';
      return true;
    },
  }
}


export default form
