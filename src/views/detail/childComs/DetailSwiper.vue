<template>
    <swiper>
        <swiper-item v-for="(item, index) in topImages" :key="item.index">
            <img :src="item" alt="">
        </swiper-item>
    </swiper>
</template>

<script>
    import {Swiper, SwiperItem} from 'components/common/swiper/index'

    export default {
        name: "DetailSwiper",
        props: {
            topImages: {
                type: Array,
                default: []
            }
        },
        components: {
            Swiper,
            SwiperItem,
        },
    }
</script>

<style scoped>

</style>