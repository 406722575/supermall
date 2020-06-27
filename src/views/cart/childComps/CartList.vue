<template>
    <div class="cart-list">
        <scroll class="scroll" ref="scroll">
            <cart-list-item
                    v-for="(item, index) in cartList"
                    :key="index"
                    :item-info="item"/>
        </scroll>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Scroll from 'components/common/scroll/Scroll'
    import CartListItem from "./CartListItem";

    export default {
        name: "CartList",
        computed: {
            ...mapGetters(['cartList'])
        },
        components: {
            CartListItem,
            Scroll,
        },
        activated() {//进入页面立即刷新,防止不能滚动
            this.$refs.scroll.refresh()
        }
    }
</script>

<style scoped>
    .cart-list {
        height: calc(100% - 44px - 49px - 40px);
    }

    .scroll {
        height: 100%;
        overflow: hidden;
    }
</style>