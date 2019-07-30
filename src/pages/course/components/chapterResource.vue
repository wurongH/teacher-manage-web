<template>
  <div class="chapter-resource">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="refereeName" label="资源名称"></el-table-column>
      <el-table-column prop="refereeMobile" label="格式"></el-table-column>
      <el-table-column prop="referrerPosition" label="类型"></el-table-column>

      <el-table-column prop="studentName" label="关联章节"></el-table-column>
      <el-table-column prop="studentName" label="设为作业"></el-table-column>
      <el-table-column prop="amount3" label="操作">
        <template slot-scope="scope">
          <el-button @click="$router.push({ name: 'manageDetails', params: { id: scope.row.id } })" type="text" size="small">查看</el-button>
          <el-button @click="$router.push({ name: 'manageDetails', params: { id: scope.row.id } })" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pager">
      <!-- @size-change="handleSizeChange" -->
      <!-- @current-change="handleCurrentChange" -->
      <el-pagination

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
    name: 'chapterResource',
    props: {
      id: String,
    },
    mixins: [ tableMixin ],
    data() {
      return {
      }
    },
    async created() {
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
</style>
