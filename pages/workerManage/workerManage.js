// pages/workerManage/workerManage.js
import Dialog from 'tdesign-miniprogram/dialog/index';
import Message from 'tdesign-miniprogram/message/index';
import {
	wxReq
} from '../../utils/util';

const dialogConfig = {
	title: '',
	tConfirmBtn: '',
	content: '',
	confirmBtn: '',
	cancelBtn: '',
	buttonLayout: 'horizontal',
	actions: false,
};

const modelConfigFactory = (opt) => {
	return {
		...dialogConfig,
		...opt,
	};
};

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardInfoData: {
			cardData: [],
			cardTitle: [{
				title: '姓名',
				width: 30
			}, {
				title: '在岗状态',
				width: 20
			}, {
				title: '在岗时间',
				width: 50
			}]
		},
		isOpenAddWorkerWin: false
	},

	click(option) {
		// console.log(option.detail)
	},

	// 获取参数，判断是否为作坊主
	onLoad: function (option) {
		option.isLeader = option.isLeader === "true" ? true : false
		this.setData(option)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function (option) {
		this.getWokerList()
	},

	addWorkrManage() {
		this.setData({
			show: true,
			useSlot: true,
			currentKey: 'withInput',
			dialogConfig: modelConfigFactory({
				title: '添加员工',
				content: '添加后可以为该员工添加产量',
				confirmBtn: '保存',
				cancelBtn: '取消',
			}),
			isOpenAddWorkerWin: true
		})
	},

	getWokerList() {
		let _this = this
		wxReq({
			url: '/user/staff/record/list',
			method: 'GET',
			success: (res) => {
				let arr = []
				res.data.data.forEach(item => {
					arr.push([
						item.user.name + (item.user.user_name ? ('（' + item.user.user_name.slice(8, 11) + '）') : ''),
						item.status === 1 ? '在职' : '离职',
						item.created_at.slice(0, 10) + '~' + (item.quit_at === "0000-00-00 00:00:00" ? "至今" : item.quit_at.slice(0, 10))
					])
				});
				_this.data.cardInfoData.cardData = arr
				_this.setData({
					cardInfoData: _this.data.cardInfoData,
					cardInfoDataDetail: res.data.data
				})
			}
		})
	},

	// 点击二维码拿到小程序码
	openPopup() {
		wx.setStorageSync('wxacodeTime', Date.now())
		this.getWxACode()
	},

	getWxACode() {
		let _this = this
		let uuid = wx.getStorageSync('userInfo').userinfo.uuid
		wxReq({
			url: '/wechat/wxacode',
			data: {
				path: "pages/addWorkShop/addWorkShop?uuid=" + uuid + '&time=' + Date.now(),
				width: 430,
				auto_color: false,
				line_color: {
					"r": 0,
					"g": 0,
					"b": 0
				},
				is_hyaline: false
			},
			method: "POST",
			success: function (res) {
				if (res.data.code !== 200) {
					Message.error({
						offset: [20, 32],
						duration: 2000,
						content: '获取员工邀请码失败'
					});
					return
				}
				_this.setData({
					showPopup: true,
					showImage: res.data.data
				})
				wx.setStorageSync('作坊主小程序码', res.data.data)
				return
			}
		})
	},

	closePopup() {
		this.setData({
			showPopup: false
		})
	},

	addWorkrManage() {
		this.setData({
			show: true,
			useSlot: true,
			currentKey: 'confirm',
			dialogConfig: modelConfigFactory({
				title: '添加员工',
				content: '添加后可以为该员工添加产量',
				confirmBtn: '保存',
				cancelBtn: '取消',
			}),
			isOpenAddWorkerWin: true,
			isAddWoker: true
		})
	},

	/** 取消关闭弹层 */
	closeHandle() {
		this.setData({
			show: false,
			useSlot: false,
		});
		Dialog.close();
	},

	/** 普通弹层关闭 */
	confirmHandle(e) {
		if (this.data.isAddWoker) {
			this.addWorker()
			return
		}

		let selectUserData = this.data.cardInfoDataDetail[this.data.workerListIndex]
		wxReq({
			url: '/user/staff/record/quitat',
			data: {
				id: selectUserData.id
			},
			method: "POST",
			success: (res) => {
				if (res.data.code !== 200) {
					Message.error({
						offset: [20, 32],
						duration: 2000,
						content: '离职失败，请重试',
					});
					return
				}
				if (res.data.data === true) {
					Message.success({
						offset: [20, 32],
						duration: 2000,
						content: '离职成功',
					});
					this.getWokerList()
					return
				}
			}
		})
		this.setData({
			show: false,
			useSlot: false,
		});
		Dialog.close();
	},

	workerName(e) {
		this.setData({
			workerName: e.detail.value
		})
	},

	getName(e) {
		if (e.detail.item[1] === '离职') return
		this.setData({
			show: true,
			useSlot: false,
			currentKey: 'confirm',
			dialogConfig: modelConfigFactory({
				title: '请问是否将 ' + e.detail.item[0] + ' 设为离职状态？',
				content: '离职后该员工将无法再操作相关业务',
				confirmBtn: '离职',
				cancelBtn: '取消',
			}),
			isOpenAddWorkerWin: true,
			workerListIndex: e.detail.index,
			isAddWoker: false
		})
	},

	// 添加员工
	addWorker() {
		let _this = this
		wxReq({
			url: '/user/staff/add',
			method: 'POST',
			data: {
				name: this.data.workerName
			},
			success: (res) => {
				if (res.data.code === 200) {
					Message.success({
						offset: [20, 32],
						duration: 2000,
						content: '添加成功',
					});
					_this.getWokerList()
					return
				} else if (res.data.message === '姓名已存在,请更换') {
					Message.error({
						offset: [20, 32],
						duration: 2000,
						content: '姓名已存在,请更换',
					});
					return
				}
			}
		})
	},
})