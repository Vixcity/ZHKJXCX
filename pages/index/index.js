import {wxReq} from '../../utils/util';
// index.js
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    value:0,
    isShowLoadmore:false,
    isShowNoDatasTips:false,
    endloading: false,
    page:1,
    page_size:10,
    orderList:[],
    detailOrderList:[],
  },

  onShow(){
    wx.hideHomeButton()
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.setData({
      page:1,
      orderList:[]
    })
    this.reviewpage()
  },

  onReachBottom: function () {
    var that = this;
    var endloading = that.data.endloading
    if (!endloading){
      that.reviewpage()
    }
  },

  // 评论分页加载
  reviewpage:function(e){
    let that =this;
    let page = this.data.page;
    let page_size = this.data.page_size;
    wxReq({
      url: '/workshop/weave/product/list', 
      method:'GET' ,
      data:{
          page:page, //默认从第二页加载
          limit:page_size //每页加载十条 上面设置
      },
      success:function(res){
        // console.log(res.data.data.data)
        if(res.data.code == 200){  //判断当code == 200 的时候得到数据

        //   var datas = res.data.result.comments; // 下面有得到的数据可以参考
          if (res.data.data.data.length === 0){ //如果res.data.data.data.length === 0 表示没有可加载的数据了
            that.setData({
              isShowLoadmore: false, //隐藏正在加载
              isShowNoDatasTips: true, //显示暂无数据
              endloading: true, //上拉不在加载
            })
          } else {
            let data = res.data.data.data
            let datas = []
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
            that.setData({
              orderList: that.data.orderList.concat(datas),  //将得到的订单添加到orderList中更新
              detailOrderList: data
            })
            if (data.length < that.data.page_size){ //如果剩下评论数 小于10表示数据加载完了
              // console.log('已经加载完了')
              that.setData({
                isShowLoadmore: false, //隐藏正在加载
                isShowNoDatasTips: false, //显示暂无数据
              })
            }
          }
          that.setData({
            page:page+1 //更新page 请求下一页数据
          })
        }else{
          console.log(res)
        }
      }
    })
  },

  toOutPutEntry(e){
    let i = e.currentTarget.dataset.index
    let detailOrder = this.data.detailOrderList[i]
    let cardOrder = this.data.orderList[i]
    wx.setStorageSync('outPutEntry', {detailOrder,cardOrder})
    wx.navigateTo({
      url: '../outputEntry/outputEntry',
    })
  }
})
