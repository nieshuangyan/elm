<template>
<div class="ratings" ref="ratings">
  <div class="ratings-content">
    <div class="overview">
      <div class="overview-left">
        <h1 class="score">{{seller.foodScore}}</h1>
        <h1 class="title">综合评分</h1>
        <p class="text">高于周边商家{{seller.rankRate}}%</p>
      </div>
      <div class="overview-right">
        <div class="score-wrapper">
          <span class="title">服务态度</span>
          <star :size="36" :score="seller.serviceScore"></star>
          <span class="score">{{seller.serviceScore}}</span>
        </div>
        <div class="score-wrapper">
          <span class="title">商品评分</span>
          <star :size="36" :score="seller.foodScore"></star>
          <span class="score">{{seller.foodScore}}</span>
        </div>
        <div class="time-wrapper">
          <span class="title">送达时间</span>
          <span class="time">{{seller.deliveryTime}}分钟</span>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <ratingselect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent"></ratingselect>
    <div class="rating-wrapper">
      <ul>
        <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
          <div class="avatar">
            <img :src="rating.avatar" alt="" width="28" height="56">
          </div>
          <div class="content">
            <h1 class="name">{{rating.username}}</h1>
            <div class="star-wrapper">
              <star :size="24" :score="seller.score"></star>
              <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
            </div>
            <p class="text">{{rating.text}}</p>
            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
              <i :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></i>
              <span v-for="item in rating.recommend" class="item">{{item}}</span>
            </div>
            <div class="time">
              {{rating.rateTime | formate}}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import star from 'components/star/star';
import ratingselect from 'components/ratingselect/ratingselect';
import {method} from '../../common/js/common';
const POSITIVE=0;
const NEGATIVE=1;
const ALL=2;
const ERR_OK=0;
export default{
  props:{
    seller:{
      type:Object,
    }
  },
  // 依赖跟踪变量
  data(){
    return{
      ratings:[],
      selectType:ALL,
      onlyContent:true,
      desc:{
        all:'全部',
        positive:'满意',
        negative:'不满意'
      }
    }
  },
  components:{
    star,
    ratingselect
  },
  created(){
    this.$http.get('/api/ratings').then(response => {
    // get body data
    response = response.body;
    if(response.errno===ERR_OK){
      this.ratings=response.data;
      this.$nextTick(function (){
          this.scroll=new BScroll(this.$refs.ratings,{
            click:true,
          });
      });
    }
  }, response => {
    // error callback
  });
  this.$root.eventHub.$on('ratingtype.select',(target) => {
  // this.functionName(target)
  this.selectType=target;
  // dom树更新后操作
  this.$nextTick(()=>{
    console.log("click4")
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
  filters:{
    formate(time){
      let date=new Date(time);
      // return date;
      return method.formateDate(date,'yyyy-MM-DD hh:mm');
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.ratings
  position:absolute
  left:0
  bottom:0
  top:175px
  width:100%
  overflow:hidden
  .overview
     display:flex
     padding:18px
     @media only screen and (max-width: 320px){
       padding:10px
     }
    .overview-left
      flex:0 0 119px
      width:119px
      text-align:center
      border-right:1px solid rgba(7,17,27,.1)
      @media only screen and (max-width: 360px){
        flex: 0 0 100px;
        width: 100px;
      }
      .score
        // padding-top:6px
        line-height:28px
        font-size:24px
        color:rgb(255,153,0)
      .title
        margin:6px 0 8px 0
        line-height:12px
        font-size:12px
        color:rgb(7,17,27)
      .text
        padding-bottom:6px
        line-height:10PX
        font-size:10PX
        color:rgb(147,153,157)
    .overview-right
      flex:1
      padding-left:24px
      @media only screen and (max-width:360px)
        padding-left:6px

      .title
        display:inline-block
        line-height:18px
        vertical-align:top
        font-size:12px
        color:rgb(7,17,27)
      .score-wrapper
        font-size:0
        margin-bottom:8px
        .star
          display:inline-block
          vertical-align:top
          margin:0 12px
        .score
          line-height:18px
          vertical-align:top
          font-size:12px
          color:rgb(255,153,0)
      .time-wrapper
        .time
          line-height:16px
          font-size:12px
          color:rgb(147,153,159)
          margin-left:12px
  .rating-wrapper
    padding:0 18px
    .rating-item
      display:flex
      padding:18px 0
      border-bottom:.5px solid rgba(7,17,27,.1)
      .avatar
        flex:0 0 28px
        width:28px
        margin-right:12px
        img
          border-radius:50%
      .content
        flex:1
        position:relative
        .name
          line-height:12px
          font-size:10px
          color:rgb(7,17,27)
          margin-bottom:4px
        .star-wrapper
          margin-bottom:6px
          font-size:0
          .star
            display:inline-block
            margin-right:6px
            vertical-align:top
          .delivery
            display:inline-block
            vertical-align:top
            line-height:12px
            font-size:10px
            color:rgb(147,153,159)
        .text
          margin-bottom:8px
          line-height:18px
          font-size:12px
          color:rgb(7,27,37)
        .recommend
          font-size:0
          line-height:16px
          word-wrap:break-word
          word-break:break-all
          .icon-thumb_up
            display:inline-block
            line-height:16px
            font-size:12px
            color:rgb(0,160,220)
          .icon-thumb_down
            display:inline-block
            line-height:16px
            font-size:12px
            color:rgb(183,187,191)
          .item
            // line-height:16px
            border-radius:1px
            margin:0 6px
            border:1px solid rgba(7,17,27,.1)
            font-size:9px
            color:rgb(147,153,159)
            background:#fff
        .time
          position:absolute
          top:0
          right:0
          line-height:12px
          font-size:10
          color:rgb(147,153,159)
</style>
