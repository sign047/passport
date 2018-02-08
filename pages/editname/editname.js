var app=getApp();
var util=require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     huName:'',
     cnplace:'',
     huPinYin:'',
      enplace:'',
     hId:''
  },
  topassport:function(){
      var url=app.globalData.huoLiBase+'updatePassPort',
          authToken=app.globalData.authToken,
          huName=this.data.huName,
          huPinYin=this.data.huPinYin,
          hId=this.data.hId;
      var data={authToken:authToken,huName:huName,huPinYin:huPinYin,hId:hId};
      if(!util.check(data)) return;
      util.http(url,data,function(){
          wx.redirectTo({
              url: '../passport/passport?id='+hId
          })
      });
  },
  CnName:function(e){
     var value=e.detail.value;
     this.setData({
         huName:value
     })

  },
  EnName:function(e){
      var value=e.detail.value.toUpperCase();
      this.setData({
         huPinYin:value
      });
      return {
          value:value
      }
  },
  onLoad: function (options) {
      this.setData({
          huName:options.huName,
          cnplace:options.huName,
          huPinYin:options.huPinYin,
          enplace:options.huPinYin,
          hId:options.id
      })
  }
});