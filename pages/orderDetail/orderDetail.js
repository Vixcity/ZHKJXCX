// pages/orderDetail.js
import Message from 'tdesign-miniprogram/message/index';
import {
	wxReq
} from '../../utils/util';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 展开信息
		cardInfoData: {
			cardData: [],
			cardTitle: [{
				title: '颜色尺码',
				width: 20
			}, {
				title: '工序',
				width: 20
			}, {
				title: '加工价',
				width: 20
			}, {
				title: '数量',
				width: 20
			}, {
				title: '已完成/差额',
				width: 20
			}]
		},
		// 生产进度
		productionSchedule: {
			cardData: [],
			cardTitle: [{
				title: '生产时间/人员',
				width: 37
			}, {
				title: '尺码颜色/数量',
				width: 33
			}, {
				title: '单价/总价',
				width: 30
			}],
			hasBr: true,
		},
		onePrice: '',
		allPrice: '',
		maxOneLength: 10,
		maxAllLength: 10
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let productDetail = wx.getStorageSync('orderDetail')
		delete productDetail.detailInfo.status
		this.setData(productDetail)
		wxReq({
			url: '/workshop/weave/product/detail',
			method: "GET",
			data: {
				id: this.data.detailProduct.id
			},
			success: (res) => {
				let arr = []
				let list = []
				let product_info = res.data.data.product_info
				let user_workshop_yields = res.data.data.user_workshop_yields
				let cardInfoData = this.data.cardInfoData
				let productionSchedule = this.data.productionSchedule
				product_info.forEach(item => {
					arr.push([(item.size.size_name || '无数据') + ' / ' + (item.color.color_name || '无数据'), res.data.data.weave_plan.process_name, item.price + '元/件', item.number, item.real_number + ' / ' + (item.number - item.real_number)])
				});
				cardInfoData.cardData = arr

				user_workshop_yields.forEach(item => {
					list.push([
						[item.created_at.slice(0, 16), item.user.name],
						[(item.weave_plan_product_info.size.size_name || '无数据') + '/' + (item.weave_plan_product_info.color.color_name || '无数据'), item.number],
						[item.price + '元', (item.number * item.price).toFixed(2) + '元']
					])
				});
				// console.log(list)
				productionSchedule.cardData = list

				this.setData({
					cardInfoData,
					productionSchedule,
					onePrice: res.data.data.process_prices[0]?.price,
					allPrice: res.data.data.process_prices[0]?.total_price
				})
			}
		})
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

	// 提交
	commitProductPrice() {
		let detailProduct = this.data.detailProduct
		if (this.data.onePrice === "" || this.data.allPrice === "") {
			Message.error({
				offset: [20, 32],
				duration: 2000,
				content: '请填写对应价格',
			});
			return
		}
		wxReq({
			url: '/process/price/save',
			method: 'POST',
			data: {
				data: [{
					pid: detailProduct.pid,
					total_price: this.data.allPrice,
					price: this.data.onePrice,
					product_id: detailProduct.product_id,
					id: detailProduct.process.length !== 0 ? detailProduct.process[0].id : ""
				}]
			},
			success: (res) => {
				if (res.data.code === 200) {
					Message.success({
						offset: [20, 32],
						duration: 2000,
						content: '提交成功',
					});
				}
			}
		})
	},

	// 更改单价
	changePrice(e) {
		let type = e.target.dataset.price
		let allNumber = +this.data.detailInfo.allNumber
		let price = e.detail.value
		let maxlength = price.indexOf('.') + 3

		if (type === 'one') {
			if (maxlength === 2) {
				this.setData({
					maxOneLength: 10
				})
			} else {
				this.setData({
					maxOneLength: maxlength
				})
			}
			this.setData({
				allPrice: (+price * allNumber).toFixed(2),
				onePrice: price
			})
		}

		if (type === 'all') {
			if (maxlength === 2) {
				this.setData({
					maxAllLength: 10
				})
			} else {
				this.setData({
					maxAllLength: maxlength
				})
			}
			this.setData({
				onePrice: (+price / allNumber).toFixed(2),
				allPrice: price
			})
		}
	}
})