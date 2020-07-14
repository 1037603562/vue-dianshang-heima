<template>
  <div class="login_container">
     <div class="login_box">
         <!-- 头像区域 -->
         <div class="avatar_box">
             <img src="../assets/logo.png" alt="">
         </div>
         <!-- 登录表单区域 -->
         <el-form ref="loginFormref"  label-width="0" class="login_form" :model="loginForm" :rules="loginFormRules">
             <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
             <el-form-item prop="password">
                <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
            </el-form-item>

            <!-- 按钮 -->
            <el-form-item class="btns">
               <el-button type="primary" plain @click="login">登录</el-button>
               <el-button type="info" plain @click="resetLoginForm">重置</el-button>
            </el-form-item>

         </el-form>
     </div>
  </div>
</template>
<script>
export default {
  //一.对form表单进行v-model的数据双向绑定  --先在el-form 进行属性绑定 :model="loginForm",然后在data中定义它，在进一步定义username和password,最后在el-input上面通过v-model实现数据绑定
  //二.实现表单数据验证                    --先在el-form 上绑定一个规则 :rules="loginFormRules",然后在data中定义它，在进一步定义username和password的相应规则,然后在通过prop将username和password绑定到el-form-item上
  //三.实现表单重置功能
  //四.实现登录前表单数据的预验证           --@click="login  elementui的form表单中有个validate方法
  //五.配置axios发起登录请求
  //六.配置登录成功或失败的弹框提示          --elementui中有一个message消息提示 用法：  this.$message.success('登录成功')  this.$message.error('登录失败')
  //七.完善登录之后的操作
  //八。路由导航守卫控制页面访问权限，去router下的index.js中看
  //九.实现退出功能 核心为清除token值,去home.vue的logout()查看
  //十.去home.vue
  data(){
    return {
       loginForm:{//这是登录表单的数据绑定对象
          username:'admin',
          password:'123456' 
       },
      //z这是表单的验证规则
      loginFormRules:{
            username:[  //验证用户名是否合法
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到10 个字符', trigger: 'blur' }
                    ],
            //验证密码是否合法       
            password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到15 个字符', trigger: 'blur' }
            ]
      }
    }
  },
  methods:{
    resetLoginForm(){
      //点击重置按钮，重置登录表单   方法：elementuiform表单下的methods有个resetFields（）的重置方法，通过在el-form上面添加ref="loginFormref"的引用 ,就可以在this的$refs的loginFormref访问重置方法
     // console.log(this)
  
     this.$refs.loginFormref.resetFields();
    },
    login(){//登录
    //注意：如果返回的是一个promise对象，则需要在在this.$http前面加一个await来简化promise操作，有因为await只能用作被async修饰的方法中 所有需要把紧挨着await的箭头函数方法 前面 加上async 
    this.$refs.loginFormref.validate(async valid => {//validate接收一个回调函数，从而拿到验证的结果
       if(!valid) return;//如果valid的值是false 则return 不发起请求
          var result = await this.$http.post('login',this.loginForm)
      console.log(result.data) 
        if(result.data.meta.status !== 200){
          this.$message.error('登录失败')
          console.log("登录失败")
        }else{
              this.$message.success('登录成功')
          console.log("登录成功")
           //完善登录成功之后的操作
        // 1.将登陆成功之后的token保存到客户端的sessionstorage中  localstorege是持久化的保存机制，sessionstorage是会话期间的保存机制
        //   1.1项目中除了登录之外的其他api接口必须在登录成功之后才能访问
        //   1.2token只应当在当前网站打开是生效，所有将token保存在sessionstorage中
        
        window.sessionStorage.setItem('token',result.data.data.token)
        // 2.通过编程式导航跳转到后台主页，路由地址是home 
        this.$router.push('/home')
    }
        }
       
    )

    }
  }
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;

  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
