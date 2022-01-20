// manages.js
import Message from 'tdesign-miniprogram/message/index';
import {wxReq,getTimeDiff} from '../../utils/util';

Component({
  data: {
    userInfo:null,
    showPopup: false,
    showImage:'',
    pageList: []
  },
  pageLifetimes: {
    show: function () {
      let _this = this

      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      if (this.data.userInfo === null ) {
        let userInfo = wx.getStorageSync('userInfo')
        this.setData({
          userInfo: userInfo
        })
      }

      wxReq({
        url:'/user/info',
        method:'GET',
        success:function(res){
          if(res.data.code===200){
            let allUserinfo = wx.getStorageSync('userInfo')
            allUserinfo.userinfo = res.data.data
            wx.setStorageSync('userInfo', allUserinfo)
            // 作坊主 == 3
            // 员工 == 2
            // 路人 == 1
            let userRole = allUserinfo.userinfo.role
            _this.setData(_this.getPageList(userRole))
            
          } else {
            let userRole = wx.getStorageSync('userInfo').userinfo.role
            _this.setData(_this.getPageList(userRole))
          }
        }
      })

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
      if(wx.getStorageSync('wxacodeTime') === ""){
        wx.setStorageSync('wxacodeTime' ,Date.now())
        this.getWxACode()
      } else {
        let prevTime = wx.getStorageSync('wxacodeTime')
        let timeDiff = getTimeDiff(Date.now(),prevTime,'hours')
        if(timeDiff<48){
          this.setData({
            showImage:wx.getStorageSync('作坊主小程序码'),
            showPopup:true
          })
        }
      }
    },
    getWxACode(){
      let _this = this
      let uuid = this.data.userInfo.userinfo.uuid
      wxReq({
        url:'/wechat/wxacode',
        data: {
          path:"pages/addWorkShop/addWorkShop?uuid="+uuid+'&time='+Date.now(),
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
    },
    closePopup(){
      this.setData({
        showPopup: false
      })
    },
    // 获取pageList
    getPageList(type){

      if(type === 2){
        return {pageList:[{
            title: '数据统计',
            path: '../statistics/statistics?isStaff=true',
            icon:'https://file.zwyknit.com/%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1-01.png',
            index:1
          }, {
            title: '历任作坊',
            path: '../historyWorkShop/historyWorkShop?isStaff=true',
            icon:'https://file.zwyknit.com/%E5%8E%86%E4%BB%BB%E4%BD%9C%E5%9D%8A-01.png',
            index:2
          }]
        }
      }

      return {
        pageList:[{
          title: '订单管理',
          path: '../orderControl/orderControl?isLeader=' + (type === 3),
          icon:'https://file.zwyknit.com/%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86-01.png',
          index:1
        }, {
          title: '数据统计',
          path: '../statistics/statistics?isLeader=' + (type === 3),
          icon:'https://file.zwyknit.com/%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1-01.png',
          index:2
        }, {
          title: '客户管理',
          path: '../userManagement/userManagement?isLeader=' + (type === 3),
          icon:'https://file.zwyknit.com/%E5%AE%A2%E6%88%B7%E7%AE%A1%E7%90%86-01.png',
          index:3
        }, {
          title: '员工管理',
          path: '../workerManage/workerManage?isLeader=' + (type === 3),
          icon:'https://file.zwyknit.com/%E5%91%98%E5%B7%A5%E7%AE%A1%E7%90%86-01.png',
          index:4
        }]
      }
    }
  }
})