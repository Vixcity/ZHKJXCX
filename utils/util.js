const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const wxReq = data => {
  const openid = wx.getStorageSync("userInfo").openid.openid
  wx.request({
    url: getApp().globalData.api + data.url,
    data: data.data,
    method: data.method,
    success: data.success,
    header:{
      Authorization:'Bearer '+openid
    }
  })
}

// 验证手机号
function verifyTel (tel){
  let reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
  if(reg.test(tel)){
    return true;
  }
  return false;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 获取时间差
const getTimeDiff = (time1,time2,type='hours') => {
  let timeDiff = time1>time2?time1-time2:time2-time1
  let hours = Math.floor(timeDiff / (3600 * 1000));
  let days = Math.floor(timeDiff / (24 * 3600 * 1000));
  let minutes = Math.floor(timeDiff / (60 * 1000));
  if(type==="hours") return hours
  if(type==="days") return days
  if(type==="minutes") return minutes
}

module.exports = {
  formatTime,
  wxReq,
  verifyTel,
  getTimeDiff
}
