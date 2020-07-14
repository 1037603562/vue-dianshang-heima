import Vue from 'vue'
import VueRouter from 'vue-router'
//import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName:"login_home_welcome"*/ '../components/Login.vue')
//import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome"*/ '../components/Home.vue')
//import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome"*/ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
const Users = () => import(/* webpackChunkName:"Users_Rights_Roles"*/ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName:"Users_Rights_Roles"*/ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName:"Users_Rights_Roles"*/ '../components/power/Roles.vue')

// import Goods from '../components/goods/Goods.vue'
// import Add from '../components/goods/Add.vue'
const Goods = () => import(/* webpackChunkName:"Goods_Add"*/ '../components/goods/Goods.vue')
const Add = () => import(/* webpackChunkName:"Goods_Add"*/ '../components/goods/Add.vue')

// import Categories from '../components/categories/Categories.vue'
// import Params from '../components/categories/Params.vue'
const Categories = () => import(/* webpackChunkName:"GCategories_Params"*/ '../components/categories/Categories.vue')
const Params = () => import(/* webpackChunkName:"GCategories_Params"*/ '../components/categories/Params.vue')

// import Orders from  '../components/orders/Orders.vue'
// import See from  '../components/orders/See.vue'
// import Report from '../components/report/Report.vue'
const Orders = () => import(/* webpackChunkName:"Orders_See_Report"*/ '../components/orders/Orders.vue')
const See = () => import(/* webpackChunkName:"Orders_See_Report"*/ '../components/orders/See.vue')
const Report = () => import(/* webpackChunkName:"Orders_See_Report"*/ '../components/report/Report.vue')


//学习资料相关路由
import Myvuex from '../components/study/Myvuex.vue'
import Vfor from '../components/study/Vfor.vue'
import Chuanzhi from '../components/study/Chuanzhi.vue'
import Myaddrouters from '../components/study/Myaddrouters.vue'
import Donghua from '../components/study/donghua.vue'

Vue.use(VueRouter)

  const routes = [
    {path:'/',redirect:'/login'},
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      // 学习资料相关路由
      {
        path:'/welcome/myvuex',
        component:Myvuex
      },
      {
        path:'/welcome/vfor',
        component:Vfor
      },
      {
        path:'/welcome/chuanzhi',
        component:Chuanzhi
      },
      {
        path:'/welcome/Myaddrouters',
        component:Myaddrouters
      },
      {
        path:'/welcome/donghua',
        component:Donghua
      },

      //***************
      {
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/goods',
        component:Goods
      },
      {
        path:'/goods/add',
        component:Add
      },
      {
        path:'/categories',
        component:Categories
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/orders',
        component:Orders
      },
      {
        path:'/orders/see',
        component:See
      },
      {
        path:'/reports',
        component:Report
      },
    ]
  },
]

const router = new VueRouter({
  routes
})


//挂载路由导航守卫
router.beforeEach((to,from,next) => {
//to将要访问的路径 from从哪个路径跳转而来，next是一个函数表示放行 
//有2中放行方式：第一种直接next()放行   第二种：强制跳转到某个路由 next('/login)
if(to.path === '/login') return next();//如果用户访问的是login页面 则直接放行  因为login页面不需要权限
//如果访问的不是login页面则需要权限才可以访问 所有先获取token
var tokenStr = window.sessionStorage.getItem('token')
if(!tokenStr) return next('/login')//如果token为空 则表示没有登录 则强制跳转到login页面
next();//否则就是有token，有token的话就直接放行      

})

export default router
