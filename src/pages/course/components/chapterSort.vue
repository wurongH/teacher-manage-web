
<template>
  <div class="chapter-sort">
    <el-dialog title="章节排序(拖动排序)" :visible.sync="showValue" width="500px" custom-class="dialog" :close-on-click-modal="false">
      <ul class="head">
        <p>章节名称</p>
        <span>操作</span>
      </ul>
      <div class="list-view" id="scroll">
        <ul ref="list">
          <li class="item" :key="index" :data-id="item.id" v-for="(item, index) in chapterSortData">
            <p>{{item.chapterName}}</p>
            <span></span>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showValue = false">取 消</el-button>
        <el-button type="primary" @click="submit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import nicescroll from 'nicescroll'
  import $ from 'jquery'
  import '@/assets/js/jquery-ui'
  export default {
    name: 'chapterSort',
    props: {
      value: Boolean,
      id: String,
      chapterSortData: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        showValue: false,
      }
    },
    watch: {
      value (val) {
        if (val && this.chapterSortData.length > 1) {
          setTimeout(() => {
            $("#scroll").niceScroll({
              cursorcolor: "#ccc",
            }).init();
            $(this.$refs.list).sortable({
              axis: 'y',
              revert: true,
              stop(event, ui) {},
            });
          }, 10)
        }
        this.showValue = val
      },
      showValue (val) {
        this.$emit('updata-modal', val)
      }
    },
    created() {
    },
    methods: {
      async submit(){
        var lis = this.$refs.list.querySelectorAll('li'),
        chapterArray = [];
        for (var i = 0; i < lis.length; i ++) {
          chapterArray.push({ id: lis[i].getAttribute('data-id') });
        }
        const d = await this.post(this.$api.course.updateChapterSortById, {
          coursesId: this.id,
          chapterArray
        });
        this.$emit('updata-modal', false)
        if(d.code === 0){
          this.$message({
            message: '排序成功',
            type: 'success'
          });
          this.$emit('updata-data')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog{
    font-size: 14px;

    .head{
      height: 40px;
      line-height: 40px;
      color: #666;
      text-align: center;
      border-top: 1px solid #E1E2E3;
      border-bottom: 1px solid #F0F1F2;
    }
    .head, li{
      p{
        float: left;
        width: 390px;
      }
      span{
        float: right;
        width: 70px;
        height: 53px;
      }
    }
    .list-view{
      height: 270px;
      width: 100%;
      overflow: hidden;

      .item{
        line-height: 54px;
        height: 54px;
        color: #333;
        cursor: move;
        border-bottom: 1px solid #F0F1F2;
        text-align: center;

        &:hover{
          background: #F0F1F2
        }

        span{
          background: url('./images/more.png') no-repeat center center;
          background-size: 20px 20px;
        }
      }
    }
  }

</style>
