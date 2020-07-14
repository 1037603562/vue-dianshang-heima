<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="iscollapse ? '64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                 <el-menu
                 :default-active='activePath'
                 :router="true"
                 :collapse-transition="false"
                 :collapse="iscollapse"
                unique-opened
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409eff">
                <!-- 一级菜单 -->
                <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">  <!--:index接收的是一个字符串类型的值 而item.id是number类型 所有在后面加一个空字符串 就可以了  空字符串加数字等于字符串  -->
                    <!-- 一级菜单的模板区域 -->
                    <template slot="title">
                    <!-- 图标 -->
                     <i :class="iconsObj[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.authName}}</span>
                    </template>

                    <!-- 二级菜单 -->
                    <el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                        <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
               
                </el-menu>
  </el-col>
</el-row>
            </el-aside>
            <!-- 右侧主体区 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
                <pre>{{this.test}}</pre>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    //十.实现主页基本布局  --elementui中的Container 布局容器--常见页面布局--第四个复制出来
    //十一。实现左侧导航菜单 --elementui中的导航菜单的侧栏的自定义颜色 改造
    //十二。通过axios请求拦截添加token,保证拥有获取数据的权限
            //1.除了logoin页面之外其他的页面接口都需要权限认证才能使用 而登录时获取的token就是权限验证字段
            //2.具体操作在main.js的请求拦截器中
    //十三从服务器获取左侧菜单数据 定义方法getMenuList
    //十四通过双层for循环渲染左侧菜单  外层for循环一级菜单 内层for循环二级菜单
    //十五，美化菜单 1.高亮选中的菜单el-menu里面的 active-text-color 2.二级菜单图标改变 <i class="el-icon-menu"></i>
                    //3.一级图标修改，data中定义iconsObj对象，然后去一级图标那里去循环（以id为媒介）
    //十六。修改为手风琴式菜单，点开一个其他的关闭 --elementui 中的Menu Attribute 中unique-opened默认是false,改为true即可，或者直接写成unique-opened就行
                                //2.修改菜单栏边框不齐问题，只需要将el-menu的border-right改为none即可
    //十七。实现左侧菜单的折叠和展开功能   ---在菜单栏上方定义一个div,再在data定义一个布尔值，再在div上定义一个方法，再在el-aside 上用三目运算控制菜单宽度，还要取消折叠动画效果
    //十八.重定向页面到welcome;1.新建welcome页面，在路由里面导入页面，home路由下面建一个子路由welcome，在home路由上面重定向为welcome，最后在el-main中放一个路由占位符
    //十九。将左侧菜单改为路由连接；elementui 的Menu Attribute 中有个router可以实现
            //1.在el-menu上加:router="true"或者直接写router也行
            //2.将二级菜单的index当成跳转地址 即:index="'/'+subItem.path"
    //二十.实现点击用户列表，跳转到用户列表组件当中去 --新建user.vue,导入路由，在home组件下面配置user路由
    //二十一。保持菜单栏的激活状态（否则一刷新就没了激活状态）
                //1.ui中有个default-active可以使用
                //2.data中定义一个activepath,给二级菜单定义一个保存链接激活的方法saveNavState，该方法有实参'/'+subItem.path，
                //在方法中将实参保存到sessionstorage中，然后在created当中将sessionstorage中保存的值取出来赋值给data中的activePath，这样刷新的时候就有了，
                //最后在saveNavState方法中将activepath重新赋一下值，这样可以保证点击其他路由后回来再点击本路由是会有高亮效果
    //二十二去user.vue查看
data(){
    return {
        //左侧菜单数据
        menulist:[],
        iconsObj:{//一级菜单图标类
            '125':'el-icon-user-solid',
            '103':'el-icon-s-tools',
            '101':'el-icon-s-goods',
            '102':'el-icon-s-order',
            '145':'el-icon-s-platform',
        },
        iscollapse:false,//是否折叠菜单
        //被激活的链接地址
        activePath:'',
        test:[]
    }
},
created(){
    this.getMenuList(),
    this.activePath=window.sessionStorage.getItem('activePath')
},
  methods:{
      logout(){
          window.sessionStorage.clear()//清空token
          this.$router.push('/login')//重定向到登录页面
      },
      //获取所有的菜单
      async getMenuList(){
        //  var res=await this.$http.get('menus') 这样console.log出来的不止包括data数据 
        //还有一些其他的数据 而我们只需要data数据，所有可以
        //通过解构赋值吧data属性解构出来并且重命名为res进行接收 如下：
         var {data:res}=await this.$http.get('menus')
         if(res.meta.status !==200) return this.$message.error(res.meta.msg)//如果status不是200则请求失败，return失败消息
         this.menulist = res.data//否则就是请求成功，则将请求数据保存到menulist当中 
        console.log(res)
        this.test = res
      },
    //   点击按键切换菜单的折叠与展开
      toggleCollapse(){
            this.iscollapse=!this.iscollapse
      },
      //保存链接的激活状态
      saveNavState(activePath){
          window.sessionStorage.setItem('activePath',activePath)
          this.activePath=activePath
      }
  }
}
</script>
<style scoped>
/* header */
.el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;/*退出按钮上下贴边了 此代码可使其上下居中*/
    color: #fff;
    font-size: 20px;
}
.el-header div{
    display: flex;
    align-items: center
}
.el-header div span{
    margin-left: 15px;
}



.el-aside{
    background-color: #333744;
}
.el-menu{
    border-right: none;
}
.el-main{
    background-color: #eaedf1;
}
.home-container{
    height: 100%;
}
img{
    width: 15%;
    height: 15%; 
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;/*给文本加空格*/
    cursor: pointer;
}

</style>
