var util=require('../../utils/util');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      huIssuePlace:'',
      cityPlace:'',
      hId:''
  },
  topassport:function(){
    var url=app.globalData.huoLiBase+'updatePassPort',
        authToken=app.globalData.authToken,
        huIssuePlace=this.data.huIssuePlace,
        hId=this.data.hId;
    var data={authToken:authToken,huIssuePlace:huIssuePlace,hId:hId};
    if(!util.check(data)) return;
    util.http(url,data,function(){
        wx.redirectTo({
            url: '../passport/passport?id='+hId
        })
    });
  },
  bindCity:function(e){
    var value=e.detail.value;
    this.setData({
        huIssuePlace:value
    })
  },
  onLoad: function (options) {
     this.setData({
         huIssuePlace:options.huIssueplace,
         cityPlace:options.huIssueplace,
         hId:options.id
     })
  }


});