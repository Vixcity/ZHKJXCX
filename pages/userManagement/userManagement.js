// pages/userManagement/userManagement.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardInfoData: {
			cardData: [
				[
					'凯瑞针织', '合作中', '无'
				],
				[
					'凯瑞针织', '绑定中', '2021-12-29~至今'
				],
				[
					'凯瑞针织', '已终止', '2021-12-29~2022-02-22'
				]
			],
			cardTitle: [{
				title: '客户名',
				width: 30
			}, {
				title: '绑定状态',
				width: 25
			}, {
				title: '绑定时间',
				width: 45
			}]
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (option) {
		option.isLeader = option.isLeader === "true" ? true : false
		this.setData(option)
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

	}
})