// components/listCard.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		cardInfoData:{
			cardTitleInfo:Array,
			cardData:Array,
			hasBr:{
				type:Boolean,
				value: false,
			}
		},		
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的生命周期
	 */
	pageLifetimes: {
		show: function() {

		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		clickLine(event){
			this.triggerEvent("clickLine", event.currentTarget.dataset)
		}
	}
})
