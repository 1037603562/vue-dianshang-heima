import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueQuillEditor from 'vue-quill-editor'//导入富文本编辑器
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//全局注册富文本编辑器
Vue.use(VueQuillEditor, /* { default global options } */)



Vue.config.productionTip = false

//导入全局样式表
import './assets/css/global.css'

// import VueResource from 'vue-resource'

// /*使用VueResource插件*/
// Vue.use(VueResource)

//导入nprogress包对应的js 和css  这个是页面顶部的那个进度条
import NProgress from 'nprogress' 
import 'nprogress/nprogress.css'

import axios from 'axios'//接口2备用：https://www.liulongbin.top:8888/api/private/v1/
axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'//http://119.23.53.78:8888/api/private/v1/login?username=admin&password=123456
//axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'//这个是自己搭建的后台接口
//axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
//请求拦截器--简单理解就是在每次发送api请求到达服务器之前会将请求拦截下来，吧token值加上 再发送给服务器进行权限验证

//在request拦截器中展示进度条  NProgress.start()
axios.interceptors.request.use(config => {
  //axios.interceptors后面的request就是一个请求拦截器，我们可以通过use函数为请求拦截器挂载一个回调函数
  //只要你通过axios项服务端发了一次数据请求，那么必然会在发送请求期间优先调用use这个回调函数。也就是请求在到达服务器之前
  //先调用一下这个回调函数,对咱们的请求做一下预处理，return config 就代表咱们已经对其做了一次预处理
  //console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')//为config做预处理--在config.headers下面手动加一个Authorization字段 赋值为预先保存的token
  //在最后必须return config
  return config
})

//在response拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config =>{
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

//时间过滤器
Vue.filter('dataFormat',function(mydate){
  var dt = new Date(mydate)
  var y=dt.getFullYear()
  var mm=(dt.getMonth()+1+'').padStart(2,'0')
  var dd=(dt.getDate()+'').padStart(2,'0')

  var hh=(dt.getHours()+'').padStart(2,'0')
  var mm=(dt.getMinutes()+'').padStart(2,'0')
  var ss=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${mm}-${dd} ${hh}:${mm}:${ss}`
})

//导入elementui
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
import './plugins/elements.js'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)













new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
