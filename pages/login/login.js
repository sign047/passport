var util = require('../../utils/util');
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
        id: '',
        showTopTips: false,
        errTxt: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        if (id) {
            this.setData({
                id: id
            })
        }
    },
    login: function () {
        var data = this.data;
        if(!data.verifyCode || data.verifyCode.length <4){
            this.showTopTips('请输入正确的4位验证码');
            return;
        }
        var json = {
            phone: data.phone,
            smsCode: data.verifyCode,
            authToken: app.globalData.authToken
        };
        var url = app.globalData.huoLiBase + 'savePhone';
        var id = data.id;
        util.http(url, json, function (res) {
            app.globalData.hasPhone = 1;
            wx.setStorageSync('hasPhone', 1);
            if (id) {
                wx.switchTab({
                    url: '../passportList/passportList'
                })
                // wx.redirectTo({
                //     url: '../passport/passport?id=' + id
                // })
            } else {
                wx.switchTab({
                    url: '../passportList/passportList'
                })
            }
        })
    },
    getPhone: function (e) {
        var val = e.detail.value;
        this.setData({
            phone: val
        });
    },
    setCode: function (e) {
        var val = e.detail.value;
        this.setData({
            verifyCode: val
        });
    },
    showTopTips: function (errmsg) {
        var that = this;
        this.setData({
            showTopTips: true,
            errTxt: errmsg
        });
        setTimeout(function () {
            that.setData({
                showTopTips: false
            });
        }, 2400);
    },
    getCode: function () {
        var self = this;
        var url = app.globalData.huoLiBase + 'sendLoginSms';
        var mobile = /^0?(13|15|18|14|17)[0-9]{9}$/;
        var phone = this.data.phone;
        if (!mobile.test(phone)) {
            self.showTopTips('手机号格式错误');
            return;
        }
        if (this.data.second > 0) return;
        this.setData({
            second: 60
        });
        this.timeTick();
        util.http(url, {phone: phone}, function (res) {

        })
    },
    timeTick: function () {
        var self = this;
        setTimeout(function () {
            if (self.data.second > 0) {
                var second = self.data.second;
                second--;
                self.setData({
                    second: second
                });
                self.timeTick();
            }
        }, 1000);
    }
});