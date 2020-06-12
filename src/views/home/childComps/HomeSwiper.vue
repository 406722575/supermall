<template>
  <swiper>
    <swiper-item v-for="item in banners" :key="item.image">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad"/>
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import {Swiper,SwiperItem} from 'components/common/swiper/index'

export default {
  name: "HomeSwiper",
  props: {
      banners: {
          type: Array,
          default: []
      }
  },
  data(){
    return{
      isLoad: false
    }
  },
  components: {
      Swiper,
      SwiperItem
  },
  methods:{
    imageLoad(){
      //只发送一次事件，获取offsetTop
      if(!this.isLoad){
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
    }
  }

};
</script>

<style lang="scss" scoped>
</style>