// pages/basePassport/basePassport.js
var util=require('../../utils/util');
var app=getApp();
const rules= [
    {name: 'idCardNumber',errmsg: '请填写身份证信息',baseTxt:''},
    {name: 'issuePlace',errmsg: '请填写签发地'},
    {name: 'issueDate',errmsg: '请填写护照签发日期',baseTxt:''},
    {name: 'expireTime', errmsg: '请填写护照有效期',baseTxt:''}]
Page({
    /**
     * 页面的初始数据
     */
    data: {
        showTopTip:false,
        basePassport: {
            idCardNumber:'',
            huNumber: '',
            issuePlace: '',
            issueDate: '请选择签发日期',
            expireTime: '请选择有效期',
            issueAuthority: '公安部出入境管理局'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInfo();
    },
    getInfo() {
        let globalData = app.globalData;
        const url =  globalData.httpBase+'/hzgjVisaFile/getMessageInfo';
        const vfId = globalData.baseApplication.vfId;
        const authToken = globalData.authToken;
        util.http(url,{authToken,vfId},(res) => {
            let basePassport = res.object;
            if(basePassport && basePassport != null) {
                basePassport.issueAuthority ='公安部出入境管理局';
                basePassport.issueDate = util.parseDate(basePassport.issueDate);
                basePassport.expireTime = util.parseDate(basePassport.expireTime);
            }

        this.setData({
            basePassport
        })
    })
    },
    showTopTips: function(errmsg){
        var that = this;
        this.setData({
            showTopTip: true,
            errTxt:errmsg
        });
        clearTimeout(that.timer);
        that.timer=setTimeout(function(){
            that.setData({
                showTopTip: false
            });
        }, 1000);
    },
    saveInfo() {
        const globalData = app.globalData;
        const url =  globalData.httpBase+'/hzgjVisaFile/saveMessageInfo';
        let basePassport = this.data.basePassport;
        const vfId = globalData.baseApplication.vfId;
        const id = this.data.basePassport.id;
        const authToken = globalData.authToken;
        var err=util.check(basePassport,rules);
        if(!err.isCheck){
            this.showTopTips(err.errmsg);
            return;
        }
        Object.assign(basePassport,{
            vfId,
            authToken
        })

        util.http(url,basePassport,function(res){

            wx.redirectTo({
                url: '../baseApplication/baseApplication'
            })
        })
    },
    setChange(name,changedVal) {
        let basePassport = this.data.basePassport;
        basePassport[name] = changedVal;
        this.setData({
            basePassport
        })
    },
    statusChange(e) {
        const value = e.detail.value;
        const name = e.currentTarget.dataset.name;
        this.setChange(name,value);
    }
})