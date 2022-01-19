// pages/orderDetail.js
import Dialog from 'tdesign-miniprogram/dialog/index';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		detailInfo: {
      title: '圈圈纱围脖',
      time: '2022-01-30',
      nowNumber: 130,
      allNumber: 300,
      customer: '凯瑞针纺',
      price: 90000,
      imgSrc:'https://file.zwyknit.com/1641886474000.png'
		},
		cardInfoData: {
			cardData: [
				[
					'S/红色', '车标', '0.5元/件', 10000, '3000/7000'
				],
				[
					'S/红色', '车标', '0.5元/件', 10000, '3000/7000'
				],
				[
					'S/红色', '车标', '0.5元/件', 10000, '3000/7000'
				]
			],
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
		productionSchedule: {
			cardData: [
				[
					['2021-01-18 12:30','王先生'],
					['S/红色',3000],
					['0.3元','900.00元']
				],
				[
					['2021-01-18 12:30','王先生'],
					['S/红色',3000],
					['0.3元','900.00元']
				]
			],
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