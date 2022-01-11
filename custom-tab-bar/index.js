Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#008DF9",
    list: [{
      pagePath: "/pages/index/index",
      text: "首页"
    }, {
      pagePath: "/pages/manage/manage",
      text: "管理"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})