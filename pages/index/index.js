// index.js
Component({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    value:0,
    detailInfo:{
      title:'圈圈纱围脖',
      time:'2022-01-30',
      nowNumber:130,
      allNumber:300,
      customer:'凯瑞针纺',
      price:90000,
      isBind:true,
    }
  },
  pageLifetimes: {
    show: function() {
      wx.hideHomeButton()
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  }
})
