//vue-cli 3.0 工具生成的项目 默认是隐藏了所有的webpack的配置项 目的是为了屏蔽项目的配置过程 让程序员吧工作重心放到具体的功能和业务逻辑上
//若程序员有修改webpack配置项的需求则可以用此文件
module.exports = {
    chainWebpack:config =>{
        config.when(process.env.NODE_ENV === 'production',config =>{//这是产品发布阶段默认打包入口
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
              })
              
        })

        config.when(process.env.NODE_ENV === 'development',config =>{//这是产品开发阶段默认打包入口
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }
}
//默认情况下 通过import语法导入的第三方依赖包 最终会被打包并合并到同一个文件当中 从而导致打包成功后 单文件体积过大的问题
//为解决上述问题可通过webpack的external节点 来配置并加载外部的cdn资源 凡是声明在external中的第三方依赖包都不会被打包