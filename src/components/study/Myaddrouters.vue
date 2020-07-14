<template>
  <div>
                  <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>v-for</el-breadcrumb-item>
          <!-- <el-breadcrumb-item>查看页面</el-breadcrumb-item> -->
      </el-breadcrumb>
      <el-card>
          <h3>利用addRoutes进行菜单栏权限控制：</h3><br>
          <img src="../../assets/addRoutes1.png" alt="">
          <img src="../../assets/addRoutes2.png" alt="">
          <img src="../../assets/addRoutes3.png" alt="">
          <img src="../../assets/addRoutes4.png" alt="">
          <img src="../../assets/addRoutes5.png" alt=""><br><br><br>
          <h3>注意：不需要在el-menu标签当中开启router,只需要在item上面定义一个点击事件 调用编程式导航将其push到对应的页面</h3><br>
          <img src="../../assets/clickmenu1.png" alt="">
          <img src="../../assets/clickmenu2.png" alt=""><br><br>
          <h3>利用mock模仿的后台返回的菜单数据</h3>
          <img src="../../assets/mock_menu.png" alt="">
    
      </el-card>
  </div>
</template>
