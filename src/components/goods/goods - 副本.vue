<template>
<div class="good">
  <div class="menu-wrapper menu-wrapper-hook" ref="menuwrapper">
    <ul>
      <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="changeY(index,$event)">
        <span class="text border-1px">
          <span v-show="item.type>0" class="icon" :class="classMap[item.type]">
          </span>
          {{item.name}}
        </span>
      </li>
    </ul>
  </div>
  <div class="food-wrapper" ref="foodwrapper">
    <ul >
      <li v-for="item in goods" class="food-list food-list-hook">
        <h1 class="title">{{item.name}}</h1>
        <ul class="food-items">
          <li v-for="food in item.foods" class="food-item">
            <div class="icon">
              <img :src="food.icon" alt="" width="57" height="57">
            </div>
            <div class="content">
              <h2 class="name">{{food.name}}</h2>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}</span>
              </div>
              <div class="price">
                <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old"><del>￥{{food.oldPrice}}</del></span>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <showCar></showCar>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll"
import showCar from "../showCar/showCar"
const ERR_OK=0;
export default{
  // 获取从父组件传来的数据,用于接收来自父组件的数据
  props:{
    seller:{
      type:Object
    }
  },

  // Vue 实例的数据对象,定义数据，初始化变量
  // [Vue warn]: Property or method "message" is not defined on the instance but referenced during render.
  //  Make sure to declare reactive data properties in the data option.
  data(){
    return{
      // 只能定义在这里
      goods:[],
      // 下面两个也只能定义在这里，不然左边无法自适应右边的滚动条
      // listHeight使用在method和computed中
      listHeight:[],
      scrollY:0,
      // scrollToIndex:0,
      // 可以定义在这里，也可以定义在created中，classMap仅仅使用在dom中
      // classMap:['decrease','discount','special','invoice','guarantee']
    };
  },

  // 从服务器获取数据,实例已经创建完成之后被调用。
  // 实例已完成以下的配置：数据观测(data observer)，属性和方法的运算，
  // watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
  created(){
    // this.listHeight=[];
    // this.scrollY=0;
    this.classMap=['decrease','discount','special','invoice','guarantee'];
    this.$http.get('/api/goods').then(response => {
    // get body data
    response = response.body;
    console.log(response)
    if(response.errno===ERR_OK){
      this.goods=response.data;
      console.log(this.goods);
      this.$nextTick(function (){
        this._initScroll();
        this._caculateHeight();
      });
    }
  }, response => {
    // error callback
  });
  },

  // 定义所用方法，事件方法、指令表达式方法、内部访问created()
  methods:{
    _initScroll(){
      // this.indexY=0;
      console.log(this.$refs.menuwrapper);
      // 恢复元素点击事件，注册点击事件，在浏览器模式点击事件无效
      this.menuScroll=new BScroll(this.$refs.menuwrapper,{
        click:true
      });
      this.foodScroll=new BScroll(this.$refs.foodwrapper,{
        probeType:3,
        // startY:this.indexY
      });

      // 监控foods列表滚动y值
      this.foodScroll.on('scroll',(pos)=>{
        this.scrollY=Math.abs(Math.round(pos.y));
      })
    },
    _caculateHeight(){
      this.listHeight=[];
      let foodList=document.getElementsByClassName("food-list-hook");
      let height=0;
      this.listHeight.push(height);
      for(let i=0;i<foodList.length;i++){
        let item=foodList[i];
        height+=item.clientHeight;
        this.listHeight.push(height);
      }
      // console.log(this.listHeight)
    },
    changeY(index){
      this.indexY=index;

      // 解决pc点击两次效果，一次是注册better-scroll点击事件，一次自己点击事件
      if(!event._constructed){
        return;
      }
      let foodList=document.getElementsByClassName("food-list-hook");
      let el=foodList[index];
      this.foodScroll.scrollToElement(el,300);
    }
  },

  // getter 和 setter 的 this 自动地绑定到实例
  // get返回一个值时候，给DOM中的数据作对比   eg:   :currentIndex===index
  computed:{
    currentIndex(){
      // console.log('currentIndex')
      for(let i=0;i<this.listHeight.length;i++){
        let height1=this.listHeight[i];
        let height2=this.listHeight[i+1];
        if(this.scrollY>=height1 && this.scrollY<height2){
          // this.scrollToIndex=i;
          return i;
          // console.log('i='+i)
        }
      }
      // console.log('0='+0)
      return 0;
    }
  },

  components:{
    showCar
  }

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.good
  position:absolute
  display:flex
  top:174px
  bottom:46px
  width:100%
  overflow:hidden
  .menu-wrapper
    // flex:等分 缩放情况 占位空间
    flex:0 0 80px
    background: #f3f5f7
    // 设置width兼容andro
    width:80px
    .menu-item
      display:table
      height:54px
      width:56px
      line-height:14px
      font-size:0
      padding:0 12px
      background:#f3f5f7
      &.current
        position:relative
        margin-top:-1px
        background:#ebecec
        font-weight:700
        .text
          border:none
      .icon
        display:inline-block
        width:12px
        height:12px
        margin-right:2px
        background-size:12px 12px
        background-repeat:no-repeat
        vertical-align:top
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        font-size:12px
        display:table-cell
        width:56px
        vertical-align:middle
        border-bottom:1px solid rgba(7,17,27,.1)
        border-1px(rgba(7,17,27,.1))
      &:last-child
        .text
          border-bottom:none
  .food-wrapper
    flex:1
    color:rgb(147,153,159)
    // padding-left:14px
    // border:1px solid #f3f5f7
    .food-list
      .title
        background:#f3f5f7
        border-left:1px solid #b9b7b7
        padding-left:14px
        font-size:12px;
        // color:rgb(147,153,159)
        height:26px
        line-height:26px
      // .food-items
      //   padding:18px
      .food-item
        // padding:18px
        // font-size:0
        display:flex
        margin:18px
        padding-bottom:18px
        border-1px(rgba(7,17,27,.1))
        border-bottom:.5px solid rgba(7,17,27,.1)
        &:last-child
          border-none()
          margin-bottom:0
          border-bottom:none
        .icon
          flex:0 0 57px
          margin-right:10px
        .content
          flex:1
          .name
            margin:2px 0 8px 0;
            height:14px
            line-height:14px
            font-size:14px
            color:rgb(7,17,27)
          .desc,.extra

            height:10px
            line-height:10px
            font-size:10px
          .desc
            margin-bottom:8px
            line-height:12px
          .extra
           .count
            margin-right:12px
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
</style>
