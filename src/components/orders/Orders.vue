<template>
  <div>
            <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>

       <!-- 卡片视图 -->
        <el-card>
                 <!-- 搜索 -->
       
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getOrdersList">
                    <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
                </el-input>
            </el-col>
              <!-- 订单表格 -->
              <el-table border stripe :data="ordersList">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="订单编号" prop="order_number"></el-table-column>
                  <el-table-column label="订单价格" prop="order_price" width="70px"></el-table-column>
                  <el-table-column label="是否付款" prop="pay_status" width="90px">
                    <template slot-scope="scope">
                          <el-tag v-if="scope.row.pay_status ==='1'">已付款</el-tag>
                          <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否发货" prop="is_send" width="70px"></el-table-column>
                  <el-table-column label="下单时间" prop="create_time">
                      <template slot-scope="scope">
                          {{scope.row.create_time | dataFormat}}
                      </template>
                  </el-table-column>

                  <el-table-column label="操作" prop="create_time">
                      <template slot-scope="scope">
                           <el-tooltip class="item" effect="dark" content="更改状态" placement="top" :enterable="false">
                                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeStatus(scope.row)"></el-button>
                            </el-tooltip>

                            <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                    <el-button type="primary" icon="el-icon-s-help" size="mini"></el-button>
                            </el-tooltip> -->

                            <el-tooltip class="item" effect="dark" content="物流信息" placement="top" :enterable="false">
                                <el-button type="success" icon="el-icon-location" size="mini" @click="LookWuLiuDialog(scope.row)"></el-button>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" content="查看" placement="top" :enterable="false">
                                <el-button type="info" icon="el-icon-s-order" size="mini" @click="gotoSee(scope.row)"></el-button>
                            </el-tooltip>
                         
                          
                          
                          
                      </template>
                  </el-table-column>
              </el-table>

              <!-- 分页 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 20, 40]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
       
        </el-card>


        <!-- 修改状态对话框 -->
        <el-dialog
        title="更改状态"
        :visible.sync="changeStatusDialogVisible"
        width="50%"
        @close="changeStatusClosed">
       <!-- form表单 -->
            <el-form :model="changeStatusForm" :rules="changeStatusFormRules" ref="changeStatusFormRef" label-width="100px">
                <el-form-item label="是否发货" prop="is_send">
                     <el-select v-model="changeStatusForm.is_send" placeholder="请选择">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="订单支付" prop="order_pay">
                     <el-select v-model="changeStatusForm.order_pay" placeholder="请选择" >
                            <el-option label="未支付" value="0"></el-option>
                            <el-option label="支付宝" value="1"></el-option>
                            <el-option label="微信" value="2"></el-option>
                            <el-option label="银行卡" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="订单价格" prop="order_price">
                    <el-input v-model="changeStatusForm.order_price"></el-input>
                </el-form-item>

                  <el-form-item label="订单数量" prop="order_number">
                    <el-input v-model="changeStatusForm.order_number"></el-input>
                </el-form-item>

                 <el-form-item label="支付状态" prop="pay_status">
                     <el-select v-model="changeStatusForm.pay_status" placeholder="请选择" >
                            <el-option label="未付款" value="0"></el-option>
                            <el-option label="已付款" value="1"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="changeStatusDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editChangeStatus">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 查看物流进度对话框 -->
        <el-dialog
        title="查看物流进度"
        :visible.sync="lookWuLiudialogVisible"
        width="50%">
      <!-- 时间线 -->
      <el-timeline :reverse="reverse">
            <el-timeline-item
            v-for="(activity, index) in wuliuList"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
      </el-timeline>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="lookWuLiudialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="lookWuLiudialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>

  </div>
</template>
<script>
export default {
  data(){
    return {
        queryInfo:{
          query:'',
          pagenum:1,//当前页码
          pagesize:5,//每页显示条数
        },
        ordersList:[],//获取到的订单列表数据
        total:0,//总条数
        //用于控制更改状态对话框的显示隐藏
        changeStatusDialogVisible:false,
        //当前行信息
        // nowHangMessage:{},
        //更改状态表单信息
        changeStatusForm:{
            is_send:'',
            order_price:'',
            order_pay:'',
            order_number:'',
            pay_status:'',
        },
        //g更改状态验证规则
        changeStatusFormRules:{
                is_send: [
                        { required: true, message: '请输入订单状态', trigger: 'blur' },
                     ],
        },
        //提交更改状态所需id
        changerStatusId:'',
        //查看物流对话框显示隐藏
        lookWuLiudialogVisible:false,
        //物流信息列表
        wuliuList:{},
    }
  },
  created(){
    this.getOrdersList()
  },
  methods:{
      async getOrdersList(){
          var {data:res} = await this.$http.get('/orders',{params:this.queryInfo})
          if(res.meta.status !== 200) return this.$message.error('订单列表数据获取失败')
          this.ordersList = res.data.goods
          this.total = res.data.total
          //console.log(this.ordersList)
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getOrdersList()
      },
      handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum
            this.getOrdersList()
      },
      gotoSee(row){
        console.log(row.order_id)
          window.sessionStorage.setItem('lookId',row.order_id)
       // this.$store.commit('saveLookId',row.order_id)
        this.$router.push('/orders/see')
      },
    //   更改状态 对话框的 显示隐藏  并且 获取当前行的信息
    changeStatus(row){
            this.changeStatusDialogVisible = true
            this.changeStatusForm = row
            this.changerStatusId=row.order_id
            console.log(row)
    },
    //修改状态对话框的关闭的监听事件
    changeStatusClosed(){
        this.$refs.changeStatusFormRef.resetFields()
       // this.$refs.addFormRef.resetFields()
    },
    //提交修改订单状态的请求
    async editChangeStatus(){
        var {data:res} = await this.$http.put('orders/'+this.changerStatusId,this.changeStatusForm)
        if(res.meta.status !== 201){
            return this.$message.error('更改状态失败')
        }
        this.changeStatusDialogVisible = false
        this.getOrdersList()
        this.$message.success('更改状态成功')
    },
    //查看物流对话框的显示隐藏
    async LookWuLiuDialog(row){
        this.lookWuLiudialogVisible = true
        var id = row.order_id
        console.log(id)
        //获取物流信息
        var {data:res} = await this.$http.get('/kuaidi/1106975712662')
        if(res.meta.status !== 200) return this.$message.error('获取物流信息失败')
        this.wuliuList = res.data.reverse()
        //console.log(this.wuliuList)
        
    }
  }
}
</script>
<style scoped>
.el-table{
  margin-top:50px;
  font-size: 10px
}
.el-select{
    width: 100%;
}
</style>
