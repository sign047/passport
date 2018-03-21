var util = require('../../utils/util');
var app=getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hId:'',
        huTag: '',
        numPlace:'',
        huNumber:'',
        tabArr:['我','配偶','孩子','父母','亲戚','朋友']
    },
    radioChange: function (e) {
        this.setData({
            huTag: e.detail.value
        })
    },
    bindNum:function(e){
        var value=e.detail.value.toUpperCase();
        var huNumber=this.data.huNumber;
        this.setData({
            huNumber:value
        });
        return {
            value:value
        }
    },
    topassport: function () {
        var url = app.globalData.huoLiBase + 'updatePassPort',
            authToken = app.globalData.authToken,
            huNumber = this.data.huNumber,
            huTag=this.data.huTag,
            hId = this.data.hId;
        var data={authToken: authToken, huNumber: huNumber, huTag: huTag, hId: hId};
        if(!util.check(data)) return;
        util.http(url,data, function (data) {
            if(data.object == 'hasNumber'){
                app.showModel({
                    title:'此护照号码已存在',
                    showCancel:false,
                    success: function(res) {
                        if (res.confirm) {
                           return;
                        } else if (res.cancel) {

                        }
                    }
                });
            }else{
                wx.redirectTo({
                    url: '../passport/passport?id=' + hId
                })
            }

        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            huNumber: options.huNumber,
            huTag: options.huTag,
            hId:options.id,
            numPlace:options.huNumber
        })
    }
});