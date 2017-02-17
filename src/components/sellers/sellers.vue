<template>
<div class="seller"  ref="sellContent">
  <div class="sell-content">
    <div class="overview">
      <h1 class="title">{{seller.name}}</h1>
      <div class="desc">
        <star :size="36" :score="seller.score"></star>
        <span class="text">({{seller.ratingCount}})</span>
        <span class="text sellCount">月售{{seller.sellCount}}单</span>
      </div>
      <ul class="remark">
        <li class="block">
          <h1 class="title">起步价</h1>
          <div class="content">
            <span class="price">{{seller.minPrice}}</span>
            <span class="yuan">元</span>
          </div>
        </li>
        <li class="block">
          <h1 class="title">商家配送</h1>
          <div class="content">
            <span class="price">{{seller.deliveryPrice}}</span>
            <span class="yuan">元</span>
          </div>
        </li>
        <li class="block">
          <h1 class="title">平均配送时间</h1>
          <div class="content">
            <span class="price">{{seller.deliveryTime}}</span>
            <span class="yuan">分钟</span>
          </div>
        </li>
      </ul>
      <div class="collect" @click="toFavorite">
        <i class="icon-favorite"  :class="{'active':favorite}"></i>
        <h1 class="text" >{{favoriteText}}</h1>
      </div>
    </div>
    <div class="line"></div>
    <div class="bulletin">
      <h1 class="title">公告与活动</h1>
      <div class="content-wrapper">
        <p class="content">{{seller.bulletin}}</p>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li class="support-item" v-for="(item, index) in seller.supports">
          <span class="icon" :class="classMap[seller.supports[index].type]"></span>
          <span class="text">{{seller.supports[index].description}}</span>
        </li>
      </ul>
    </div>
    <div class="line"></div>
    <div class="pics">
      <h1 class="title">商家实景</h1>
      <div class="pic-wrapper" ref="picList">
        <ul class="pic-list" ref="ulList">
          <li v-for="pic in seller.pics" class="pic-item">
            <img :src="pic" alt="" width="120" height="90">
          </li>
        </ul>
      </div>
    </div>
    <div class="line"></div>
    <div class="info">
      <h1 class="title">商家信息</h1>
      <ul>
        <li class="info-item" v-for="info in seller.infos">{{info}}</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import star from 'components/star/star';
import BScroll from "better-scroll";
import {method} from '../../common/js/common';
export default{
  props:{
    seller:{
      type:Object
    }
  },
  data(){
    return{
      favorite:(()=>{
        return method.loadFormLocal(this.seller.id,'favorite',false);
      })(),
    };
  },
  computed:{
    favoriteText(){
      return this.favorite? "已收藏":"收藏"
    }
  },
  components:{
    star
  },
  created(){
    this.classMap=['decrease','discount','special','invoice','guarantee'];
    this.$nextTick(function (){
      // this._initScroll();
      // this._initScrollpic();
    });
  },
  // mounted相当于vue1中的ready时期，也可以在created时期执行
  mounted(){
    this._initScroll();
    this._initScrollpic();
  },
  methods:{
    _initScroll(){
      this.$nextTick(function (){
        if(!this.scroll){
          this.scroll=new BScroll(this.$refs.sellContent,{
            click:true,
          });
        }else{
          this.scroll.refresh();
        }
      });
    },
    _initScrollpic(){
      if(this.seller.pics){
        let picWidth=120;
        let margin=6;
        let width=(picWidth+margin)*this.seller.pics.length-margin;
        this.$refs.ulList.style.width=`${width}px`;
        this.$nextTick(function (){
            if(!this.picscroll){
              this.picscroll=new BScroll(this.$refs.picList,{
                scrollX:true,
                // click:true,
                eventPassthrought:'vertical'
              });
            }else{
              this.picscroll.refresh();
            }
        });
      }
    },
    toFavorite(event){
      if(!event._constructed){
        return;
      }
      this.favorite=!this.favorite;
      // localStorage.favorite=this.favorite;
      method.saveToLocal(this.seller.id,'favorite',this.favorite)
    }
  },
  // 监控this.seller一旦有数据，更新dom后建立或者刷新scroll
  watch:{
    'seller'(){
      this._initScroll();
      this._initScrollpic();
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.seller
  position:absolute
  display:relative
  top:175px
  bottom:0
  left:0
  width:100%
  overflow:hidden
  .overview
    padding:18px
    .title
      margin-bottom:8px
      line-height:14px
      font-size:14px
      color:rgb(7,17,27)
    .desc
      font-size:0
      height:18px
      line-height:18px
      padding-bottom:18px
      border-bottom:1px solid rgba(7,17,27,.1)
      .star
        display:inline-block
        margin-right:8px
        vertical-align:top
      .text
        display:inline-block
        margin-right:12px
        vertical-align:top
        line-height:18px
        font-size:10px
        color:rgb(77,85,93)
    .remark
      display:flex
      padding-top:16px
      text-align:center
      // 平分空间
      .block
        flex:1
        border-right:1px solid rgba(7,17,27,.1)
        &:last-child
          border-right:none
        .title
          line-height:10px
          font-size:10px
          color:rgb(147,153,159)
          margin-bottom:4px
        .content
          .price
            line-height:24px
            font-weight:200
            font-size:24px
            color:rgb(7,17,27)
          .yuan
            line-height:24px
            font-weight:200
            font-size:10px
            color:rgb(7,17,27)
    .collect
      position:absolute
      width:50px
      top:18px
      right:18px
      text-align:center
      .icon-favorite
        margin-bottom:4px
        line-height:24px
        font-size:24px
        color:#d4d6d9
        &.active
          color:rgb(240,20,20)
      .text
        line-height:10px
        font-size:10px
        color:rgb(77,85,93)
  .bulletin
    padding:18px 12px 0 12px
    .title
      line-height:14px
      font-size:14px
      color:rgb(7,17,27)
    .content-wrapper
      padding:8px 12px 16px 12px
      border-bottom:.5px solid rgba(7,17,27,.1)
      .content
        // padding-bottom:16px
        line-height:24px
        // border-bottom:.5px solid rgba(7,17,27,.1)
        font-weight:200
        font-size:12px
        color:rgb(240,20,20)
    .supports
      padding:0 12px
      .support-item
        padding:16px 0
        border-bottom:.5px solid rgba(7,17,27,.1)
        font-size:0
        &:last-child
          border:none
        .icon
          display:inline-block
          width:16px
          height:16px
          margin-right:6px
          background-size:16px 16px
          background-repeat:no-repeat
          vertical-align:top
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          line-height:16px
          font-weight:200
          font-size:12px
          color:rgb(7,17,27)
  .pics
    padding:18px
    .title
      margin-bottom:12px
      line-height:14px
      font-size:14px
      color:rgb(7,17,27)
    .pic-wrapper
      width:100%
      white-space:nowrap
      .pic-list
        font-size:0
        .pic-item
          display:inline-block
          margin-right:6px
          width:120px
          height:90px
          &:last-child
            margin-right:0
  .info
    padding:18px 18px 0 18px
    .title
      padding-bottom:12px
      line-height:14px
      font-size:14px
      color:rgb(7,17,27)
      border-bottom:.5px solid rgba(7,17,27,.1)
    .info-item
      padding:16px 12px
      line-height:16px
      border-bottom:.5px solid rgba(7,17,27,.1)
      color:rgb(7,17,27)
      font-size:12px
      &:last-child
        border:none
</style>
