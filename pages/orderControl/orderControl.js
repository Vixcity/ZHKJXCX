const { wxReq } = require("../../utils/util")

// index.js
Page({
  data: {
    detailInfo: {
      title: '圈圈纱围脖',
      time: '2022-01-30',
      nowNumber: 130,
      allNumber: 300,
      customer: '凯瑞针纺',
      price: 90000,
      imgSrc:'https://file.zwyknit.com/1641886474000.png',
      status:2
    },
  },
  onLoad:function(option) {
    option.isLeader = option.isLeader==="true"?true:false
    this.setData(option)
  },
  onShow(){
    wxReq({
      url:'/workshop/order/list',
      data:{
        status:''
      },
      method:'GET',
      success:(res) => {
        let data = res.data.data
        let datas = []
        // console.log(res.data.data)
        data.forEach(item => {
          datas.push({
            title:item.product.name,
            time:item.weave_plan.end_time,
            nowNumber:item.real_number?item.real_number:0,
            allNumber:item.number,
            customer:item.weave_plan.company.company_name,
            imgSrc:item.product.rel_image[0].image_url || ''
          })
        });
        this.setData({
          detailInfoList:datas
        })
      }
    })
  },
  toOrderDetail(e){
    wx.navigateTo({
      url: '../orderDetail/orderDetail',
    })
  },
  onTabsChange(e){
    console.log(e)
  }
})