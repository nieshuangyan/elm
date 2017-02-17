<template>
  <transition name="fade">
    <div class="food" v-show="showFlag" ref="foodwrapper">
      <div class="food-info">
        <div class="img-wrapper">
          <img :src="selectedFood.image" alt="" width="100%" height="375px">
        </div>
        <div class="info-wrapper">
          <div class="info">
            <h3 class="name">{{selectedFood.name}}</h3>
            <div class="seller-wrapper">
              <span class="sell">月售{{selectedFood.sellCount}}份</span>
              <span class="sell">好评率{{selectedFood.rating}}份</span>
            </div>
            <div class="price-wrapper">
              <span class="icon">￥</span><span class="price">{{selectedFood.price}}</span>
              <del><span class="oldPrice">￥{{selectedFood.oldPrice}}</span></del>
              <button type="button" name="button" class="addCar">加入购物车</button>
            </div>
          </div>
          <div class="line"></div>
          <div class="desc">
            <h3 class="title">商品介绍</h3>
            <p class="infom">{{selectedFood.info}}</p>
          </div>
          <div class="line"></div>
          <div class="rating-wrapper">
            <div class="title-wrapper">
              <h3 class="title">商品评价</h3>
              <div class="button-wrapper">
                <button type="button" name="button" class="all">全部</button>
                <button type="button" name="button" class="support">推荐</button>
                <button type="button" name="button" class="casual">吐槽</button>
              </div>
            </div>
            <div class="content-wrapper">
              <div class="title">
                <i></i>
                <span>只看有内容的评价</span>
              </div>
              <ul>
                <li v-for="(rating,index) in selectedFood.ratings" class="rating-wrapper">
                  <div class="desc">
                    <div class="time">{{rating.rateTime}}</div>
                    <div class="person">
                      <span class="username">{{rating.username}}</span>
                      <img :src="rating.avatar" alt="">
                    </div>
                  </div>
                  <div class="rating">
                    <i class="icon"></i>
                    <span class="text">{{rating.text}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll"
export default{
props:{
  selectedFood:{
    type:Object
  }
},
data(){
  return{
    showFlag:false
  }
},
computed:{

},
methods:{
  // 给父组件调用
  show(){
    this.showFlag=true;
    this.$nextTick(function (){
      console.log("created")
      if(!this.scroll){
        this.scroll=new BScroll(this.$refs.foodwrapper,{
          click:true,
          // 监控x,y值
          probeType:3,
          // y:1000
        });
      }else{
        this.scroll.refresh();
      }
    });
},
},
// created(){
//   // 滚动效果写在这里不能滚动，只会建立滚动
//   this.$nextTick(function (){
//     console.log("created")
//     if(!this.scroll){
//       this.scroll=new BScroll(this.$refs.foodwrapper,{
//         click:true,
//         // 监控x,y值
//         probeType:3,
//         y:
//       });
//     }else{
//       this.scroll.refresh();
//     }
//   });
// }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.food
  position:fixed
  left:0
  bottom:48px
  top:0
  background:#fff
  z-index:1
  width:100%
  transition:all .4s linear
  transform:translate3d(0,0,0)
  &.fade-enter,&.fade-leave
    transform:translate3d(100%,0,0)
  // &.fade-leave-active,&.fade-enter-active
  //   opacity:.5
  //   transform:translate3d(12px,0,0)
  .food-info
    // padding-bottom:56px
    .info-wrapper
    color:rgb(147,153,159)
    .info,.desc,.rating-wrapper
      padding:18px
    .line
      width:100%
      height:16px
      background:#f3f5f7
    .info
      .name
        height:14px
        line-height:14px
        font-weight:700
        font-size:14px
        color:rgb(7,17,27)
        margin-bottom:8px
      .sell
        font-size:10px
        line-height:10px
        margin:0px 12px 18px 0
      .price-wrapper
        margin-top:18px
        color:rgb(147,153,159)
        position:relative
        .icon
          font-size:10px
          font-weight:normal
          color:rgb(240,20,20)
        .price
          font-size:14px
          font-weight:700
          height:24px
          line-height:24px
          color:rgb(240,20,20)
        .oldPrice
          font-size:10px
          font-weight:700
          height:24px
          line-height:24px
        .addCar
          position:absolute
          right:0
          width:72px
          height:24px
          background:rgb(0,160,220)
          color:#fff
          border-radius:24px
          border:none
          outline:none
          font-size:10px
          line-height:12px
    .desc
      .title
        height:14px
        line-height:14px
        font-weight:500
        font-size:14px
        color:rgb(7,17,27)
      .infom
        padding:6px 8px 0 8px
        line-height:24px
        font-weight:200
        word-wrap:break-word
        word-break:break-all
</style>
