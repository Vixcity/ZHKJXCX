// components/orderCard.js
Component({
	options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	
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