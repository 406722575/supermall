<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @navTitleClick="navTitleClick" ref="nav"/>
        <scroll class="scroll" ref="scroll" @scroll="scroll" :probe-type="3">
            <detail-swiper :topImages="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop='shopInfo'/>
            <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
            <detail-param-info :params-info="paramsInfo" ref="params"/>
            <detail-comment-info :comment-info='commentInfo' ref="comment"/>
            <goods-list :goods='recommends' ref="recommend"/>
        </scroll>
        <detail-bottom-bar  @addCart="addCart"/>
        <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>
</template>

<script>
    import DetailNavBar from './childComs/DetailNavBar'
    import DetailSwiper from './childComs/DetailSwiper'
    import DetailBaseInfo from './childComs/DetailBaseInfo'
    import DetailShopInfo from './childComs/DetailShopInfo'
    import DetailParamInfo from './childComs/DetailParamInfo'
    import DetailGoodsInfo from './childComs/DetailGoodsInfo'
    import DetailCommentInfo from './childComs/DetailCommentInfo'
    import DetailBottomBar from './childComs/DetailBottomBar'

    import GoodsList from 'components/content/goods/GoodList'
    import {getDetail, GoodsBaseInfo, ShopInfo, ParamsInfo, getRecommend} from 'network/detail'
    import {itemListenerMixin, backTopMixin} from 'common/mixin'

    import Scroll from 'components/common/scroll/Scroll'

    import {debounce} from 'common/utils'
    import BackTop from "../../components/content/backTop/BackTop";

    export default {
        name: "Detail",
        mixins: [itemListenerMixin,backTopMixin],
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shopInfo: {},
                detailInfo: {},
                paramsInfo: {},
                commentInfo: {},
                recommends: [],
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex: 0,
            }
        },
        created() {
            // 保存传入的id
            this.iid = this.$route.params.iid;
            //请求详情页面
            this._getDetail(this.iid)

            //给getThemeTopy赋值
            this.getThemeTopY = debounce(() => {
                this.themeTopYs = []
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                this.themeTopYs.push(Number.MAX_VALUE);
                console.log(this.themeTopYs);
            }, 100)


        },
        mounted() {


        },
        updated() {

        },
        destroyed() {
            //离开页面时取消全局事件的监听
            this.$bus.$off("itemImgLoad", this.imgLoadedListener);
            console.log("销毁Detail的bus")
        },
        components: {
            BackTop,
            DetailParamInfo,
            DetailShopInfo,
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            Scroll,
            DetailGoodsInfo,
            DetailCommentInfo,
            GoodsList,
            DetailBottomBar,

        },
        methods: {
            async _getDetail(iid) {
                const res = await getDetail(iid);
                if (!res) return;
                // console.log(res);
                const data = res.result;
                this.topImages = data.itemInfo.topImages;
                //获取商品基本信息
                this.goods = new GoodsBaseInfo(
                    data.itemInfo,
                    data.columns,
                    data.shopInfo.services
                );
                //获取店铺信息
                this.shopInfo = new ShopInfo(data.shopInfo);
                //获取商品详情
                this.detailInfo = data.detailInfo;
                //获取参数信息
                this.paramsInfo = new ParamsInfo(data.itemParams)
                // 获取评论信息
                if (data.rate.cRate !== 0) {
                    this.commentInfo = data.rate.list[0]
                }
                // 请求推荐数据
                getRecommend().then(res => {
                    this.recommends = res.data.list
                });
                // //获取推荐商品
                // let recommends = await getRecommends();
                // console.log(recommends);
                // this.recommends = recommends.data.list;

            },

            detailImageLoad() {
                this.newRefresh()
                //图片加载完成后获取offsetTop
                this.getThemeTopY()

            },
            navTitleClick(index) {
                this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
            },
            //点击导航标题，显示对应的标题信息
            scroll(position) {
                //获取y值
                const positionY = -position.y
                //positionY和offsetTopt中值进行两个值之间的对比
                let length = this.themeTopYs.length
                //最后一个最大值不需要遍历length - 1
                for (let i = 0; i < length - 1; i++) {
                    //防止频繁赋值his.currentIndex !== i
                    if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] &&
                        positionY < this.themeTopYs[i + 1])) {
                        this.currentIndex = i;
                        console.log(this.currentIndex);
                        this.$refs.nav.currentIndex = this.currentIndex
                    }
                }
                //是否显示回到顶部
                this.ListenShowBackTop(position);
            },
            addCart(){
                //获取购物车展示的信息
                const product = {}
                product.image = this.topImages[0];
                product.title = this.goods.title;
                product.desc = this.goods.desc;
                product.price = this.goods.realPrice;
                product.iid = this.iid;
                //将商品加入购物车,使用vuex
                // this.$store.commit('addCart', product)
                this.$store.dispatch('addCart', product).then(res=>{
                    this.$toast.show(res, 1500)
                })
            }

        }
    }
</script>

<style scoped>

    #detail {
        position: relative;
        /*去掉底部的tabbar*/
        z-index: 10;
        /*去掉底部的tabbar*/
        background-color: #fff;
        /*滚动父元素设置高度*/
        height: 100vh;
    }

    /*添加滚动后会消失*/
    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }

    .scroll {
        /*设置滚动区域*/
        height: calc(100% - 44px - 49px);
        overflow: hidden;
    }
</style>