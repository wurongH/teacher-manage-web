<template>
  <div class="v-top-header">
    <span>{{title}}</span>
    <slot name="main"></slot>
  </div>
</template>

<script>
  export default {
    name: 'vTopHeader',
    props: {
      title: {
        type: String,
        default: '这里是一个标题'
      },
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .v-top-header{
    height: 80px;
    line-height: 80px;
    padding-left: 10px;

    &:after{
      content: '';
      position: absolute;
      left: 0;
      top: 30px;
      width: 3px;
      height: 20px;
      border-radius: 2px;
      background: #0f88eb;
    }
    span{
      font-size: 22px;
      color: #000;
    }
    .btn-list{
      text-align: right;
      float: right;
    }
  }
</style>
