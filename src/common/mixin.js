import {debounce} from 'common/utils'
import BackTop from 'components/content/backTop/BackTop'
import {BACK_POSITiON} from 'common/const'

//监听图片的加载，刷新可滚动高度
export const itemListenerMixin = {
    data() {
        return {
            //goodsListItem图片加载监听器
            itemImgListener: null,
            newRefresh: null
        }
    },
    mounted() {
        //监听图片刷新
        this.newRefresh = debounce(this.$refs.scroll.refresh, 200);
        this.itemImgListener = () => {
            //利用 $bus 事件监听，去刷新 scroll的高度
            this.newRefresh();
        };
        this.$bus.$on("itemImgLoad", this.itemImgListener);

    }
}

export const backTopMixin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShowBackTop: false
        }
    },
    methods: {
        backClick() { // 返回顶部
            // ref拿到scroll组件中的对象属性(方法)
            this.$refs.scroll.scrollTo(0, 0, 300)
        },
        ListenShowBackTop(position) {
            this.isShowBackTop = (-position.y) > BACK_POSITiON
        }
    }
}