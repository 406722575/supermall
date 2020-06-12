<template>
    <div id="home">
        <nav-bar class="home-nav">
            <div class="nav-center" slot="nav-center">购物街</div>
        </nav-bar>
        <tab-control :titles="['流行', '新款', '潮流']"
                     @tabEvent="tabClick"
                     ref="tabControl1"
                     class="tab-control"
                     v-show="isTabFixed"/>
        <scroll
                class="content"
                ref="scroll"
                :probe-type="3"
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="LoadMore">
            <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
            <recommend-view :recommends="recommends"/>
            <feature-view/>
            <tab-control :titles="['流行', '新款', '潮流']"
                         @tabEvent="tabClick"
                         ref="tabControl2" />
            <good-list :goods="showGoods"/>
        </scroll>
        <!-- 监听组件需要native-->
        <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from 'components/content/goods/GoodList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata, getHomeGoods} from 'network/api/home'
  import {debounce} from 'common/utils'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodList,
      Scroll,
      BackTop,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        //默认类型
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      //请求多个数据
      this.getHomeMultidata();
      //请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    mounted() {
      // l。图片加载完成的事件监听
      //setTimeout会延迟执行，这里不用传参
      const refresh = debounce(this.$refs.scroll.refresh)
      //监听滚动区域每一张图片是否加载完成，需要在mainjs中先创建$bus
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })

    },
    methods: {
      /**
       * 网络请求相关的方法
       **/
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.banner.list;
          this.recommends = res.recommend.list
        });
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.list);
          this.goods[type].page += 1;
          // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载
          this.$refs.scroll.finishPullUp()
        })
      },
      /**
       * 事件监听相关的方法,3个链接
       **/
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
        this.$refs.tabControl1.cuurentIndex = index
        this.$refs.tabControl2.cuurentIndex = index
      },
      backClick() { // 返回顶部
        // ref拿到组件中的对象属性(方法)
        this.$refs.scroll.scrollTo(0, 0)
      },
      // 监听滚动,显示隐藏backtop
      contentScroll(pos) {
        // pos.y返回的是负数，所以要改成正数
        this.isShowBackTop = (-pos.y) > 1000

        // 决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-pos.y) > this.tabOffsetTop
      },
      // 到底部时上拉加载更多
      LoadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        //获取tabControl的offsetTOp
        // 所有的组件都有一个属性$el:用于获取组件中的元素(div)
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop  //轮播图加载完成再获取值
      }


    }
  };
</script>

<style scoped>
    #home {
        height: 100vh;
        position: relative;
    }

    .home-nav {
        background-color: var(--color-tint);
        color: #fff;
    }

    .tab-control {
        position: relative;
        z-index: 9;
    }

    .content {
        overflow: hidden;
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }

    .fixed {
        position: fixed;
        left: 0;
        right: 0;
        top: 44px;
    }

    /*.content {*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 44px;*/
    /*}*/
</style>