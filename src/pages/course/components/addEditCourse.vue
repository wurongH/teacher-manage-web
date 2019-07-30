<template>
  <div class="add-edit-course">
    <el-dialog :title="title" :visible.sync="showValue" width="500px" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="课程名称" prop="coursesName">
          <el-input v-model="ruleForm.coursesName" placeholder="最多不超过30个字"></el-input>
        </el-form-item>
        <el-form-item label="关联班级" prop="classIds">
          <el-select v-model="ruleForm.classIds" multiple style="width: 100%" placeholder="一个班级可以关联一个或多个课程">
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item.className"
              :value="item.id + ''">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级封面" prop="coursesCover">
          <div class="upload-file-view">
            <el-button size="small" type="primary">点击上传</el-button>
            <input ref="file" type="file" @change="imageLoad" accept="image/*" class="file" />
          </div>
          <i class="lazyimg" v-show="ruleForm.coursesCover !== ''" :style="`background-image: url('${ruleForm.coursesCover}')`"></i>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="4" v-model="ruleForm.remark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showValue = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    name: 'addEditCourse',
    props: {
      value: Boolean,
      title: String,
      data: {
        type: Object,
        default () {
          return {
          }
        }
      }
    },
    data() {
      return {
        classList: [],
        showValue: false,
        ruleForm: {
          coursesName: '',
          classIds: [],
          remark: '',
          coursesCover: '',
          //课程id 编辑的时候使用
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
    watch: {
      value (val) {
        if(val && this.title == '编辑课程'){
          var ids = []
          if(this.data.recClassDtoList){
            this.data.recClassDtoList.map(v =>{
              ids.push(v.id + '')
            })
          }
          this.ruleForm = {
            coursesName: this.data.coursesName,
            classIds: ids,
            remark: this.data.remark,
            coursesCover: this.data.coursesCover,
            coursesId: this.data.id
          }
        }
        this.showValue = val
      },
      showValue (val) {
        this.$emit('update:value', val);
      }
    },
    async created() {
      const d = await this.post(this.$api.schoolClass.listTcMyClass)
      if(d.code === 0){
        this.classList = d.data;
      }
    },
    methods: {
      async imageLoad(e){
        var formData = new FormData();
        formData.append('multipartFile', e.target.files[0]);
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
      closeDialog(){
        setTimeout(_ =>{
          Object.keys(this.ruleForm).map(v =>{
            this.ruleForm[v] = v === 'classIds' ? [] : '';
          });
        }, 300)
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var ids = '';
            this.ruleForm.classIds.forEach(v =>{
              ids += `${v},`;
            })
            ids = ids.substring(0, ids.length - 1);
            const d = await this.post(this.$api.course[this.title == '编辑课程' ? 'modifyCoursesInfo' : 'createCourses'], {
              coursesId: this.ruleForm.coursesId,
              coursesName: this.ruleForm.coursesName,
              classIds: ids,
              coursesCover: this.ruleForm.coursesCover,
              remark: this.ruleForm.remark
            })
            if(d.code === 0){
              this.$message({
                message: this.title == '编辑课程' ? '编辑成功' : '创建成功',
                type: 'success'
              });
              this.$emit('updata-modal', false)
              this.$emit('updata-data')
            }
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
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
