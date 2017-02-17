<template>
  <div >
    <!-- 传入获取到的seller值 -->
    <v-header :seller="seller">

    </v-header>
    <!-- <div id="header">
      header
    </div> -->
    <div class="tab border-1px">
      <div class="tab-item">
        <!-- <a v-link="path:'/goods'">商品</a> -->
        <router-link to="/goods" exact>商品</router-link>
      </div>
      <div class="tab-item">
        <!-- <a v-link="path:'/ratings'">评论</a> -->
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <!-- <a v-link="path:'/seller'">商家</a> -->
        <router-link to="/sellers">商家</router-link>
      </div>
    </div>
    <!-- keep-alive保持组件切换一致性 ，当组件在 <keep-alive> 内被切换，保留组件状态或避免重新渲染-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import header from './components/header/header.vue';
import {method} from './common/js/common';
// import Vue from 'vue'
// import VueRouter from 'vue-router'
// Vue.use(VueRouter)
const ERR_OK=0;
export default {
  data() {
    return {
      // 发送ajax请求，拿到数据，赋给seller
      seller:{
        id:(()=>{
          let ids=method.urlParse("id");
          console.log(`ids:${ids}`)
          return ids;
        })()
      },
    }
  },
  created(){
    this.$http.get('/api/seller?id='+this.seller.id).then(response => {
    // get body data
    response = response.body;
    console.log(response)
    if(response.errno===ERR_OK){
      // this.seller=response.data;
      this.seller=Object.assign({},this.seller,response.data);
      console.log(this.seller.id)
    }
  }, response => {
    // error callback
  });
  },
  // 注册子组件
  components:{
    'v-header':header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/mixin.styl"
.tab
    display: flex
    width: 100%
    height:40px
    line-height: 40px
    border-bottom:.5px solid rgba(7,17,27,.2)
    border-1px(rgba(7,17,27,.1))
    .tab-item
      flex: 1
      text-align: center
      &>a
        display:block
        font-size:14px
        color:rgb(77,85,93)
        &.active
          color:rgb(240,20,20)
</style>
