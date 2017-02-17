<template>
  <transition name="fade">
    <div class="food" v-show="showFlag" ref="foodwrapper">
      <!-- <div class="food-info">
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
      </div> -->
      <div class="food-content">
        <div class="image-header">
          <img :src="selectedFood.image" alt="">
          <div class="back" @click="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{selectedFood.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{selectedFood.sellCount}}份</span>
            <span class="rating">好评率{{selectedFood.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{selectedFood.price}}</span><span class="old"><del v-show="selectedFood.oldPrice">￥{{selectedFood.oldPrice}}</del></span>
          </div>
          <div class="carControl-wrapper">
            <carControl :food="selectedFood"></carControl>
          </div>
          <transition name="buy">
            <div class="buy" @click="addFirst" v-show="!selectedFood.count || selectedFood.count===0">
              加入购物车
            </div>
          </transition>
        </div>
        <div class="line" v-show="selectedFood.info"></div>
        <div class="info" v-show="selectedFood.info">
          <h1 class="title">商品信息</h1>
          <p class="text" >{{selectedFood.info}}</p>
        </div>
        <div class="line" v-show="selectedFood.info"></div>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="selectedFood.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="selectedFood.ratings && selectedFood.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in selectedFood.ratings" class="rating-item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
                </div>
                <div class="time">
                  {{rating.rateTime | formate}}
                </div>
                <p class="text">
                  <i :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!selectedFood.ratings || !selectedFood.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
        <!-- <div class="rating-wrapper">
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
        </div> -->
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import carControl from "../carControl/carControl";
import ratingselect from "../ratingselect/ratingselect";
import {method} from '../../common/js/common'
import Vue from "vue";
const POSITIVE=0;
const NEGATIVE=1;
const ALL=2;
export default{
props:{
  selectedFood:{
    type:Object
  }
},
// 依赖跟踪变量
data(){
  return{
    showFlag:false,
    selectType:ALL,
    onlyContent:true,
    desc:{
      all:'全部',
      positive:'推荐',
      negative:'吐槽'
    }
  }
},
created(){
  this.$nextTick(function (){
    if(!this.scroll){
      this.scroll=new BScroll(this.$refs.foodwrapper,{
        click:true,
        // 监控x,y值
        // probeType:3,
        // y:1000
      });
    }else{
      this.scroll.refresh();
    }
  });
  // 父组件监听子组件ratingtype.select数据变化，做出相应的改变
  this.$root.eventHub.$on('ratingtype.select',(target) => {
  // this.functionName(target)
  this.selectType=target;
  // dom树更新后操作
  this.$nextTick(()=>{
    console.log("click3")
    // console.log(this.scroll)
    this.scroll.refresh();
  });
  });
  this.$root.eventHub.$on('content.toggle',(target) => {
  // this.functionName(target)
  this.onlyContent=target;
  this.$nextTick(()=>{
    this.scroll.refresh();
  });
  });
},
methods:{
  // 给父组件调用
  show(){
    this.showFlag=true;
    this.selectType=POSITIVE;
    this.onlyContent=true;
    this.$nextTick(function (){
      console.log("created")
      if(!this.scroll){
        this.scroll=new BScroll(this.$refs.foodwrapper,{
          click:true,
          // 监控x,y值
          // probeType:3,
          // y:1000
        });
      }else{
        this.scroll.refresh();
      }
    });
},
back(){
  this.showFlag=false;
},
addFirst(event){
  if(!event._constructed){
    return;
  }
  Vue.set(this.selectedFood,"count",1)
},
needShow(type,text){
  if(this.onlyContent && !text){
    return false;
  }
  if(this.selectType==ALL){
    return true;
  }else{
    return type===this.selectType;
  }
}
},
components:{
  carControl,
  ratingselect
},
filters:{
  formate(time){
    let date=new Date(time);
    // return date;
    return method.formateDate(date,'yyyy-MM-DD hh:mm');
  }
},
destroyed(){
  console.log("fooddestroyed")
    // this.$root.eventHub.$off();
},
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
// @import "../../common/stylus/icon.css"
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
  // .line
  //   width:100%
  //   height:16px
  //   background:#f3f5f7
  .image-header
    position:relative
    width:100%
    height:0
    padding-top:100%
    img
      position:absolute
      top:0
      left:0
      width:100%
      height:100%
    .back
      position:absolute
      top:10px
      left:0
      .icon-arrow_lift
        display:block
        padding:10px
        font-size:20px
        color:#fff
  .content
    padding:18px
    position:relative
    .title
      line-height:14px
      margin-bottom:8px
      font-size:14px
      font-weight:700
      color:rgb(7,17,27)
    .detail
      margin-bottom:18px
      line-height:10px
      font-size:0
      .sell-count,.rating
        font-size:10px
        color:rgb(147,153,159)
      .sell-count
        margin-right:12PX
    .price
      font-weight:700
      line-height:24px
      .now
        margin-right:8px
        font-size:14px
        color:rgb(240,20,20)
      .old
        margin-right:8px
        font-size:14px
    .carControl-wrapper
      position:absolute
      right:12px
      bottom:12px
    .buy
      position:absolute
      right:18px
      bottom:18px
      z-index:10
      line-height:24px
      padding:0 12px
      box-sizing:border-box
      border-radius:12px
      font-size:10px
      background:rgb(0,160,220)
      color:#fff
      opacity:1
      transition:all .2s linear
      &.buy-enter,&.buy-leave
        opacity:0
  .info
    padding:18px
    .title
      line-height:14px
      margin-bottom:6px
      font-size:14px
      color:rgb(7,17,27)
    .text
      line-height:24px
      padding:0 8px
      font-size:12px
      color:rgb(77,85,93)
  .rating
    .title
      line-height:14px
      margin-left:18px
      padding-top:18px
      font-size:14px
      color:rgb(7,17,27)
    .rating-wrapper
      padding:0 18px
      .rating-item
        position:relative
        padding:16px 0
        border-bottom:.5px solid rgba(7,17,27,.1)
        .user
          position:absolute
          right:0
          top:16px
          line-height:12px
          font-size:0
          .name
            display:inline-block
            vertical-align:top
            margin-right:6px
            font-size:10px
            color:rgb(147,153,159)
          .avatar
            border-radius:50%
        .time
          margin-bottom:6px
          line-height:12px
          font-size:10px
          color:rgb(147,153,159)
        .text
          line-height:16px
          font-size:12px
          color:rgb(7,17,27)
          .icon-thumb_down,.icon-thumb_up
            margin-right:4px
            line-height:16px
            font-size:12px
          .icon-thumb_up
            color:rgb(0,160,220)
          .icon-thumb_down
            color:rgb(147,153,159)
      .no-rating
        padding:16px 0
        font-size:12px
        color:rgb(147,153,159)
  // .food-info
  //   // padding-bottom:56px
  //   .info-wrapper
  //   color:rgb(147,153,159)
  //   .info,.desc,.rating-wrapper
  //     padding:18px
  //   .line
  //     width:100%
  //     height:16px
  //     background:#f3f5f7
  //   .info
  //     .name
  //       height:14px
  //       line-height:14px
  //       font-weight:700
  //       font-size:14px
  //       color:rgb(7,17,27)
  //       margin-bottom:8px
  //     .sell
  //       font-size:10px
  //       line-height:10px
  //       margin:0px 12px 18px 0
  //     .price-wrapper
  //       margin-top:18px
  //       color:rgb(147,153,159)
  //       position:relative
  //       .icon
  //         font-size:10px
  //         font-weight:normal
  //         color:rgb(240,20,20)
  //       .price
  //         font-size:14px
  //         font-weight:700
  //         height:24px
  //         line-height:24px
  //         color:rgb(240,20,20)
  //       .oldPrice
  //         font-size:10px
  //         font-weight:700
  //         height:24px
  //         line-height:24px
  //       .addCar
  //         position:absolute
  //         right:0
  //         width:72px
  //         height:24px
  //         background:rgb(0,160,220)
  //         color:#fff
  //         border-radius:24px
  //         border:none
  //         outline:none
  //         font-size:10px
  //         line-height:12px
  //   .desc
  //     .title
  //       height:14px
  //       line-height:14px
  //       font-weight:500
  //       font-size:14px
  //       color:rgb(7,17,27)
  //     .infom
  //       padding:6px 8px 0 8px
  //       line-height:24px
  //       font-weight:200
  //       word-wrap:break-word
  //       word-break:break-all
</style>
