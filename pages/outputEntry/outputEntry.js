const {
	wxReq
} = require("../../utils/util")
import Message from 'tdesign-miniprogram/message/index';
// pages/outputEntry/outputEntry.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		choosePeople: false,
		people: [],
		selectedPeopleValue: '',
		selectedPeopleLabel: '',
		enteryAllNumber: "",
		showChoose: false,
		entryArr: []
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.setData(wx.getStorageSync('outPutEntry'))
		if (wx.getStorageSync('userInfo').userinfo.role === 3) {
			this.setData({
				showChoose: true,
				userName: wx.getStorageSync('userInfo').userinfo.name
			})
		} else {
			this.setData({
				userName: wx.getStorageSync('userInfo').userinfo.name
			})
		}
		this.getDetailInfo()
		this.getPeopleName()
	},

	getDetailInfo() {
		let _this = this
		if (_this.data.detailOrder.process[0] === undefined) {
			this.setData({
				notProcess: true
			})
		}
		wxReq({
			url: '/workshop/weave/product/detail',
			data: {
				id: _this.data.detailOrder.id
			},
			method: "GET",
			success: (res) => {
				let allNumber = 0
				let allRealNumber = 0
				wx.setStorageSync('entry_product_info', res.data.data.product_info)

				// 计算差额
				res.data.data.product_info.forEach(item => {
					allNumber += item.number
					allRealNumber += item.real_number
				})

				// 更新卡片的数据
				let discrepancy = allNumber - allRealNumber
				let cardOrder = this.data.cardOrder
				cardOrder.nowNumber = cardOrder.allNumber - discrepancy
				console.log(cardOrder, this.data.allNumber)

				this.setData({
					cardOrder,
					allNumber,
					entryArr: [],
					allRealNumber,
					sizeColorPrice: 0,
					enteryAllNumber: '',
					product_info: res.data.data.product_info,
					process_price: res.data.data.process_prices[0]?.price || '0.00',
					process_price_all: res.data.data.process_prices[0]?.price || '0.00',
				})
			}
		})
	},

	// 拿到员工的名字
	getPeopleName() {
		let _this = this
		wxReq({
			url: "/user/staff/list",
			method: "GET",
			data: {
				status: 1,
				is_add: 2
			},
			success: (res) => {
				let arr = []
				res.data.data.forEach(item => {
					arr.push({
						label: item.name,
						value: item.uuid
					})
				});
				_this.setData({
					people: arr
				})
			}
		})
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
		this.setData({
			selectedPeopleLabel: e.detail.value[0].label,
			selectedPeopleValue: e.detail.value[0].value,
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

	// 拿到输入的数字
	getInputNumber(e) {
		let data = this.data.product_info[e.currentTarget.dataset.index]
		let value = +e.detail.value > (data.number - data.real_number) ? (data.number - data.real_number) : +e.detail.value

		data.value = value === 0 ? undefined : value
		this.setData({
			product_info: this.data.product_info,
			sizeColorPrice: (value * this.data.process_price).toFixed(2)
		})
	},

	// 拿到总的差额数
	getEnteryAllNumber(e) {
		let value = +e.detail.value > (this.data.allNumber - this.data.allRealNumber) ? (this.data.allNumber - this.data.allRealNumber) : +e.detail.value

		if (value === 0) {
			value = ""
		}

		this.setData({
			process_price_all: ((value || 1) * this.data.process_price).toFixed(2),
			enteryAllNumber: value
		})
	},

	// 切换选项卡
	onTabsChange(e) {
		if (e.detail.value == 0) {
			this.setData({
				enteryAllNumber: "",
				process_price_all: this.data.process_price,
				tabValue: 0
			})
		} else {
			this.setData({
				product_info: wx.getStorageSync('entry_product_info'),
				tabValue: 1
			})
			if (!this.data.showChoose) {
				this.setData({
					selectedPeopleLabel: ''
				})
			}
		}
	},

	// 提交按钮
	commitEntry() {
		let uuid = wx.getStorageSync('userInfo').userinfo.uuid

		// 判断是尺码颜色还是自由录入
		if (this.data.tabValue !== 1) {
			// 判断是否留空
			if ((this.data.product_info.find(item => item.value !== undefined)) !== undefined) {
				let data = []

				this.data.product_info.forEach(item => {
					if (item.value) {
						data.push({
							product_info_id: item.id,
							number: item.value,
							uuid: uuid,
							process_price_id: (this.data.detailOrder.process[0] !== undefined) ? this.data.detailOrder.process[0].id : 0,
							price: this.data.process_price
						})
					}
				});

				wxReq({
					url: '/workshop/weave/product/save',
					method: 'POST',
					data: {
						data
					},
					success: (res) => {
						if (res.data.code === 200) {
							Message.success({
								offset: [20, 32],
								duration: 2000,
								content: '提交成功',
							});
							this.getDetailInfo()
							return
						}
					}
				})
			}

			Message.error({
				offset: [20, 32],
				duration: 2000,
				content: '请至少填写一个尺码颜色对应产量',
			});
			return
		}

		if (this.data.enteryAllNumber === "") {
			Message.error({
				offset: [20, 32],
				duration: 2000,
				content: '请填写自由录入产量',
			});
			return
		}

		if (this.data.showChoose) {
			if (this.data.selectedPeopleLabel === "") {
				Message.error({
					offset: [20, 32],
					duration: 2000,
					content: '请选择生产人员',
				});
				return
			}
			this.getPostData(this.data.selectedPeopleValue)
		} else {
			this.getPostData()
		}

		// 保存产量
		wxReq({
			url: '/workshop/weave/product/save',
			method: 'POST',
			data: {
				data: this.data.entryArr
			},
			success: (res) => {
				if (res.data.code === 200) {
					Message.success({
						offset: [20, 32],
						duration: 2000,
						content: '提交成功',
					});
					this.getDetailInfo()
					return
				}
			}
		})

		this.getDetailInfo()

	},

	// 得到最小的差值
	getMinDiff() {
		let min

		this.data.product_info.forEach(item => {
			let difference = item.number - item.real_number

			if (item.isMin) return

			if (!min) {
				min = item
				return
			}

			if (difference !== 0) {
				min.number - min.real_number > difference ? min = item : min = min
			}
		});
		min.isMin = true
		return min
	},

	getPostData(getUuid) {
		let min = this.getMinDiff()
		let minDiff = min.number - min.real_number
		let enteryAllNumber = this.data.enteryAllNumber
		let uuid = getUuid ? getUuid : wx.getStorageSync('userInfo').userinfo.uuid
		let _this = this

		if (enteryAllNumber > minDiff) {
			_this.data.entryArr.push({
				uuid: uuid,
				number: minDiff,
				price: _this.data.process_price,
				product_info_id: min.id,
				process_price_id: _this.data.detailOrder.process[0].id
			})
			_this.data.enteryAllNumber = _this.data.enteryAllNumber - minDiff
			_this.getPostData()
		} else {
			_this.data.entryArr.push({
				uuid: uuid,
				number: enteryAllNumber,
				price: _this.data.process_price,
				product_info_id: min.id,
				process_price_id: _this.data.detailOrder.process[0].id
			})

			return _this.data.entryArr
		}
	}
})