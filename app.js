// app.js
App({
  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const code = res.code
        wx.request({
          url: getApp().globalData.api + '/wechat/userinfo',
          data: {
            code
          },
          method: 'POST',
          success(res) {
            if (res.data.code === 200) {
              if(wx.getStorageSync('userInfo') === "" && wx.getStorageSync('userInfo').wechat_data === undefined){
                wx.setStorageSync('userInfo', res.data.data)
                wx.reLaunch({
                  url: '/pages/noLogin/noLogin',
                })
              }
            }
          }
        })
      }
    })
  },
  globalData: {
    api:'https://knit-m-beta.zwyknit.com/api'
  }
})
