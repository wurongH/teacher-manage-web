<template>
  <div class="person-info">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item label="真实姓名" prop="userName">
        <el-input v-model="ruleForm.userName" placeholder="最多不超过30个字"></el-input>
      </el-form-item>
      <el-form-item label="个人头像" prop="headIcon">
        <div class="upload-file-view">
          <el-button size="small" type="primary">点击上传</el-button>
          <input type="file" ref="file" @change="imageLoad" accept="image/*" class="file" />
        </div>
        <i class="lazyimg" v-show="ruleForm.headIcon !== '' && ruleForm.headIcon !== null" :style="`background-image: url('${ruleForm.headIcon}')`"></i>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="出生年月" prop="birthday">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birthday" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="ruleForm.gender" style="width: 100px" placeholder="请选择">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入电子邮箱"></el-input>
      </el-form-item>
      <el-form-item label="职称" prop="titleName">
        <el-input v-model="ruleForm.titleName" placeholder="请输入职称"></el-input>
      </el-form-item>
      <el-form-item label="教工号" prop="teacherNumber">
        <el-input v-model="ruleForm.teacherNumber" placeholder="请输入电子邮箱"></el-input>
      </el-form-item>
      <el-form-item label="学校" prop="universityName">
        <el-input v-model="ruleForm.universityName" placeholder="请输入学校"></el-input>
      </el-form-item>
      <el-form-item label="院系" prop="college">
        <el-input v-model="ruleForm.college" placeholder="请输入院系"></el-input>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input v-model="ruleForm.major" placeholder="请输入院系"></el-input>
      </el-form-item>
      <el-form-item label="个人介绍" prop="introduce">
        <el-input type="textarea" :rows="4" v-model="ruleForm.introduce" placeholder="请输入介绍信息"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    name: 'personInfo',
    data() {
      return {
        ruleForm: {
          userName: '',
          headIcon: '',
          birthday: '',
          gender: '',
          email: '',
          titleName: '',
          teacherNumber: '',
          universityName: '',
          college: '',
          major: '',
          introduce: ''
        },
        rules: {
          email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
        }
      }
    },
    created() {
      this.getTeacherInfo();
    },
    methods: {
      async getTeacherInfo(){
        const d = await this.post(this.$api.user.getTeacherInfo)
        if(d.code === 0){
          Object.keys(this.ruleForm).map(v =>{
            if(v == 'gender'){
              this.ruleForm[v] = d.data[v] == null ? '' : d.data[v] + '';
            }else if(v == 'birthday'){
              this.ruleForm[v] = d.data[v] == null ? '' : new Date(d.data[v])
            }else{
              this.ruleForm[v] = d.data[v]
            }
          });
          var headIcon = d.data.headIcon;
          d.data.headIcon = (headIcon == '' || headIcon == null) ? require('@/assets/images/default-avatar.jpg') : headIcon;
          this.$store.dispatch('setUserInfo', d.data);
        }
      },
      async imageLoad(e){
        var formData = new FormData();
        formData.append("multipartFile", e.target.files[0]);
        const d = await this.post2(this.$api.upload, formData)
        if(d.code === 0){
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          this.$refs.file.value = '';
          this.ruleForm.headIcon = d.data.url;
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var json = { ...this.ruleForm };
            json.birthday = Vue.filter('datetimeFormat')(this.ruleForm.birthday.getTime(), 'yyyy-MM-dd')
            const d = await this.post(this.$api.user.modifyTeacherInfo, json)
            if(d.code === 0){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.getTeacherInfo();
            }
          }
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  .person-info{
    margin-top: 15px;
  }
  .demo-ruleForm{
    width: 500px;
  }
  .upload-file-view{
    width: 80px;
    height: 32px;
    line-height: 32px;

    .el-button{
      z-index: 1;
    }

    .file{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      opacity: 0;
      cursor: pointer;
    }
  }
  .lazyimg{
    width: 100px;
    height: 100px;
    border-radius: 3px;
    margin-top: 15px;
  }
</style>
