<template>
<div class="carControl">
  <transition name="fade">
    <div class="car-decrease" v-show="food.count>0" @click.stop.prevent="decrease($event)">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
  </transition>
  <div class="car-count" v-show="food.count>0">{{food.count}}</div>
  <div class="car-add icon-add_circle" @click.stop.prevent="add($event)"></div>
</div>
</template>

<script type="text/ecmascript-6">
export default{
props:{
  food:{
    type:Object
  }
},
created(){
  // console.log(this.food)
},
methods:{
  add(event){
    if(!event._constructed){
      return;
    }
    if(!this.food.count){
      // 设置food中没有的字段count无效，要用set()方法设置才能,观测food.count变化，
      // 改变dom
      // this.food.count=1
      // Vue.set(this.food,'count',1)   vue2报错：Vue is not defined
      this.$set(this.food,'count',1)
    }else{
      this.food.count++;
    }
    // 派发点击事件给父组件
    this.$root.eventHub.$emit('cart.add', event.target);
  },
  decrease(event){
    if(!event._constructed){
      return;
    }
    if(this.food.count){
      this.food.count--;
    }
  },
},
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.carControl
  font-size:0
  .car-decrease
    display:inline-block
    padding:6px
    transition:all .4s linear
    .inner
      display:inline-block
      font-size:24px
      line-height:24px
      color:rgb(0,160,220)
      transition:all .4s linear
      transform:rotate(0)
      opacity:1
      // 应用3D,开启动画加速
      transform:translate3d(0,0,0)
    &.fade-enter,&.fade-leave
      opacity:0
      transform:translate3d(24px,0,0)
      .inner
        transform:rotate(180deg)
    // &.fade-leave,&.fade-enter-active
    //   opacity:.5
    //   background:rgba(7,17,27,0.8)
    &.fade-leave-active,&.fade-enter-active
      opacity:.5
      transform:translate3d(12px,0,0)
      .inner
        transform:rotate(90deg)
  .car-count
    display:inline-block
    width:12px
    vertical-align:top
    padding-top:6px
    line-height:24px
    text-align:center
    font-size:10px
    color:rgb(147,153,159)
  .car-add
    display:inline-block
    padding:6px
    font-size:24px
    line-height:24px
    color:rgb(0,160,220)
</style>
