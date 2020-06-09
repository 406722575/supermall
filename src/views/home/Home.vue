<template>
    <div id="home">
        <nav-bar class="home-nav">
            <div class="nav-center" slot="nav-center">购物街</div>
        </nav-bar>
        <home-swiper :banners="banners"/>
        <recommend-view :recommends="recommends"/>
        <feature-view/>
        <tab-control class="tab-control"
                     :titles="['流行','新款', '精选']"
                     @tabClick="tabClick"/>
        <good-list :goods="showGoods"/>
    </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from 'components/content/goods/GoodList'

  import {getHomeMultidata, getHomeGoods} from 'network/api/home'


  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodList,
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
        currentType: 'pop'
      }
    },
    computed:{
      showGoods(){
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
          console.log(res);
          this.goods[type].list.push(...res.list);
          this.goods[type].page += 1;
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
      }

    }
  };
</script>

<style lang="less" scoped>
    #home {
        padding-top: 44px;
        padding-bottom: 800px;
    }

    .home-nav {
        background-color: var(--color-tint);

        .nav-center {
            color: #fff;
        }

        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9;
    }

    .tab-control {
        position: sticky;
        top: 44px;
        z-index: 9;
    }

</style>