// 获取应用实例
const app = getApp()
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
  },
  toManage() {
    wx.reLaunch({
      url: '../manage/manage'
    })
	},
	canToManage(){
		if(wx.getStorageSync('userInfo') !== "" && wx.getStorageSync('userInfo').userinfo!==null){
			this.toManage()
		}
	},
  onLoad() {
		this.canToManage()
  },
  getUserProfile(e) {
    let _this = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        let wxUserInfo = res.userInfo
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
              success(resdata) {
                if (resdata.data.code === 200) {
                    let userinfo = resdata.data.data
                    userinfo.wechat_data = wxUserInfo
                    wx.setStorageSync('userInfo',userinfo)
                    _this.toManage()
                } else {
                  Message.error({
                    offset: [20, 32],
                    duration: 2000,
                    content: res.data.data || res.data.message,
                  });
                  return
                }
              }
            })
          }
        })
      }
    })
  }
})
