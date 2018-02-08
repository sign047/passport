var app=getApp();
var util = require('../../utils/util');
Page({
    data:{
        message:''
    },
    saveMsg:function(e){
       var value=e.detail.value;
       this.setData({
           message:value
       })
    },
    saveSuggestion:function(){
        var global=app.globalData;
        var url=global.huoLiBase+'saveSuggestion';
        var message=this.data.message;
        var authToken=global.authToken;

        util.http(url, { authToken: authToken,msg:message}, function (res) {
            this.setData({
                message:''
            })
            wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1000,
                complete:function(){
                    setTimeout(function(){
                        wx.switchTab({
                            url:'../user/user'
                        })
                    },300)
                }
            })
        })
    }

});