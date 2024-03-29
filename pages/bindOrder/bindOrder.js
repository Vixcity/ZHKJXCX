import Message from "tdesign-miniprogram/message/index";
import {
  wxReq,
  dateDiff,
  urlParams,
  getTimeDiff,
  getTimestamp,
} from "../../utils/util";
Page({
  data: {
    detailInfoList: [],
    showDialog: false,
    hash: "",
    abnormal: false,
  },

  onLoad: function (options) {
    if (
      wx.getStorageSync("userInfo") === "" ||
      wx.getStorageSync("userInfo").userinfo.role === 1
    ) {
      this.setData({
        abnormal: true,
      });
      return;
    }

    // 扫描普通链接进入小程序，并获取参数
    // 链接为：https://knit-m-beta.zwyknit.com/miniprogram?company_id=xx1&hash=7777
    // 参数为：company_id,hash
    if (options.q) {
      let scan_url = decodeURIComponent(options.q);
      let params = urlParams(scan_url);

      this.setData(params);
      params.index = 1;
      params.order_status = 2;
      this.init(params);
    }

    // let params = {
    //   company_id: 'da3fd4be69f011ecb621b1870022e9e4',
    //   hash: "新版测试工厂2202266",
    //   id: 82,
    //   order_status: 2,
    //   index: 1
    // }

    // this.setData(params);
    // this.init(params);
  },

  init(params) {
    let _this = this;

    wxReq({
      url: "/company/detali",
      method: "GET",
      data: params,
      success: (res) => {
        if (res.data.data === null) {
          _this.setData({
            abnormal: true,
          });
          return;
        }
        _this.setData({
          companyName: res.data.data.company_name,
        });
      },
    });

    this.getList(params);
  },

  getList(params) {
    let _this = this;
    let index = params.index;
    delete params.index;

    wxReq({
      url:
        index === 1
          ? "/workshop/weave/product/codestatus"
          : "/workshop/weave/product/list",
      method: "GET",
      data: params,
      success: (res) => {
        if (res.data.data === "未注册，请注册") {
          _this.setData({
            abnormal: true,
          });
          return;
        }

        if (index === 1) {
          // 选择情况
          let notChoose =
            (res.data.data.is_band === 0 && res.data.data.data.length === 1) ||
            res.data.data.is_band === 1;

          // 先判断订单是否被绑定 is_band === 0 则代表未绑定
          if (res.data.data.is_band === 0 && res.data.data.data.length === 0) {
            let param = {
              company_id: params.company_id,
              no_binding: 1,
              index: 2,
            };
            // 没绑定我们就再去查一遍list拿到没绑定的数据
            _this.getList(param);
            return;
          }

          _this.notDataGetData(res.data.data.data);

          // 直接跳转
          if (notChoose) {
            // 改变数据格式进行跳转
            let arr = _this.dataChange(res.data.data.data);
            let detailOrder = res.data.data.data[0];
            let cardOrder = arr[0];
            let detailInfoList = _this.data.detailInfoList;

            detailInfoList[0].isBind = true;

            _this.setData({
              detailInfoList,
            });

            // 转换数据，使得完成数量录入不会因为process是undefined而提交失败
            detailOrder.process = detailOrder.process || detailOrder.pidprocess;

            wx.setStorageSync("outPutEntry", {
              detailOrder,
              cardOrder,
            });

            if (res.data.data.is_band !== 1) {
              _this.bindOrder();
              return;
            }
            _this.toOutputEntry();
          }

          return;
        } else {
          _this.notDataGetData(res.data.data);
        }
      },
    });
  },

  notDataGetData(data) {
    let _this = this;
    // 这里是初始化进来无订单绑定数据的
    let arr = _this.dataChange(data);

    // 如果数据为空，抛出异常
    if (data.length === 0 || arr.length === 0) {
      _this.setData({
        abnormal: true,
      });
      return;
    }

    _this.setData({
      detailInfoList: arr,
      detailOrderList: data,
    });
  },

  dataChange(data) {
    let arr = [];
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let nowDate =
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (day < 10 ? "0" + day : day);
    let nowTime = nowDate + " " + hour + ":" + minute + ":" + second;
    data.forEach((item) => {
      arr.push({
        title: item.product.name,
        time: item.weave_plan.end_time,
        nowNumber: item.real_number,
        allNumber: item.number,
        imgSrc:
          item.product.rel_image[0]?.image_url ||
          "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
        customer: item.weave_plan.company?.company_name,
        isBind: false,
        display: item.display,
        dataDiff: dateDiff(nowDate, item.weave_plan.end_time),
        code: item.product.product_code || item.product.code_fix,
        pid: item.pid,
        id: item.id,
        product_id: item.product_id,
        bigThan30:
          getTimeDiff(
            getTimestamp(nowTime),
            getTimestamp(item.weave_plan.created_at),
            "minutes"
          ) >= 30,
      });
    });

    return arr;
  },

  changeCheck(e) {
    let _this = this;
    this.data.detailInfoList.forEach((item, index) => {
      if (index === e.target.dataset.index) {
        if (item.isBind === true) {
          item.isBind = false;
          _this.data.detailOrderList[index].isBind = false;
        } else {
          item.isBind = true;
          _this.data.detailOrderList[index].isBind = true;
        }
      } else {
        item.isBind = false;
        _this.data.detailOrderList[index].isBind = false;
      }
    });
    this.setData({
      detailInfoList: this.data.detailInfoList,
    });
  },

  toOutputEntry() {
    wx.redirectTo({
      url: "../outputEntry/outputEntry?hash=" + this.data.hash,
    });
  },

  toManage() {
    wx.reLaunch({
      url: "../manage/manage",
    });
  },

  bindOrder() {
    let _this = this;

    // 判断是否绑定
    if (
      this.data.detailInfoList.find((item) => item.isBind === true) ===
      undefined
    ) {
      Message.error({
        offset: [20, 32],
        duration: 2000,
        content: "请选择一个订单进行绑定",
      });
      return;
    }

    // 获取对应的绑定值
    let cardOrder;
    let index;
    for (let i = 0; i < this.data.detailInfoList.length; i++) {
      if (this.data.detailInfoList[i].isBind === true) {
        cardOrder = this.data.detailInfoList[i];
        index = i;
        break;
      }
    }

    let detailOrder = this.data.detailInfoList[index];

    // console.log(detailOrder)

    wx.setStorageSync("outPutEntry", {
      detailOrder,
      cardOrder,
    });

    wxReq({
      url: "/weave/product/save",
      method: "POST",
      data: {
        product_id: cardOrder.product_id,
        pid: cardOrder.pid,
        hash: this.data.hash,
        production_code_id: this.data.id,
      },
      success: (res) => {
        if (res.data.code === 200) {
          Message.success({
            offset: [20, 32],
            duration: 2000,
            content: "绑定成功",
          });
          setTimeout(() => {
            _this.toOutputEntry();
          }, 2000);
        }
      },
    });
  },
});
