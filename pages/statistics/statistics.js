// pages/statistics/statistics.js
import {
	createDateDate,
	wxReq
} from '../../utils/util';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showDataPick: false,
		showPeoplePick: false,
		topTabData: [{
				desc: "dateTime",
				value: (new Date().getFullYear()) + "年" + (new Date().getMonth() + 1) + "月",
				whichType: 1
			},
			{
				desc: "peopleChoose",
				value: "所有人",
				whichType: 2
			}
		],
		year: '',
		years: Array.from(new Array(4), (_, index) => ({
			label: `${new Date().getFullYear() - index}年`,
			value: new Date().getFullYear() - index,
		})),
		months: Array.from(new Array(12), (_, index) => ({
			label: `${index + 1}月`,
			value: index + 1,
		})),
		people: [],
		cardInfoData: {
			cardData: [],
			cardTitle: [{
				title: '生产时间/人员',
				width: 28
			}, {
				title: '客户/产品',
				width: 21
			}, {
				title: '尺码颜色/数量',
				width: 26
			}, {
				title: '工序单价/总价',
				width: 25
			}],
			hasBr: true,
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (option) {
		option.isLeader = option.isLeader === "true" ? true : false
		option.isStaff = option.isStaff === "true" ? true : false
		// console.log(option)
		option.beforeDate = createDateDate(6, true)
		this.setData(option)
	},

	onShow: function () {
		let date = new Date()
		if (wx.getStorageSync('userInfo').userinfo.role === 2) {
			this.reqData(date.getFullYear(), date.getMonth() + 1, wx.getStorageSync('userInfo').userinfo.uuid)
		} else {
			this.reqData(date.getFullYear(), date.getMonth() + 1,"",true)
		}
	},

	getPeople(list) {
		let _this = this

		let arr = [{
			label: '所有人',
			value: ''
		}]

		list.forEach(item => {
			arr.push({
				label: item.user.name,
				value: item.uuid
			})
		});

		_this.setData({
			people: arr
		})
	},

	// 标签点击事件
	chooseWhichOne(event) {
		if (event.currentTarget.dataset.whichtype === 1) {
			this.setData({
				showDataPick: true
			})
		} else if (event.currentTarget.dataset.whichtype === 2) {
			this.setData({
				showPeoplePick: true
			})
		}
	},

	// 时间选择器
	pickDataConfirm(event) {
		let pickedData = ''
		event.detail.value.forEach(item => {
			pickedData += item.label
		});

		this.data.topTabData[0].value = pickedData
		this.setData({
			topTabData: this.data.topTabData,
			showDataPick: false
		})

		// 选中时获取数据
		if (this.data.topTabData[1].valueChoose === "") {
			this.reqData(pickedData.slice(0, 4), pickedData.slice(5, 6), "", true)
		} else {
			this.reqData(pickedData.slice(0, 4), pickedData.slice(5, 6), this.data.topTabData[1].valueChoose, true)
		}
	},
	pickDataCancel() {
		this.setData({
			showDataPick: false
		})
	},

	// 人类选择器
	pickPeopleConirm(event) {
		this.data.topTabData[1].value = event.detail.value[0].label
		this.data.topTabData[1].valueChoose = event.detail.value[0].value
		this.setData({
			topTabData: this.data.topTabData,
			showPeoplePick: false
		})

		let pickedData = this.data.topTabData[0].value

		// 选中时获取数据
		if (event.detail.value[0].value === "") {
			this.reqData(pickedData.slice(0, 4), pickedData.slice(5, 6))
		} else {
			this.reqData(pickedData.slice(0, 4), pickedData.slice(5, 6), event.detail.value[0].value)
		}
	},
	pickPeopleCancel() {
		this.setData({
			showPeoplePick: false
		})
	},

	// 标签页切换
	onTabsChange(e) {
		this.reqData(e.detail.label.slice(0, 4), e.detail.label.slice(5, 7), wx.getStorageSync('userInfo').userinfo.uuid)
	},

	// 获取数据
	reqData(year, month, uuid, isChangeMouth) {
		let data = {
			year,
			month
		}
		if (uuid) {
			data.uuid = uuid
		}
		wxReq({
			url: '/user/workshop/yield/list',
			method: 'GET',
			data: data,
			success: (res) => {
				let arr = []
				let allNumber = 0
				res.data.data.list.forEach(item => {
					arr.push([
						[item.created_at.slice(5, 16), item.user?.name || ""],
						[item.weave_plan_product_info.weave_plan.company.company_name, item.weave_plan_product_info.product.name],
						[item.weave_plan_product_info.size.size_name + '/' + item.weave_plan_product_info.color.color_name, item.number],
						[item.price + '元', (item.number * item.price).toFixed(2) + '元']
					])
					allNumber += item.number * item.price
				});
				this.data.cardInfoData.cardData = arr

				if(isChangeMouth){
					this.getPeople(res.data.data.staff)
				}

				this.setData({
					cardInfoData: this.data.cardInfoData,
					allNumber:allNumber.toFixed(2)
				})
			}
		})
	}
})