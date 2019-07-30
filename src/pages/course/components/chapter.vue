<template>
  <div class="chapter">
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="chapterCover" label="章节封面">
        <template slot-scope="scope">
          <i class="lazyimg" :style="`background-image: url('${scope.row.chapterCover}')`"></i>
        </template>
      </el-table-column>
      <el-table-column prop="chapterName" label="章节名称"></el-table-column>
      <el-table-column prop="chapterIntroduction" label="章节简介"></el-table-column>

      <el-table-column prop="studentName" label="教学资源"></el-table-column>
      <el-table-column prop="amount3" label="操作">
        <template slot-scope="scope">
          <el-button @click="toChapterDetails(scope.row)" type="text" size="small">管理教学资源</el-button>
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
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

    <el-dialog :title="title" :visible.sync="isShowDialog" width="500px" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="名称" prop="chapterName">
          <el-input v-model="ruleForm.chapterName" placeholder="最多不超过30个字"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="chapterCover">
          <div class="upload-file-view">
            <el-button size="small" type="primary">点击上传</el-button>
            <input type="file" ref="file" @change="imageLoad" accept="image/*" class="file" />
          </div>
          <i class="lazyimg i-file" v-show="ruleForm.chapterCover !== ''" :style="`background-image: url('${ruleForm.chapterCover}')`"></i>
        </el-form-item>
        <el-form-item label="简介" prop="chapterIntroduction">
          <el-input type="textarea" :rows="4" v-model="ruleForm.chapterIntroduction" placeholder="请输入章节简介"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import tableMixin from '@/mixins/table'
  export default {
    name: 'chapter',
    props: {
      id: String,
    },
    data() {
      return {
        data: [],

        ruleForm: {
          chapterName: '',
          chapterCover: '',
          chapterIntroduction: '',
        },
        rules: {
          chapterName: [
            { required: true, message: '章节名称不能为空', trigger: 'blur' },
            { min: 1, max: 30, message: '最多不超过30个字', trigger: 'blur' }
          ],
        },

        isShowDialog: false,
        title: '',
      }
    },
    mixins: [ tableMixin ],
    created() {
      this.getList()
    },
    methods: {
      //分页获取章节列表
      async getList(){
        const d = await this.post(this.$api.course.pageCoursesChapters, {
          coursesId: this.id,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        });
        if(d.code === 0){
          this.data = d.data.data;
          this.total = d.data.total;
        }
      },
      //上传图片
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
      //编辑章节
      edit(data){
        this.isShowDialog = true;
        this.title = '编辑章节';
        this.ruleForm = {
          chapterName: data.chapterName,
          chapterCover: data.chapterCover,
          chapterIntroduction: data.chapterIntroduction,
          id: data.id
        };
      },
      //删除章节
      del(id){
        this.$confirm('是否删除此章节?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const d = await this.post(this.$api.course.deleteChapterInfo, { id })
          if(d.code === 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          }
        })
      },
      //关闭新建章节弹窗
      closeDialog(){
        setTimeout(_ =>{
          this.$refs['ruleForm'].resetFields();
        }, 300)
      },
      showDialog(){
        this.isShowDialog = true;
        this.title = '新建章节';
      },
      //跳转详情
      toChapterDetails(item){
        this.$store.state.classCourseName.name = item.chapterName
        this.$router.push({ name: 'chapterDetails', params: { id: item.id, courseid: this.id } })
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const d = await this.post(this.$api.course[this.title == '新建章节' ? 'createChapter' : 'modifyChapterInfo'], {
              //编辑
              id: this.ruleForm.id,
              //新建
              coursesId: this.id,
              chapterName: this.ruleForm.chapterName,
              chapterCover: this.ruleForm.chapterCover,
              chapterIntroduction: this.ruleForm.chapterIntroduction,
            })
            if(d.code === 0){
              this.$message({
                message: this.title == '新建章节' ? '创建成功' : '编辑成功',
                type: 'success'
              });
              this.getList();
              this.isShowDialog = false;
            }
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .lazyimg{
    width: 100px;
    height: 50px;
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
  .i-file{
    width: 100px;
    height: 100px;
    border-radius: 3px;
    margin-top: 15px;
  }
</style>
