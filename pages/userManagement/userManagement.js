const {
	wxReq
} = require("../../utils/util")

// pages/userManagement/userManagement.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardInfoData: {
			cardData: [],
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
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getUserData(2)
	},

	// 获取用户数据
	getUserData: function (status) {
		let _this = this
		wxReq({
			url: '/user/company/list',
			method: 'GET',
			data: {
				status
			},
			success: (res) => {
				let arr = []
				res.data.data.forEach(item => {
					let status
					if (item.status === 1) {
						status = '绑定中'
					} else if (item.status === 2) {
						status = '合作中'
					} else if (item.status === 3) {
						status = '已终止'
					}
					arr.push([
						item.company.company_name,
						status,
						item.created_at.slice(0, 10) + '~' + (item.quit_at === '0000-00-00 00:00:00' ? '至今' : item.quit_at.slice(0, 10))
					])
				});
				_this.data.cardInfoData.cardData = arr
				_this.setData({
					cardInfoData:_this.data.cardInfoData
				})
			}
		})
	},

	// 切换Tab页面
	onTabsChange: function (e) {
		this.getUserData(+e.detail.value)
	}
})