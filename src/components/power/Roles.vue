<template>
  <div>
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图 -->
      <el-card>
          <!--添加角色按钮区域  -->
          <el-row>
              <el-col>
                  <el-button type="primary" @click="addRoles">添加角色</el-button>
              </el-col>
          </el-row>

          <!-- 角色列表区域 -->
          <el-table :data="rolelist" border stripe>
              <!-- 展开列 -->
              <el-table-column type="expand">
                  <template slot-scope="scope">
                      <el-row :class="['bdbottom',i1===0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                          <!-- 渲染一级权限 -->
                          <el-col :span="5">
                             <el-tag closable @close="removeRightByid(scope.row,item1.id)"> {{item1.authName}} </el-tag>
                             <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!--渲染二级和三级权限 -->
                          <el-col :span="19">
                              <!-- 通过for循环嵌套渲染二级权限 -->
                              <el-row v-for="(item2 ,i2) in item1.children" :key="item2.id" :class="[i2 ===0 ? '' : 'bdtop', 'vcenter']">
                                  <el-col :span="6">
                                      <el-tag type="success" closable @close="removeRightByid(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                       <i class="el-icon-caret-right"></i>
                                  </el-col>
                                  <el-col :span="18">
                                      <!-- 循环三级权限 -->
                                      <el-tag v-for="(item3 ,i3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightByid(scope.row,item3.id)">
                                          {{item3.authName}}
                                      </el-tag>
                                  </el-col>
                              </el-row>
                          </el-col>
                      </el-row>
                      <!-- <pre>{{scope.row}}</pre> -->
                  </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="角色名称" prop="roleName"></el-table-column>
              <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
              <el-table-column label="操作" width="300px">
                  <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(scope.row.id)">删除</el-button>
                      <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </el-card>

<!-- ffff分配权限的对话框 -->
<el-dialog
@close="setRightDialogClosed"
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%">
    <!-- 树形控件 -->
  <el-tree ref="treeRef":data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>

  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>

<!-- 添加角色对话框 -->
<el-dialog
  title="添加角色"
  :visible.sync="addRolesDialogVisible"
  width="50%">
  <!-- 表单 -->
  <el-form ref="addRolesformRef" :model="addrolesform" label-width="80px" :rules="addrolesRules">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addrolesform.roleName"></el-input>
  </el-form-item>
   <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addrolesform.roleDesc"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRolesreally">确 定</el-button>
  </span>
</el-dialog>


<!-- 编辑角色对话框 -->
<el-dialog
  title="编辑角色"
  :visible.sync="editDialogVisible"
  width="50%">
  <!-- form表单 -->
    <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="addrolesRules">
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>

         <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
        
    </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editDialogVisibleRoles">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>
<script>
//四十八 面包屑 卡片视图 获取角色数据
//四十九 实现表格的基础布局和渲染 添加展开列 只需要将type="expand"
//五十 渲染展开列 pre标签可以做结构美化 
        //1. 通过作用域插槽可以拿到展开列的信息
        //2.渲染一级权限  2.1利用栅格化系统分一下页面区域 2.2scope.row.children for循环
        //3.顶部 底部加边框线
        //4.渲染二级权限 32行
        //5.渲染三级权限
//五十一 el-tag上面有个close时间 通过该事件绑定删除函数 赋值messagebox l里面的弹出提示框，如果返回结果是confirm 则是取消删除 否则就是执行删除操作
//五十二 完成删除操作 109行
//五十三 分配权限 z在分配权限按钮上绑定单机事件 复制ele的对话框 定义一个布尔值 用来控制对话框的显示和隐藏，发起数据请求将返回的数据保存到dataz中定义好的rightsList当中
//五十四 引用tree组件 需要绑定data和props  node-key="id"(只要点击它 就是选中了它的id值)
//五十五 将角色已有的权限加载出来 通过树形控件上的default-checked-keys 可以默认选中 所有可以通过递归函数递归出当前角色已有权限的id 将该id放到defkeys当中
//五十六 分配权限的勾选项会一直在数组里面，多个就会累加起来，所有需要清除一下，定义setRightDialogClosed函数，将defkeys清空一下即可
//五十七 完成分配权限 首先定义分配权限的函数allotRights，定义一个keys用来保存分配的权限的id，keys里面保存的选中的id和半选中的id的获取方法在eled的树形控件的方法当中有分别是getCheckedKeys，getHalfCheckedKeys，当然要在tree上加一个引用，这样就可以通过树形控件的引用调用到这两个方法
        //发起提交请求 这时，提交参数中需要当前角色的id,该id在本函数上获取不到 需要在之前的方法showSetRightDialog上获取到，然后定义到data当中去，另一个参数就是保持选择id的那个数组keys 因为该参数需要以逗号为间隔的字符串 所有提交的是idStr

