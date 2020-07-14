<template>
  <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
          <!-- 搜索与添加 -->
         

          <el-row :gutter="25">
              <el-col :span="8">
                   <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                      <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                   </el-input>
              </el-col>
              <el-col :span="4">
               <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
              </el-col>
          </el-row>

          <!-- 用户列表 -->
          <el-table :data="userlist" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="姓名" prop="username"></el-table-column>
              <el-table-column label="邮箱" prop="email"></el-table-column>
              <el-table-column label="电话" prop="mobile"></el-table-column>
              <el-table-column label="角色" prop="role_name"></el-table-column>
              <el-table-column label="状态" prop="mg_state">
                  <template slot-scope="scope">
                      <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                  
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                       <!-- 修改按钮 -->
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                      <!-- 删除按钮 -->
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserByid(scope.row.id)"></el-button>
                      <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetUserDialog(scope.row)"></el-button>
                        </el-tooltip>
                </template>
              </el-table-column>
          </el-table>


          <!-- 分页区域 -->
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
<!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible"  width="50%" @close="addDialogClosed">
          <!-- 内容主体区域 -->
           <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>

                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
           </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
    </el-dialog>

<!-- 修改用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogVClosed">
             <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email" ></el-input>
                    </el-form-item>

                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile" ></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色权限对话框 -->
        <el-dialog
  title="分配角色"
  :visible.sync="showRolesDialogVisible"
  width="50%" @close="setRoleDialogClosed">
  <!-- 表单 -->
    <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
             <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
                </el-option>
            </el-select>
        </p>
    </div>

 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>
<script>
//二十二.基本布局
    //1.面包屑  2.卡片视图 栅格视图
//二十三.获取用户列表数据  --getUserList
//二十四。渲染用户数据表格
//二十五。列表当中的状态整理  --<template slot-scope="scope">
                            //   {{scope.row}}
                            // </template>
                            //最后调用el-switch组件
//二十六 利用作用域插槽完成操作列
//二十七 分页
//二十八 改变用户的状态    --1.监听switch开关的状态 ele中有个change事件可以监听  2.调用接口将状态同步到服务器当中
//二十九 搜索功能 --对搜索框进行双向数据绑定v-model   然后按钮添加点击事件即可
//三十 添加用户  --ele 中dialog可用 在按钮绑定单机事件 赋值为true即可显示添加页面
//三十一 添加用户渲染表单
//三十二 自定义校验规则（邮箱手机）  --var checkEmail = (rule,value,cb)=>{ -- {validator:checkEmail,trigger:'blur'}
//三十三 添加用户表单重置      --1.监听对话框的close事件 2.在close事件的处理函数中拿到表单的引用调用resetFields()
//三十四 实现添加用户前的表单预验证  --在按钮上定义adduser方法，拿到表单的引用调用validate方法即可预验证表单
//三十五 调用接口完成用户添加
//三十六 渲染编辑对话框    --修改按钮绑定点击事件showEditDialog，data中定义一个布尔值来控制对话框的显示和隐藏，在点击事件中将布尔值改为true
//三十七 根据id 查询出对应的用户信息  --定义的方法showEditDialog(id)加一个形参，修改按钮那里的点击事件可以通过作用域插槽获取到实参id
        //通过id发起网络请求 获取到对应的数据存放在已经定义好的editForm当中
//三十八 渲染修改用户的列表 粘贴一个表单项  改造 验证规则 
//三十九 修改用户-实现修改用户表单的重置操作  editDialogVClosed  注意：此步的意义是 验证会报红字错误 可吧红字错误去掉
//四十  修改表单的预验证  --确定按钮绑定单机事件 通过表单的引用点出validate方法 进行验证 
//四十一 提交表单完成信息的修改  --
//四十二 删除用户  --在删除按钮绑定单机事件removeUserByid，借用ele的弹框组件，
//四十三 完成删除用户操作

