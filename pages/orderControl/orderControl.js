const {
  wxReq,
  dateDiff,
  getTimeDiff,
  getTimestamp
} = require("../../utils/util")
import Message from 'tdesign-miniprogram/message/index';

// index.js
Page({
  data: {
    isLogin: true,
    cardInfoData: {
      cardData: [],
      cardTitle: [{
        title: '颜色尺码',
        width: 20
      }, {
        title: '工序',
        width: 20
      }, {
        title: '加工价',
        width: 20
      }, {
        title: '数量',
        width: 20
      }, {
        title: '已完成/差额',
        width: 20
      }]
    },
  },
  onLoad: function (option) {
    // 测试用例
    // option.order = "XXSJH-2200012"
    // 生产用例
    // option.order = "CSXBSJH-2200021"
    option.isLeader = option.isLeader === "true" ? true : false
    this.setData(option)

    if (wx.getStorageSync('userInfo') === "") {
      this.setData({
        isLogin: false
      })

      return
    } else {
      this.getOrderList(wx.getStorageSync('orderChooseIndex'))
    }
  },

  // 获取列表
  getOrderList(status) {
    let _this = this
    _this.setData({
      isShowLoadmore: true,
      detailInfoList: [],
      allInfoList: []
    })
    wxReq({
      url: '/workshop/order/list',
      data: {
        status,
        limit: 1000000,
        code: _this.data.order || ""
      },
      method: 'GET',
      success: (res) => {
        if (res.data.data.data.length === 0 && _this.data.order) {
          _this.setData({
            error: true
          })
          return
        }

        let data = res.data.data.data
        let arr = []
        let datas = []
        let indexArr = []
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
          if (!_this.data.order) {
            if (item.weave_plan.order_status !== 2) {
              indexArr.push(index)
              return;
            }
          }
          let product_info = item.product_info_data
          product_info.forEach(el => {
            arr.push([(el.size.size_name || '无数据') + '/' + (el.color.color_name || '无数据'), item.weave_plan.process_name, (el.price || 0) + '元/件', el.number, (el.real_number || 0) + ' / ' + (el.number - el.real_number)])
          })
          datas.push({
            title: item.product.name,
            time: item.weave_plan.end_time,
            nowNumber: item.real_number ? item.real_number : 0,
            allNumber: item.number,
            customer: item.weave_plan.company.company_name,
            imgSrc: item.product.rel_image[0]?.image_url || 'https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png',
            status: _this.data.order ? 4 : item.status,
            showPrice: item.total_price ? true : false,
            price: item.total_price.toFixed(2),
            display: item.display,
            id: item.id,
            pid: item.pid,
            product_id: item.product_id,
            code: item.product.product_code || item.product.code_fix,
            dateDiff: dateDiff(nowDate, item.weave_plan.end_time),
            processName: item.weave_plan.process_name,
            bigThan30: getTimeDiff(getTimestamp(nowTime), getTimestamp(item.weave_plan.created_at), 'minutes') >= 30,
          })
        });

        indexArr.forEach(item => {
          data.splice(item, 1);
        })

        this.data.cardInfoData.cardData = arr
        this.setData({
          isShowLoadmore: false,
          detailInfoList: datas,
          allInfoList: data,
          cardInfoData: this.data.cardInfoData,
          orderStatus:data[0].weave_plan.order_status
        })
      }
    })
  },

  toOrderDetail(e) {
    if (this.data.order) {
      return
    }

    wx.setStorageSync('orderDetail', {
      detailProduct: this.data.allInfoList[e.currentTarget.dataset.index],
      detailInfo: this.data.detailInfoList[e.currentTarget.dataset.index]
    })

    wx.navigateTo({
      url: '../orderDetail/orderDetail',
    })
  },

  postPlanStatus(status) {
    let _this = this

    wxReq({
      url: '/weave/plan/status',
      method: "POST",
      data: {
        code: _this.data.order || "",
        order_status: status
      },
      success: (res => {
        if (res.data.status) {
          if (status === 2) {
            Message.success({
              offset: [20, 32],
              duration: 3000,
              content: '接单成功，3秒后返回首页',
            });
          }

          if (status === 3) {
            Message.success({
              offset: [20, 32],
              duration: 3000,
              content: '拒单成功，3秒后返回首页',
            });
          }

          setTimeout(function () {
            _this.toManege()
          }, 3000)
        }
      })
    })
  },

  // 接单
  argeeOrder() {
    this.postPlanStatus(2)
  },

  // 拒单按钮点击
  refuseOrder() {
    this.setData({
      isRefuseOrder: true
    })
  },

  // 拒单按钮再次点击
  isConfirmReuseOrder() {
    this.postPlanStatus(3)
  },

  // 返回首页
  toManege() {
    wx.reLaunch({
      url: '../manage/manage',
    })
  },

  // 注册页
  toNoLogin() {
    let _this = this
    wx.reLaunch({
      url: '../noLogin/noLogin?order=' + _this.data.order,
    })
  },

  // 切换tab页
  onTabsChange(e) {
    this.getOrderList(e.detail.value === '0' ? "" : e.detail.value)

    wx.setStorageSync('orderChooseIndex', e.detail.value === '0' ? "" : e.detail.value)
  }
})