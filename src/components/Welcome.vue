<template>
  <div>
      <h3>WELCOME BITCH !!!</h3>
      <el-button type="primary" @click="studyVuex">vuex资料</el-button>
      <el-button type="primary" @click="studyv_for">v-for倒序显示</el-button>
      <el-button type="primary" @click="studyv_sendMsg">父子组件传值</el-button>
      <el-button type="primary" @click="study_addRouters">addRouters权限管理</el-button>
      <el-button type="primary" @click="study_animal">css3动画相关</el-button>
  </div>
</template>
<script>
export default {
  methods:{
    studyVuex(){
      console.log('123')
      this.$router.push('/welcome/myvuex')
      
    },
    studyv_for(){
       this.$router.push('/welcome/vfor')
    },
     studyv_sendMsg(){
       this.$router.push('/welcome/chuanzhi')
    },
     study_addRouters(){
       this.$router.push('/welcome/Myaddrouters')
    },
     study_animal(){
       this.$router.push('/welcome/donghua')
    },
  }
}
</script>
<style scoped>

</style>
