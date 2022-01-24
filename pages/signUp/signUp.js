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
    isRead: false,
    showPick: false,
    workProcedure: [{
        label: '工序1',
        value: '工序1'
      },
      {
        label: '工序2',
        value: '工序2'
      },
      {
        label: '工序3',
        value: '工序3'
      },
      {
        label: '工序4',
        value: '工序4'
      },
      {
        label: '工序5',
        value: '工序5'
      }
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
    changePhone(e){
      this.changePhoneNumber(e.detail.value)
    },
    changePhoneNumber(phoneNumber){
      this.data.userInfo.wechat_data.phoneNumber=phoneNumber
      this.data.userInfo.phoneNumber=phoneNumber
      this.setData({userInfo:this.data.userInfo})
    },
    getPhoneNumber(e){
      if(e.detail.errMsg==="getPhoneNumber:ok"){
        wxReq({
          url: '/wechat/phone',
          data: {
            code:e.detail.code,
          },
          method:"POST",
          success:(res) => {
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
        if(!verifyTel(this.data.userInfo.phoneNumber)){
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
          user_name:userInfo.phoneNumber,
          name:userInfo.realName,
          process:userInfo.process,
          wechat_data:userInfo.wechat_data,
          openid:userInfo.openid.openid
        },
        method:"POST",
        success:(res) => {
          if(res.data.data===true){
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
    chooseProcedure() {
      this.setData({
        showPick: true,
      });
    }
  }
})