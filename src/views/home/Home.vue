<template>
    <div id="home">
        <nav-bar class="home-nav">
            <div class="nav-center" slot="nav-center">购物街</div>
        </nav-bar>
        <tab-control :titles="Object.values(titles)"
                     @tabEvent="tabClick"
                     ref="tabControl1"
                     class="tab-control"
                     v-show="isTabFixed"/>
        <scroll
                class="scroll"
                ref="scroll"
                :probe-type="3"
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="LoadMore">
            <home-swiper :banners="banners" @swiperImageFinshLoad="swiperImageFinshLoad"/>
            <recommend-view :recommends="recommends"/>
            <feature-view/>
            <tab-control :titles="Object.values(titles)"
                         @tabEvent="tabClick"
                         ref="tabControl2"/>
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

    import {getMultiData, getProduct} from 'network/home'
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
                titles: {
                    pop: "流行",
                    new: "新款",
                    sell: "精选"
                },
                isShowBackTop: false,
                tabOffsetTop: 0,
                isTabFixed: false,
                scrollY: 0,
            }
        },
        computed: {
            showGoods() {
                return this.goods[this.currentType].list
            }
        },
        activated() {//进入页面立即滚动
            // 强调刷新，有可能会自动跳转到顶部
            this.$refs.scroll.refresh();
            this.$refs.scroll.scrollTo(0, this.scrollY, 0);
        },
        deactivated() { //离开时保存位置
            this.scrollY = this.$refs.scroll.getScrollY()
        },
        created() { //组件创建完成
            //请求banner和recommend
            this._getMultiData();

            //请求商品
            this._getProduct("pop");
            this._getProduct("new");
            this._getProduct("sell");
        },
        mounted() {
            // l。图片加载完成的事件监听或者给图片设置固定高度,解决图片未加载完，导致有时不能滚动问题
            //setTimeout会延迟执行，这里不用传参
            const refresh = debounce(this.$refs.scroll.refresh) //刷新频率过高，使用防抖函数，一定时间执行一次
            //监听滚动区域每一张图片是否加载完成，需要在mainjs中先创建$bus，用于管理事件，不是状态
            this.$bus.$on('itemImageFinshLoad', () => {
                refresh()
            })

        },
        methods: {
            /**
             * 网络请求相关的方法
             **/

            async _getMultiData() {
                const res = await getMultiData();
                if (!res) return;
                this.banners = res.data.banner.list;
                this.recommends = res.data.recommend.list;
            },

            async _getProduct(type) {
                let page = this.goods[type].page + 1;
                const res = await getProduct(type, page);
                if (!res) return;
                res && this.goods[type].list.push(...res.data.list);
                this.goods[type].page += 1;
                // 第二页，当上拉加载数据加载完毕后
                this.$refs.scroll.finishPullUp();
                this.$refs.scroll.refresh();
            },
            /**
             * 事件监听相关的方法,3个链接
             **/
            tabClick(index) {
                // 获取当前标题点击的类型
                this.currentType = Object.keys(this.titles)[index];
                // 保持点击内容显示一致
                this.$refs.tabControl1.cuurentIndex = index
                this.$refs.tabControl2.cuurentIndex = index
            },
            backClick() { // 返回顶部
                // ref拿到scroll组件中的对象属性(方法)
                this.$refs.scroll.scrollTo(0, 0)
            },
            // 监听滚动,显示隐藏backtop
            contentScroll(position) {
                // pos.y返回的是负数，所以要改成正数
                this.isShowBackTop =(-position.y) > 1000;
                // if (-position.y >= 1000 && !this.isShowBackTop) {
                //     this.isShowBackTop = true;
                // } else if (-position.y < 1000 && this.isShowBackTop) {
                //     this.isShowBackTop = false;
                // }

                // 决定tabControl是否吸顶
                this.isTabFixed = (-position.y) > this.tabOffsetTop
                // if (-position.y >= this.tabOffsetTop && !this.isTabFixed) {
                //     this.isTabFixed = true;
                // } else if (-position.y < this.tabOffsetTop && this.isTabFixed) {
                //     this.isTabFixed = false;
                // }
            },
            // 到底部时上拉加载更多
            LoadMore() {
                this._getProduct(this.currentType);

            },
            swiperImageFinshLoad() { //轮播图加载完成再获取offsetTOp值
                //获取tabControl的offsetTOp
                // 所有的组件都有一个属性$el:用于获取组件中的元素(div)
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
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

    .scroll {
        overflow: hidden;
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }

    .fixed {
        position: fixed;
        top: 44px;
        bottom: 0;
        left: 0;
        right: 0;
    }

</style>