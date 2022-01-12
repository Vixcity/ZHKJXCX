import Message from 'tdesign-miniprogram/message/index';
import {
  wxReq
} from '../../utils/util';
// index.js
Component({
  data: {
    userInfo: {},
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
      if (JSON.stringify(this.data.userInfo) === '{}') {
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      }
    }
  },
  methods: {
    changeName(e) {
      this.data.userInfo.name = e.detail.value
    },
    changePhone(e){
      this.data.userInfo.phoneNumber = e.detail.value
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
      if (this.data.userInfo.name === undefined) {
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
      }
      let userInfo = this.data.userInfo
      
      wxReq({
        url: '/user/register',
        data: {
          // user_name:userInfo.phoneNumber,
          user_name:'18958643187',  
          name:userInfo.name,
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
      console.log('picker1 confirm:', e.detail);
      this.data.userInfo.process = e.detail.value[0].value
      this.setData({
        selectedWorkProcedureValue: e.detail.value[0].value,
        showPick: false
      });
    },
    onPicker1Cancel() {
      console.log('picker1 cancel:');
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