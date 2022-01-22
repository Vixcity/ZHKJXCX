const {
	wxReq
} = require("../../utils/util")

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
		showChangeIcon: {
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
		isShow: 'title'
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
		clickEvent(event) {
			this.triggerEvent("clickEvent", event.currentTarget.dataset)
		},
		changeShow(e) {
			// 0 为title
			// 1 为code
			if (this.data.detailInfo.display === 0) {
				this.data.detailInfo.display = 1
			} else {
				this.data.detailInfo.display = 0
			}

			this.setData({
				detailInfo: this.data.detailInfo
			})

			let {
				pid,
				display,
				product_id
			} = this.data.detailInfo

			wxReq({
				url: '/workshop/order/display',
				method: "POST",
				data: {
					pid,
					display,
					product_id
				},
				success: (res) => {

				}
			})

			this.triggerEvent("changeShow", display)
		}
	}
})