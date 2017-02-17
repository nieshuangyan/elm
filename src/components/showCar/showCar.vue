<template>
<div class="showCar">
  <div class="content" @click="foldList">
    <div class="content-left">
      <div class="logo-wrapper">
        <div class="logo" :class="{'hightLight':totalCount>0}">
          <i class="icon-shopping_cart"></i>
        </div>
        <div class="num" v-show="totalPrice>0">{{totalCount}}</div>
      </div>
      <div class="price" :class="{'hightLight':totalPrice>0}">￥{{totalPrice}}元</div>
      <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
    </div>
    <div class="content-right">
      <!-- 阻止事件冒泡 @click.stop.prevent -->
      <div class="pay" :class="getenough" @click.stop.prevent="parTO">
        {{pay}}
      </div>
    </div>
    <div class="content1">

    </div>
  </div>
  <!-- <div class="ball-container">
    <div v-for="ball in balls">
      <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
      <transition name="fade">
        <div class="ball" v-show="ball.show" >
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>
  </div> -->
  <!-- <div class="ball-container">
    <transition name="fade">
    <div class="ball">
      <div class="inner inner-hook"></div>
    </div>
    </transition>
  </div> -->
  <transition name="show">
    <div class="showCar-list" v-show="listShow">
      <div class="showCarWrapper">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="clear">清空</span>
        </div>
        <div class="list-content" ref="contentwrapper">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="carControl-wrapper">
                <carControl :food="food"><carControl>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="background" @click="hideList"></div>
    </div>
  </transition>
  <!-- <div class="background"></div> -->

