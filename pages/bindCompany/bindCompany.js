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
      return   
    }
    
    if(options.company_id){
      let company_id = options.company_id
      let params = {
        company_id
      }
      this.setData({
        company_id
      })
      this.init(params)
      return
    }

    // 测试工厂
    // let company_id = '0db46f8e744211eca9a54d3cafd8c04d'
    // 凯瑞工厂
    let company_id = '70857b7288a011ecba5dd79c3ad4c961'
    let params = {
      company_id
    }
    this.setData({
      company_id
    })
    this.init(params)
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
          alias:res.data.data?.alias,
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
    if((this.data.bindStatus === 0 || this.data.bindStatus === 3 || this.data.bindStatus === 2) && (this.data.companyName !== undefined || this.data.alias !== undefined)){
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
  },

  toManege(){
    wx.reLaunch({
      url: '../manage/manage',
    })
  }
})
