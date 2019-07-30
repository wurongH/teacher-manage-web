<template>
  <div class="invite-code">
    <el-dialog title="班级二维码" :visible.sync="showValue" width="500px" custom-class="dialog">
      <div class="dialog-view">
        <p class="code-number">邀请码：{{inviteCode}}</p>
        <div class="code" ref="code"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import tableMixin from '@/mixins/table'
  import QRCode from '@/assets/js/qrcode';
  export default {
    name: 'inviteCode',
    props: {
      value: Boolean,
      inviteCode: String
    },
    watch: {
      value (val) {
        if(val){
          setTimeout(() => {
            this.$refs.code.innerHTML = '';
            var qrcode = new QRCode(this.$refs.code, {
                width : 255,//设置宽高
                height : 255,
                colorDark : "#000000",
                colorLight : "#ffffff",
            });
            qrcode.makeCode(this.inviteCode);
          },10)
        }
        this.showValue = val
      },
      showValue (val) {
        this.$emit('update:value', val);
      }
    },
    data() {
      return {
        showValue: false,
      }
    },
    created() {
    },
    mounted(){
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .code-number{
    font-size: 17px;
    color: #333;
    text-align: center;
  }
  .dialog-view{
    padding: 30px 0;
  }
  .code{
    margin: 40px auto 30px;
    width: 255px;
  }
</style>
