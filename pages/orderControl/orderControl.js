const {
  wxReq
} = require("../../utils/util")

// index.js
Page({
  data: {},
  onLoad: function (option) {
    option.isLeader = option.isLeader === "true" ? true : false
    this.setData(option)
  },
  onShow() {
    wxReq({
      url: '/workshop/order/list',
      data: {
        status: '',
        limit:1000000
      },
      method: 'GET',
      success: (res) => {
        let data = res.data.data.data
        let datas = []
        // console.log(res.data.data)
        data.forEach(item => {
          datas.push({
            title: item.product.name,
            time: item.weave_plan.end_time,
            nowNumber: item.real_number ? item.real_number : 0,
            allNumber: item.number,
            customer: item.weave_plan.company.company_name,
            imgSrc: item.product.rel_image[0].image_url || '',
            status:item.status,
            showPrice:item.total_price?true:false,
            price:item.total_price
          })
        });
        this.setData({
          detailInfoList: datas,
          allInfoList: data
        })
      }
    })
  },
  toOrderDetail(e) {
    wx.setStorageSync('orderDetail', {
      detailProduct: this.data.allInfoList[e.currentTarget.dataset.index],
      detailInfo: this.data.detailInfoList[e.currentTarget.dataset.index]
    })

    wx.navigateTo({
      url: '../orderDetail/orderDetail',
    })
  },
  onTabsChange(e) {
    console.log(e)
  }
})