<template>
<div class="ratingselect">
  <div class="rating-type">
    <span class="block positive" @click="select(2,$event)" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
    <span class="block positive" @click="select(0,$event)" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
    <span class="block negative" @click="select(1,$event)" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
  </div>
  <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
    <i class="icon-check_circle"></i>
    <span class="text">只看有内容的评价</span>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
const POSITIVE=0;
const NEGATIVE=1;
const ALL=2;
export default{
  props:{
    ratings:{
      type:Array,
      default(){
        return [];
      }
    },
    selectType:{
      type:Number,
      default:ALL
    },
    onlyContent:{
      type:Boolean,
      default:false
    },
    desc:{
      type:Object,
      default(){
        return {
          all:'全部',
          positive:'满意',
          negative:'不满意'
        }
      }
    }
  },
  data(){
    return{
      myselectType:this.selectType,
      myonlyContent:this.onlyContent
    }
  },
  methods:{
    // 不能改变父组件的selectType,派发事件给父组件，我的selectType变化了
    select(type,event){
      console.log("click1")
      if(!event._constructed){
        console.log("click2")
        return;
      }
      this.myselectType=type;
      // 子组件内调用事件触发，告诉父组件我的type变了
      this.$root.eventHub.$emit('ratingtype.select', this.myselectType);
    },
    toggleContent(event){
      if(!event._constructed){
        return;
      }
      this.myonlyContent=!this.myonlyContent;
      // 子组件内调用事件触发，告诉父组件我的type变了
      this.$root.eventHub.$emit('content.toggle', this.myonlyContent);
    },
  },
  computed:{
    positive(){
      return this.ratings.filter((rating)=>{
        return rating.rateType===POSITIVE;
      });
    },
    negative(){
      return this.ratings.filter((rating)=>{
        return rating.rateType===NEGATIVE;
      });
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.ratingselect
  // padding-bottom:56px
  .rating-type
    padding:18px 0
    margin:0 18px
    line-height:16px
    border-bottom:.5px solid rgba(7,17,27,.1)
    font-size:0
    .block
      display:inline-block
      padding:8px 12px
      border-radius:1px
      margin-right:8px
      font-size:12px
      color:rgb(77,85,93)
      &.active
        color:#fff
      .count
        margin-left:2px
        font-size:8px
      &.positive
        background:rgba(0,160,220,.2)
        &.active
          background:rgb(0,160,220)
      &.negative
        background:rgba(77,85,93,.2)
        &.active
          background:rgb(77,85,93)
  .switch
    padding:12px 18px
    line-height:24px
    border-bottom:1px solid rgba(7,17,27,.1)
    font-size:0
    color:rgb(147,153,159)
    &.on
      .icon-check_circle
        color:#00c850
    .icon-check_circle
      display:inline-block
      vertical-align:top
      margin-right:4px
      font-size:24px
    .text
      font-size:12px
</style>
