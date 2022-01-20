// pages/statistics/statistics.js
import {createDateDate, wxReq} from '../../utils/util';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showDataPick: false,
		showPeoplePick: false,
		topTabData: [{
				desc: "dateTime",
				value: "2022年1月",
				whichType: 1
			},
			{
				desc: "peopleChoose",
				value: "所有人",
				whichType: 2
			}
		],
		year:'',
		years: [{
				label: '2022年',
				value: '2022'
			},
			{
				label: '2021年',
				value: '2021'
			},
			{
				label: '2020年',
				value: '2020'
			},
			{
				label: '2019年',
				value: '2019'
			},
		],
		months: Array.from(new Array(12), (_, index) => ({
			label: `${index + 1}月`,
			value: index + 1,
		})),
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
		cardInfoData: {
			cardData: [
				[
					['2021-01-18 12:30'],
					['凯瑞针织','圈圈纱围脖'],
					['S/红色',3000],
					['0.3元','900.00元']
				],
				[
					['2021-01-18 12:30'],
					['凯瑞针织','圈圈纱围脖'],
					['S/红色',3000],
					['0.3元','900.00元']
				]
			],
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
	onLoad:function(option) {
    option.isLeader = option.isLeader==="true"?true:false
		option.isStaff = option.isStaff==="true"?true:false
		// console.log(option)
		option.beforeDate = createDateDate(6,true)
		this.setData(option)
		// if(isStaff){
		// 	
		// }
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

		this.setData({
			topTabData: [{
					desc: "dateTime",
					value: pickedData,
					whichType: 1
				},
				{
					desc: "peopleChoose",
					value: this.data.topTabData[1].value,
					whichType: 2
				}
			],
			showDataPick: false
		})
		// console.log(pickedData)
	},
	pickDataCancel() {
		this.setData({
			showDataPick: false
		})
	},

	// 人类选择器
	pickPeopleConfirm(event) {
		this.setData({
			topTabData: [{
					desc: "dateTime",
					value: this.data.topTabData[0].value,
					whichType: 1
				},
				{
					desc: "peopleChoose",
					value: event.detail.value[0].label,
					whichType: 2
				}
			],
			showPeoplePick: false
		})
	},
	pickPeopleCancel() {
		this.setData({
			showPeoplePick: false
		})
	},

	// 标签页切换
	onTabsChange(e){
		this.reqData(e.detail.label.slice(0,4),e.detail.label.slice(5,7))
	},

	reqData(year,month){
		wxReq({
			url:'/user/workshop/yield/list',
			method:'GET',
			data:{
				uuid: wx.getStorageSync('userInfo').userinfo.uuid,
				year:year,
				month:month
			},
			success:(res) => {
				res.data.data.list.forEach(item => {
					[item.created_at.slice(0,17),item.user.name]
					// []
					[item.weave_plan_product_info.size.size_name+'/'+item.weave_plan_product_info.color.color_name,item.number]
					[item.weave_plan.company_name]
					console.log(item)
				});
			}
		})
	}
})