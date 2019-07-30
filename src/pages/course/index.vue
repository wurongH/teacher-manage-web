<template>
  <div class="course-list">
    <top-header title="课程列表"></top-header>
    <ul class="card-list clear">
      <li :class="['add', { pt: data.length }]" @click="dialogAddEditCourseVisible = true, dialogAddEditCourseTitle = '添加课程'">
        <i class="i-add"></i>
        <p v-if="!data.length">目前还没有属于你的课程</p>
        <span>点击添加</span>
      </li>
      <li class="item" v-for="(item, index) in data">
        <p class="title oe">{{item.coursesName}}</p>
        <p class="count">学生数: <span>{{item.studentNumber}}</span></p>
        <i class="lazyimg" @click="toSchoolClassDetails(item)" :style="`background-image: url('${item.coursesCover}')`"></i>
        <div class="operation">
          <i class="i-edit" @click="edit(item)"></i>
          <i class="i-more" @click.stop="more(index)"></i>
        </div>
        <div class="more-view" v-show="item.isShowMore">
          <div class="details" @click="toSchoolClassDetails(item)">查看详情</div>
          <div class="del" @click="del(item.id)">删除课程</div>
        </div>
      </li>
    </ul>

    <add-edit-course
      :value.sync="dialogAddEditCourseVisible"
      :title="dialogAddEditCourseTitle"
      :data="dialogAddEditCourseData"
      @updata-data="_ =>{ this.getListTcMyCourses() }">
    </add-edit-course>
  </div>
</template>

<script>
  import addEditCourse from './components/addEditCourse'
  import topHeader from '@/components/topHeader';
  export default {
    name: 'course-list',
    data() {
      return {
        //添加班级dialog
        dialogAddEditCourseVisible: false,
        dialogAddEditCourseTitle: '',
        dialogAddEditCourseData: {},

        data: [],
      }
    },
    components: {
      topHeader,
      addEditCourse
    },
    created() {
      this.getListTcMyCourses();
    },
    mounted(){
      document.onclick = () =>{
        if(this.$route.name === 'courseList'){
          this.closeMore();
        }
      };
    },
    methods: {
      edit(data){
        this.dialogAddEditCourseTitle = '编辑课程';
        this.dialogAddEditCourseVisible = true;
        this.dialogAddEditCourseData = data;
      },
      more(index){
        this.data.map((v, i) =>{
          v.isShowMore = index === i;
        })
      },
      closeMore(){
        this.data.map((v, i) =>{
          v.isShowMore = false;
        })
      },
      del(coursesId){
        this.$confirm('课程删除后,关于该课程的相关数据均将一并删除,是否确认?', '删除课程', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async _ => {
          const d = await this.post(this.$api.course.deleteCoursesInfo, { coursesId })
          if(d.code === 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getListTcMyCourses();
          }
        })
      },
      async getListTcMyCourses(){
        const d = await this.post(this.$api.course.listTcMyCourses)
        if(d.code === 0){
          d.data.map(v =>{
            if(v.coursesCover == '' || v.coursesCover == null){
              v.coursesCover = require('@/assets/images/default-course.png')
            }
            v.isShowMore = false;
          })
          this.data = d.data;
        }
      },
      //跳转详情
      toSchoolClassDetails(item){
        this.$store.state.classCourseName.name = item.coursesName
        this.$router.push({ name: 'courseDetails', params: { id: item.id } })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import './style';
  .i-edit{
    float: left;
  }
  .i-more{
    float: right;
  }
</style>
