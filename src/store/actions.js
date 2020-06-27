export default {
    addCart(context, payload) {
        return new Promise((resolve, reject) => {
            //payload新添加的商品
            //查看之前数组中是否有该商品
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
            //判断oldProduct已经存在则数量加1
            if (oldProduct) {
                context.commit('addCounter', oldProduct)
                resolve('当前的商品数量+1')
            } else {
                //如果没有，新添加一个count属性
                payload.count = 1
                context.commit('addToCart', payload)
                resolve('添加了新的商品')
            }
        })
    }
}