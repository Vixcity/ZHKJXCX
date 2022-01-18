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
      isBind: true,
      status:2
    }
  },
  onLoad:function(option) {
    option.isLeader = option.isLeader==="true"?true:false
    this.setData(option)
  }
})