//app.js
var wxApi = require('/utils/wxApi');
var wxRequest = require('/utils/wxRequest');
App({
    login: function(cb) {
        var token=wx.getStorageSync('authToken');
        if(token){
            this.globalData.authToken=token;
            if(this.hasPhone()){
                this.globalData.hasPhone=1
            }else{
                this.globalData.hasPhone=0
            }
            cb && cb();
        }else{
            this.getLogin(cb);
        }
    },
    getLogin: function (cb) {
        var that = this;
        var encryptedData="";
        var iv="";
        var signature="";
        // wx.showToast({
        //     title: '加载中',
        //     icon: 'loading',
        //     duration: 10000,
        //     mask:true
        // });
        //1.获取code
        var wxLogin = wxApi.wxLogin();
        wxLogin()
            .catch(res => {
        that.showModel({title:'调用登录失败',content:'请下拉刷新重试！',showCancel:false});
    })
    .then(res => {
            const code = res.code;
        if (code) {
            that.globalData.code = code;
        }
        wx.hideToast();
        return wxApi.wxUserInfo({
            withCredentials:true
        })
    })
    .catch( res => {
        cb&&cb({showLoad:false})
        that.showModel({title:'授权失败',content:'您不小心拒绝了微信授权！请允许我们获取您的基础信息才能正常使用',showCancel:false});
        wx.hideToast();
        return Promise.reject();
    })
        // userInfo
    .then( res => {
        encryptedData=res.encryptedData;
        iv=res.iv;
        var url=this.globalData.huoLiBase+'loginfo',
            code=that.globalData.code;

        // wx.showToast({
        //     title: '加载中',
        //     icon: 'loading',
        //     duration: 10000,
        //     mask:true
        // });
        wxRequest.getRequest(url,{encryptedData,iv,code})
            .then(res => {
            var data=res.data;
            console.log(data);
        if(res.statusCode >= 400){
            that.showModel({content:'服务器出错,请下拉刷新重试',showCancel:false});
            wx.hideToast();
            return;
        }
        if(data.code == 200){
            wx.hideToast();
            wx.setStorage({
                key:"authToken",
                data:data.object.authToken
            });
            that.globalData.authToken=data.object.authToken;
            if(!that.hasPhone()){
                wx.setStorageSync('hasPhone', data.object.phone);
                that.globalData.hasPhone=data.object.phone;
            }
            setTimeout(() =>{
                cb&&cb();
        },0)
        }else{
            that.showModel({content:data.content,showCancel:false});
            wx.hideToast();
        }
    })
    .catch(res => {
            wx.hideToast();
        that.showModel({title:'数据获取失败',content:'请检查网络后刷新！',showCancel:false});
    })
    })
    .finally(function (res) {
            wx.hideToast();
        })
    },
    hasPhone:function(){
        var phone=wx.getStorageSync('hasPhone');
        if(phone == 1){
            return true
        }else{
            return false;
        }
    },
    showToast:function(){
        wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
        })
    },
    showModel:function(json){
        wx.showModal({
            title:json.title?json.title:'',
            content:json.content?json.content:'',
            showCancel:json.showCancel?json.showCancel:false,
            success: function(res) {
                if (res.confirm) {
                    json.confirm&&json.confirm()
                } else if (res.cancel) {
                    json.cancel&&json.cancel()
                }
            }
        })
    },
    isLogin:function(){
        if(this.globalData.authToken){
            return true
        }else{
            return false
        }
    },
    globalData: {
        authToken: null,
        hasPhone:null,
        code:null,
        isPre:false,
        cropImg: {
            showIndex:0,
            showImage: [],
            pageType:''
        },
        currentPassport:'',
        currentNumber:'',
        pagePath:'',
        pageLoad:false,
        baseApplication:{
            basicStatus: 0,
            contactStatus: 0,
            familyStatus: 0,
            humessageStatus: 0,
            id: '',
            vfId: ''
        },
        currentFile:{
            accountBookStatus: 0,
            applicationStatus: 0,
            headStatus: 0,
            id: -1,
            idCardStatus: 0,
            marriageStatus: 0,
            propertyStatus: 0,
            step:0,
            moveStep:0,
            visaFileDesc: "",
            visaFileName: "",
            visaFileUserName: null
        },
        // httpBase:"http://192.168.10.157:8080/",
        // huoLiBase: "http://192.168.10.157:8080/hzgj/"
        // httpBase:"http://trip2.133.cn",
        // huoLiBase: "http://trip2.133.cn/hzgj/"
        httpBase:"https://travel.huoli.com",
        huoLiBase: "https://travel.huoli.com/hzgj/"
    }
});
