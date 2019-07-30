<template>
  <div class="chapter-details">
    <top-header :title="$store.state.classCourseName.name">
      <div class="btn-list"  slot="main">
        <el-button size="small" @click="$router.go(-1)"><i class="el-icon-back"></i> 返回模块列表</el-button>
        <el-button size="small" @click="prevNextChapter(false)"><i class="el-icon-arrow-left"></i> 上个模块</el-button>
        <el-button size="small" @click="prevNextChapter(true)">下个模块 <i class="el-icon-arrow-right"></i></el-button>
        <el-button size="small" @click="delChapter"><i class="el-icon-delete"></i> 删除</el-button>
      </div>
    </top-header>
    <div class="main-view">
      <div class="el-menu-item-view">
        <el-menu :default-active="activeIndex" @select="selectMenu" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">教学资源</el-menu-item>
          <el-menu-item index="2">模块/章节信息</el-menu-item>
        </el-menu>
        <div class="btn-list">
          <template v-if="activeIndex == 1">
            <el-button>新建教学资源</el-button>
            <el-button type="primary">导入教学资源</el-button>
          </template>
          <template v-if="activeIndex == 2">
            <el-button @click="_ =>{ this.$refs.chapterInfo.getChapterInfo() }">重置</el-button>
            <el-button @click="_ =>{ this.$refs.chapterInfo.submitForm('ruleForm') }" type="primary">保存</el-button>
          </template>
        </div>
      </div>
      <component
        :is="components[this.activeIndex - 1]"
        :ref="components[this.activeIndex - 1]"
        v-if="hackReset"
        :id='id'>
      </component>
    </div>
  </div>
</template>

<script>
  import topHeader from '@/components/topHeader';
  import chapterResource from './components/chapterResource';
  import chapterInfo from './components/chapterInfo'
  export default {
    name: 'chapterDetails',
    data() {
      return {
        activeIndex: '1',

        components: [ 'chapterResource', 'chapterInfo' ],
        hackReset: true,

        id: '',
        courseid: ''
      }
    },
    components: {
      topHeader,
      chapterResource,
      chapterInfo
    },
    created() {
      this.id = this.$route.params.id;
      this.courseid = this.$route.params.courseid;
    },
    methods: {
      selectMenu(index){
        this.activeIndex = index;
      },
      //点击上个模块和下个模块
      async prevNextChapter(flag){
        const d = await this.post(this.$api.course.preOrNextChapter, { coursesId: this.courseid, flag, chapterId: this.id })
        if(d.code === 0){
          this.id = d.data.id;
          this.$store.dispatch('setClassCourseName', d.data.chapterName)
          window.location.href = `${document.location.origin}/#/course/chapterDetails/${d.data.id}/${this.courseid}`;
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
      //删除章节
      delChapter(){
        this.$confirm('是否删除此章节?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async _ => {
          const d = await this.post(this.$api.course.deleteChapterInfo, { id: this.id })
          if(d.code === 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$router.go(-1)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
