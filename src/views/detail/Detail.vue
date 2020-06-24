<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav"/>
        <scroll class="scroll" ref="scroll">
            <detail-swiper :topImages="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop='shopInfo'/>
            <detail-goods-info :detail-info="detailInfo" @imgageLoad="imageLoad"/>
            <detail-param-info :params-info="paramsInfo"/>
            <detail-comment-info :comment-info='commentInfo' ref="comment"/>
            <goods-list :goods='recommends' ref="recommend"/>
        </scroll>
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

    import GoodsList from 'components/content/goods/GoodList'

    import {getDetail, GoodsBaseInfo, ShopInfo, ParamsInfo, getRecommend} from 'network/detail'
    import {itemListenerMixin} from 'common/mixin'

    import Scroll from 'components/common/scroll/Scroll'

    export default {
        name: "Detail",
        mixins: [itemListenerMixin],
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
            }
        },
        created() {
            // 保存传入的id
            this.iid = this.$route.params.iid;
            //请求详情页面
            this._getDetail(this.iid)
        },
        mounted() {
        },
        destroyed() {
            //离开页面时取消全局事件的监听
            this.$bus.$off("imgFinishLoaded", this.imgLoadedListener);
            console.log("销毁Detail的bus")
        },
        components: {
            DetailParamInfo,
            DetailShopInfo,
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            Scroll,
            DetailGoodsInfo,
            DetailCommentInfo,
            GoodsList,

        },
        methods: {
            async _getDetail(iid) {
                const res = await getDetail(iid);
                if (!res) return;
                console.log(res);
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

            imageLoad() {
                // this.deBounceRefresh();
                tihs.$refs.scroll.refresh()
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

    /*!*添加滚动后会消失*!*/
    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }

    .scroll {
        /*设置滚动区域*/
        height: calc(100% - 44px);
        overflow: hidden;
    }
</style>