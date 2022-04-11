import {
  wxReq,
  dateDiff,
  getTimeDiff,
  getTimestamp,
  urlParams
} from '../../utils/util';
import Message from 'tdesign-miniprogram/message/index';
// index.js
Page({
  data: {
    userInfo: {},
    value: 0,
    isShowLoadmore: false,
    isShowNoDatasTips: false,
    endloading: false,
    page: 1,
    page_size: 10,
    orderList: [],
    detailOrderList: [],
    isLeader: false
  },

  onShow() {
    wx.hideHomeButton()
    if (wx.getStorageSync('userInfo') === '') {
      this.setData({
        showLogin: true
      })
      return
    }

    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.setData({
      page: 1,
      orderList: [],
      isLeader: wx.getStorageSync('userInfo')?.userinfo?.role === 3
    })
    this.reviewpage()
  },

  onHide: function () {
    this.setData({
      userInfo: {},
      value: 0,
      isShowLoadmore: false,
      isShowNoDatasTips: false,
      endloading: false,
      page: 1,
      page_size: 10,
      orderList: [],
      detailOrderList: [],
    })
  },

  // onReachBottom: function () {
  //   var that = this;
  //   var endloading = that.data.endloading
  //   if (!endloading) {
  //     that.reviewpage()
  //   }
  // },

  // 列表分页加载
  reviewpage: function (e) {
    let that = this;
    let page = this.data.page;
    // let page_size = this.data.page_size;

    that.setData({
      isShowLoadmore: true, // 隐藏正在加载
    })

    if (page === 1) {
      this.setData({
        notShow: false
      })
    }

    wxReq({
      url: '/workshop/weave/product/list',
      method: 'GET',
      data: {
        // page: page, // 默认从第二页加载
        // limit: page_size, // 每页加载十条 上面设置
        // type: 1, // 未完成列表
        // no_binding: 1 // 显示未绑定订单
        order_status: 2 // 显示已经接单的订单
      },
      success: function (res) {
        // console.log(res.data.data.data)
        if (res.data.code == 200) { // 判断当code == 200 的时候得到数据

          // var datas = res.data.result.comments; // 下面有得到的数据可以参考
          // if (res.data.data.data.length === 0) { // 如果res.data.data.data.length === 0 表示没有可加载的数据了
          // if (that.data.page === 1) {
          //   that.setData({
          //     isShowLoadmore: false, // 隐藏正在加载
          //     isShowNoDatasTips: false, // 显示暂无数据
          //     endloading: false, // 上拉不在加载
          //     notShow: true
          //   })
          // } else {
          //   that.setData({
          //     isShowLoadmore: false, // 隐藏正在加载
          //     isShowNoDatasTips: true, // 显示暂无数据
          //     endloading: true, // 上拉不在加载
          //   })
          // }
          // } else {
          let smallThan24h
          let data = res.data.data
          let datas = []
          let datas2 = []
          let date = new Date()
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          let hour = date.getHours()
          let minute = date.getMinutes()
          let second = date.getSeconds()
          let nowDate = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? '0' + day : day)
          let nowTime = nowDate + ' ' + hour + ":" + minute + ":" + second

          data.forEach((item, index) => {
            if (item.workshop_yield_at === "0000-00-00 00:00:00" || item.workshop_yield_at === null) {
              smallThan24h = true
            } else {
              smallThan24h = getTimeDiff(getTimestamp(nowTime), getTimestamp(item.workshop_yield_at), 'hours') <= 24
              if (!smallThan24h) {
                return
              }
            }

            if (!(dateDiff(nowDate, item.weave_plan.end_time) >= -1)) {
              return
            }
            datas.push({
              title: item.product.name,
              time: item.weave_plan.end_time,
              nowNumber: item.real_number ? item.real_number : 0,
              allNumber: item.number,
              customer: item.weave_plan.company.company_name,
              imgSrc: item.product.rel_image[0]?.image_url || 'https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png',
              display: item.display,
              pid: item.pid,
              product_id: item.product_id,
              code: item.product.product_code || item.product.code_fix,
              dateDiff: dateDiff(nowDate, item.weave_plan.end_time),
              processName: item.weave_plan.process_name,
              bigThan30: getTimeDiff(getTimestamp(nowTime), getTimestamp(item.weave_plan.created_at), 'minutes') >= 30,
              smallThan24h
            })
            datas2.push(item)
          });

          that.setData({
            orderList: datas, // 将得到的订单添加到orderList中更新
            detailOrderList: datas2, // 将得到的订单添加到详情进行更新
            isShowLoadmore: false,
            noData: datas.length === 0
          })

          // 判断是否满足条件
          // if (data.length < that.data.page_size) { // 如果剩下评论数 小于10表示数据加载完了
          //   // console.log('已经加载完了')
          //   that.setData({
          // isShowLoadmore: false // 隐藏正在加载
          //     isShowNoDatasTips: false, // 显示暂无数据
          //   })
          // }
          // }
          // that.setData({
          //   page: page + 1 // 更新page 请求下一页数据
          // })
        } else {
          Message.error({
            offset: [20, 32],
            duration: 2000,
            content: res.data.data || res.data.message,
          });
          that.setData({
            showDialog: true
          })
          // console.log(res.data.data)
        }
      }
    })
  },

  toOutPutEntry(e) {
    let i = e.currentTarget.dataset.index
    let detailOrder = this.data.detailOrderList[i]
    let cardOrder = this.data.orderList[i]

    wx.setStorageSync('outPutEntry', {
      detailOrder,
      cardOrder
    })
    wx.navigateTo({
      url: '../outputEntry/outputEntry',
    })
  },

  // 扫码功能
  toPhoto() {
    wx.scanCode({
      scanType: "qrCode",
      onlyFromCamera: true,
      success: (res) => {
        if (res.errMsg === "scanCode:ok") {
          if (res.result.slice(0, 43) === "https://knit-m-beta.zwyknit.com/miniprogram") {
            let a = urlParams(res.result)
            wx.navigateTo({
              url: '/pages/bindCompany/bindCompany?company_id=' + a.company_id,
            })
          }
          if (res.scanType === "WX_CODE" && res.path.slice(0, 29) === 'pages/addWorkShop/addWorkShop') {
            wx.navigateTo({
              url: '/' + res.path,
            })
          }
        }
      }
    })
  },

  changeShow(e) {
    let detailOrder = this.data.detailOrderList[e.currentTarget.dataset.index]
    let cardOrder = this.data.orderList[e.currentTarget.dataset.index]
    detailOrder.display = e.detail
    cardOrder.display = e.detail
  },

  toManage() {
    wx.reLaunch({
      url: '../manage/manage'
    })
  },

  toSingUp() {
    wx.navigateTo({
      url: '../signUp/signUp',
    })
  },

  toNoLogin() {
    wx.reLaunch({
      url: '../noLogin/noLogin',
    })
  }
})