export default {
  data(){
      return {
          //所有角色列表数据
          rolelist:[],
          //控制分配权限对话框的显示与隐藏
          setRightDialogVisible:false,
          //所有权限的数据
          rightsList:[],
            //树形控件的属性绑定对象
          treeProps:{
              label:'authName',//指定需要显示的属性
              children:'children'//在咱们的数据结构中是通过children来实现父子节点的嵌套的
          },
          //默认选中的节点id值数组
          defKeys:[],
          //当前即将分配权限的角色id
          roleID:'',
        //控制添加对话框的显示与隐藏
        addRolesDialogVisible:false,
        //t添加角色表单数据
        addrolesform:{
            roleName:'',
            roleDesc:'',
        },
        //角色验证规则
        addrolesRules:{
                 roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                  { min: 3, max: 5, message: '长度在 6 到 10 个字符', trigger: 'blur' } ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
                        
        },
        //用于控制编辑对话框的显示与隐藏
        editDialogVisible:false,
        editForm:{
                roleName:'',
                roleDesc:''
        },
        //编辑提交的参数id
        editId:'',
       


      }
  },
  created(){
      this.getRolesList()
  },
  methods:{
      //获取所有角色的列表
      async getRolesList(){
          var {data : res} = await this.$http.get('roles')
          if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
          this.rolelist = res.data;
          console.log(this.rolelist)
      },
        //根据id删除对应的权限
     async removeRightByid(role,rightId){
        //弹框提示用户是否要删除
        var confirmResult= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== 'confirm'){
            return this.$message.info('取消删除')
        }
       // console.log('删除了')
       var {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)//反引号表示字符串
       if(res.meta.status !==200){
           return this.$message.error('删除权限失败')
       }
       //this.getRolesList(); 不建议使用这个 因为会发生之后整个列表的渲染
       role.children = res.data//用这个  吧服务器返回的最新的权限直接赋值给当前角色的children
      },
      //展示分配权限的对话框
      async showSetRightDialog(role){
          this.roleID =role.id//后续分配权限提交是用的
          //获取所有权限的数据
          var {data:res} = await this.$http.get('rights/tree')
          
          if(res.meta.status !==200){
              return this.$message.error('获取权限数据失败')
          }
          //把获取到的权限数据保存到data中
          this.rightsList = res.data
          console.log(this.rightsList)
          //递归获取三级节点的id
          this.getLeafKeys(role,this.defKeys)
          this.setRightDialogVisible = true
      },
      //通过递归的形式获取角色下所有三级权限的id 并保持到defkeys数组当中
      getLeafKeys(node,arr){
          //如果当前节点不包含chidlren属性 则是三级节点
          if(!node.children){//没有chidlren 是三级节点
              return arr.push(node.id)
          }
          node.children.forEach(item => this.getLeafKeys(item,arr))
      },
        //监听分配权限对话框的关闭事件
      setRightDialogClosed(){
          this.defKeys=[]
      },
      //点击为角色分配权限
     async allotRights(){//扩展运算符...,展开数组用的，比如a=[1,2,3],b=[...a] 就对等[1,2,3],并且是深拷贝而非浅拷贝
          //保存的数所有全选和半选状态的节点
          var keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
         // console.log(keys)
         var idStr=keys.join(',')//将keys数组变成以逗号为间隔的字符串

         var { data:res } = await this.$http.post(`roles/${this.roleID}/rights`,{rids:idStr})
         if(res.meta.status !== 200){
             return this.$message.error('分配权限失败')
         }
         this.$message.success('分配权限成功')
         this.getRolesList();//刷新列表
         this.setRightDialogVisible = false;//关闭对话框
          
      },
      //添加角色时控制对话框的显示与隐藏
      addRoles(){
          this.addRolesDialogVisible = true
      },
      //添加角色
       addRolesreally(){
          this.$refs.addRolesformRef.validate(async valid =>{
              //console.log(valid)
           
              if(!valid) return
              //var { data:res } = await this.$http.post('roles',this.addrolesform)
               var { data:res } = await this.$http.post('roles',this.addrolesform)
            //   console.log(res)
            if(res.meta.status !== 201){
                return this.$message.error('添加角色失败')
            }
            this.$message.success('添加角色成功')
            this.getRolesList()
            this.addRolesDialogVisible = false
          })
      },

      //删除角色
      async deleteRoles(id){
          
          var confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //console.log(confirmResult)
        if(confirmResult === 'cancel'){
            return this.$message.error('删除失败！')
        }else if(confirmResult === 'confirm'){
                var { data:res } = await this.$http.delete('roles/'+id)
                this.$message.success('删除成功！')
                this.getRolesList()
        }
        
      },
      //编辑角色中用于控制对话框的显示和隐藏
      async editRoles(id){
          this.editId=id
          this.editDialogVisible = true
          var { data:res } = await this.$http.get('roles/'+id)
          if(res.meta.status !==200) return this.$message.error('获取角色失败')
          this.editForm = res.data
      },
      //编辑角色
      editDialogVisibleRoles(){
          //预验证
          this.$refs.editFormRef.validate(async valid => {
              console.log(valid)
              if(!valid) return 
              var { data:res} = await this.$http.put('roles/'+this.editId,this.editForm)
              if(res.meta.status !==200) return this.$message.error('编辑角色失败')
              this.editDialogVisible = false
              this.getRolesList();
              this.$message.success('编辑角色成功')

          })
      }

  }

}
</script>
<style scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee
}
.bdbottom{
    border-bottom: 1px solid #eee
}
.vcenter{
    display: flex;
    align-items: center
}

</style>

