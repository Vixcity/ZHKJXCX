import Message from 'tdesign-miniprogram/message/index';
import {
  wxReq,
  urlParams,
  reloadThisPage
} from '../../utils/util';
Page({
  data: {
    workShopInfo: {},
    isAdded: wx.getStorageSync('userInfo').userinfo?.parent !== null || false,
    query_uuid: '',
    showDialog: false,
    showUsed: false,
    isBeOverdue: false,
    bindStatus: '',
    iRead: false,
    isLogin: true,
    isLeader: true,
    isNoTrueLogin: true,
    isNoData: false
  },

  onLoad: function (options) {
    if (wx.getStorageSync('userInfo') === "") {
      this.setData({
        isLogin: false,
        abnormal: true,
      })
    }

    if (wx.getStorageSync('userInfo').userinfo?.role === 2) {
      this.setData({
        isLeader: false,
        abnormal: true,
      })

      return
    }

    // 扫描普通链接进入小程序，并获取参数
    // 链接为：https://knit-m-beta.zwyknit.com/miniprogram?company_id=xx1
    // 参数为：company_id
    if (options.q) {
      let scan_url = decodeURIComponent(options.q);
      let params = urlParams(scan_url)

      let {
        company_id
      } = params
      this.setData({
        company_id
      })

      if (this.data.abnormal) return;

      this.init(params)
      return
    }

    if (options.company_id) {
      let company_id = options.company_id
      let params = {
        company_id
      }

      this.setData({
        company_id
      })

      if (this.data.abnormal) return;

      this.init(params)
      return
    }

    // 测试工厂
    // let company_id = '0db46f8e744211eca9a54d3cafd8c04d'
    // 线上测试工厂
    // let company_id = 'da3fd4be69f011ecb621b1870022e9e4'
    // let params = {
    //   company_id
    // }
    // this.setData({
    //   company_id
    // })
    // this.init(params)
  },

  init(params) {
    let _this = this

    wxReq({
      url: '/user/company/status',
      method: 'GET',
      data: params,
      success: (res) => {
        if (res.data.code === 400 && res.data.data === '未注册，请注册') {
          _this.setData({
            abnormal: true,
            isNoTrueLogin: false,
            companyName: '',
            alias: ''
          })
          return
        }
        _this.setData({
          bindStatus: res.data.data
        })

        wxReq({
          url: '/company/detali',
          method: 'GET',
          data: params,
          success: (ress) => {
            _this.setData({
              companyName: ress.data.data?.company_name,
              alias: ress.data.data?.alias,
              address: ress.data.data?.address
            })
          }
        })
      }
    })
  },

  changeRead() {
    this.setData({
      iRead: !this.data.iRead
    })
  },

  bindOrToManege() {
    if ((this.data.bindStatus === 0 || this.data.bindStatus === 3 || this.data.bindStatus === 2) && (this.data.companyName !== undefined || this.data.alias !== undefined)) {
      this.bindCompany()
      return
    }

    this.toManege()
  },

  bindCompany() {
    let _this = this
    wxReq({
      url: '/user/apply/company',
      method: 'POST',
      data: {
        company_id: _this.data.company_id
      },
      success: (res) => {
        if (res.data.code === 200) {
          _this.init({
            company_id: _this.data.company_id
          })
          Message.success({
            offset: [20, 32],
            duration: 2000,
            content: '审核提交成功'
          });
          return
        }
      }
    })
  },

  toManege() {
    wx.reLaunch({
      url: '../manage/manage',
    })
  },

  toSignUp() {
    let _this = this
    wx.navigateTo({
      url: '../signUp/signUp?company_id=' + _this.data.company_id
    })
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
                  wx.setStorageSync('userInfo', userinfo)
                  wxReq({
                    url: '/user/info',
                    method: 'GET',
                    success: function (res) {
                      if (res.data.data === "未注册，请注册") {
                        _this.toSignUp()
                      } else {
                        _this.setData({
                          abnormal: false,
                          isLogin: true
                        })

                        let params = {
                          company_id: _this.data.company_id
                        }
                        _this.init(params)
                      }
                    }
                  })
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