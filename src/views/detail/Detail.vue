<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav"/>
        <scroll class="scroll">
            <detail-swiper :topImages="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop='shopInfo'/>
        </scroll>
    </div>
</template>

<script>
    import DetailNavBar from './childComs/DetailNavBar'
    import DetailSwiper from './childComs/DetailSwiper'
    import DetailBaseInfo from './childComs/DetailBaseInfo'
    import DetailShopInfo from './childComs/DetailShopInfo'
    import {getDetail, GoodsBaseInfo, ShopInfo} from 'network/detail'

    import Scroll from 'components/common/scroll/Scroll'

    export default {
        name: "Detail",
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shopInfo: {}
            }
        },
        created() {
            // 保存传入的id
            this.iid = this.$route.params.iid;
            //请求详情页面
            this._getDetail(this.iid)
        },
        components: {
            DetailShopInfo,
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            Scroll,
        },
        methods: {
            async _getDetail(iid) {
                const res = await getDetail(iid);
                if (!res) return;
                console.log(res);
                const data = res.result;
                this.topImages = data.itemInfo.topImages;
                this.goods = new GoodsBaseInfo(
                    data.itemInfo,
                    data.columns,
                    data.shopInfo.services
                );
                //获取商品信息
                this.shopInfo = new ShopInfo(data.shopInfo);
            },

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