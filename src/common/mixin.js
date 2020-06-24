import {debounce} from 'common/utils'

//监听图片的加载，刷新可滚动高度
export const itemListenerMixin = {
    data() {
        return {
            itemImgListener:null,
            newRefresh: null
        }
    },
    mounted() {
        //监听图片刷新
        this.newRefresh = debounce(this.$refs.scroll.refresh, 200);
        this.itemImgListener  = () => {
            //利用 $bus 事件监听，去刷新 scroll的高度
            this.newRefresh();
        };
        this.$bus.$on("itemImgLoad", this.itemImgListener);

    }
}