export default {
  data(){
      //验证邮箱的规则
       var checkEmail = (rule,value,cb)=>{
           //验证邮箱的正则表达式
           var regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
           //var regEmail = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
           if(regEmail.test(value)){
               //合法的邮箱
               return cb()
           }
           cb(new Error('请输入合法的邮箱'))
       },
        //验证手机的规则
         checkMobile = (rule,value,cb)=>{
            //验证手机的正则表达式
            var regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            //var regMobile = /0?(13|14|15|18|17)[0-9]{9}/
            if(regMobile.test(value)){
                return cb()
            }
            cb(new Error('请输入合法手机号'))
            
        }
    return {
        //获取用户列表的参数对象
        queryInfo:{
          query:'',//搜索
          pagenum:1,//页数
          pagesize:5//每页显示条数
        },
        userlist:[],//获取到的用户数据保存在这里
        total:0,//总数据调速
        addDialogVisible:false,//控制添加对话框的显示和隐藏
        addForm:{//添加用户的表单数据
                username:'',
                password:'',
                email:'',
                mobile:'',
        },
        addFormRules:{//添加表单的验证规则对象
            username:[
                { required: true,message:'请输入用户名',trigger:'blur'},
                { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
            ],

            password:[
                 {required:true,message:'请输入密码',trigger:'blur'},
                { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
            ],

             email:[
                 {required:true,message:'请输入邮箱',trigger:'blur'},
                {validator:checkEmail,trigger:'blur'}
            ],

            mobile:[
                 {required:true,message:'请输入手机',trigger:'blur'},
                {validator:checkMobile,trigger:'blur'}
            ],


        },
        //控制修改对话框的显示与隐藏
       editDialogVisible:false,
       //查询到的用户信息对象
       editForm:{},
        //修改表单的验证规则对象
       editFormRules:{
             email:[
                 {required:true,message:'请输入邮箱',trigger:'blur'},
                {validator:checkEmail,trigger:'blur'}
            ],

            mobile:[
                 {required:true,message:'请输入手机',trigger:'blur'},
                {validator:checkMobile,trigger:'blur'}
            ],


        },
        //控制分配权限对话框的显示和隐藏
        showRolesDialogVisible:false,
        //需要被分配角色的用户信息
        userInfo:{},
        //所有角色的数据列表
        rolesList:[],
        //已选中的角色id值
        selectedRoleId:[],
        
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
      async getUserList(){//获取用户列表数据
        var { data:res } =await this.$http.get('users',{params:this.queryInfo})
       // console.log(res)
        if(res.meta.status !==200) return this.$message.error('获取用户列表失败')

        this.userlist = res.data.users
        this.total = res.data.total
      },
    //监听pagesize改变的事件
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
         // console.log(newSize)
         this.getUserList()
      },
      //监听页面值改变的事件
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
         //console.log(newPage)
         this.getUserList();
      },
        //监听switch开关状态的改变
      async userStateChange(userInfo){
          console.log(userInfo)
         var {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
         if(res.meta.status !== 200) {
             userInfo.mg_state=!userInfo.mg_state
             return this.$message.error('更新用户状态失败')
         }
         this.$message.success('更新状态成功')
      },
        //监听添加用户对话框的关闭事件
      addDialogClosed(){
          this.$refs.addFormRef.resetFields()
      },
      //点击按钮添加新用户
      addUser(){
             this.$refs.addFormRef.validate(async valid => {
               console.log(valid)
                if(!valid) return //如果valid校验失败则直接return
                //否则，就是校验通过，可以发起添加用户的网络请求
                var { data:res } = await this.$http.post('users',this.addForm)
                if(res.meta.status !==201) return this.$message.error('用户添加失败')
                this.$message.success('用户添加成功')
                this.addDialogVisible = false //隐藏对话框
                this.getUserList()//重新获取用户列表数据

             })
      },
        //展示编辑用户的对话框
      async showEditDialog(id){
         // console.log(id)
           this.editDialogVisible = true
          var { data: res } =await this.$http.get('users/'+id)
            if(res.meta.status !==200) return this.$message.error('查询用户数据失败')
            this.editForm = res.data
            console.log(this.editForm )
       
      },
        //监听修改用户对话框的关闭事件
      editDialogVClosed(){
           this.$refs.editFormRef.resetFields()
      },
      //修改用户信息并提交
      editUserInfo(){
          this.$refs.editFormRef.validate(async valid => {
            //   console.log(valid)
            if(!valid) return
            //发起用户修改的数据请求
            var {data:res} = await this.$http.put('users/'+this.editForm.id,
            {email:this.editForm.email,
            mobile:this.editForm.mobile})
            if(res.meta.status !==200) return this.$message.error('更新用户信息失败')
            
            //关闭对话框
            this.editDialogVisible = false
            //刷新数据列表
            this.getUserList()
            //提示修改成功
            this.$message.success('更新用户信息成功')

          })
      },
      //g根据id删除对应的信息
      async removeUserByid(id){
        //   console.log(id)
          //弹框询问用户是否删除数据
           var confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)//用catch捕获了那个错误消息 并吧这个错误消协return给了confirmResult来进行接收
        //r如果用户确认删除 则返回值为字符串confirm
        //如果用户取消了删除 则返回值为字符串cancel
        // console.log(confirmResult)
        if(confirmResult !== 'confirm'){
            return this.$message.info('已经取消删除')
        }
        //完成删除用户操作
        var {data:res}=await this.$http.delete('users/'+id)
        if(res.meta.status!==200){
            return this.$message.error('删除用户失败')
        }
        this.$message.success('删除用户成功')
        this.getUserList();
        //console.log('确认了删除')
      },
      ////展示分配权限的对话框
      async showSetUserDialog(userInfo){
          this.userInfo = userInfo
          //在展示对话框之前获取所有角色的列表
          var { data:res } = await this.$http.get('roles')
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败')
            }
            this.rolesList = res.data

          this.showRolesDialogVisible = true
      },

      //点击按钮分配角色
      async saveRoleInfo(){
          if(!this.selectedRoleId){
              return this.$message.error('请分配新角色！')
          }

          var { data : res } = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
          if(res.meta.status !== 200){
              return this.$message.error('更新角色失败')
          }
          this.$message.success('更新角色成功')
          this.getUserList();
          this.showRolesDialogVisible = false
      },
        //监听分配角色对话框的关闭事件
      setRoleDialogClosed(){
          this.selectedRoleId = ''
          this.userInfo = {}
      }

  }
}
</script>
<style scoped>

</style>
