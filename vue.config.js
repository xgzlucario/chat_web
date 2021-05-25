module.exports = {
    devServer:{
        proxy:{
            '/go':{
                target:'http://127.0.0.1:10888/api/v1',
                changeOrigin:true,
                pathRewrite:{
                    '^/go':''
                }
            }
        }
    }
}
