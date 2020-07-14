<template>
  <div>
           <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>父子组件传值</el-breadcrumb-item>
          <!-- <el-breadcrumb-item>查看页面</el-breadcrumb-item> -->
      </el-breadcrumb>
      <el-card>
            
      <h3>父组件向子组件传值1：</h3><br>
      <img src="../../assets/parent.jpg" alt="">
      <img src="../../assets/son.jpg" alt="">
       <h3>子组件项父组件传值：</h3><br><br><br>
       <img src="../../assets/zichuanfu.jpg" alt=""><br><br>
        <h3>父子组件之间传值的第二种方法：</h3><br
        <img src="../../assets/chuanzhi2.jpg" alt="">
         <img src="../../assets/chuanzhi3.jpg" alt=""><br><br>

           <h3>父子组件之间传值的第三种方法：</h3><br
         <img src="../../assets/chuanzhi5.jpg" alt="">
         <img src="../../assets/chuanzhi4.jpg" alt=""><br><br>

         <h3>非父子组件间的传值1</h3>
         <img src="../../assets/nops0.jpg" alt="">
          <img src="../../assets/noPS1.jpg" alt=""><br><br>

           <h3>非父子组件间的传值2(祖孙间传值)</h3>
         <img src="../../assets/attrs0.jpg" alt="">
          <img src="../../assets/attrs.jpg" alt=""><br><br>
      </el-card>


  </div>
</template>
<style scoped>
img{
    width: 100%;
    height: 100%;
}
</style>
