<template>
    <div class="goods">
        <good-list-item v-for="(item, index) in goods" :goodsItem="item" :key="index"/>
    </div>
</template>

<script>
    import GoodListItem from './GoodListItem'

    export default {
        name: "GoodList",
        props: {
            goods: {
                type: Array,
                default: []
            }
        },
        components: {
            GoodListItem
        }
    }
</script>

<style scoped>
    .goods {
        display: flex;
        /* 让弹性盒元素在必要的时候拆行  ,  默认值nowrap 不拆行 */
        flex-wrap: wrap;
        justify-content: space-evenly;

    }
</style>