</div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll"
import carControl from "../carControl/carControl"
export default{
  props:{
    deliveryPrice:{
      type:Number,
      default:0
    },
    minPrice:{
        type:Number,
        default:0
    },
    selectFoods:{
        type:Array,
        default(){
          return[
            // {
            //   price:0,
            //   count:0
            // }
          ]
        }
    }
  },
  data(){
    return {
      balls:[
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        },
      ],
      dropBalls:[],
      fold:true
    }
  },
  computed:{
    totalPrice(){
      // console.log(this.selectFoods);
      let total=0;
      // for(let i=0,len=this.selectFoods.length;i<len;i++){
      //   total+=this.selectFoods[i].price*this.selectFoods[i].count;
      // }
      this.selectFoods.forEach(function(food){
        total+=food.price*food.count;
      });
      return total;
    },
    totalCount(){
      let count=0;
      this.selectFoods.forEach(function(food){
        count+=food.count;
      });
      return count;
    },
    pay(){
      if(this.totalPrice===0){
        console.log("1")
        return `￥${this.minPrice}元起送`;
      }else if(this.totalPrice<this.minPrice){
        console.log("2")
        return  `还差￥${this.minPrice-this.totalPrice}元起送`
      }else{
        console.log("3")
        return "去结算"
      }
    },
    getenough(){
      if(this.totalPrice<this.minPrice){
        console.log("11:"+this.totalPrice)
        return " "
      }else{
        console.log("12:")
        return "enough";
      }
      // return "noenough";
    },
    listShow(){
      console.log('this.totalCount:'+this.totalCount)
      if(!this.totalCount){
        this.fold=true;
        return false;
      }
      let show=!this.fold;
      if(show){
        this.$nextTick(function (){
          if(!this.scroll){
            this.scroll=new BScroll(this.$refs.contentwrapper,{
              click:true,
              // 监控x,y值
              probeType:3,
            });
          }else{
            this.scroll.refresh();
          }
        });
      }
      return show;
    },
  },
  methods:{
    carAdd(target){
      console.log(target)
      // 遍历第一个show为false球取出来做动画
      for(let i=0,len=this.balls.length;i<len;i++){
        let ball=this.balls[i];
        if(!ball.show){
          ball.show=true;
          ball.el=target;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeEnter(el) {
      let count=this.ball.length;
      while(count--){
        let ball=this.balls[count];
        if(ball.show){
          let rect=ball.el.getBoundingClientReact();
          let x=rect.left-32;
          let y=-(window.innerHeight-rect.top-22);
          console.log('111beforeEnter');
          console.log(`x:${x}`);
          console.log(`y:${y}`);
          el.style.display="";
          el.style.webkitTransform=`translate3D(0,${y}px,0)`;
          el.style.transform=`translate3d(0,${y}px,0)`;
          let inner=el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform=`translate3d(${x}px,0,0)`;
          inner.style.transform=`translate3D(${x}px,0,0)`;
        }
      }
    },
    // 此回调函数是可选项的设置
    // 与 CSS 结合时使用
    enter(el, done) {
      // ...
      // done()
      this.$nextTick(()=>{
        el.style.webkitTransform=`translate3D(0,0,0)`;
        el.style.transform=`translate3d(0,0,0)`;
        let inner=el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform=`translate3d(0,0,0)`;
        inner.style.transform=`translate3D(0,0,0)`;
      });
    },
    afterEnter(el) {
      // ...
      let ball=this.dropBalls.shift();
      if(ball){
        ball.show=false;
        el.style.display="none";
      }
    },
    foldList(){
      if(!this.totalCount){
        return;
      }
      this.fold=!this.fold;
    },
    clear(){
      this.selectFoods.forEach((food)=>{
        food.count=0;
      });
    },
    hideList(){
      // console.log("click");
      this.fold=true;
    },
    parTO(){
      if(this.totalPrice===0||this.totalPrice<this.minPrice){
        return false;
      }else{
        window.alert(`支付￥${this.totalPrice}元`);
      }
    }
  },
  components:{
    carControl
  }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.showCar
  position:fixed;
  left:0
  bottom:0
  z-index:50
  height:48px
  width:100%
  .ball-container
    .ball
      position:fixed
      left:32px
      bottom:22px
      z-index:200
      transition:all .4s
      .inner
        width:16px
        height:16px
        border-radius:50%
        background:rgb(0,160,220)
        transition:all .4s
  .showCar-list
    position:fixed;
    left:0
    top:0
    bottom:48px
    width:100%
    // background:#fff
    z-index:-1
    transition:all .4s linear
    transform:translate3d(0,0,0)
    &.show-enter,&.show-leave
      transform:translate3d(0,100%,0)
    .showCarWrapper
      position:fixed
      bottom:0
      width:100%
      z-index:1
      .list-header
        // width:100%
        // z-index:1
        background:#f3f5f7
        padding:0 18px
        height:40px
        line-height:40px
        border-bottom:.5px solid rgba(7,17,27,.1)
        .title
          // display:inline;
          font-size:14px
          font-weight:200
          color:rgb(7,17,27)
          float:left
        .empty
          float:right
          font-size:12px
          font-weight:200
          color:rgb(0,160,220)
      .list-content
        // z-index:1
        background:#fff
        padding:0 18px
        overflow:hidden
        max-height:258px
        .food
          position:relative
          border-bottom:.5px solid rgba(7,17,27,.1)
          height:48px
          .name
            font-size:14px
            color:rgb(7,17,27)
            float:left
            line-height:48px
          .price
            float:right
            line-height:48px
            margin-right: 84px
            font-weight:700
            padding-right: 12px
            padding-left: 18px
            color:rgb(240,20,20)
          .carControl-wrapper
            position: absolute;
            right: 0;
            top: 6px;
            /* margin-left: 6px; */
    .background
      position:fixed
      z-index:-1
      top:0
      bottom:48px
      width:100%
      background:rgba(7,17,27,.6)
  .content
    display:flex
    background:#141d27
    font-size:0
    .content-left
      flex:1
      .logo-wrapper
        display:inline-block
        position:relative
        top:-10px
        margin:0 12px
        padding:6px
        width:56px
        height:56px
        box-sizing:border-box
        vertical-align:top
        border-radius:50%
        background:#141d27
        .logo
          width:100%
          height:100%
          border-radius:50%
          background:#2b343c
          color:#80858a
          text-align:center
          &.hightLight
            background:rgb(0,160,220)
            color:#fff
          .icon-shopping_cart
            line-height:44px
            font-size:24px
        .num
          position:absolute
          top:0
          right:0
          width:24px
          height:16px
          line-height:16px
          text-align:center
          border-radius:16px
          font-size:9px
          font-weight:400
          background:rgb(240,24,24)
          box-shadow:0 4px 8px 0 rgba(0,0,0,.4)
          color:#fff
      .price
        display:inline-block
        vertical-align:top
        line-height:24px
        margin-top:12px
        box-sizing:border-box
        padding-right:12px
        border-right:1px solid rgba(255,255,255,.1)
        font-size:16px
        font-weight:700
        color:rgba(255,255,255,.4)
        &.hightLight
          color:#fff
      .desc
        display:inline-block
        vertical-align:top
        line-height:24px
        margin:12px 0 0 12px
        font-size:10px
        color:rgba(255,255,255,.4)
    .content-right
      flex:0 0 105px
      width:105px
      .pay
        height:48px
        line-height:48px
        font-size:12px
        color:rgba(255,255,255,.4)
        font-weight:700
        background:#2b333b
        text-align:center
        &.enough
          background:#00b43c
          color:#fff
        // &.noenough
          // background:#2b333b
</style>
