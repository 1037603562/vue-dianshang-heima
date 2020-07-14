<template>
  <div>
     <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
         <!-- 卡片视图 -->
      <el-card>
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
        <label>选择商品分类 : </label>
          <el-cascader
           v-model="selectedKeys"
          :options="cateList"
          :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
          @change="parentCateChanged"></el-cascader>

          <!-- tab选项卡 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
              <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加参数</el-button>
                <el-table border stripe :data="manyTableDate">
                  <!-- 展开行 -->
                   <el-table-column  type="expand">
                      <template slot-scope="scope">
                        <!-- 循环渲染tag标签 -->
                          <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                          <!-- s输入的文本框 -->
                          <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!-- 添加的按钮 -->
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>


                       </template>
                   </el-table-column>
                    
                 
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                  <el-table-column label="操作">
                      <template slot-scope="scope">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editShowManyDialog(scope.row)">修改</el-button>
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMany(scope.row)">删除</el-button>
                      </template>
                  </el-table-column>
                </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
              <el-button type="primary" size="mini"  :disabled="isBtnDisable" @click="addDialogVisible=true" >添加属性</el-button>

               <el-table border stripe :data="onlyTableDate">
                  <!-- 展开行 -->
                   <el-table-column  type="expand">
                      <template slot-scope="scope">
                        <!-- 循环渲染tag标签 -->
                          <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                          <!-- s输入的文本框 -->
                          <el-input
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <!-- 添加的按钮 -->
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>


                       </template>
                   </el-table-column>
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                   <el-table-column label="操作">
                      <template slot-scope="scope">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editShowManyDialog(scope.row)">修改</el-button>
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMany(scope.row)">删除</el-button>
                      </template>
                  </el-table-column>
                </el-table>

          </el-tab-pane>
          </el-tabs>
      </el-card> 

    <!-- 添加参数对话框 -->
    <el-dialog
  :title="'添加'+titleText"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed">
  <!-- 添加参数的对话框 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
      <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParms">确 定</el-button>
  </span>
</el-dialog>

