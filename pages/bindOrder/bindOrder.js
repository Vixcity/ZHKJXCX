import Message from 'tdesign-miniprogram/message/index';
import {
  wxReq,
  urlParams,
  dateDiff
} from '../../utils/util';
Page({
  data: {
    detailInfoList: [],
    showDialog: false,
    hash: ''
  },

  onLoad: function (options) {
    // 扫描普通链接进入小程序，并获取参数
    // 链接为：https://knit-m-beta.zwyknit.com/miniprogram?company_id=xx1&hash=7777
    // 参数为：company_id,hash
    // if (options.q) {
    //   let scan_url = decodeURIComponent(options.q);
    //   let params = urlParams(scan_url)

    //   let { company_id,hash } = params
    //   this.setData({
    //     company_id,
    //     hash
    //   })

    //   this.init(params)      
    // }
    let params = {
      company_id: 'xx1',
      hash: 7777
    }
    this.setData(params)
    this.init(params)
  },

  init(params) {
    let _this = this

    wxReq({
      url: '/company/detali',
      method: 'GET',
      data: params,
      success: (res) => {
        _this.setData({
          companyName: res.data.data.company_name
        })
      }
    })

    wxReq({
      url: '/workshop/weave/product/list',
      method: 'GET',
      data: params,
      success: (res) => {
        console.log(res.data.data)
        let arr = []
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let nowDate = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? '0' + day : day)
        res.data.data.forEach(item => {
          arr.push({
            title: item.product.name,
            time: item.weave_plan.end_time,
            nowNumber: item.real_number,
            allNumber: item.number,
            imgSrc: item.product.rel_image[0].image_url,
            customer: item.weave_plan.company.company_name,
            isBind: false,
            display: item.display,
            dataDiff: dateDiff(nowDate,item.weave_plan.end_time),
            code: item.product.product_code,
            pid: item.pid,
            product_id: item.product_id
          })
        });

        _this.setData({
          detailInfoList:arr
        })
      }
    })
  },

  changeCheck(e) {
    this.data.detailInfoList.forEach((item,index) => {
      if(index === e.target.dataset.index){
        item.isBind=true
      } else {
        item.isBind=false
      }
    });
    this.setData({
      detailInfoList:this.data.detailInfoList
    })
  },

  toManege() {
    wx.reLaunch({
      url: '../manage/manage',
    })
  }
})