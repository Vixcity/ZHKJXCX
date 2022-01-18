// pages/statistics/statistics.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardInfoData: {
			cardData: [
				[
					'张师傅', '在岗', '2021-12-29~至今'
				],
				[
					'王先生', '在岗', '2021-12-29~至今'
				],
				[
					'王师傅', '离职', '2021-12-29~2022-02-22'
				],
				[
					'王师傅', '离职', '2021-12-29~2022-02-22'
				],
				[
					'王师傅', '离职', '2021-12-29~2022-02-22'
				]
			],
			cardTitle: [{
				title: '作坊负责人',
				width: 30
			}, {
				title: '在岗状态',
				width: 25
			}, {
				title: '在岗时间',
				width: 45
			}]
		}
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