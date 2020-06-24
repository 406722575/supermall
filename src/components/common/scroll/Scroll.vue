<template>
    <div ref="wrapper">
        <div class="content">
            <slot></slot>
        </div>
    </div>

</template>

<script>
    import BScroll from "@better-scroll/core";
    import PullUp from '@better-scroll/pull-up';
    import PullDown from '@better-scroll/pull-down'
    import ObserveDOM from "@better-scroll/observe-dom";

    BScroll.use(PullDown)
    BScroll.use(ObserveDOM);
    BScroll.use(PullUp);


    export default {
        name: "Scroll",
        //这里用的是驼峰，在父组件实例处需要用 probe-type 才行。
        props: {
            probeType: {
                type: Number,
                default: 0
            },
            //在上拉到超过底部时，触发 pullingUp 事件
            pullUpLoad: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                scroll: null,
            }
        },
        mounted() {
            // 创建BScroll对象
            this.scroll = new BScroll(this.$refs.wrapper, {
                scrollY: true,
                click: true,
                probeType: this.probeType,
                pullUpLoad: this.pullUpLoad,
                observeDOM: true
            });

            //监听
            if (this.probeType != 0) this.scroll.on("scroll", this._onScroll);
            if (this.pullUpLoad) this.scroll.on("pullingUp", this._pullingUp);
        },
        methods: {
            // 滑动
            _onScroll(position) {
                this.$emit("scroll", position);
            },
            //上拉加载更多
            _pullingUp() {
                this.$emit("pullingUp");
            },
            // 返回顶部方法
            scrollTo(x, y, time = 500) {
                this.scroll && this.scroll.scrollTo(x, y, time)
            },
            finishPullUp() {// 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载
                this.scroll && this.scroll.finishPullUp()
            },
            refresh() {
                this.scroll && this.scroll.refresh()
            },
            getScrollY() {
                return this.scroll ? this.scroll.y : 0
            }
        }

    }
</script>

<style scoped>

</style>