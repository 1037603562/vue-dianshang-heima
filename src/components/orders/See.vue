<template>
  <div>
                <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/orders' }">订单列表</el-breadcrumb-item>
          <el-breadcrumb-item>查看页面</el-breadcrumb-item>
      </el-breadcrumb>

           <!-- 卡片视图 -->
        <el-card>
            <ul>
              <li>
                <label class="first">订单编号:</label>
                 <label class="two">{{ordersIdList.order_number}}</label>
              </li>

              <li>
                <label class="first">订单价格:</label>
                 <label class="two">{{ordersIdList.order_price}}</label>
              </li>

               <li>
                <label class="first">是否付款:</label>
                 <label class="two" >
                      <label v-if="this.ordersIdList.order_pay === '1'">是</label>
                      <label v-else>否</label>
                 </label>
              </li>

              <li>
                <label class="first">是否发货:</label>
                 <label class="two">{{ordersIdList.is_send}}</label>
              </li>

              <li>
                <label class="first">收货地址:</label>
                 <label class="two">{{ordersIdList.consignee_addr}}</label>
              </li>
              <li>
                <label class="first">创建时间:</label>
                 <label class="two">{{ordersIdList.create_time | dataFormat}}</label>
              </li>
              <li>
                <label class="first">修改时间:</label>
                 <label class="two">{{ordersIdList.update_time | dataFormat}}</label>
              </li>
            </ul>

            
        </el-card>
         <pre>{{ordersIdList.consignee_addr}}</pre>
  </div>
</template>
<script>
export default {
  
  data(){
    return {
        ordersIdList:{},
        myid:'',
    }
  },
  created(){
      this.myid = window.sessionStorage.getItem('lookId')
    this.getOrdersIdList()
  
                  
  },
  methods:{
        async getOrdersIdList(){
          //this.myid=this.$store.state.lookId
        
        var {data:res} = await this.$http.get('orders/'+this.myid)
        this.ordersIdList = res.data
          console.log(this.ordersIdList)
        }
  }
}
</script>
<style scoped>
ul{
  width: 100%;
}
li{
  border: 1px solid #e6e6e6;
  width: 500px;
 line-height: 35px;
 margin: 10px;
 float: left;
}
.first{
  width:200px;
  background-color:#fbfbfb;
  display:inline-block;
  border-right: 1px solid #e6e6e6;
  text-align: right;
  padding-right: 15px
}
.two{
  padding-left: 15px;
}
.el-card{
  font-size: 13px;
}
</style>
