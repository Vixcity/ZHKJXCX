// pages/statistics/statistics.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showDataPick:false,
		showPeoplePick:false,
		topTabData:[{
			desc: "dateTime",
			value: "2022年1月",
			whichType:1
		},
		{
			desc: "peopleChoose",
			value: "所有人",
			whichType:2
		}],
		years: [
      { label: '2022年', value: '2022' },
      { label: '2021年', value: '2021' },
      { label: '2020年', value: '2020' },
      { label: '2019年', value: '2019' },
		],
    months: Array.from(new Array(12), (_, index) => ({
      label: `${index + 1}月`,
      value: index + 1,
		})),
		people:[
			{label:'老刘',value:'老刘'},
			{label:'老李',value:'老李'},
			{label:'老王',value:'老王'},
			{label:'老谢',value:'老谢'},
			{label:'老张',value:'老张'},
			{label:'老陈',value:'老陈'},
		],
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

	},

	// 标签点击事件
	chooseWhichOne(event){
		if(event.currentTarget.dataset.whichtype===1){
			this.setData({
				showDataPick:true
			})
		} else if(event.currentTarget.dataset.whichtype===2){
			this.setData({
				showPeoplePick:true
			})
		}
	},

	// 时间选择器
	pickDataConfirm(event){
		let pickedData = ''
		event.detail.value.forEach(item => {
			pickedData += item.label
		});

		this.setData({
			topTabData:[{
				desc: "dateTime",
				value: pickedData,
				whichType:1
			},
			{
				desc: "peopleChoose",
				value: this.data.topTabData[1].value,
				whichType:2
			}],
			showDataPick:false
		})
		// console.log(pickedData)
	},
	pickDataCancel(){
		this.setData({
			showDataPick:false
		})
	},

	// 人类选择器
	pickPeopleConfirm(event){
		this.setData({
			topTabData:[{
				desc: "dateTime",
				value: this.data.topTabData[0].value,
				whichType:1
			},
			{
				desc: "peopleChoose",
				value: event.detail.value[0].label,
				whichType:2
			}],
			showPeoplePick:false
		})
	},
	pickPeopleCancel(){
		this.setData({
			showPeoplePick:false
		})
	}
})