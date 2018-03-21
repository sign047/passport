var util=require('../../utils/util');
var app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'',
        isCode:false,
        verifyCode:'',
        second:0,
        path:'',
        oldPhone:'',
        oldTxt:'',
        errTxt:'',
        showTopTips:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var phone=options.phone;
        var oldPhone=this.maskNum(options.phone);
        this.setData({
            oldPhone:oldPhone,
            oldTxt:phone
        });
    },
    maskNum: function(num){
        return num.replace(/\d{11}/g,function(s){
            return s.substring(0,3)+'****'+ s.substring(7);
        });
    },
    login:function(){
        var data=this.data;
        var json={
            phone:data.phone,
            smsCode:data.verifyCode,
            authToken:app.globalData.authToken
        };
        var url=app.globalData.huoLiBase+'savePhone';
        var path=data.path;
        util.http(url,json,function(res){
            app.globalData.hasPhone=1;
            wx.setStorageSync('hasPhone', 1);
            wx.switchTab({
                url:'/pages/user/user'
            })

        })
    },
    showTopTips: function(errmsg){
        var that = this;
        this.setData({
            showTopTips: true,
            errTxt:errmsg
        });
        clearTimeout(that.timer);
        that.timer=setTimeout(function(){
            that.setData({
                showTopTips: false
            });
        }, 1000);
    },
    getPhone:function(e){
        var val=e.detail.value;
        this.setData({
            phone:val
        });
    },
    setCode:function(e){
        var val=e.detail.value;
        this.setData({
            verifyCode:val
        });
    },
    getCode:function(){
        var self = this;
        var url=app.globalData.huoLiBase+'sendLoginSms';
        var mobile=/^0?(13|15|18|14|17)[0-9]{9}$/;
        var phone=this.data.phone;
        var oldTxt=this.data.oldTxt;
        if(!mobile.test(phone)){
            this.showTopTips('手机号格式错误');
            return;
        }else if(oldTxt == phone){
            this.showTopTips('手机号已注册');
            return;
        }
        if(this.data.second>0)return;
        this.setData({
            second:60
        });
        this.timeTick();
        util.http(url,{phone:phone},function(res){

        })
    },
    timeTick:function () {
        var self = this;
        setTimeout(function() {
            if (self.data.second > 0) {
                var second= self.data.second;
                second--;
                self.setData({
                    second:second
                });
                self.timeTick();
            }
        }, 1000);
    }
});