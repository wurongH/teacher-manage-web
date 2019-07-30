<template>
  <div class="school-class-details">
    <top-header :title="$store.state.classCourseName.name">
      <div class="btn-list"  slot="main">
        <el-button size="small" @click="$router.push({ path: '/schoolClass'})"><i class="el-icon-back"></i> 返回班级列表</el-button>
        <el-button size="small" @click="prevNextClass(false)"><i class="el-icon-arrow-left"></i> 上个班级</el-button>
        <el-button size="small" @click="prevNextClass(true)">下个班级 <i class="el-icon-arrow-right"></i></el-button>
        <el-button size="small" @click="delClass"><i class="el-icon-delete"></i> 删除</el-button>
      </div>
    </top-header>
    <div class="main-view">
      <div class="el-menu-item-view">
        <el-menu :default-active="activeIndex" @select="selectMenu" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">学生列表</el-menu-item>
          <el-menu-item index="2">班级信息</el-menu-item>
        </el-menu>
        <div class="btn-list">
          <el-button v-if="activeIndex == 1" @click="dialogVisibleCourse = true">所学课程</el-button>
          <el-button v-if="activeIndex == 1" type="primary">导出</el-button>
          <el-button v-if="activeIndex == 2" @click="_ =>{ this.$refs.classInfo.getClassInfo() }">重置</el-button>
          <el-button v-if="activeIndex == 2" @click="_ =>{ this.$refs.classInfo.submitForm('ruleForm') }" type="primary">保存</el-button>
        </div>
      </div>
      <school-list v-if="activeIndex == 1 && hackReset" :id="id"></school-list>
      <class-info
        :courseData="courseData"
        ref="classInfo"
        v-if="activeIndex == 2"
        :id="id">
      </class-info>
    </div>


    <el-dialog
      title="所学课程"
      :visible.sync="dialogVisibleCourse"
      width="570px"
      class="dialog-visible-course">
      <span class="info">选择该班级需要学习的一个或多个现有的课程，则该班级中的学生将被导入该课程的学生列表中：</span>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="关联课程">
          <el-select v-model="form.checkCourses" style="width: 400px" multiple placeholder="无">
            <el-option
              v-for="(item, index) in courseData"
              :key="index"
              :label="item.coursesName"
              :value="item.id + ''">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCourse = false">取 消</el-button>
        <el-button type="primary" @click="relationCourse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import schoolList from './components/schoolList'
  import classInfo from './components/classInfo'
  import topHeader from '@/components/topHeader';
  export default {
    name: 'school-class-details',
    data() {
      return {
        activeIndex: '1',
        hackReset: true,

        //关联课程弹窗
        dialogVisibleCourse: false,
        form: {
          //已关联课程
          checkCourses: []
        },

        //关联课程列表
        courseData: [],

        id: ''
      }
    },

    components: {
      schoolList,
      topHeader,
      classInfo
    },
    async created() {
      this.id = this.$route.params.id;

      const d = await this.post(this.$api.course.listClassCourses, { classId: this.id })
      if(d.code === 0){
        this.courseData = d.data;
        this.checkCourses = [];
        d.data.map(v =>{
          v.choose && this.form.checkCourses.push(v.id + '');
        })
      }
    },
    methods: {
      //点击上个班级和下个班级
      async prevNextClass(flag){
        const d = await this.post(this.$api.schoolClass.preOrNextClass, { currentClassId: this.id, flag })
        if(d.code === 0){
          this.id = d.data.id;
          this.$store.dispatch('setClassCourseName', d.data.className)
          window.location.href = `${document.location.origin}/#/schoolClass/details/${d.data.id}`;
          if(this.activeIndex == 1){
            this.hackReset = false;
            this.$nextTick(() => {
              this.hackReset = true
            })
          }else{
            this.activeIndex = '1';
          }
        }
      },
      //关联课程
      async relationCourse(){
        var coursesIds = '';
        this.form.checkCourses.forEach(v =>{
          coursesIds += `${v},`;
        })
        coursesIds = coursesIds.substring(0, coursesIds.length - 1);
        const d = await this.post(this.$api.course.relateCourses, { classId: this.id, coursesIds })
        if(d.code === 0){
          this.$message({
            type: 'success',
            message: '关联成功!'
          });
          this.dialogVisibleCourse = false;
        }
      },
      //删除班级
      delClass(){
        this.$confirm('班级删除后，关于该班级的相关数据均将一并删除，是否确认?', '删除班级', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async _ => {
          const d = await this.post(this.$api.schoolClass.deleteClassInfo, { classId: this.id })
          if(d.code === 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$router.push({ path: '/schoolClass'})
          }
        })
      },
      selectMenu(index){
        this.activeIndex = index;
        (index == 2) && (this.isDisabled = true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-visible-course{
    .el-form{
      margin-top: 20px;
    }
  }
</style>
