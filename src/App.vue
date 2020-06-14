<template>
    <div id="app" class="wrapper">
        <keep-alive exclude="Detail">
            <router-view/>
            <main-tab-bar/>
        </keep-alive>

    </div>
</template>

<script>
    import MainTabBar from 'components/content/mainTabbar/MainTabBar'

    export default {
        name: 'App',
        components: {
            MainTabBar
        }
    }

</script>
<style>
    @import url('assets/css/base.css');
</style>
