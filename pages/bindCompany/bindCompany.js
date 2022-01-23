import Message from 'tdesign-miniprogram/message/index';
import { wxReq, urlParams } from '../../utils/util';
Page({
  data: {
    workShopInfo: {},
    isAdded:wx.getStorageSync('userInfo').userinfo?.parent!==null || false,
    query_uuid:'',
    showDialog:false,
    showUsed:false,
    isBeOverdue:false,
    bindStatus:''
  },

  onLoad: function(options) {
    // 扫描普通链接进入小程序，并获取参数
    // 链接为：https://knit-m-beta.zwyknit.com/miniprogram?company_id=xx1
    // 参数为：company_id
    if (options.q) {
      let scan_url = decodeURIComponent(options.q);
      let params = urlParams(scan_url)

      let { company_id } = params
      this.setData({
        company_id
      })

      this.init(params)      
    }
    // let params = {
    //   company_id:'xx1'
    // }
    // this.init(params)
  },

  init(params){
    let _this = this
    wxReq({
      url:'/company/detali',
      method:'GET',
      data:params,
      success: (res) => {
        _this.setData({
          companyName:res.data.data.company_name,
          address:res.data.data.address
        })
      }
    })

    wxReq({
      url:'/user/company/status',
      method:'GET',
      data:params,
      success: (res) => {
        _this.setData({
          bindStatus:res.data.data
        })
      }
    })
  },
    
  bindOrToManege(){
    if(this.data.bindStatus === 0){
      this.bindCompany()
      return
    }
    
    this.toManege()
  },

  bindCompany(){
    let _this = this
    wxReq({
      url:'/user/apply/company',
      method:'POST',
      data:{
        company_id:_this.data.company_id
      },
      success: (res) => {
        if(res.data.code === 200){

          return
        }
      }
    })
  },

  toManege(){
    wx.reLaunch({
      url: '../manage/manage',
    })
  }
})
