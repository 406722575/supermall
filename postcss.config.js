module.exports = {
    plugins: {
        // ...
        'postcss-px-to-viewport': {
            // options
            viewportWidth: 375,  //视窗的宽度，对应的是设计稿的宽度
            unitPrecision: 5,  //指定px转换为视窗单位值的小数位数（很多时候无法整除）
            viewportUnit: 'vw', //指定需要转换成的视窗单位，建议用vw
            selectorBlackList: ['tab-bar','tab-bar-item'],
            minPixelValue: 1, //小于或者等于1px不转换为视窗单位
            mediaQuery: false,  //允许在媒体查询中转换px
            fontViewportUnit: 'vw',
            landscapeUnit: 'vw',
            landscapeWidth: 667,
            exclude: /\.\/src\//
        }
    }
}