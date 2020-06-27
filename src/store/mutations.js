export default {
    //mutations的目的是修改state中状态，每个方法要单一
    addCounter(state, payload) {
        payload.count++;
    },
    addToCart(state, payload) {
        payload.checked = true
        state.cartList.push(payload)
    }
}