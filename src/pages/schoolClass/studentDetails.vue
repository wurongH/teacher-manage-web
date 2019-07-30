<template>
  <div class="class-student-details">
    <student-info :id="$route.params.id"></student-info>
  </div>
</template>

<script>
  import studentInfo from 'components/studentInfo'
  export default {
    name: 'classStudentDetails',
    data() {
      return {
      }
    },
    created() {
    },
    components: {
      studentInfo,
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
</style>
