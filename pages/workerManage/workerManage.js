// pages/workerManage/workerManage.js
import Dialog from 'tdesign-miniprogram/dialog/index';

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
			cardData: [
				[
					'王先生', '员工', '在岗', '2021-12-29~至今'
				],
				[
					'王先生', '员工', '在岗', '2021-12-29~至今'
				],
				[
					'王先生', '员工', '离职', '2021-12-29~2022-02-22'
				]
			],
			cardTitle: [{
				title: '姓名',
				width: 19
			}, {
				title: '角色',
				width: 15
			}, {
				title: '在岗状态',
				width: 20
			}, {
				title: '在岗时间',
				width: 46
			}]
		},
		isOpenAddWorkerWin:false
	},

	click(option){
		// console.log(option.detail)
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

	addWorkrManage(){
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
	
	addWorkrManage(){
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
			isOpenAddWorkerWin: true
		})
	},

	/** 异步关闭弹层 */
	closeHandle() {
    this.confirmHandle();
	},

	 /** 普通弹层关闭 */
	 confirmHandle(e) {
		console.log(this.data.workerName)
		console.log(this.data.useSlot)
    this.setData({
      show: false,
      useSlot: false,
    });
    Dialog.close();
	},
	
	workerName(e){
		this.setData({
			workerName:e.detail.value
		})
	},

	getName(e){
		e.detail.item,
		this.setData({
			show: true,
			useSlot: false,
			currentKey: 'confirm',
			dialogConfig: modelConfigFactory({
				title: '请问是否将 '+ e.detail.item[0] +' 设为离职状态？',
				content: '离职后该员工将无法再操作相关业务',
				confirmBtn: '离职',
				cancelBtn: '取消',
			}),
			isOpenAddWorkerWin: true
		})
	}
})