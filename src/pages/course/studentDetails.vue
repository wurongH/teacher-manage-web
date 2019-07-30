<template>
  <div class="course-student-details">
    <student-info :id="$route.params.id"></student-info>
  </div>
</template>

<script>
  import studentInfo from 'components/studentInfo'
  export default {
    name: 'courseStudentDetails',
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
