<template>
  <div class="school-list">
    <el-table :data="tableData" style="width: 100%">
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
          <el-button @click="$router.push({ name: 'classStudentDetails', params: { id: scope.row.studentId } })" type="text" size="small">查看</el-button>
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
  export default {
    name: 'schoolList',
    props: {
      id: String,
    },
    data() {
      return {
      }
    },
    created() {
      this.getList()
    },
    mixins: [ tableMixin ],
    methods: {
      async getList(){
        const d = await this.post(this.$api.schoolClass.pageClassStudent, {
          classId: this.id,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        });
        if(d.code === 0){
          this.tableData = d.data.data;
          this.total = d.data.total;
        }
      },
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
            this.getList();
            this.currentPage = 1;
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
