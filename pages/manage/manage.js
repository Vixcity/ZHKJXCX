// manages.js
import Message from 'tdesign-miniprogram/message/index';
Component({
  data: {
    wechat_data: {},
    userInfo: {},
    ourUser: null,
    pageList: [{
      title: '订单管理',
      path: '../orderControl/orderControl'
    }, {
      title: '数据统计',
      path: '../statistics/statistics'
    }, {
      title: '客户管理',
      path: '../userManagement/userManagement'
    }, {
      title: '员工管理',
      path: '../workerManage/workerManage'
    }]
  },
  pageLifetimes: {
    show: function () {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      if (JSON.stringify(this.data.wechat_data) === '{}') {
        this.setData({
          wechat_data: wx.getStorageSync('wechat_data')
        })
      }
      if (this.data.ourUser === null) {
        let _this = this
        wx.login({
          timeout: 5000,
          success: function (needCode) {
            const code = needCode.code
            wx.request({
              url: getApp().globalData.api + '/wechat/userinfo',
              data: {
                code
              },
              method: 'POST',
              success(res) {
                if(res.data.code===200){
                  let wechat_data = wx.getStorageSync('wechat_data')
                  let userInfo = _this.data.userInfo
                  userInfo.openid = res.data.data.openid
                  userInfo.wechat_data = wechat_data
                  if (res.data.data.userinfo !== null) {
                    userInfo.userinfo = res.data.data.userinfo
                  }
                  _this.setData({
                    ourUser: res.data.data
                  })
                  wx.setStorageSync('userInfo', userInfo)
                } else {
                  Message.error({
                    offset: [20, 32],
                    duration: 2000,
                    content: res.data.message
                  });
                }
              }
            })
          }
        })
        wx.login({
          success(res){
            const code = res.code
            wx.request({
              url: getApp().globalData.api + '/wechat/phone',
              data: {
                code
              },
              method: 'POST',
              success(res) {
                console.log(res)
              }
            })
          }
        })
      }
    }
  },
  methods: {
    toSignUp(){
      wx.navigateTo({
        url: '../signUp/signUp'
      })
    },
    toWitchPage(e){
      wx.navigateTo({
        url: e.currentTarget.dataset.path
      })
    }
  }
})