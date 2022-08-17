// pages/orderDetail.js
import Message from "tdesign-miniprogram/message/index";
import { wxReq } from "../../utils/util";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    // 展开信息
    cardInfoData: {
      cardData: [],
      cardTitle: [
        {
          title: "颜色尺码",
          width: 20,
        },
        {
          title: "工序",
          width: 20,
        },
        {
          title: "加工价",
          width: 20,
        },
        {
          title: "数量",
          width: 20,
        },
        {
          title: "已完成/差额",
          width: 20,
        },
      ],
    },
    // 生产进度
    productionSchedule: {
      cardData: [],
      cardTitle: [
        {
          title: "生产时间/人员",
          width: 37,
        },
        {
          title: "尺码颜色/数量",
          width: 33,
        },
        {
          title: "单价/总价",
          width: 30,
        },
      ],
      hasBr: true,
    },
    // 原料计划
    rawMaterialPlanList: {
      cardData: [],
      cardTitle: [
        {
          title: "原料",
          width: 25,
        },
        {
          title: "计划数量",
          width: 25,
        },
        {
          title: "需领数量",
          width: 25,
        },
        {
          title: "数量差值",
          width: 25,
        },
      ],
      hasBr: true,
    },
    // 扣款损耗
    deductionLossList: {
      cardData: [],
      cardTitle: [
        {
          title: "扣款原因",
          width: 33,
        },
        {
          title: "扣款金额",
          width: 33,
        },
        {
          title: "相关图片",
          width: 33,
          isImg: true,
        },
      ],
      // hasBr: true,
    },
    onePrice: "",
    allPrice: "",
    maxOneLength: 10,
    maxAllLength: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let productDetail = wx.getStorageSync("orderDetail");
    delete productDetail.detailInfo.status;

    wxReq({
      url: "/workshop/weave/product/detail",
      method: "GET",
      data: {
        id: productDetail.detailInfo.id,
      },
      success: (res) => {
        let arr = [];
        let list = [];
        let rawMaterialPlan = [];
        let deduct_info_list = [];
        let product_info = res.data.data.product_info;
        let user_workshop_yields = res.data.data.user_workshop_yields;
        let material_info = res.data.data.material_info;
        let deduct_info = res.data.data.deduct_info;
        let cardInfoData = this.data.cardInfoData;
        let productionSchedule = this.data.productionSchedule;
        product_info.forEach((item) => {
          arr.push([
            (item.size.size_name || "无数据") +
              "/" +
              (item.color.color_name || "无数据"),
            res.data.data.weave_plan.process_name,
            item.price + "元/件",
            item.number,
            (item.real_number || 0) + " / " + (item.number - item.real_number),
          ]);
        });
        cardInfoData.cardData = arr;

        user_workshop_yields.forEach((item) => {
          list.push([
            [item.created_at.slice(0, 16), item.user?.name || "无数据"],
            [
              (item.weave_plan_product_info.size.size_name || "无数据") +
                "/" +
                (item.weave_plan_product_info.color.color_name || "无数据"),
              item.number,
            ],
            [item.price + "元", (item.number * item.price).toFixed(2) + "元"],
          ]);
        });
        productionSchedule.cardData = list;
        productDetail.detailProduct = res.data.data;
        productDetail.detailInfo.nowNumber = res.data.data.real_number;
        // console.log(productDetail);

        // 原料计划
        if (material_info) {
          material_info.forEach((item) => {
            rawMaterialPlan.push([
              [item.material_name, item.material_color],
              [item.number + item.unit],
              [item.number - item.real_push_number + item.unit],
              [item.real_push_number + item.unit],
            ]);
          });
        }

        this.data.rawMaterialPlanList.cardData = rawMaterialPlan;
        let rawMaterialPlanList = this.data.rawMaterialPlanList;

        // 扣款损耗
        if (deduct_info) {
          deduct_info.forEach((item) => {
            deduct_info_list.push([
              item.reason ? unescape(item.reason.replace(/\\u/g, "%u").replaceAll('"','')) : "无",
              (item.price || 0) + "元",
              item.file_url ||
                "https://file.zwyknit.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220211103236.png",
            ]);
          });
        }

        this.data.deductionLossList.cardData = deduct_info_list;
        let deductionLossList = this.data.deductionLossList;

        this.setData(productDetail);

        this.setData({
          cardInfoData,
          productionSchedule,
          onePrice: res.data.data.process_prices[0]?.price,
          allPrice: res.data.data.process_prices[0]?.total_price,
          rawMaterialPlanList,
          deductionLossList,
        });
      },
    });
  },

  closePopup() {
    this.setData({
      showPopup: false,
    });
  },
  showImage(e) {
    console.log();
    this.setData({
      popupSrc: e.detail.src,
      showPopup: true,
    });
  },

  // 提交
  commitProductPrice() {
    let detailProduct = this.data.detailProduct;
    if (this.data.onePrice === "" || this.data.allPrice === "") {
      Message.error({
        offset: [20, 32],
        duration: 2000,
        content: "请填写对应价格",
      });
      return;
    }
    wxReq({
      url: "/process/price/save",
      method: "POST",
      data: {
        data: [
          {
            pid: detailProduct.pid,
            total_price: this.data.allPrice,
            price: this.data.onePrice,
            product_id: detailProduct.product_id,
            id:
              detailProduct.process.length !== 0
                ? detailProduct.process[0].id
                : "",
          },
        ],
      },
      success: (res) => {
        if (res.data.code === 200) {
          Message.success({
            offset: [20, 32],
            duration: 2000,
            content: "提交成功",
          });
        }
      },
    });
  },

  // 更改单价
  changePrice(e) {
    let type = e.target.dataset.price;
    let allNumber = +this.data.detailInfo.allNumber;
    let price = e.detail.value;
    let maxlength = price.indexOf(".") + 3;

    if (type === "one") {
      if (maxlength === 2) {
        this.setData({
          maxOneLength: 10,
        });
      } else {
        this.setData({
          maxOneLength: maxlength,
        });
      }
      this.setData({
        allPrice: (+price * allNumber).toFixed(2),
        onePrice: price,
      });
    }

    if (type === "all") {
      if (maxlength === 2) {
        this.setData({
          maxAllLength: 10,
        });
      } else {
        this.setData({
          maxAllLength: maxlength,
        });
      }
      this.setData({
        onePrice: (+price / allNumber).toFixed(2),
        allPrice: price,
      });
    }
  },
});
