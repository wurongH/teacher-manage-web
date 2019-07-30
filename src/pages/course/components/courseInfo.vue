<template>
  <div class="course-info">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
      <el-form-item label="课程名称" prop="coursesName">
        <el-input v-model="ruleForm.coursesName" placeholder="最多不超过30个字"></el-input>
      </el-form-item>
      <el-form-item label="关联班级" prop="classIds">
        <el-select v-model="ruleForm.classIds" multiple style="width: 100%" placeholder="一个班级可以关联一个或多个课程">
          <el-option
            v-for="(item, index) in classData"
            :key="index"
            :label="item.className"
            :value="item.id + ''">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程封面" prop="coursesCover">
        <div class="upload-file-view">
          <el-button size="small" type="primary">点击上传</el-button>
          <input type="file" ref="file" @change="imageLoad" accept="image/*" class="file" />
        </div>
        <i class="lazyimg" v-show="ruleForm.coursesCover !== ''" :style="`background-image: url('${ruleForm.coursesCover}')`"></i>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="4" v-model="ruleForm.remark" placeholder="请输入备注信息"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'courseInfo',
    props: {
      id: String,
      classIds: {
        type: Array,
        default () {
          return []
        }
      },
      classData: {
        type: Array,
        default () {
          return []
        }
      },
      coursesName: String,
    },
    data() {
      return {
        ruleForm: {
          coursesName: '',
          classIds: [],
          remark: '',
          coursesCover: '',
          coursesId: ''
        },
        rules: {
          coursesName: [
            { required: true, message: '班级名称不能为空', trigger: 'blur' },
            { min: 1, max: 30, message: '最多不超过30个字', trigger: 'blur' }
          ],
        }
      }
    },
    async created() {
      this.ruleForm.classIds = this.classIds;
      this.getCoursesInfo();
      console.log(this.coursesName);
    },
    methods: {
      async getCoursesInfo(){
        const d = await this.post(this.$api.course.getCoursesInfo, { coursesId: this.id })
        if(d.code === 0){
          this.ruleForm.coursesName = d.data.coursesName;
          this.ruleForm.remark = d.data.remark;
          this.ruleForm.coursesCover = d.data.coursesCover;
          this.ruleForm.coursesId = d.data.id;
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
          this.ruleForm.coursesCover = d.data.url;
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var ids = '';
            this.ruleForm.classIds.forEach(v =>{
              ids += `${v},`;
            })
            ids = ids.substring(0, ids.length - 1);
            const d = await this.post(this.$api.course.modifyCoursesInfo, {
              coursesId: this.id,
              coursesName: this.ruleForm.coursesName,
              classIds: ids,
              coursesCover: this.ruleForm.coursesCover,
              remark: this.ruleForm.remark
            })
            if(d.code === 0){
              this.$message({
                message: '编辑成功',
                type: 'success'
              });
              this.$emit('update:coursesName', this.ruleForm.coursesName);
              this.$emit('update:classIds', this.ruleForm.classIds);
            }
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .course-info{
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
