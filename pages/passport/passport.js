var app = getApp();
var util = require('../../utils/util');
var Promise = require('../../utils/es6-promise.js');
var wxRequest = require('../../utils/wxRequest');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        sex: ['男', '女'],
        visaList: [],
        id:'',
        sexIndex: '',
        passport: {},
        sharePassport: {},
        shareVisaList:[],
        hidden: true,
        huBoth: '',
        showTopTips:false,
        huCreateTime: '',
        visaHidden:true,
        huExpireTime: '',
        huSex: '',
        isShare:false,
        lastTime: '',
        txtStyle:'',
        startX:'',
        isLoad:false,
        isGo:false
    },
    isShare: function () {
        var isShare = this.data.isShare;
        if (isShare) {
            return true;
        } else {
            return false;
        }
    },
    //删除护照
    delPass: function (ev) {
        var url = app.globalData.huoLiBase + 'delPassport';
        var huId =this.data.id;
        var authToken = app.globalData.authToken;
        var that = this;
        wx.showModal({
            title: '是否删除护照',
            success: function (res) {
                if (res.confirm) {
                    util.http(url, {huId: huId, authToken: authToken}, function () {
                        wx.switchTab({
                            url:'../passportList/passportList'
                        })
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    //下拉刷新
    onPullDownRefresh: function () {
        var that=this;
        var id=this.data.id;
        app.login(that.getPort);
        wx.stopPullDownRefresh();
    },
    //转发
    onShareAppMessage: function (res) {
        var id = this.data.id;
        var passport = this.data.passport;
        const that = this;

        if(that.data.isGo) return;
        that.setData({
            isGo:true
        });
        if (res.from === 'button') {

        }
        return {
            title: passport.huName + '的护照',
            path: `/pages/passport/passport?id=${id}&isShare=true`,
            success: function (res) {

            },
            fail: function (res) {

            },
            complete:function() {
                setTimeout(() => {
                    that.setData({
                    isGo:false
                })
            },300)
            }
        }
    },
    //签证修改
    updateVisa:function(value,visa,index,type){
        var url=app.globalData.huoLiBase+'updateVisa',
            authToken=app.globalData.authToken,
            createTime,
            expireTime,
            that=this;
        if(type ===1){
            expireTime=this.parseTime(visa.expireTime);
            if( util.compareTime('huCreateTime',value,that,expireTime)){
                createTime=value;

                visa.createTime=this.parse(value);
            }else{
                return
            }

        }
        if(type === 2){
            createTime = this.parseTime(visa.createTime);
            if( util.compareTime('huExpireTime',value,that,createTime)) {
                expireTime = value;
                visa.expireTime = this.parse(value);
            }else{
                return
            }
        }
        util.http(url,{authToken:authToken,visaId:visa.id,createTime:createTime,expireTime:expireTime},function(res){
            var list=that.data.visaList;
            list[index]=visa;
            that.setData({
                visaList:list
            });
            wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
            });

        },function(){
            util.showModel({
                title:'保存失败',
                showCancel:false
            })
        })
    },
    parseTime:function(time){
        return time.replace(/\./g,'-');

    },
    parse:function(time){
        return time.replace(/-/g,'.');
    },
    bindStartChange:function(e){
        var visa=e.target.dataset.visa;
        var index=e.target.dataset.index;
        var value=e.detail.value;

        this.updateVisa(value,visa,index,1);
    },
    bindEndChange:function(e){
        var visa=e.target.dataset.visa;
        var index=e.target.dataset.index;
        var value=e.detail.value;
        this.updateVisa(value,visa,index,2);
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
    changeNav:function(e){
        var type=e.target.dataset.type;
        if(type === '1'){
            this.setData({
                visaHidden:true
            })
        }
        if(type ==='2'){
            this.setData({
                visaHidden:false
            })
        }
    },
    // 修改时间
    bindDateChange: function (e) {
        if(this.isShare()) return;
        var val = e.detail.value.split('-');
        var time = `${val[0]}年${val[1]}月${val[2]}日`;
        var value = e.detail.value;
        var kind = e.currentTarget.dataset.kind;
        var passport = this.data.passport;
        var url = app.globalData.huoLiBase + 'updatePassPort';
        var authToken = app.globalData.authToken;
        var id = this.data.id;
        var that = this;
        switch (kind) {
            case '1':
                util.http(url, {authToken: authToken, huBoth: value, hId: id}, function () {
                    that.setData({huBoth: time});
                });
                break;
            case '2':
                this.setData({huCreateTime: value});
                util.http(url, {authToken: authToken, huCreateTime: value, hId: id}, function () {
                    that.setData({huCreateTime: time});
                });
                break;
            case '3':
                var v = util.matchTime2(e.detail.value);
                util.http(url, {authToken: authToken, huExpireTime: value, hId: id}, function () {
                    that.setData({huExpireTime: time, lastTime: v});
                });
                break;
        }

    },
    onGotUserInfo:function(){
        var that=this;
        var id=this.data.id;
        var authToken = app.globalData.authToken;
        if(!that.data.sharePassport.huNumber){
            app.login(that.getPort);
        }else{
            that.savePort();
        }
    },
    //转发保存
    savePort: function () {
        var id = this.data.id;
        if (!app.globalData.authToken) return;
        var url = app.globalData.huoLiBase + 'savePassPort';
        var passport = this.data.sharePassport;
        var authToken = app.globalData.authToken;
        passport.authToken = authToken;
        var data = app.globalData;
        var visaUrl = data.huoLiBase + 'saveVisa';
        var visaList = this.data.shareVisaList;
        //分享保存
        util.http(url, passport, function (data) {
            var code = data.object;
            if (code.hasNumber) {
                app.showModel({
                    title: '此护照号码已存在',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            return false;
                        } else if (res.cancel) {

                        }
                    }
                });
                return false;
            } else {
                util.http(visaUrl, {huId:code.huMessageId, authToken: authToken,isShare:1,visaList: visaList}, function (res) {
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2600,
                        complete:function(){
                            if (!app.hasPhone()) {
                                wx.redirectTo({
                                    url:`../login/login?id=${code}`
                                });
                            }else{
                                wx.switchTab({
                                    url:'../passportList/passportList'
                                })
                            }
                        }
                    });

                });
            }
        });
    },
    //删除签证
    del: function (ev) {
        if(this.isShare()) return;
        var url = app.globalData.huoLiBase + 'delVisa';
        var visaId = ev.currentTarget.dataset.id;
        var index = ev.currentTarget.dataset.index;
        var authToken = app.globalData.authToken;
        var that = this;
        wx.showModal({
            title: '是否删除签证',
            success: function (res) {
                if (res.confirm) {
                    util.http(url, {visaId: visaId, authToken: authToken}, function () {
                        var list = that.data.visaList;
                        list.splice(index, 1);
                        that.setData({
                            visaList: list
                        })
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    //修改性别
    bindSexChange: function (e) {
        if(this.isShare()) return;
        var index = e.detail.value;
        var data = this.data;
        var sex = data.sex[index];
        var url = app.globalData.huoLiBase + 'updatePassPort';
        var authToken = app.globalData.authToken;
        var id = this.data.id;
        this.setData({
            huSex: sex
        });
        util.http(url, {authToken: authToken, huSex: sex, hId: id}, function () {

        });
    },
    confirm: function (e) {
        this.setData({
            hidden: true
        })
    },
    toVisa: function () {
        if (this.isShare()) return;
        var id = this.data.id;
        wx.redirectTo({
            url: `../addVisa/addVisa?id=${id}`
        })
    },
    /*左滑*/
    touchS:function(e){
        //判断是否只有一个触摸点
        if(e.touches.length==1){
            this.setData({
                //记录触摸起始位置的X坐标
                startX:e.touches[0].clientX
            });
        }
    },
    //触摸时触发，手指在屏幕上每移动一次，触发一次
    touchM:function(e){

    },
    touchE:function(e){
        var that = this;
        if(e.changedTouches.length==1){
            //手指移动结束后触摸点位置的X坐标
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = that.data.startX - endX;
            var delBtnWidth =100;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle = disX > 20 ? `transform:translatex(-${delBtnWidth}px)`:"transform:translatex(0)";
            //获取手指触摸的是哪一项
            var index = e.currentTarget.dataset.index;
            var list = that.data.visaList;
            list[index].txtStyle = txtStyle;
            //更新列表的状态
            that.setData({
                visaList:list
            });
        }
    },
    /*左滑end*/
    delPort: function () {
        var url = app.globalData.huoLiBase + 'delPassport';
        var huId = this.data.id;
        var authToken = app.globalData.authToken;
        var that = this;
        wx.showModal({
            title: '是否删除护照',
            success: function (res) {
                if (res.confirm) {
                    util.http(url, {huId: huId, authToken: authToken}, function (data) {
                        wx.redirectTo({
                            url: '../passportList/passportList'
                        })
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    editPass:function(e){
        var pass =JSON.stringify(this.data.sharePassport);
        wx.redirectTo({
            url:'../addpassport/addpassport?isEdit=true&passport='+pass
        })
    },
    getVisaList: function (id, authToken) {
        var url = app.globalData.huoLiBase + 'getVisa';
        var that = this;
        util.http(url, {huId: id, authToken: authToken}, function (data) {
            var list=JSON.parse(JSON.stringify(data.object));
            var shareVisaList =JSON.parse(JSON.stringify(data.object));
            list.forEach(function(item,index){
                item['lastTime'] = util.matchTime(item.expireTime, 2);
                item.expireTime = util.toDate2(item.expireTime);
                item.createTime = util.toDate2(item.createTime);
            });
            shareVisaList.forEach(function(item,index){
                item.expireTime = util.toDate3(item.expireTime);
                item.createTime = util.toDate3(item.createTime);
            });
            that.setData({
                visaList: list,
                shareVisaList:shareVisaList
            });
        });

    },
    /**
     * 生命周期函数--监听页面加载
     */
    getPort:function(){
        var that = this;
        var id=this.data.id;
        var url = app.globalData.huoLiBase + 'getPassPortById';
        var authToken = app.globalData.authToken;
        util.http(url, {huId:id, authToken: authToken}, function (data) {
            if (data.content == 'noPort') {
                app.showModel({
                    content: '护照不存在',
                    showCancel:false,
                    confirm: function (res){
                        wx.switchTab({
                            url: '../passportList/passportList'
                        });
                    },
                    fail:function(){
                        wx.switchTab({
                            url: '../passportList/passportList'
                        });
                    }
                });
            } else {
                var shareData = Object.assign({},data.object);
                var list = data.object;
                var lastTime = util.matchTime(list.huExpireTime, 1);
                var huExpireTime = util.toDate(list.huExpireTime);
                var huCreateTime = util.toDate(list.huCreateTime);
                var huBoth = util.toDate(list.huBoth);
                var pass=Object.assign({},list,{huExpireTime,huCreateTime,huBoth});
                shareData =Object.assign(shareData,{
                    'huExpireTime':util.toDate3(shareData.huExpireTime),
                    'huCreateTime':util.toDate3(shareData.huCreateTime),
                    'huBoth'      :util.toDate3(shareData.huBoth),
                    'huIssuePlace':shareData.huIssueplace
                });
                that.setData({
                    passport: pass,
                    sharePassport: shareData,
                    huExpireTime: huExpireTime,
                    huCreateTime: huCreateTime,
                    huBoth: huBoth,
                    huSex: list.huSex,
                    lastTime: lastTime
                });
                var tit = `${list.huName}的护照`;
                util.setTitle(tit);
                that.getVisaList(id, authToken);
            }
        });

    },
    onShow:function(){
        var that=this;
        app.login(that.getPort);
    },
    onLoad: function (options) {
        var id = options.id;
        if (options.isShare) {
            var isShare = options.isShare;
            this.setData({
                id: id,
                isShare: isShare
            });
        }
        if(options.visaHidden != undefined || options.visaHidden ==false){
            this.setData({
                visaHidden:false
            })
        }
        var that = this;
        this.setData({
            id: id
        });
        
    }
});