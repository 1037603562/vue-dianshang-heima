<template>
  <div>
                  <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>v-for</el-breadcrumb-item>
          <!-- <el-breadcrumb-item>查看页面</el-breadcrumb-item> -->
      </el-breadcrumb>
      <el-card>
         
         <div>
           渲染数据时，有时候往往需要把最新的那条数据放在最上面，最简单的方法就是在渲染之前把数据先倒序排列好，再渲染到网页上。<br>

这时就要用到reverse()（颠倒数组中元素的顺序：）---订单列表的物流信息显示就用到了此方法。<br>

&lt div class="list" v-for="(item,index) in reverseSum" &gt <br>
	&lt ul &gt<br>
		&lt li &gt '{{' item.id '}}' &lt /li &gt<br>
		&lt li &gt '{{' item.sumtime '}}' &lt /li &gt<br>
		&lt li &gt '{{' item.week '}}' &lt /li &gt<br>
		&lt li &gt '{{' item.grasp '}}' &lt /li &gt<br>
	&lt /ul &gt<br>
&lt /div &gt<br>

computed: {<br>
        reverseSum() {<br>
            return this.allSum.reverse();<br>
        }<br>
},<br>
         </div>



      </el-card>
  </div>
</template>
