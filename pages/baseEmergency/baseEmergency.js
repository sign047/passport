// pages/baseEmergency/baseEmergency.js
var util=require('../../utils/util');
var app=getApp();
const rules= [
    {name: 'name',errmsg: '请填写现居省市',baseTxt:''},
    {name: 'phone',errmsg: '请填写手机',baseTxt:'',regErrTxt:'请输入正确的手机号码',regExp:/^0?(13|15|18|14|17)[0-9]{9}$/},
    {name: 'sameHouse',errmsg: '请选择同住状态'}, {name: 'relationship',errmsg: '请选择与申请人关系'}]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sameHouse: ['是', '否'],
        showTopTip:false,
        baseEmergency: {
            name: '',
            phone: '',
            sameHouse: '否',
            currentAddress: ['北京市','北京市','朝阳区'],
            detailedAddress: '',
            relationship: ''
        }
    },

    onLoad: function (options) {
        const isEdit = app.globalData.baseApplication.contactStatus;
        if(isEdit) {
            this.getInfo();
        }

    },
    onShow() {

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
    setChange(name,changedVal) {
        let baseEmergency = this.data.baseEmergency;
        baseEmergency[name] = changedVal;
        this.setData({
            baseEmergency
        })
    },
    bindSameHouse(e) {
        const name = e.currentTarget.dataset.name;
        const value = e.detail.value;

        let data = this.data;
        let baseEmergency = data.baseEmergency;
        if(value == 0){
            Object.assign(baseEmergency,{
                detailedAddress: ''
            })
        }
        baseEmergency[name] = data[name][value];
        this.setData({
            baseEmergency
        })

    },
    statusChange(e) {
        const value = e.detail.value;
        const name = e.currentTarget.dataset.name;
        this.setChange(name,value);
    },
    getInfo() {
        const globalData = app.globalData;
        const url =  globalData.httpBase+'/hzgjVisaFile/getContactInfo';
        const vfId = globalData.baseApplication.vfId;
        const authToken = globalData.authToken;
        const that = this;
        util.http(url,{authToken,vfId},(res) => {
            let baseEmergency = res.object;
            if(baseEmergency && baseEmergency != null) {
                if(baseEmergency.currentAddress) {
                    baseEmergency.currentAddress =JSON.parse(baseEmergency.currentAddress)
                }
                that.setData({
                    baseEmergency
                })
            }

        })
    },
    saveInfo() {
        const globalData = app.globalData;
        const url =  globalData.httpBase+'/hzgjVisaFile/saveContactInfo';
        let baseEmergency = this.data.baseEmergency;
        const vfId = globalData.baseApplication.vfId;
        const id = this.data.baseEmergency.id;
        const authToken = globalData.authToken;
        var err=util.check(baseEmergency,rules);
        if(!err.isCheck){
            this.showTopTips(err.errmsg);
            return;
        }
        Object.assign(baseEmergency,{
            vfId,
            authToken
        })
        if(baseEmergency.sameHouse == '是') {
            baseEmergency.currentAddress = '';
        } else{
            baseEmergency.currentAddress =JSON.stringify(baseEmergency.currentAddress)
        }

        util.http(url,baseEmergency,function(res){
            wx.redirectTo({
                url: '../baseApplication/baseApplication'
            })
        })
    }

})