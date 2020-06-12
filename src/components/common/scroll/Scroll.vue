<template>
    <div ref="wrapper">
        <div class="content">
            <slot></slot>
        </div>
    </div>

</template>

<script>
  import BScroll from "@better-scroll/core";
  import PullUp from "@better-scroll/pull-up";
  //
  BScroll.use(PullUp);

  export default {
    name: "Scroll",
    //这里用的是驼峰，在父组件实例处需要用 probe-type 才行。
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      //在上拉到超过底部时，触发 pullingUp 事件
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
      }
    },
    updated() {
      // 创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      });

      //监听滚动的位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (pos) => {
          // 子传父
          this.$emit('scroll', pos)
        })
      }

      // 监听scroll滚动到底部
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', ()=>{
          this.$emit('pullingUp')
        })
      }

    },
    methods: {
      // 返回顶部方法
      scrollTo(x, y, time = 500) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {// 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      }
    },

  }
</script>

<style scoped>

</style>