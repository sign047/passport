var util = require('../../utils/util');
var wxApi=require('../../utils/wxApi');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    isCode: false,
    verifyCode: '',
    second: 0,
    path: '',
    phoneTxt:'绑定手机开启护照到期短信提醒功能',
    oldPhone:'',
    avatarUrl:'http://7xj7u1.com1.z0.glb.clouddn.com/passport/user.png',
    nickName:''
  },

  /**
   * 生命周期函数--监听页面加载
   *
   */

  onShow: function (options) {
    var that=this,
        data=this.data,
        avatarUrl,
        nickName;
    app.login(that.getPhone);
    wxApi.wxUserInfo()
    .then((res) => {
        const userInfo=res.userInfo
        this.setData({
            avatarUrl:userInfo.avatarUrl,
            nickName:userInfo.nickName
        })
    })
  },
  toVisaFiles() {
      wx.switchTab({
          url:'../addVisaData/addVisaData'
      })
  },
  getPhone:function(){
      var that=this;
      var hasPhone = app.globalData.hasPhone;
      var url=app.globalData.huoLiBase+'getPhone';
      var phone=wx.getStorageSync('hasPhone');
      const authToken = app.globalData.authToken;
      if(hasPhone === null || hasPhone == 0){
          this.setData({
              phoneTxt:"绑定手机开启护照到期短信提醒功能"
          })
      }else{
          if(authToken === null || !authToken) return;
          util.http(url,{authToken:authToken},function(res){
              if(res.object === null) return;
              var phone=that.maskNum(res.object);
              var txt=res.object;
              that.setData({
                  phoneTxt:phone,
                  oldPhone:phone,
                  phone:txt
              })
          })
      }
  },
  maskNum: function(num){
      return num.replace(/\d{11}/g,function(s){
          return s.substring(0,3)+'****'+ s.substring(7);
      });
  },
  toPhone:function(){
    const hasPhone  = app.globalData.hasPhone;
    const authToken = app.globalData.authToken;
    if(authToken === null || !authToken) return;
    var phone=this.data.phone;
    if( hasPhone === null || hasPhone == 0){
        wx.navigateTo({
            url:'../login/login'
        })
    }else{
        wx.navigateTo({
            url:'../changePhone/changePhone?phone='+phone
        })
    }
  },
  toFeedBack:function(){
    const hasPhone  = app.globalData.hasPhone;
    const authToken = app.globalData.authToken;
    if(authToken === null || !authToken) return;
    wx.navigateTo({
        url:'../feedBack/feedBack'
    })
  }

});