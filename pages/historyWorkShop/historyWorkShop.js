const { wxReq } = require("../../utils/util")

// pages/statistics/statistics.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardInfoData: {
			cardData: [],
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
		wxReq({
			url:'/user/workshop/record/list',
			method:'GET',
			success:(res) => {
				// console.log(res.data.data)
				let arr = []
				res.data.data.forEach(item => {
					arr.push([
						item.workshop.name,
						item.status===1?'在岗':'离职',
						item.created_at.slice(0,10)+'~'+(item.quit_at?+item.quit_at.slice(1,10):'至今')
					])
				});
				this.data.cardInfoData.cardData = arr
				this.setData({
					cardInfoData:this.data.cardInfoData
				})
			}
		})
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