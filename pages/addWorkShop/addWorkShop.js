import Message from 'tdesign-miniprogram/message/index';
import { wxReq,getTimeDiff } from '../../utils/util';
Component({
  data: {
    workShopInfo: {},
    isAdded:wx.getStorageSync('userInfo').userinfo?.parent!==null || false,
    query_uuid:'',
    showDialog:false,
    showUsed:false,
    beloneInfo:{},
    isBeOverdue:false,
  },
  pageLifetimes: {
    show: function() {
      let _this = this
      let query_uuid = wx.getLaunchOptionsSync().query.uuid
      let time = wx.getLaunchOptionsSync().query.time
      let timeDiff = getTimeDiff(Date.now(),time,'hours')
      // 判断是否为直接扫码进入
      if(wx.getStorageSync('userInfo')===""){
        wx.reLaunch({
          url: '../noLogin/noLogin',
        })
      }

      if(timeDiff>48){
        this.setData({
          isBeOverdue:true
        })
        return
      }

      this.data.query_uuid = query_uuid
      if(query_uuid===undefined){
        Message.error({
          offset: [20, 32],
          duration: 2000,
          content: '您扫描的作坊主码不正确'
        });
      } else {
        wxReq({
          url:'/user/detali',
          data:{
            uuid:query_uuid
          },
          method:"GET",
          success(res){
            _this.setData({
              workShopInfo:res.data.data
            })
            if(res.data.data.uuid === query_uuid){
              _this.setData({
                showUsed:true
              })
            }
          }
        })
        this.setData({
          beloneInfo:wx.getStorageSync('userInfo').userinfo.parent
        })
      }
    }
  },
  methods: {
    addWorkShop(){
      let _this = this
      wxReq({
        url:this.data.isAdded?'/user/exchange/workshop':'/user/apply/workshop',
        data:{
          parent_id:this.data.query_uuid
        },
        method:"POST",
        success(res){
          if(res.data.code!==200){
            Message.error({
              offset: [20, 32],
              duration: 2000,
              content: res.data.data
            });
            return
          }
          wxReq({
            url:'/user/adopt/workshop',
            method:"POST",
            success:(res) => {
              _this.setData({
                showDialog:true
              })
            }
          })
        }
      })
    },
    toManege(){
      wx.reLaunch({
        url: '../manage/manage',
      })
    }
  }
})
