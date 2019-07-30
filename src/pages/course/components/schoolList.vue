<template>
  <div class="school-list">
    <div class="swiper-view">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div :class="['swiper-slide', { active: item.isActive }]" :key="index" @click="toSlide(item, index)" v-for="(item, index) in swiperData">
            <i class="lazyimg" :style="`background-image: url('${item.classCover}')`"></i>
            <div class="right">
              <p class="oe">{{item.className}}</p>
              <span>学生数： {{item.studentNumber}}</span>
              <em v-if="item.joinTime !== ''">加入课程： {{item.joinTime}}</em>
            </div>
          </div>
        </div>
      </div>
      <p class="page prev" @click="_ =>{ this.swiper.slidePrev(); }"></p>
      <p class="page next" @click="_ =>{ this.swiper.slideNext(); }"></p>
    </div>
    <el-table :data="tableData" style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userName" label="学生姓名"></el-table-column>
      <el-table-column prop="gender" label="性别">
        <template slot-scope="scope">
          {{
            scope.row.gender == '' || scope.row.gender == null ? '' :
            scope.row.gender == 1 ? '男' :
            scope.row.gender == 2 && '女'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="universityName" label="学校"></el-table-column>
      <el-table-column prop="college" label="学院"></el-table-column>
      <el-table-column prop="major" label="专业"></el-table-column>
      <el-table-column prop="grade" label="年级"></el-table-column>
      <el-table-column prop="className" label="班级"></el-table-column>
      <el-table-column prop="joinTime" label="关联班级时间" width="180"></el-table-column>
      <el-table-column prop="amount3" label="操作">
        <template slot-scope="scope">
          <el-button @click="$router.push({ name: 'courseStudentDetails', params: { id: scope.row.studentId } })" type="text" size="small">查看</el-button>
          <el-button @click="del(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import tableMixin from '@/mixins/table'
  import Swiper from 'swiper'
  export default {
    name: 'schoolList',
    props: {
      id: String,
    },
    data() {
      return {
        swiper: Object,
        aa: 'http://10.0.0.26:8001/group1/M00/00/01/CgAAGlx-LoCAawSqAAPHfPoir_Q457.png',
        swiperData: [
          //默认未分班数据
          // {
          //   classCover: 'http://10.0.0.26:8001/group1/M00/00/01/CgAAGlx-LoCAawSqAAPHfPoir_Q457.png',
          //   className: '未分班',
          //   studentNumber: 0,
          //   joinTime: '',
          //   isActive: true
          // }
        ],

        classId: '',

        //选中Slide 下标, 如果下标相同则不请求数据
        checkSlideIndex: 0
      }
    },
    async created() {
      const d = await this.post(this.$api.schoolClass.listCoursesClass, {
        coursesId: this.id,
      });
      if(d.code === 0){
        d.data.map((v, index) =>{
          if(v.choose){
            v.isActive = !index;
            this.swiperData.push(v)
          }
        })
      }
      this.classId = this.swiperData[0].id
      this.getList(this.swiperData[0].id)
    },

    mounted(){
      setTimeout(_ =>{
        this.swiper = new Swiper('.swiper-container', {
          slidesPerView: 'auto',
          spaceBetween: 20,
        });
      }, 100)
    },
    mixins: [ tableMixin ],
    methods: {
      //删除学生
      del(id){
        this.$confirm('是否删除此学生?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const d = await this.post(this.$api.schoolClass.deleteClassStudent, { id });
          if(d.code === 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList(this.classId);
            this.currentPage = 1;
          }
        })
      },
      toSlide(item, index){
        if(this.checkSlideIndex === index){
          return
        }
        var classId = '';
        this.checkSlideIndex = index;
        this.swiper.slideTo(index, 300, false);
        this.swiperData.map((v, i) =>{
          v.isActive = i === index;
          i === index && ( classId = v.id );
        })
        this.classId = classId;
        this.currentPage = 1;
        this.getList(classId)
      },
      async getList(classId){
        // if(this.checkSlideIndex){
        //   this.classId = classId;
        //   this.getClassStudent(classId);
        // }else{
        //   this.getNoClassStudent();
        // }
        this.getClassStudent(classId);
      },
      //获取未分班学生
      async getNoClassStudent(){
        const d = await this.post(this.$api.course.pageCoursesStudent, {
          coursesId: this.id,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        });
        if(d.code === 0){
          this.tableData = d.data.data;
          this.total = d.data.total;
          this.swiperData[0].studentNumber = d.data.total;
        }
      },
      //获取分班学生
      async getClassStudent(classId){
        const d = await this.post(this.$api.schoolClass.pageClassStudent, {
          classId,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        });
        if(d.code === 0){
          this.tableData = d.data.data;
          this.total = d.data.total;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'swiper/dist/css/swiper.css';
  .swiper-view{
    padding: 0 38px;
    margin: 20px 0 20px;
    height: 100px;

    .swiper-container{
      width: 100%;
      height: 100px;

      .swiper-slide{
        width: 260px;
        height: 90px;
        padding: 10px;
        cursor: pointer;
        border-radius: 3px;
        border: 1px solid #d8e3e7;
        background: #fff;


        .lazyimg{
          width: 70px;
          height: 70px;
          float: left;
        }
        .right{
          height: 70px;
          width: 168px;
          float: right;
          padding-left: 10px;

          p{
            font-size: 18px;
            color: #333;
          }
          span, em{
            display: block;
            font-size: 14px;
            color: #666;
          }
          span{
            line-height: 27px;
          }
        }
        &.active{
          border: 1px solid #0f88eb;
          background-color: #0f88eb;

          .right{
            span, em, p{
              color: #fff;
            }
          }
          &:after{
            content: '';
            width: 16px;
            height: 8px;
            position: absolute;
            bottom: -8px;
            left: 50%;
            margin-left: -8px;
            background-image: url('./images/1.png')
          }
        }
      }
    }
    .page{
      width: 38px;
      height: 90px;
      position: absolute;
      top: 0;
      cursor: pointer;

      &.prev{
        left: 0;
        background: url('~@/assets/images/arrow-left.png') center center no-repeat
      }
      &.next{
        right: 0;
        background: url('~@/assets/images/arrow-right.png') center center no-repeat
      }
    }
  }
</style>