<!-- 编辑参数对话框 -->
<el-dialog
  :title="'修改'+titleText"
  :visible.sync="editManyDialogVisible"
  width="50%">
  <!-- form表单 -->
  <el-form :model="editManyForm" :rules="editManyFormRules" ref="editManyFormRef" label-width="100px">
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="editManyForm.attr_name"></el-input>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editManyDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editManyDhow">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return {
      cateList:[],
       queryInfo:{//获取列表数据的请求条件
              type:3,
              pagenum:1,
              pagesize:5
          },
           //点击之后选中的父及分类的id数组
          selectedKeys:[],
          activeName: 'many',
          //动态参数的数据保存
          manyTableDate:[],
          //静态参数的数据保存
          onlyTableDate:[],
            //控制添加对话框的显示与隐藏
          addDialogVisible:false,
          //添加参数的的表单数据对象
          addForm:{
              attr_name:''
          },
          //添加表单的验证规则对象
          addFormRules:{
            attr_name:[
              { required: true, message: '请输入参数名称', trigger: 'blur' },
            ]
          },
          //编辑对话框的显示隐藏
          editManyDialogVisible:false,
          //编辑数据保存
          editManyForm:{
            attr_name:'',
            attr_sel:'many'
          },
          //编辑验证规则
          editManyFormRules:{
              attr_name: [
            { required: true, message: '请输入动态参数', trigger: 'blur' },
               ],
          },
          //编辑提交所需的分类id
          editManyCatid:'',
          //编辑提交所需的属性id
          editManyAttrid:'',
         
    }

  },
  created(){
    this.getCategories()
    this.handleClick()
  },
  methods:{

     //获取所有的分类数据列表
        async getCategories(){
            var { data:res } = await this.$http.get('categories')
            //console.log(res)
            if(res.meta.status !==200){
                this.$message.error('商品分类数据获取失败')
            }
           
           // console.log(res.data)
            this.cateList = res.data
            this.$message.success('商品分类数据获取成功')
           // console.log(this.cateList)
        },
        //只要选择项发生变化就会触发这个函数
        parentCateChanged(){
          this.handleClick()
          //如果选择的不是三级分类而是一级二级的 则需要将动态和静态面板的数据清空，级联选择框的也要 清空
           if(this.selectedKeys.length!==3){
          this.selectedKeys = []
          this.manyTableDate = []
          this.onlyTableDate = []
          return
        }
        },
       //tab面板的点击事件
       async handleClick(){
         this.getCategories()
       // console.log(this.activeName)
        var {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
        if(res.meta.status !==200){
          return this.$message.error('获取参数列表失败')
        }
       
         res.data.forEach(item =>{
              item.attr_vals = 
              item.attr_vals ? item.attr_vals.split(' ') : []
                //控制文本框的显示与隐藏
              item.inputVisible = false
              //文本框中输入的值
              item.inputValue=''
            })
              

        console.log(res.data)
        if(this.activeName === 'many'){
          this.manyTableDate = res.data
        }else{
          this.onlyTableDate = res.data
        }

        },
        //监听添加对话框的关闭事件
        addDialogClosed(){
          this.$refs.addFormRef.resetFields()
        },
        //点击按钮添加参数
        addParms(){
            this.$refs.addFormRef.validate(async valid =>{
              if(!valid) return
              var {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                               attr_name:this.addForm.attr_name,
                               attr_sel:this.activeName                           
              })
              if(res.meta.status !== 201){
                return this.$message.error('添加参数失败')
              }
              this.$message.success('添加参数成功')
              this.addDialogVisible = false
             this.handleClick()
            })
        },
        //编辑参数对话框的显示隐藏
        editShowManyDialog(row){
          this.editManyDialogVisible = true
          this.editManyForm.attr_name = row.attr_name
          this.editManyCatid= row.cat_id
          this.editManyAttrid= row.attr_id
            console.log(row)
        },
        //编辑提交many
        async editManyDhow(){
          //console.log(this.activeName)
          var { data:res }= await this.$http.put(`categories/${this.editManyCatid}/attributes/${this.editManyAttrid}`,{
            attr_name:this.editManyForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.meta.status !== 200){
            return this.$message.error(this.titleText+'编辑失败')
          }
          this.editManyDialogVisible = false
          this.handleClick()
          this.$message.success(this.titleText+'编辑成功')
        },
        //删除
        async deleteMany(row){
            var confirmResult= await this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error =>error)
        console.log(row)
        //console.log(confirmResult)
        if(confirmResult !== 'confirm') return this.$message.error('取消删除')

        var {data:res} = await this.$http.delete(`categories/${row.cat_id}/attributes/${row.attr_id}`)
        if(res.meta.status !==200) return this.$message.error('删除失败')
        this.handleClick()
        this.$message.success('删除成功')
        },
        //文本框失去焦点 或按下了enter键都会触发
       async handleInputConfirm(row){
          if(row.inputValue.trim().length ===0){
            row.inputValue = ''
            row.inputVisible= false
            return
          }
      //如果没有return则证明输入了内容 需要做后续处理
      
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      //此时只是将新增的数据保存到了前端的这个数组中了 并没有保存到后端
      //所以需要发起请求保存这次操作的数据
      this.saveAttrvals(row)
        },
        //将对attr-vals的操作保存到数据库
        async saveAttrvals(row){
          var {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })

      if(res.meta.status !== 200) return this.$message.error('修改参数项失败')
      this.$message.success('修改参数项成功')
        },
        //dian点击按钮展示文本输入框
        showInput(row){
            row.inputVisible = true
            //让文本框自动获得焦点 这个是ele动态编辑标签中的方法
            //$nextTick 方法的作用：当页面上元素被重新渲染之后 才会执行回调函数中的代码
             this.$nextTick(_ => {
               this.$refs.saveTagInput.$refs.input.focus();
        });
        },
        //删除对应的c参数可选项
        handleClose(i,row){
          row.attr_vals.splice(i,1)
          this.saveAttrvals(row)
        }


              
  },
  computed:{
    //如果按钮需要被禁用 则返回true否则返回false
    isBtnDisable(){
        if(this.selectedKeys.length !==3){
          return true
        }
        return false

    },
    //当前选中的三级分类的id
    cateId(){
       if(this.selectedKeys.length ===3){
         return this.selectedKeys[2]
       }
       return null
    },
    //动态计算标题的文本
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }
      return '静态属性'
    }

  }
}
</script>
<style scoped>
.el-tag{
  margin: 5px;
}
.input-new-tag{
  width: 120px;
}
</style>
