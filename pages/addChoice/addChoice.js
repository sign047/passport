var util=require('../../utils/util');
var wxRequest = require('../../utils/wxRequest');
var app=getApp();
Page({
    data:{},
    onGotUserInfo:function(e){
       var that=this;
       var type=e.target.dataset.type;
       if(type === '1'){
           app.login(that.toPhoto);
       }
       if(type === '2'){
           app.login(that.toWrite);
       }

    },
    toPhoto:function(){
        if(!app.isLogin()) return;
        wx.navigateTo({
            url:'../pic/pic'
        })
    },
    toWrite:function(){
        if( !app.isLogin()) return;
        wx.navigateTo({
            url:'../addpassport/addpassport'
        })
    }
});