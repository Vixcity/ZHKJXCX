// manages.js
import Message from 'tdesign-miniprogram/message/index';
import {wxReq} from '../../utils/util';

Component({
  data: {
    userInfo: {},
    ourUser: null,
    showPopup: false,
    showImage:'',
    pageList: [{
      title: '订单管理',
      path: '../orderControl/orderControl',
      index:1
    }, {
      title: '数据统计',
      path: '../statistics/statistics',
      index:2
    }, {
      title: '客户管理',
      path: '../userManagement/userManagement',
      index:3
    }, {
      title: '员工管理',
      path: '../workerManage/workerManage',
      index:4
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
      if (JSON.stringify(this.data.userInfo) === '{}') {
        let userInfo = wx.getStorageSync('userInfo')
        this.setData({
          userInfo: userInfo
        })
      }
      // console.log(userInfo)
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
                if (res.data.code === 200) {
                  let userInfo = _this.data.userInfo
                  userInfo.openid = res.data.data.openid
                  if (res.data.data.userinfo !== null) {
                    userInfo.userinfo = res.data.data.userinfo
                  }
                  _this.setData({
                    ourUser: res.data.data
                  })
                  // console.log(_this.data.ourUser)
                  wx.setStorageSync('userInfo', userInfo)
                  wxReq({
                    url:'/user/info',
                    method:'GET',
                    success:function(res){
                      let allUserinfo = wx.getStorageSync('userInfo')
                      allUserinfo.userinfo = res.data.data
                      wx.setStorageSync('userInfo', allUserinfo)
                      // 作坊主 == 3
                      // 员工 == 2
                      // 路人 == 1
                      if(allUserinfo.userinfo.role == 2){
                        _this.setData({
                          pageList:[{
                            title: '数据统计',
                            path: '../statistics/statistics',
                            index:1
                          }, {
                            title: '历任作坊',
                            path: '../historyWorkShop/historyWorkShop',
                            index:2
                          }]
                        })
                      }
                    }
                  })
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
      }
    },
    hide: function () {
      this.setData({
        showPopup: false
      })
    }
  },
  methods: {
    toSignUp() {
      wx.navigateTo({
        url: '../signUp/signUp'
      })
    },
    toWitchPage(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.path
      })
    },
    // 点击二维码拿到小程序码
    openPopup() {
      let _this = this
      if(wx.getStorageSync('作坊主小程序码')===''){
        let uuid = this.data.ourUser.userinfo.uuid
        wxReq({
          url:'/wechat/wxacode',
          data: {
            path:"pages/addWorkShop/addWorkShop?uuid="+uuid,
            width:430,
            auto_color:false,
            line_color:{"r":0,"g":0,"b":0},
            is_hyaline:false
          },
          method: "POST",
          success: function(res){
            if(res.data.code!==200){
              Message.error({
                offset: [20, 32],
                duration: 2000,
                content: '获取作坊主码失败'
              });
              return
            }
            _this.setData({
              showPopup: true,
              showImage:res.data.data
            })
            wx.setStorageSync('作坊主小程序码', res.data.data)
            return
          }
        })
      }
      this.setData({
        showImage:wx.getStorageSync('作坊主小程序码'),
        showPopup:true
      })
    },
    closePopup(){
      this.setData({
        showPopup: false
      })
    }
  }
})