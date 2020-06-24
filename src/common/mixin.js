import {debounce} from 'common/utils'

//监听图片的加载，刷新可滚动高度
export const itemListenerMixin = {
    data() {
        return {
            imgLoadedListener: null,
            deBounceRefresh: null
        }
    },
    mounted() {
        //监听图片刷新
        this.deBounceRefresh = debounce(this.$refs.scroll.refresh, 100);
        this.imgLoadedListener = () => {
            //利用 $bus 事件监听，去刷新 scroll的高度
            this.deBounceRefresh();
        };
        this.$bus.$on("imgFinishLoaded", this.imgLoadedListener);

    }
}
