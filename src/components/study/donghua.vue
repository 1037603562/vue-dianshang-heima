<template>
    <div>
             <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>动画相关</el-breadcrumb-item>
          <!-- <el-breadcrumb-item>查看页面</el-breadcrumb-item> -->
      </el-breadcrumb>
        <h3>2d转换</h3>
        <img src="../../assets/donghua/2d-1.jpg" alt="">
         <img src="../../assets/donghua/2d-2.jpg" alt="">
          <img src="../../assets/donghua/transform.jpg" alt="">
         <h3>盒子水平垂直居中</h3>
          <img src="../../assets/donghua/水平居中.jpg" alt="">
          <img src="../../assets/donghua/水平居中2.jpg" alt=""><br><br>
          <h3>2d转换之旋转 rotate</h3>
          <p>2d旋转是指让元素在在2维平面内顺时针或者逆时针旋转</p>
          <p>过度写到本身上，谁做动画给谁加</p>
          <img src="../../assets/donghua/rotate1.jpg" alt="" class="xz"><br><br>

        <h3>2d转换中心点</h3>
        <div class="twodzx"></div>
         <img src="../../assets/donghua/2d转换中心点代码.jpg" alt=""  >
            <img src="../../assets/donghua/2d转换中心点代码2.jpg" alt=""  >
        <img src="../../assets/donghua/2d转换中心点.jpg" alt=""  >
        <h3>2d缩放</h3>
         <img src="../../assets/donghua/缩放.jpg" alt=""  >
         <img src="../../assets/donghua/缩放2.jpg" alt="" class="sf" >
         <h3>2d转换综合写法及顺序问题</h3>
         <img src="../../assets/donghua/顺序.jpg" alt=""  class="sx">
         <br><br><br>
         <h1>c3动画</h1>
         <img src="../../assets/donghua/动画1.jpg" alt=""  >
        <img src="../../assets/donghua/动画基本使用.jpg" alt=""  >
         <img src="../../assets/donghua/动画序列.jpg" alt=""  >
        <img src="../../assets/donghua/使用动画.jpg" alt=""  >
        <img src="../../assets/donghua/动画代码.jpg" alt=""  class="dhdm">
        <br>
        <h3>动画常见属性</h3>
        <img src="../../assets/donghua/动画常见属性.jpg" alt=""  class="seeShuxing">
        <h3>动画简写</h3>
        <img src="../../assets/donghua/动画简写.jpg" alt=""  >
        <h3>地图案例</h3>
        <div class="map">
            <div class="city">
                <div class="dotted"></div>
                <div class="pulse1"></div>
                <div class="pulse2"></div>
                <div class="pulse3"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style  scoped>
/* .one{
    width: 200px;
    height: 200px;
    background-color: pink;
    transform: translate(100px,100px)
} */
/* 2d转换旋转 */
.xz{
    /* 过度写到本身上，谁做动画给谁加 */
    transition: all 0.3s ease;
}
.xz:hover{
    /* 顺时针旋转45度 */
    transform: rotate(360deg);
}

/* 2d转换中心点 */
.twodzx{
    width: 100px;
    height: 100px;
    background-color: pink;
     /* 过度写到本身上，谁做动画给谁加 */
    transition: all 0.3s ease;
    /* transform-origin: left bottom; */
     transform-origin: 10px 10px;
}
.twodzx:hover{
    transform: rotate(360deg)
}
/* s缩放 */
.sf{
     transition: all 0.3s ease;
}
.sf:hover{
     
    transform: scale(1.1)
}
/* zo综合写法 顺序 */
.sx{
 transition: all 0.3s ease;
}
.sx:hover{
    transform: translate(150px,150px) rotate(180deg) scale(1.2)
}
/* 动画 */
@keyframes move {
    0%{
        transform: translateX(0)
    }
    25%{
        transform: translateX(1000px)
    }
     50%{
        transform: translate(1000px,500px)
    }
     75%{
        transform: translate(0px,500px)
    }
    100%{
        transform: translateX(0)
    }
}

.dhdm{
    animation-name: move;
    animation-duration: 2s;
}

/* 动画常见属性 */
@keyframes move1 {
    0%{
        transform: translateX(0)
    } 
    100%{
        transform: translateX(1000px)
    }
}
.seeShuxing{
    /* 动画名称 */
animation-name: move1;
/* 持续时间 */
animation-duration: 2s;
/* 运动曲线 */
animation-timing-function: ease;
/* 何时开始 */
animation-delay: 1s;
/* 播放次数 infinite（无数次）*/
animation-iteration-count:4;
/* s是否反方向播放 */
animation-direction: alternate;/*normal*/
/*  */
}
/* ditditd地图案例*/
.map{
    width: 200px;
    height: 200px;
    background-color: darkolivegreen;
    margin: 0 auto;
    position: relative;
}
.city{
    position: absolute;
    top: 10px;
    right: 10px;
    color: red;
}
.dotted{
    width: 8px;
    height: 8px ;
    background-color: #09f;
    border-radius: 50%;
}
.city div[class^="pulse"]{
    width: 8px;
    height: 8px;
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 12px #009dfd;
    border-radius: 50%;
    animation: pulse 1.2s linear infinite;
}
.city div.pulse2{
    animation-delay: 0.4s
}
.city div.pulse3{
    animation-delay: 0.8s
}
@keyframes pulse{
    0%{

    }
    70%{
     width: 40px;
     height: 40px;
     opacity: 1;   

    }
    100%{
        width: 70px;
        height: 70px;
        opacity: 0;
    }
}

</style>