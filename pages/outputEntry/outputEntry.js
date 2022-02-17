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
				if(cardOrder === undefined){
					wx.reLaunch({
						url: '../manage/manage',
					})
				} 

				cardOrder.nowNumber = cardOrder.allNumber - discrepancy

				this.setData({
					cardOrder,
					allNumber,
					entryArr: [],
					allRealNumber,
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
					people: arr,
					selectedPeopleLabel:arr[0].label,
					selectedPeopleValue:arr[0].value,
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
		if(e.detail.value === '-'){
			e.detail.value = 0
		}

		// 超额10%
		let value = +e.detail.value >= (data.number*1.1 - data.real_number) ? (data.number*1.1 - data.real_number) : +e.detail.value
		data.value = value === 0 ? undefined : value.toFixed(0)

		this.setData({
			product_info: this.data.product_info
		})
	},

	// 拿到总的差额数
	getEnteryAllNumber(e) {
		let value = +e.detail.value > (this.data.allNumber*1.1 - this.data.allRealNumber) ? (this.data.allNumber*1.1 - this.data.allRealNumber) : +e.detail.value

		if (value === '-') {
			value = 0
		}

		this.setData({
			enteryAllNumber: value.toFixed(0)
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
		let uuid = this.data.selectedPeopleValue

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
			} else {
				Message.error({
					offset: [20, 32],
					duration: 2000,
					content: '请至少填写一个尺码颜色对应产量',
				});
				return
			}
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
		
		this.data.product_info.forEach((item,index) => {
			let difference = item.number*1.1 - item.real_number
			
			if (item.isMin) return

			if (index === 0) {
				min = item
			}

			if (difference !== 0) {
				min.number*1.1 - min.real_number > difference ? min = item : min = min
			}
		});

		if(min){
			min.isMin = true
		}

		console.log(min)
		return min
	},

	getPostData(getUuid) {
		let min = this.getMinDiff()
		if(!min){
			// min = this.data.product_info[this.data.product_info.length-1]
			return
		}
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
				process_price_id: (_this.data.detailOrder.process[0]!==undefined)?_this.data.detailOrder.process[0].id:0
			})
			_this.data.enteryAllNumber = _this.data.enteryAllNumber - minDiff
			_this.getPostData()
		} else {
			_this.data.entryArr.push({
				uuid: uuid,
				number: enteryAllNumber,
				price: _this.data.process_price,
				product_info_id: min.id,
				process_price_id: (_this.data.detailOrder.process[0]!==undefined)?_this.data.detailOrder.process[0].id:0
			})

			return _this.data.entryArr
		}
	}
})