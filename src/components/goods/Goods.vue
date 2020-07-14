<template>
  <div>
        <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图 -->
      <el-card>
        <!-- 搜索与添加 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getGoodsList">
                    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                 <el-button type="primary" @click="goAddpage">添加商品</el-button>
            </el-col>
        </el-row>

        <!-- 商品列表 -->
        <el-table border stripe :data="goodlist" class="mytables">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name"></el-table-column>
            <el-table-column label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
            <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
            <el-table-column label="创建时间" prop="add_time" width="140px">
              <template slot-scope="scope">
                  {{scope.row.add_time | dataFormat}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                   <!-- 编辑按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showGoodsDialog(scope.row.goods_id)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)"></el-button>
              </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 4, 5, 50]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

      </el-card>

      <!-- 编辑对话框 -->
      <el-dialog
      title="商品编辑"
      :visible.sync="goodsDialogVisible"
      width="50%">
      <!-- 表单 -->
      <el-form :model="goodsIdlist" :rules="goodsEditRules" ref="editRuleFormRef" label-width="100px" >
        <label>商品编辑目前存疑，不能使用，提示错误：商品没有设置所属分类，</label>
            <label>等商品分类做完之后再看</label>
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodsIdlist.goods_name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="goodsIdlist.goods_price" type="number"></el-input>
          </el-form-item>

           <el-form-item label="商品重量" prop="goods_weight" >
            <el-input v-model="goodsIdlist.goods_weight" type="number"></el-input>
          </el-form-item>
          
          <el-form-item label="商品数量" prop="goods_number" >
            <el-input v-model="goodsIdlist.goods_number" type="number"></el-input>
          </el-form-item>

          <el-form-item label="商品介绍" prop="goods_introduce" >
            <el-input v-model="goodsIdlist.goods_introduce"></el-input>
          </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsDialogVisible">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>
<script>
export default {
  data(){
    return {
      queryInfo:{ //获取商品列表的参数对象
        query:'',
        pagenum:1,//页数
        pagesize:5//每页显示条数
      },
      //获取到的商品数据
      goodlist:[],
      total:0,
      //用于控制编辑对话框的显示与隐藏
      goodsDialogVisible:false,
      //根据id获取的数据存在这里
      goodsIdlist:{
        goods_id:'',
        goods_name:'',
        goods_price:'',
        goods_number:'',
        goods_weight:'',
        goods_introduce:'',
      },
      //编辑对话框验证规则
      goodsEditRules:{
        goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
         goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
         goods_introduce: [
            { required: true, message: '请输入商品介绍', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
      },
      //编辑是选中的id
      selectGoodsId:'',
    }  
  },
  created(){
    this.getGoodsList();
  },
  methods:{
    async getGoodsList(){
      var {data:res} = await this.$http.get('/goods',{params:this.queryInfo})
      if(res.meta.status !== 200) return this.$message.error('获取商品列表失败')
       this.goodlist = res.data.goods
       this.total = res.data.total
       this.$message.success('获取商品列表成功')
       //console.log(this.goodlist)
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //监听页面值改变的事件
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    //跳转到添加页面
    goAddpage(){
      this.$router.push('/goods/add')
    },
    //展示编辑对话框的显示与隐藏
    async showGoodsDialog(id){
      this.goodsDialogVisible = true
      console.log(id)
      this.selectGoodsId = id
      //根据id获取需要编辑的数据
      var {data:res} = await this.$http.get('goods/'+id)
      if(res.meta.status !== 200){
        return this.$message.error('根据id请求数据失败')
      }
      this.$message.success('根据id请求数据成功')
      this.goodsIdlist = res.data
      console.log(this.goodsIdlist)
    },
    //提交编辑的数据
    editGoodsDialogVisible(){
      //表单预验证
      this.$refs.editRuleFormRef.validate(async valid =>{
        console.log(valid)
        if(!valid) return
        var {data:res} = await this.$http.put('goods/'+this.goodsIdlist.goods_id,this.goodsIdlist)
        // console.log(res.data)
          if(res.meta.status !==200) return this.$message.error('更新商品信息失败')
        
        
        this.goodsDialogVisible =false
        this.$message.success('编辑数据成功')
        this.getGoodsList()
      })
    },

    //删除商品
    async removeGoods(id){
      //console.log(id)
      var confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
       // console.log(confirmResult)
        if(confirmResult !== 'confirm') return this.$message.error('取消删除')
        var { data:res } = await this.$http.delete('goods/'+id)
        if(res.meta.status !== 200) return this.$message.error('删除商品失败')
        this.editGoodsDialogVisible = false
        this.getGoodsList()
        this.$message.success('删除商品成功')
    }
  }

}
</script>
<style scoped>
.mytables{font-size: 10px;}
</style>

