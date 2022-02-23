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
        value: '拉毛'
      },
      {
        label: '刺毛',
        value: '刺毛'
      },
      {
        label: '捻须',
        value: '捻须'
      },
      {
        label: '穿线',
        value: '穿线'
      },
      {
        label: '打结',
        value: '打结'
      },
      {
        label: '压皱',
        value: '压皱'
      },
      {
        label: '整烫',
        value: '整烫'
      },
      {
        label: '车缝',
        value: '车缝'
      },
      {
        label: '开片',
        value: '开片'
      },
      {
        label: '轧光',
        value: '轧光'
      },
      {
        label: '水洗',
        value: '水洗'
      },
      {
        label: '水洗',
        value: '水洗'
      },
      {
        label: '烘干',
        value: '烘干'
      },
      {
        label: '套口',
        value: '套口'
      },
      {
        label: '套缝',
        value: '套缝'
      },
      {
        label: '抽顶',
        value: '抽顶'
      },
      {
        label: '剪球',
        value: '剪球'
      },
      {
        label: '吊球',
        value: '吊球'
      },
      {
        label: '绣花',
        value: '绣花'
      },
      {
        label: '印花',
        value: '印花'
      },
      {
        label: '钉扣',
        value: '钉扣'
      },
      {
        label: '烫钻',
        value: '烫钻'
      },
      {
        label: '接指',
        value: '接指'
      },
      {
        label: '麻缝',
        value: '麻缝'
      },
      {
        label: '染色',
        value: '染色'
      },
      {
        label: '切割',
        value: '切割'
      },
      {
        label: '手工',
        value: '手工'
      },
      {
        label: '检验',
        value: '检验'
      },
      {
        label: '车标',
        value: '车标'
      },
      {
        label: '包装',
        value: '包装'
      },
      {
        label: '吊牌',
        value: '吊牌'
      },
      {
        label: '打枪',
        value: '打枪'
      },
      {
        label: '装箱',
        value: '装箱'
      },
      {
        label: '下水',
        value: '下水'
      },
      {
        label: '压花',
        value: '压花'
      },
      {
        label: '平车',
        value: '平车'
      },
      {
        label: '成品染色',
        value: '成品染色'
      },
      {
        label: '下料',
        value: '下料'
      },
      {
        label: '烫金',
        value: '烫金'
      },
      {
        label: '锁眼',
        value: '锁眼'
      },
      {
        label: '钉珠',
        value: '钉珠'
      },
      {
        label: '点胶',
        value: '点胶'
      },
      {
        label: '搓须',
        value: '搓须'
      },
      {
        label: '梭织',
        value: '梭织'
      },
      {
        label: '针织',
        value: '针织'
      },
      {
        label: '精编',
        value: '精编'
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
    changeName(e) {
      this.data.userInfo.realName = e.detail.value
      this.data.userInfo.wechat_data.realName = e.detail.value
    },
    changePhone(e) {
      this.changePhoneNumber(e.detail.value)
    },
    changePhoneNumber(phoneNumber) {
      this.data.userInfo.wechat_data.phoneNumber = phoneNumber
      this.data.userInfo.phoneNumber = phoneNumber
      this.setData({
        userInfo: this.data.userInfo
      })
    },
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
            this.changePhoneNumber(phoneNumber)
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
          this.changePhoneNumber("")
          return
        }
      }
      let userInfo = this.data.userInfo
      wxReq({
        url: '/user/register',
        data: {
          user_name: userInfo.phoneNumber,
          name: userInfo.realName,
          unionid: userInfo.openid.unionid,
          process: userInfo.process,
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
    toManage() {
      wx.reLaunch({
        url: '../manage/manage'
      })
    },
    iRead() {
      this.setData({
        isRead: !this.data.isRead
      })
    },
    toArgument(){
      wx.navigateTo({
        url: '../agreement/agreement',
      })
    },
    onPicker1Confirm(e) {
      this.data.userInfo.process = e.detail.value[0].value
      this.setData({
        selectedWorkProcedureValue: e.detail.value[0].value,
        showPick: false
      });
    },
    onPicker1Cancel() {
      this.setData({
        showPick: false,
      });
    },
    clickPicker(e) {
      if (e.detail.y < 500) {
        this.setData({
          showPick: false
        })
      }
    },
    chooseProcedure() {
      this.setData({
        showPick: true,
      });
    }
  }
})