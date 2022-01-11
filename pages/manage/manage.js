// manages.js
const util = require('../../utils/util.js')

Component({
  data: {
    userInfo:{}
  },
  onLoad() {
    
  },
  pageLifetimes: {
    show: function() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      this.setData({
        userInfo:wx.getStorageSync('userInfo')
      })
      wx.login({
        timeout:5000,
        success:function(needCode){
          const code = needCode.code
          wx.request({
            url: getApp().globalData.api + 'wechat/userinfo',
            data: { code },
            method: 'POST',
            success(res) {
              console.log(res.data)
            }
          })
        }
      })
    }
  },
})
