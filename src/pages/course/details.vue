<template>
  <div class="course-details">
    <top-header :title="coursesName">
      <div class="btn-list"  slot="main">
        <el-button size="small" @click="$router.push({ path: '/course'})"><i class="el-icon-back"></i> 返回课程列表</el-button>
        <el-button size="small" @click="prevNextCourse(false)"><i class="el-icon-arrow-left"></i> 上个课程</el-button>
        <el-button size="small" @click="prevNextCourse(true)">下个课程 <i class="el-icon-arrow-right"></i></el-button>
        <el-button size="small" @click="delCourse"><i class="el-icon-delete"></i> 删除</el-button>
      </div>
    </top-header>
    <div class="main-view">
      <div class="el-menu-item-view">
        <el-menu :default-active="activeIndex" @select="selectMenu" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">模块/章节</el-menu-item>
          <el-menu-item index="2">教学资源</el-menu-item>
          <el-menu-item index="3">学生列表</el-menu-item>
          <el-menu-item index="4">基本信息</el-menu-item>
        </el-menu>
        <div class="btn-list">
          <template v-if="activeIndex == 1">
            <el-button @click="listCoursesChapters">章节排序</el-button>
            <el-button type="primary" @click="_ =>{ this.$refs.chapter.showDialog() }">新建章节</el-button>
          </template>
          <template v-if="activeIndex == 2">
            <el-button>新建教学资源</el-button>
            <el-button type="primary">导入教学资源</el-button>
          </template>
          <template v-if="activeIndex == 3">
            <el-button @click="dialogVisibleClass = true">关联班级</el-button>
            <el-button @click="showAddClassDialog">添加到班级</el-button>
            <el-button type="primary">导出</el-button>
          </template>
          <template v-if="activeIndex == 4">
            <el-button @click="_ =>{ this.$refs.courseInfo.getCoursesInfo() }">重置</el-button>
            <el-button @click="_ =>{ this.$refs.courseInfo.submitForm('ruleForm') }" type="primary">保存</el-button>
          </template>
        </div>
      </div>

      <component
        :is="components[this.activeIndex - 1]"
        :ref="components[this.activeIndex - 1]"
        v-if="hackReset"
        :id="id"
        :classIds.sync="form.checkClass"
        :classData="classData"
        :coursesName.sync="coursesName">
      </component>

      <chapter-sort
        v-model="dialogChapterSortVisible"
        :id='id'
        :chapterSortData="chapterSortData"
        @updata-modal="val => { this.dialogChapterSortVisible = val }"
        @updata-data="_ =>{ this.triggerNav(); }">
      </chapter-sort>
    </div>

    <el-dialog
      title="关联班级"
      :visible.sync="dialogVisibleClass"
      width="570px"
      class="dialog-visible-class">
      <span class="info">选择一个现有的班级，则该班级中的学生均可被导入该课程学生列</span>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="选择班级">
          <el-select v-model="form.checkClass" style="width: 400px" multiple placeholder="请选择">
            <el-option
              v-for="(item, index) in classData"
              :key="index"
              :label="item.className"
              :value="item.id + ''">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleClass = false">取 消</el-button>
        <el-button type="primary" @click="relationClass">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加到班级"
      :visible.sync="dialogVisibleAddClass"
      width="570px"
      @close="closeDialogAddClass"
      class="dialog-visible">
      <span class="info">将所选择的学生添加到你所指定的班级中：</span>
      <el-form ref="addClassForm" :model="addClassForm" label-width="80px">
        <el-form-item label="选择班级" prop="classId" :rules="[
          { required: true, message: '请选择班级', trigger: 'blur' },
        ]">
          <el-select v-model="addClassForm.classId" style="width: 400px" placeholder="请选择">
            <el-option
              v-for="(item, index) in classData"
              :key="index"
              :label="item.className"
              :value="item.id + ''">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddClass = false">取 消</el-button>
        <el-button type="primary" @click="addClass('addClassForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import topHeader from '@/components/topHeader';
  import chapter from './components/chapter';
  import chapterSort from './components/chapterSort';
  import resource from './components/resource';
  import schoolList from './components/schoolList'
  import courseInfo from './components/courseInfo'
  export default {
    name: 'courseDetails',
    data() {
      return {
        activeIndex: '1',
        components: [ 'chapter', 'resource', 'schoolList', 'courseInfo' ],
        hackReset: true,

        id: '',

        //课程名称
        coursesName: '',

        //班级列表
        classData: [],
        dialogVisibleClass: false,
        form: {
          //已关联班级
          checkClass: []
        },

        chapterSortData: [],
        dialogChapterSortVisible: false,

        //添加到班级
        dialogVisibleAddClass: false,
        addClassForm: {
          classId: ''
        }
      }
    },
    components: {
      topHeader,
      chapter,
      resource,
      schoolList,
      courseInfo,
      chapterSort
    },
    async created() {
      this.id = this.$route.params.id;
      //获取所有班级列表
      const d = await this.post(this.$api.schoolClass.listTcMyClass)
      if(d.code === 0){
        this.classData = d.data;
      }

      //获取关联的班级列表
      const d2 = await this.post(this.$api.schoolClass.listCoursesClass, { coursesId: this.id })
      if(d2.code === 0){
        this.checkClass = [];
        d2.data.map(v =>{
          v.choose && this.form.checkClass.push(v.id + '');
        })
      }

      //课程信息
      const d3 = await this.post(this.$api.course.getCoursesInfo, { coursesId: this.id })
      if(d3.code === 0){
        this.coursesName = d3.data.coursesName;
      }
    },
    methods: {
      //触发当前选中菜单
      triggerNav(){
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true
        })
      },
      //关联班级
      async relationClass(){
        var classIds = '';
        this.form.checkClass.forEach(v =>{
          classIds += `${v},`;
        })
        classIds = classIds.substring(0, classIds.length - 1);
        this.dialogVisibleClass = false;
        const d = await this.post(this.$api.schoolClass.relateClass, { coursesId: this.id, classIds })
        if(d.code === 0){
          this.$message({
            type: 'success',
            message: '关联成功!'
          });
          this.triggerNav();
        }
      },
      //添加到班级
      addClass(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var coursesStudentArray = [];
            this.$refs.schoolList.selectTbaleData.map(v =>{
              coursesStudentArray.push({ studentId: v.studentId })
            })
            this.dialogVisibleAddClass = false;
            const d = await this.post(this.$api.schoolClass.addClassStudentByChecked, { classId: this.addClassForm.classId, coursesStudentArray })
            if(d.code === 0){
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
              this.triggerNav();
            }
          }
        });
      },
      showAddClassDialog(){
        if(!this.$refs.schoolList.selectTbaleData.length){
          this.$message({
            type: 'error',
            message: '请选择学生'
          });
          return;
        }
        this.dialogVisibleAddClass = true;
      },
      closeDialogAddClass(){
        setTimeout(_ =>{
          this.addClassForm.classId = '';
        }, 300)
      },
      async listCoursesChapters(){
        const d = await this.post(this.$api.course.listCoursesChapters, {
          coursesId: this.id,
        });
        if(d.code === 0){
          this.dialogChapterSortVisible = true
          this.chapterSortData = d.data;
        }
      },
      selectMenu(index){
        this.activeIndex = index;
      },
      //点击上个课程和下个课程
      async prevNextCourse(flag){
        const d = await this.post(this.$api.course.preOrNextCourses, { currentCoursesId: this.id, flag })
        if(d.code === 0){
          this.id = d.data.id;
          this.$store.dispatch('setClassCourseName', d.data.coursesName)
          window.location.href = `${document.location.origin}/#/course/details/${d.data.id}`;
          this.activeIndex == 1 ? this.triggerNav() : this.activeIndex = '1';
        }
      },
      //删除课程
      delCourse(){
        this.$confirm('课程删除后,关于该课程的相关数据均将一并删除,是否确认?', '删除课程', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async _ => {
          const d = await this.post(this.$api.course.deleteCoursesInfo, { coursesId: this.id })
          if(d.code === 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$router.push({ path: '/course'})
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-visible{
  .el-form{
    margin-top: 20px;
  }
}
</style>
