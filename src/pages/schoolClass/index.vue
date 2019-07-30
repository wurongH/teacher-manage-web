<template>
  <div class="school-class-list">
    <top-header title="班级列表"></top-header>
    <ul class="card-list clear">
      <li class="add pt" @click="dialogAddEditClassVisible = true, dialogAddEditClassTitle = '添加班级'">
        <i class="i-add"></i>
        <span>添加班级</span>
      </li>
      <li class="item" v-for="(item, index) in data">
        <p class="title oe">{{item.className}}</p>
        <p class="count">学生数: <span>{{item.studentNumber}}</span></p>
        <i class="lazyimg" @click="toSchoolClassDetails(item)" :style="`background-image: url('${item.classCover}')`"></i>
        <div class="operation">
          <i class="i-code" @click="showCode(item)"></i>
          <i class="i-more" @click.stop="more(index)"></i>
          <i @click="edit(item.id)" class="i-edit"></i>
        </div>
        <div class="more-view" v-show="item.isShowMore">
          <div class="details" @click="toSchoolClassDetails(item)">查看详情</div>
          <div class="del" @click="del(item.id)">删除班级</div>
        </div>
      </li>
    </ul>

    <invite-code :value.sync="dialogInviteCodeVisible" :inviteCode="inviteCode"></invite-code>
    <add-edit-class
      :value.sync="dialogAddEditClassVisible"
      :title="dialogAddEditClassTitle"
      :data="dialogAddEditClassData"
      @updata-data="_ =>{ this.getListTcMyClass() }">
    </add-edit-class>
  </div>
</template>

<script>
  import addEditClass from './components/addEditClass'
  import inviteCode from './components/inviteCode'
  import topHeader from '@/components/topHeader'
  export default {
    name: 'school-class-list',
    data() {
      return {
        //添加班级dialog
        dialogAddEditClassVisible: false,
        dialogAddEditClassTitle: '',
        dialogAddEditClassData: {},

        dialogInviteCodeVisible: false,
        inviteCode: '',

        data: [],
      }
    },
    components: {
      addEditClass,
      inviteCode,
      topHeader
    },
    created() {
      this.getListTcMyClass();
    },
    mounted(){
      document.onclick = () =>{
        if(this.$route.name === 'schoolClassList'){
          this.closeMore();
        }
      };
    },
    methods: {
      showCode(item){
        this.inviteCode = item.inviteCode, this.dialogInviteCodeVisible = true
      },
      async edit(classId){
        const d = await this.post(this.$api.schoolClass.getClassInfo, { classId })
        if(d.code === 0){
          this.dialogAddEditClassTitle = '编辑班级';
          this.dialogAddEditClassVisible = true;
          this.dialogAddEditClassData = d.data;
        }
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
      del(classId){
        this.$confirm('班级删除后，关于该班级的相关数据均将一并删除，是否确认?', '删除班级', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async _ => {
          const d = await this.post(this.$api.schoolClass.deleteClassInfo, { classId })
          if(d.code === 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getListTcMyClass();
          }
        })
      },
      //获取班级列表
      async getListTcMyClass(){
        const d = await this.post(this.$api.schoolClass.listTcMyClass)
        if(d.code === 0){
          d.data.map(v =>{
            if(v.classCover == '' || v.classCover == null){
              v.classCover = require('@/assets/images/default-class.png')
            }
            v.isShowMore = false;
          })
          this.data = d.data;
        }
      },
      //跳转详情
      toSchoolClassDetails(item){
        this.$store.state.classCourseName.name = item.className
        this.$router.push({ name: 'schoolClassDetails', params: { id: item.id } })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../course/style';
  .i-code{
    float: left;
  }
  .i-edit, .i-more{
    float: right;
  }
  .i-more{
    margin-left: 15px;
  }
</style>
