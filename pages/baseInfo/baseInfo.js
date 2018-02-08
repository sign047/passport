// pages/baseInfo/baseInfo.js
const pinyin = require('../../utils/pinyin.js');
var util=require('../../utils/util');
var app=getApp();
 const rules= [
    {name: 'lastName',errmsg: '请填写姓氏',baseTxt:'',regErrTxt:'请输入正确的中文姓氏',regExp:/^([\u4E00-\u9FA5])*$/},
    {name: 'firstName',errmsg: '请填写名字',regErrTxt:'请输入正确的中文名字',baseTxt:'',regExp:/^([\u4E00-\u9FA5])*$/},
    {name: 'lastNamePY',errmsg: '请填写姓氏拼音',baseTxt:''},
    {name: 'firstNamePY', errmsg: '请填写名字拼音',baseTxt:''},
    {name: 'bornDate', errmsg: '请选择出生日期', baseTxt: ''},
    {name: 'maritalStatus', errmsg: '请选择婚姻状况',baseTxt:''},
    {name: 'bornProvince', errmsg: '请选择出生省份',baseTxt:''}];
Page({
    data: {
        baseInfo:{
            lastName: '',
            firstName: '',
            lastNamePY: '',
            firstNamePY: '',
            lastNamed:'',
            firstNamed: '',
            lastNamPYed: '',
            firstNamePYed: '',
            lastNamed1: '',
            lastNamed2: '',
            lastNamePYed1: '',
            lastNamePYed2: '',
            sex: '男',
            bornDate: '',
            bornProvince: '',
            maritalStatus: '未婚',
            everName: '无'
        },
        showTopTip:false,
        everName:['有','无'],
        sex: ['男','女'],
        bornProvince:['北京市','天津市','上海市','重庆市','河北','山西','辽宁','吉林','黑龙江','江苏','浙江','安徽','福建','江西','山东','河南','湖北','湖南','广东','海南','四川','贵州','云南','陕西','甘肃','青海','台湾','内蒙古自治区','广西壮族自治区','西藏自治区','宁夏回族自治区','新疆维吾尔自治区','香港特别行政区','澳门特别行政区'],
        maritalStatus:['已婚','未婚','离异']
},
/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
    const isEdit = app.globalData.baseApplication.basicStatus;
    if(isEdit) {
        this.getInfo();
    }

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
inputChange(e) {
    const name = e.currentTarget.dataset.name;
    let value = e.detail.value;
    value = value.toUpperCase();
    this.setChange(name,value)
},
txtToPy(e){
    var char = e.detail.value;
    let baseInfo = this.data.baseInfo;
    const name = e.currentTarget.dataset.name;
    char = char && char.trim();
    if(!char) {
        baseInfo[name] = '';
        this.setData({
            baseInfo
        })
    };

    let pinyinText = '';
    if (char.length >= 1) {
        for (var i = 0; i < char.length; i++) {
            let item = char[i];
            if (pinyin.hasOwnProperty(item)) {

                pinyinText += pinyin[item][0]

            }else{
                pinyinText = '';
                break;
            }
        }
        if(pinyinText){
            pinyinText = pinyinText.toUpperCase();
            if(name == 'lastNamed') {
                baseInfo['lastNamPYed'] = pinyinText;
            } else if(name == 'firstNamed') {
                baseInfo['firstNamPYed'] = pinyinText;
            }else{
                baseInfo[`${name}PY`] = pinyinText;
            }

        }

        baseInfo[name] = char;

        this.setData({
            baseInfo
        })
    }
},
bindDataChage(e) {
    const value = e.detail.value;
    const name = e.currentTarget.dataset.name;
    this.setChange(name,value)
},
setChange(name,changedVal) {
    let baseInfo = this.data.baseInfo;
    baseInfo[name] = changedVal;
    this.setData({
        baseInfo
    })
},
statusChange(e) {
    const value = e.detail.value;
    const name = e.currentTarget.dataset.name;
    let data= this.data;
    const changedVal = data[name][value];
    this.setChange(name,changedVal);
},
getInfo() {
    const globalData = app.globalData;
    const url =  globalData.httpBase+'/hzgjVisaFile/getBasicInfo';
    const vfId = globalData.baseApplication.vfId;
    const authToken = globalData.authToken;
    const that = this;
    util.http(url,{authToken,vfId},(res) => {
        let baseInfo = res.object;
    if(baseInfo) {
        baseInfo.bornDate = util.parseDate(baseInfo.bornDate);
        if( baseInfo.lastNamed ){
            baseInfo.everName = '有'
        }else{
            baseInfo.everName = '无'
        }
    }
    that.setData({
        baseInfo
    })
})
},
saveInfo() {
    const globalData = app.globalData;
    const url =  globalData.httpBase+'/hzgjVisaFile/saveBasicInfo';
    let baseInfo = this.data.baseInfo;
    const vfId = globalData.baseApplication.vfId;
    const id = this.data.baseInfo.id;
    const authToken = globalData.authToken;
    Object.assign(baseInfo,{
        vfId,
        authToken
    })
    var err=util.check(baseInfo,rules);
    if(!err.isCheck){
        this.showTopTips(err.errmsg);
        return;
    }
    util.http(url,baseInfo,function(res){
        wx.redirectTo({
            url: '../baseApplication/baseApplication'
        })
    })
}
})