<template>
    <div class="bootom-bar">
        <div class="check-area">
            <check-button
                    class="check-all"
                    :is-checked="isSelectAll"
                    @click.native="checkClick"/>
            <span>全选</span>
        </div>

        <div class="price">
            合计:{{totalPrice}}
        </div>

        <div class="calculate" @click="calcClick">
            去计算({{checkLength}})
        </div>

    </div>
</template>

<script>
    import CheckButton from 'components/content/checkButton/CheckButton'

    export default {
        name: "CartBottomBar",
        components: {
            CheckButton,
        },
        computed: {
            totalPrice() {
                return '￥' + this.$store.state.cartList.filter(item => {
                    return item.checked
                }).reduce((preValue, item) => {
                    return preValue + item.price * item.count
                }, 0).toFixed(2)
            },
            checkLength() {
                return this.$store.state.cartList.filter(item => item.checked).length
            },
            isSelectAll() {
                //购物车为空时，直接返回
                if (this.$store.state.cartList.length === 0) return false
                //有一个没有选中，不会全选
                // return !(this.$store.state.cartList.filter(item => !item.checked).length)
                return !this.$store.state.cartList.find(item => !item.checked)
            }
        },
        methods:{
            //点击全选按钮
            checkClick(){
                if(this.isSelectAll){//全部选中时，点击全选，改成false
                    this.$store.state.cartList.forEach(item => item.checked = false)
                }else {//全部没有选中或者部分选中时，点击全赞，改成true
                    this.$store.state.cartList.forEach(item => item.checked = true)
                }
            },
            calcClick(){
                if(!this.isSelectAll){
                    this.$toast.show('请选择购物的商品')
                }
            }
        }
    }
</script>

<style scoped>
    .bootom-bar {
        position: relative;
        display: flex;

        line-height: 40px;
        height: 40px;
        font-size: 14px;

        background-color: #eee;
    }

    .check-area {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 60px;
    }

    .check-all {
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin-right: 5px;
    }

    .price {
        margin-left: 20px;
        flex: 1;
    }

    .calculate {
        width: 90px;
        background-color: red;
        color: #fff;
        text-align: center;
    }
</style>