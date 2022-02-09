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
    bindStatus:'',
    iRead:false,
    isLogin:true,
    isLeader:true
  },

  onLoad: function(options) {
    if (wx.getStorageSync('userInfo')==="") {
      this.setData({
        isLogin:false
      })
      
      return  
    }
    if(wx.getStorageSync('userInfo').userinfo.role===2) {
      this.setData({
        isLeader:false
      })

      return
    }
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
    // console.log(1)
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
          companyName:res.data.data?.company_name,
          address:res.data.data?.address
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

  changeRead(){
    this.setData({
      iRead:!this.data.iRead
    })
  },
    
  bindOrToManege(){
    if(this.data.bindStatus === 0 && this.data.companyName !== undefined){
      if(!this.data.iRead){
        Message.error({
          offset: [20, 32],
          duration: 2000,
          content: '同意并阅读绑定合作协议'
        });
        return
      }
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
          _this.init({
            company_id:_this.data.company_id
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
    wxReq({
      url:'/user/adopt/company',
      method:'POST',
      success: (res) => {
        console.log(res)
      }
    })
  },

  toManege(){
    wx.reLaunch({
      url: '../manage/manage',
    })
  }
})
