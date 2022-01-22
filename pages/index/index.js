import {dateDiff, wxReq} from '../../utils/util';
// index.js
Page({
  data: {
    userInfo: {},
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
          page:page,  // 默认从第二页加载
          limit:page_size,  // 每页加载十条 上面设置
          type:1  // 未完成列表
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
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let nowDate = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? '0' + day : day)
            data.forEach(item => {
              datas.push({
                title:item.product.name,
                time:item.weave_plan.end_time,
                nowNumber:item.real_number?item.real_number:0,
                allNumber:item.number,
                customer:item.weave_plan.company.company_name,
                imgSrc:item.product.rel_image[0].image_url || '',
                display:item.display,
                pid:item.pid,
                product_id:item.product_id,
                code:item.product.product_code,
                dateDiff:dateDiff(nowDate,item.weave_plan.end_time)
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
  },

  changeShow(e){
    let detailOrder = this.data.detailOrderList[e.currentTarget.dataset.index]
    let cardOrder = this.data.orderList[e.currentTarget.dataset.index]
    detailOrder.display = e.detail
    cardOrder.display = e.detail
  }
})
