<template>
  <div class="add-edit-class">
    <el-dialog :title="title" :visible.sync="showValue" width="500px" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="ruleForm.className" placeholder="最多不超过30个字"></el-input>
        </el-form-item>
        <el-form-item label="所学课程" prop="coursesIds">
          <el-select v-model="ruleForm.coursesIds" multiple style="width: 100%" placeholder="一个班级可以关联一个或多个课程">
            <el-option
              v-for="(item, index) in courseData"
              :key="index"
              :label="item.coursesName"
              :value="item.id + ''">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属院校" prop="universityName">
          <el-input v-model="ruleForm.universityName" placeholder="输入该班级隶属的院校名称"></el-input>
        </el-form-item>
        <el-form-item label="所属院系" prop="collegeName">
          <el-input v-model="ruleForm.collegeName" placeholder="输入该班级所在的学院或系名称"></el-input>
        </el-form-item>
        <el-form-item label="所属专业" prop="major">
          <el-input v-model="ruleForm.major" placeholder="输入该班级所属的专业名称"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年级" prop="enrolYear">
              <el-select v-model="ruleForm.enrolYear" style="width: 100px" placeholder="请选择">
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
            <el-form-item label="班级" prop="classNumber">
              <el-select v-model="ruleForm.classNumber" style="width: 100px" placeholder="请选择">
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
        <el-form-item label="班级封面" prop="classCover">
          <div class="upload-file-view">
            <el-button size="small" type="primary">点击上传</el-button>
            <input type="file" ref="file" @change="imageLoad" accept="image/*" class="file" />
          </div>
          <i class="lazyimg" v-show="ruleForm.classCover !== ''" :style="`background-image: url('${ruleForm.classCover}')`"></i>
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
    name: 'addEditClass',
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
      var thisYear = new Date().getFullYear();
      for(var enrolYearArr = [], i = 2010; i <= thisYear; i++){
        enrolYearArr.push(`${i}`);
      }
      return {
        //入学年份
        enrolYearArr,
        courseData: [],
        showValue: false,
        ruleForm: {
          className: '',
          coursesIds: [],
          universityName: '',
          collegeName: '',
          major: '',
          enrolYear: '',
          classNumber: '',
          remark: '',
          classCover: '',
          //班级id 编辑的时候用
          classId: ''
        },
        rules: {
          className: [
            { required: true, message: '班级名称不能为空', trigger: 'blur' },
            { min: 1, max: 30, message: '最多不超过30个字', trigger: 'blur' }
          ],
        }
      }
    },
    watch: {
      async value (val) {
        if(val && this.title == '编辑班级'){
          var ids = []
          if(this.data.recCoursesDtoList){
            this.data.recCoursesDtoList.map(v =>{
              ids.push(v.id + '')
            })
          }
          this.ruleForm = {
            className: this.data.className,
            coursesIds: ids,
            universityName: this.data.universityName,
            collegeName: this.data.collegeName,
            major: this.data.major,
            enrolYear: this.data.enrolYear,
            classNumber: this.data.classNumber,
            remark: this.data.remark,
            classCover: this.data.classCover,
            //班级id 编辑的时候用
            classId: this.data.id
          }
        }
        this.showValue = val
      },
      showValue (val) {
        this.$emit('update:value', val);
      }
    },
    async created() {
      const d = await this.post(this.$api.course.coursesList)
      if(d.code === 0){
        this.courseData = d.data;
      }
    },
    methods: {
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
          this.ruleForm.classCover = d.data.url;
        }
      },
      closeDialog(){
        setTimeout(_ =>{
          Object.keys(this.ruleForm).map(v =>{
            this.ruleForm[v] = v === 'coursesIds' ? [] : '';
          });
        }, 300)
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var ids = '', json = {};
            this.ruleForm.coursesIds.forEach(v =>{
              ids += `${v},`;
            })
            ids = ids.substring(0, ids.length - 1);
            Object.keys(this.ruleForm).map(v =>{
              json[v] = v === 'coursesIds' ? ids : this.ruleForm[v];
            });
            const d = await this.post(this.$api.schoolClass[this.title == '编辑班级' ? 'modifyClassInfo' : 'createClass'], json)
            if(d.code === 0){
              this.$message({
                message: this.title == '编辑班级' ? '编辑成功' : '添加成功',
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
