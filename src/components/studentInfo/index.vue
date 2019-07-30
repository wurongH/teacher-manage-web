<template>
  <div class="student-info">
    <div class="main-view mt">
      <div class="el-menu-item-view">
        <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">基本信息</el-menu-item>
        </el-menu>
        <!-- <div class="btn-list">
          <el-button @click="getStudentInfo">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </div> -->
      </div>
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="真实姓名" prop="userName">
          <el-input v-model="ruleForm.userName" :disabled="true" placeholder="最多不超过30个字"></el-input>
        </el-form-item>
        <el-form-item label="个人头像" prop="headIcon">
          <!-- <div class="upload-file-view">
            <el-button size="small" type="primary">点击上传</el-button>
            <input type="file" ref="file" @change="imageLoad" accept="image/*" class="file" />
          </div> -->
          <i class="lazyimg" v-show="ruleForm.headIcon !== '' && ruleForm.headIcon !== null" :style="`background-image: url('${ruleForm.headIcon}')`"></i>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出生年月" prop="birthday">
              <el-date-picker type="date" :disabled="true" placeholder="选择日期" v-model="ruleForm.birthday" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="ruleForm.gender" :disabled="true" style="width: 100px" placeholder="请选择">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="电子邮箱" prop="email">
          <el-input :disabled="true" v-model="ruleForm.email" placeholder="请输入电子邮箱"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="studentNumber">
          <el-input :disabled="true" v-model="ruleForm.studentNumber" placeholder="请输入职称"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="universityName">
          <el-input :disabled="true" v-model="ruleForm.universityName" placeholder="请输入学校"></el-input>
        </el-form-item>
        <el-form-item label="院系" prop="college">
          <el-input :disabled="true" v-model="ruleForm.college" placeholder="请输入院系"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input :disabled="true" v-model="ruleForm.major" placeholder="请输入院系"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-select :disabled="true" v-model="ruleForm.grade" style="width: 100px" placeholder="请选择">
                <el-option
                  v-for="(item, index) in enrolYearArr"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级" prop="className">
              <el-select :disabled="true" v-model="ruleForm.className" style="width: 100px" placeholder="请选择">
                <el-option
                  v-for="(item, index) in 20"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    name: 'studentInfo',
    props: {
      id: String,
    },
    data() {
      var thisYear = new Date().getFullYear();
      for(var enrolYearArr = [], i = 2010; i <= thisYear; i++){
        enrolYearArr.push(`${i}`);
      }
      return {
        //入学年份
        enrolYearArr,
        ruleForm: {
          userName: '',
          headIcon: '',
          birthday: '',
          gender: '',
          email: '',
          studentNumber: '',
          universityName: '',
          college: '',
          major: '',
          grade: '',
          className: ''
        },
        rules: {
          email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
        }
      }
    },
    created() {
      this.getStudentInfo();
    },
    methods: {
      async getStudentInfo(){
        const d = await this.post(this.$api.user.getStudentInfo, {
          studentId: this.id
        })
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
            const d = await this.post(this.$api.user.modifyStudentInfo, json)
            if(d.code === 0){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
            }
          }
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  .el-menu-item-view{
    margin-bottom: 15px;
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
