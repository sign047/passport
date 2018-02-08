// pages/baseHome/baseHome.js
var util=require('../../utils/util');
var app=getApp();
const rules= [
    {name: 'currentAddress',errmsg: '请填写现居省市',baseTxt:''},
    {name: 'detailedAddress',errmsg: '请填写详细地址'},
    {name: 'phone',errmsg: '请填写手机',baseTxt:'',regErrTxt:'请输入正确的手机号码',regExp:/^0?(13|15|18|14|17)[0-9]{9}$/},
    {name: 'occupationalStatus', errmsg: '请填写职业状态',baseTxt:''}]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        occupationalStatus:['在职','待业'],
        isEdit:false,
        showTopTip:false,
        baseHome:{
            currentAddress:['北京市','北京市','朝阳区'],
            detailedAddress:'',
            phone: '',
            occupationalStatus: '在职',
            companyName: '',
            occupationalName: '',
            companyAddress: ['北京市','北京市','朝阳区'],
            detailedCompanyAddress: '',
            companyPhone: ''
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const isEdit = app.globalData.baseApplication.familyStatus;
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
    getInfo() {
        let globalData = app.globalData;
        const url =  globalData.httpBase+'/hzgjVisaFile/getFamilyInfo';
        const vfId = globalData.baseApplication.vfId;
        const authToken = globalData.authToken;
        util.http(url,{authToken,vfId},(res) => {
            let baseHome = res.object;
            if(baseHome.currentAddress){
                baseHome.currentAddress = JSON.parse(baseHome.currentAddress);
            }
            if(baseHome.companyAddress){
                baseHome.companyAddress = JSON.parse(baseHome.companyAddress);
            }
            this.setData({
                baseHome
            })
        })
    },
    saveInfo() {
        const globalData = app.globalData;
        const url =  globalData.httpBase+'/hzgjVisaFile/saveFamilyInfo';
        let baseHome = this.data.baseHome;
        const vfId = globalData.baseApplication.vfId;
        const id = this.data.baseHome.id;
        const authToken = globalData.authToken;
        var err=util.check(baseHome,rules);
        if(!err.isCheck){
            this.showTopTips(err.errmsg);
            return;
        }
        if(baseHome.occupationalStatus != '在职'){
            baseHome.companyAddress = '';
        }else{
            baseHome.companyAddress = JSON.stringify(baseHome.companyAddress);
        }
        baseHome.currentAddress = JSON.stringify(baseHome.currentAddress);
        Object.assign(baseHome,{
            vfId,
            authToken
        })
        if(id) {
            baseHome.id = id
        }
        util.http(url,baseHome,function(res){
            globalData.basicStatus =1;
            wx.redirectTo({
                url: '../baseApplication/baseApplication'
            })
        })
    },
    bindOccupation(e) {
        const name = e.currentTarget.dataset.name;
        const value = e.detail.value;
        let data = this.data;
        let baseHome = data.baseHome;
        if(value == 1){
           Object.assign(baseHome,{
               companyName: '',
               occupationalName: '',
               detailedCompanyAddress: '',
               companyPhone: ''
           })
        }
        baseHome[name] = data[name][value];
        this.setData({
            baseHome
        })
    },
    setChange(name,changedVal) {
        let baseHome = this.data.baseHome;
        baseHome[name] = changedVal;
        this.setData({
            baseHome
        })
    },
    statusChange(e) {
        const value = e.detail.value;
        const name = e.currentTarget.dataset.name;
        this.setChange(name,value);
    }
})