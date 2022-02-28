import Message from 'tdesign-miniprogram/message/index';
import {
  verifyTel,
  wxReq
} from '../../utils/util';
// index.js
Component({
  data: {
    userInfo: null,
    value: "",
    isRead: true,
    showPick: false,
    workProcedure: [{
        label: '拉毛',
        value: '0'
      },
      {
        label: '刺毛',
        value: '1'
      },
      {
        label: '捻须',
        value: '2'
      },
      {
        label: '穿线',
        value: '3'
      },
      {
        label: '打结',
        value: '4'
      },
      {
        label: '压皱',
        value: '5'
      },
      {
        label: '整烫',
        value: '6'
      },
      {
        label: '车缝',
        value: '7'
      },
      {
        label: '开片',
        value: '8'
      },
      {
        label: '轧光',
        value: '9'
      },
      {
        label: '水洗',
        value: '10'
      },
      {
        label: '水洗',
        value: '11'
      },
      {
        label: '烘干',
        value: '12'
      },
      {
        label: '套口',
        value: '13'
      },
      {
        label: '套缝',
        value: '14'
      },
      {
        label: '抽顶',
        value: '15'
      },
      {
        label: '剪球',
        value: '16'
      },
      {
        label: '吊球',
        value: '17'
      },
      {
        label: '绣花',
        value: '18'
      },
      {
        label: '印花',
        value: '19'
      },
      {
        label: '钉扣',
        value: '20'
      },
      {
        label: '烫钻',
        value: '21'
      },
      {
        label: '接指',
        value: '22'
      },
      {
        label: '麻缝',
        value: '23'
      },
      {
        label: '染色',
        value: '24'
      },
      {
        label: '切割',
        value: '25'
      },
      {
        label: '手工',
        value: '26'
      },
      {
        label: '检验',
        value: '27'
      },
      {
        label: '车标',
        value: '28'
      },
      {
        label: '包装',
        value: '29'
      },
      {
        label: '吊牌',
        value: '30'
      },
      {
        label: '打枪',
        value: '31'
      },
      {
        label: '装箱',
        value: '32'
      },
      {
        label: '下水',
        value: '33'
      },
      {
        label: '压花',
        value: '34'
      },
      {
        label: '平车',
        value: '35'
      },
      {
        label: '成品染色',
        value: '36'
      },
      {
        label: '下料',
        value: '37'
      },
      {
        label: '烫金',
        value: '38'
      },
      {
        label: '锁眼',
        value: '39'
      },
      {
        label: '钉珠',
        value: '40'
      },
      {
        label: '点胶',
        value: '41'
      },
      {
        label: '搓须',
        value: '42'
      },
      {
        label: '梭织',
        value: '43'
      },
      {
        label: '针织',
        value: '44'
      },
      {
        label: '精编',
        value: '45'
      },
    ],
    selectedWorkProcedureValue: ''
  },
  pageLifetimes: {
    show: function () {
      wx.hideHomeButton()
      if (this.data.userInfo === null) {
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      }
    }
  },
  methods: {
    // 下面三个方法为改变对应的值
    changeName(e) {
      this.changeSelectItem(e.detail.value, 'realName')
    },
    changeProcess(e) {
      this.changeSelectItem(e.detail.value, 'process')
    },
    changePhone(e) {
      this.changeSelectItem(e.detail.value, 'phoneNumber')
    },

    // 赋所需要的值
    changeSelectItem(item, type) {
      if (type === "phoneNumber") {
        this.data.userInfo.wechat_data[type] = item
        this.data.userInfo[type] = item
      } else if (type === "process") {
        this.data.userInfo[type] = item
      } else if (type === 'realName'){
        this.data.userInfo.realName = item
        this.data.userInfo.wechat_data.realName = item
      }
        this.setData({
          userInfo: this.data.userInfo
        })
    },

    // 获取手机号
    getPhoneNumber(e) {
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        wxReq({
          url: '/wechat/phone',
          data: {
            code: e.detail.code,
          },
          method: "POST",
          success: (res) => {
            let phoneNumber = JSON.parse(res.data.data).phone_info.purePhoneNumber
            this.changeSelectItem(phoneNumber, 'phoneNumber')
          }
        })
      } else {
        Message.error({
          offset: [20, 32],
          duration: 2000,
          content: '获取手机号失败',
        });
      }
      // this.data.userInfo.phoneNumber = e.detail.value
    },

    // 点击注册
    postSignUp() {
      if (!this.data.isRead) {
        Message.error({
          offset: [20, 32],
          duration: 2000,
          content: '请阅读并勾选协议',
        });
        return
      }
      if (this.data.selectedWorkProcedureValue === "") {
        Message.error({
          offset: [20, 32],
          duration: 2000,
          content: '请选择工序',
        });
        return
      }
      if (this.data.userInfo.realName === undefined) {
        Message.error({
          offset: [20, 32],
          duration: 2000,
          content: '请输入真实姓名',
        });
        return
      }
      if (this.data.userInfo.phoneNumber === undefined) {
        Message.error({
          offset: [20, 32],
          duration: 2000,
          content: '请填写手机号',
        });
        return
      } else {
        if (!verifyTel(this.data.userInfo.phoneNumber)) {
          Message.error({
            offset: [20, 32],
            duration: 2000,
            content: '手机号格式不正确，请重新填写或者获取',
          });
          this.changeSelectItem("", "phoneNumber")
          return
        }
      }

      let userInfo = this.data.userInfo
      let selectedWorkProcedureValue = this.data.selectedWorkProcedureValue
      wxReq({
        url: '/user/register',
        data: {
          user_name: userInfo.phoneNumber,
          name: userInfo.realName,
          unionid: userInfo.openid.unionid,
          process: selectedWorkProcedureValue,
          wechat_data: userInfo.wechat_data,
          openid: userInfo.openid.openid
        },
        method: "POST",
        success: (res) => {
          if (res.data.data === true) {
            Message.success({
              offset: [20, 32],
              duration: 2000,
              content: '注册成功',
            });
            this.toManage()
          } else {
            Message.error({
              offset: [20, 32],
              duration: 2000,
              content: res.data.data,
            });
          }
        }
      })
    },

    // 去管理界面
    toManage() {
      wx.reLaunch({
        url: '../manage/manage'
      })
    },

    // 阅读同意
    iRead() {
      this.setData({
        isRead: !this.data.isRead
      })
    },

    // 去协议界面
    toArgument() {
      wx.navigateTo({
        url: '../agreement/agreement',
      })
    },

    // 打开弹窗
    chooseProcedure(){
      this.setData({
        showPick:true
      })
    },

    // 关闭弹窗
    cancelChoose(e){
      delete this.data.userInfo.process
      this.setData({
        showPick:false
      })
    },

    // 点击确定
    confirmChoose(){
      let _this = this
      let selectedWorkProcedureValue = ''
      _this.data.workProcedure.forEach(process => {
        delete process.checked
      })

      _this.data.userInfo.process.forEach((item,index) => {
        if(index === 0){
          selectedWorkProcedureValue += _this.data.workProcedure[item].label
        } else {
          selectedWorkProcedureValue += (',' + _this.data.workProcedure[item].label)
        }

        _this.data.workProcedure[item].checked = "true"
      })

      this.setData({
        showPick:false,
        selectedWorkProcedureValue,
        workProcedure:_this.data.workProcedure
      })
    }
  }
})