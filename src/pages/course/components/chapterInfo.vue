<template>
  <div class="chapter-info">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
      <el-form-item label="名称" prop="chapterName">
        <el-input v-model="ruleForm.chapterName" placeholder="最多不超过30个字"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="chapterCover">
        <div class="upload-file-view">
          <el-button size="small" type="primary">点击上传</el-button>
          <input type="file" ref="file" @change="imageLoad" accept="image/*" class="file" />
        </div>
        <i class="lazyimg" v-show="ruleForm.chapterCover !== ''" :style="`background-image: url('${ruleForm.chapterCover}')`"></i>
      </el-form-item>
      <el-form-item label="简介" prop="chapterIntroduction">
        <el-input type="textarea" :rows="4" v-model="ruleForm.chapterIntroduction" placeholder="请输入简介信息"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'chapterInfo',
    props: {
      id: String,
    },
    data() {
      return {
        classData: [],
        ruleForm: {
          chapterName: '',
          chapterIntroduction: '',
          chapterCover: '',
          id: ''
        },
        rules: {
          chapterName: [
            { required: true, message: '章节名称不能为空', trigger: 'blur' },
            { min: 1, max: 30, message: '最多不超过30个字', trigger: 'blur' }
          ],
        }
      }
    },
    async created() {
      this.getChapterInfo();
    },
    methods: {
      async getChapterInfo(){
        const d = await this.post(this.$api.course.getChapterInfo, { id: this.id })
        if(d.code === 0){
          this.ruleForm.chapterName = d.data.chapterName;
          this.ruleForm.chapterIntroduction = d.data.chapterIntroduction;
          this.ruleForm.chapterCover = d.data.chapterCover;
          this.ruleForm.id = d.data.id;
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
          this.ruleForm.chapterCover = d.data.url;
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const d = await this.post(this.$api.course.modifyChapterInfo, {
              id: this.ruleForm.id,
              chapterName: this.ruleForm.chapterName,
              chapterCover: this.ruleForm.chapterCover,
              chapterIntroduction: this.ruleForm.chapterIntroduction,
            })
            if(d.code === 0){
              this.$message({
                message: '编辑成功',
                type: 'success'
              });
              this.$store.dispatch('setClassCourseName', this.ruleForm.chapterName)
            }
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .chapter-info{
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
