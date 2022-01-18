// components/orderCard.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		showIcon: {
			type: Boolean,
			value: false
		},
		showPrice: {
			type: Boolean,
			value: false
		},
		// 详细信息
		detailInfo: Object
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 点击勾号
		changeCheck() {
			this.setData({
				isCheck: !this.data.isCheck
			})
		},
		clickEvent(event){
			this.triggerEvent("clickEvent", event.currentTarget.dataset)
		}
	}
})