<template>
  <div>
        <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
          <!-- 表格 -->
          <tree-table :data="cateList" :columns="columns"
           :selection-type="false" :expand-type="false" show-index index-text="#"
           border>
           <!-- 是否有效 -->
           <template slot="isok" slot-scope="scope">
               <i class="el-icon-success successcolor" v-if="scope.row.cat_deleted === false"></i>
               <i class="el-icon-error errorcolor" v-else></i>
           </template>
           <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag size="min" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="success" size="min" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="warning" size="min" v-else>三级</el-tag>
            </template>

               <!-- 操作 -->
            <template slot="opt" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>

           </tree-table>

           <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total='total'>
                </el-pagination>

      </el-card>
      <!-- 编辑对话框 -->
        <el-dialog
        title="编辑分类"
        :visible.sync="editDialogVisible"
        width="50%">
        <!--编辑 表单 -->
        <el-form :model="editCatList" :rules="editCatRules" ref="editCatRuleFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="editCatList.cat_name"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editCarInfo">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 添加分类对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCatDialogVisible"
        width="50%"
        @close="addCateDialogClosed">
        <!-- form表单 -->
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addForm.cat_name"></el-input>
            </el-form-item>

            <el-form-item label="父级分类">
                 <el-cascader
                    v-model="selectedKeys"
                    :options="addCatList"
                    :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children', checkStrictly: true }"
                    @change="parentCateChanged"
                    clearable>
                </el-cascader>
            </el-form-item>
           
       
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="addCatDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCateShop">确 定</el-button>
        </span>
        </el-dialog>

  </div>
</template>
<script>
export default {
  data(){
      return {
          queryInfo:{//获取列表数据的请求条件
              type:3,
              pagenum:1,
              pagesize:5
          },
          //商品分类数据列表
          cateList:[],
          //总数据调速
          total:0,
          //为table指定列的定义
          columns:[
              {
                  label:'分类名称',
                  prop:'cat_name',
              },
              {
                  label:'是否有效',
                  type:'template',//表示将当前列定义为模板列
                  template:'isok'//表示当前这一列使用的模板名称
              },
              {
                  label:'排序',
                  type:'template',//表示将当前列定义为模板列
                  template:'order'//表示当前这一列使用的模板名称
              },
              {
                  label:'操作',
                  type:'template',//表示将当前列定义为模板列
                  template:'opt'//表示当前这一列使用的模板名称
              }
          ],
          //编辑对话框的显示与隐藏
          editDialogVisible:false,
          //编辑 根据id请求的数据
          editCatList:{},
          //选中行的分类id'
          editCatId:'',
          //编辑中的验证规则
          editCatRules:{
              cat_name:[
                  { required: true, message: '请输入分类名称', trigger: 'blur' },
              ]
          },
          //用于控制添加对话框的显示隐藏
          addCatDialogVisible:false,
          //添加列表
          addForm:{
              cat_name:'',
              cat_pid:0,
              cat_level:0
          },
          //添加验证规则
          addRules:{
               cat_name:[
                  { required: true, message: '请输入分类名称', trigger: 'blur' },
              ]
          },
          //添加分类前获取的所有分类存在这里
          addCatList:[],
          //点击之后选中的父及分类的id数组
          selectedKeys:[],
      }
  },
  created(){
      this.getCategories()
  },
  methods:{
        //获取所有的分类数据列表
        async getCategories(){
            var { data:res } = await this.$http.get('categories/',{params:this.queryInfo})//+1
            // console.log(res)
            if(res.meta.status !==200){
                this.$message.error('商品分类数据获取失败')
            }
            this.cateList = res.data.result
            this.total = res.data.total
            this.$message.success('商品分类数据获取成功')
            //console.log(this.cateList)
        },
        //显示与隐藏编辑对话框
        async showEditDialog(id){
            this.editCatId=id
            this.editDialogVisible = true
            // console.log(id)
            //获取到选中行的数据信息
            var {data:res} = await this.$http.get('categories/'+id)
           
            this.editCatList = res.data
             // console.log(this.editCatList)
        },
        //提交编辑的数据
         editCarInfo(){
            this.$refs.editCatRuleFormRef.validate(async valid =>{
                if(!valid) return 

                 var {data:res} = await this.$http.put('categories/'+this.editCatId,{cat_name:this.editCatList.cat_name})
            if(res.meta.status !== 200) return this.$message.error('编辑分类失败')
            this.editDialogVisible = false
            this.getCategories()
            this.$message.success('编辑分类成功')
            })
           
        },
        //添加分类编辑框显示隐藏
        async showAddDialog(){
            this.addCatDialogVisible = true

            //获取所有的商品分类数据
            
            var { data:res } = await this.$http.get('categories')
            if(res.meta.status !==200){
                return this.$message.srror('添加分类前获取分类列表数据失败')
            }
            this.addCatList = res.data
            console.log(this.addCatList)
        },
        //只要选择项发生变化就会触发这个函数
        parentCateChanged(){
            //如果selectedKeys数组中的length大于0 则证明选中的父及分类
            //反之则证明没有选中任何父级分类
            if(this.selectedKeys.length > 0){
                //父及分类的id
                this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                //为当前分类的等级赋值
                this.addForm.cat_level =this.selectedKeys.length
                return
            }else{
                //父及分类的id
                this.addForm.cat_pid = 0
                //为当前分类的等级赋值
                this.addForm.cat_level =0
            }
            //console.log(this.selectedKeys)
        },
        //添加分类商品
         addCateShop(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return

                 // console.log(this.addForm)
            var {data:res} = await this.$http.post('categories',this.addForm)
            //  console.log(res)
            if(res.meta.status !==201){
                return this.$message.error('添加分类失败')
            }
            this.$message.success('添加分类成功')
            this.getCategories()
            this.addCatDialogVisible = false

            })
           
        },
        //监听对话框的关闭事件重置表单数据
        addCateDialogClosed(){
            this.$refs.addFormRef.resetFields()
            this.selectedKeys = []
            this.addForm.cat_level =0
            this.addForm.cat_pid =0
        },
          //监听pagesize改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize =newSize
            this.getCategories()
        },
        //监听页面值改变的事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCategories()
        }

  }
  
}
</script>
<style scoped>
.successcolor{
    color: lightgreen
}
.errorcolor{
    color: red
}
.el-cascader{
    width: 100%;
}
.el-button{
    margin-bottom: 15px;
}
</style>
