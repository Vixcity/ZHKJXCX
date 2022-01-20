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
		selectedPeopleValue: '',
		enteryAllNumber: "",
		showChoose: false,
		entryArr:[]
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
	},

	getDetailInfo(){
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
				_this.setData({
					product_info: res.data.data.product_info
				})
				wx.setStorageSync('entry_product_info', res.data.data.product_info)
				res.data.data.product_info.forEach(item => {
					allNumber += item.number
					allRealNumber += item.real_number
				})
				this.setData({
					allNumber,
					allRealNumber,
					process_price: res.data.data.process_prices[0]?.price || '0.00',
					process_price_all: res.data.data.process_prices[0]?.price || '0.00',
					entryArr:[],
					enteryAllNumber:''
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
		console.log(e.detail)
		this.setData({
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

	// 拿到数字
	getInputNumber(e) {
		let data = this.data.product_info[e.currentTarget.dataset.index]
		let value = +e.detail.value > (data.number - data.real_number) ? (data.number - data.real_number) : +e.detail.value
		data.value = value
		this.setData({
			product_info: this.data.product_info
		})
	},
	getEnteryAllNumber(e) {
		let value = +e.detail.value > (this.data.allNumber - this.data.allRealNumber) ? (this.data.allNumber - this.data.allRealNumber) : +e.detail.value
		this.setData({
			process_price_all: (value * this.data.process_price).toFixed(2),
			enteryAllNumber: value
		})
	},

	// 切换选项卡
	onTabsChange(e) {
		if (e.detail.value == 0) {
			this.setData({
				enteryAllNumber: "",
				process_price_all: this.data.process_price,
				tabValue:0
			})
		} else {
			this.setData({
				product_info: wx.getStorageSync('entry_product_info'),
				tabValue:1
			})
		}
	},

	commitEntry() {
		let uuid = wx.getStorageSync('userInfo').userinfo.uuid

		if (this.data.detailOrder.process[0] === undefined) {
			if (wx.getStorageSync('userInfo').userinfo.role === 2) {
				Message.error({
					offset: [20, 32],
					duration: 2000,
					content: '该订单还未定价，请先通知作坊主进行定价',
				});
				return
			}
			Message.error({
				offset: [20, 32],
				duration: 2000,
				content: '您还未定价，请先去订单管理进行定价',
			});
			return
		}

		// 判断是尺码颜色还是自由录入
		if (this.data.tabValue !== 1) {
			// 判断是否留空
			if ((this.data.product_info.find(item => item.value === undefined)) !== undefined) {
				Message.error({
					offset: [20, 32],
					duration: 2000,
					content: '请完整填写尺码颜色对应产量',
				});
				return
			}

			let data = []

			this.data.product_info.forEach(item => {
				data.push({
					product_info_id: item.id,
					number: item.value,
					uuid: uuid,
					process_price_id: this.data.detailOrder.process[0].id,
					price:this.data.process_price
				})
			});

			wxReq({
				url:'/workshop/weave/product/save',
				method:'POST',
				data:{
					data
				},
				success: (res) => {
					if(res.data.code===200){
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

		this.getPostData()
		wxReq({
			url:'/workshop/weave/product/save',
			method:'POST',
			data:{
				data:this.data.entryArr
			},
			success: (res) => {
				if(res.data.code===200){
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

	getMinDiff(){
		let min

		this.data.product_info.forEach(item => {
			let difference = item.number-item.real_number

			if(item.isMin) return

			if(!min){
				min = item
				return
			}

			if( difference !== 0){
				min.number - min.real_number > difference ? min = item : min = min
			}
		});
		min.isMin = true
		return min
	},

	getPostData(){
		let min = this.getMinDiff()
		let minDiff = min.number - min.real_number
		let enteryAllNumber = this.data.enteryAllNumber
		let uuid = wx.getStorageSync('userInfo').userinfo.uuid
		let _this = this

		if(enteryAllNumber > minDiff){
			_this.data.entryArr.push({
				uuid:uuid,
				number:minDiff,
				price:_this.data.process_price,
				product_info_id:min.id,
				process_price_id:_this.data.detailOrder.process[0].id
			})
			_this.data.enteryAllNumber = _this.data.enteryAllNumber - minDiff
			_this.getPostData()
		} else {
			_this.data.entryArr.push({
				uuid:uuid,
				number:enteryAllNumber,
				price:_this.data.process_price,
				product_info_id:min.id,
				process_price_id:_this.data.detailOrder.process[0].id
			})

			console.log(_this.data.entryArr)
			return _this.data.entryArr
		}
	}
})