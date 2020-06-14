<template>
    <div id="detail">
        <detail-nav-bar/>
        <detail-swiper :topImages="topImages"/>
    </div>
</template>

<script>
    import DetailNavBar from './childComs/DetailNavBar'
    import DetailSwiper from './childComs/DetailSwiper'
    import {getDetail} from 'network/detail'

    export default {
        name: "Detail",
        data() {
            return {
                iid: null,
                topImages: []
            }
        },
        created() {
            // 保存传入的id
            this.iid = this.$route.params.iid;
            //请求详情页面
            this._getDetail(this.iid)
        },
        components: {
            DetailNavBar,
            DetailSwiper,
        },
        methods: {
            async _getDetail(iid) {
                const res = await getDetail(iid);
                if (!res) return;
                console.log(res);
                const data = res.result;
                this.topImages = data.itemInfo.topImages;
            }
        }
    }
</script>

<style scoped>

</style>