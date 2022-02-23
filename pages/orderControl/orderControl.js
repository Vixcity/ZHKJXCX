const {
  wxReq,
  dateDiff,
  getTimeDiff,
  getTimestamp
} = require("../../utils/util")

// index.js
Page({
  data: {},
  onLoad: function (option) {
    option.isLeader = option.isLeader === "true" ? true : false
    this.setData(option)
  },
  onShow() {
    this.getOrderList(wx.getStorageSync('orderChooseIndex'))
  },

  // 获取列表
  getOrderList(status) {
    this.setData({
      isShowLoadmore: true,
      detailInfoList: [],
      allInfoList: []
    })
    wxReq({
      url: '/workshop/order/list',
      data: {
        status,
        limit: 1000000
      },
      method: 'GET',
      success: (res) => {
        let data = res.data.data.data
        let datas = []
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        let nowDate = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? '0' + day : day)
        let nowTime = nowDate + ' ' + hour + ":" + minute + ":" + second
        data.forEach(item => {
          datas.push({
            title: item.product.name,
            time: item.weave_plan.end_time,
            nowNumber: item.real_number ? item.real_number : 0,
            allNumber: item.number,
            customer: item.weave_plan.company.company_name,
            imgSrc: item.product.rel_image[0]?.image_url || 'https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png',
            status: item.status,
            showPrice: item.total_price ? true : false,
            price: item.total_price.toFixed(2),
            display: item.display,
            pid: item.pid,
            product_id: item.product_id,
            code: item.product.product_code || item.product.code_fix,
            dateDiff: dateDiff(nowDate, item.weave_plan.end_time),
            processName: item.weave_plan.process_name,
            bigThan30: getTimeDiff(getTimestamp(nowTime), getTimestamp(item.weave_plan.created_at), 'minutes') >= 30,
          })
        });
        this.setData({
          isShowLoadmore: false,
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
    this.getOrderList(e.detail.value === '0' ? "" : e.detail.value)

    wx.setStorageSync('orderChooseIndex', e.detail.value === '0' ? "" : e.detail.value)
  }
})