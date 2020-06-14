<template>
    <nav-bar>
        <div slot="nav-left" class="backBtn" @click="backClick">
            <img src="~assets/img/common/back.svg" alt="">
        </div>
        <div slot="nav-center" class="title">
            <div v-for="(item, index) in titles"
                 class="title-item"
                 :class="{active: index === currentIndex}"
                 @click="titleClick(index)">
                {{item}}
            </div>
        </div>
    </nav-bar>


</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'


    export default {
        name: "DetailNavBar",
        components: {
            NavBar,
        },
        data() {
            return {
                titles: ['商品', '参数', '评论', '推荐'],
                currentIndex: 0,
            }
        },
        methods: {
            titleClick(index) {
                this.currentIndex = index
            },
            backClick(){
                this.$router.go(-1)
            }
        }
    }
</script>

<style scoped>
    .title {
        display: flex;
        font-size: 13px;
    }

    .title-item {
        flex: 1;
    }

    .active {
        color: var(--color-high-text);
    }

    .backBtn img{
        margin-top: 10px;
    }

</style>