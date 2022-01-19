const { wxReq } = require("../../utils/util")

// pages/outputEntry/outputEntry.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		choosePeople: false,
		people: [{
				label: '老刘',
				value: '老刘'
			},
			{
				label: '老李',
				value: '老李'
			},
			{
				label: '老王',
				value: '老王'
			},
			{
				label: '老谢',
				value: '老谢'
			},
			{
				label: '老张',
				value: '老张'
			},
			{
				label: '老陈',
				value: '老陈'
			},
		],
		selectedPeopleValue:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		let _this = this
		this.setData(wx.getStorageSync('outPutEntry'))
		wxReq({
			url:'/workshop/weave/product/detail',
			data:{
				id:_this.data.detailOrder.id
			},
			method:"GET",
			success:(res) => {
				let allNumber = 0
				let allRealNumber = 0
				_this.setData({product_info:res.data.data.product_info})
				res.data.data.product_info.forEach(item => {
					allNumber += item.number
					allRealNumber += item.real_number
				})
				this.setData({
					allNumber,
					allRealNumber
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	/**
	 * 打开选择器
	 */
	openPick(e) {
		this.setData({
			choosePeople: true
		})
	},

	/**
	 * 提交选择器内容
	 */
	confirmPick(e) {
		console.log(e.detail)
		this.setData({
			selectedPeopleValue:e.detail.value[0].value,
			choosePeople: false
		})
	},

	/**
	 * 关闭选择器
	 */
	closePick() {
		this.setData({
			choosePeople: false
		})
	},

	// 拿到数字
	getInputNumber(e){
		let data = this.data.product_info[e.currentTarget.dataset.index]
		let value = +e.detail.value > (data.number - data.real_number)?(data.number - data.real_number):+e.detail.value
		data.value = value
		this.setData({
			product_info:this.data.product_info
		})
	}
})