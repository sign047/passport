var util=require('../../utils/util');
var app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sex:['男','女'],
        sexIndex:0,
        tabArr:['我','配偶','孩子','父母','亲戚','朋友'],
        huBoth:'请选择你的出生年月',
        huCreateTime:'请选择你的护照签发日期',
        huExpireTime:'请选择你的护照有效期',
        huBirthPlace:['北京','天津','上海','重庆','河北','山西','辽宁','吉林','黑龙江','江苏','浙江','安徽','福建','江西','山东','河南','湖北','湖南','广东','海南','四川','贵州','云南','陕西','甘肃','青海','台湾','内蒙古','广西','西藏','宁夏','新疆','香港','澳门'],
        isScanning:false,
        isEdit:false,
        fromVisaFile: false,
        showTopTips:false,
        oldHuNum:'',
        errTxt:'',
        sendPass:{},
        passport:{
            huNumber:'',
            huName:'',
            huPinYin:'',
            huSex:'男',
            huBirthPlace: '请选择你的出生地',
            huBoth:'请选择你的出生年月',
            huIssuePlace:'请输入你的护照签发地',
            huCreateTime:'请选择你的护照签发日期',
            huExpireTime:'请选择你的护照有效期',
            huTag:'我'
        }
    },
    onLoad: function (options) {
        var data=this.data;
        if(options.isScanning === 'true' || options.isScanning !== undefined ||
            options.passport !== undefined||options.isEdit === 'true'
            || options.isEdit !== undefined){

            var list=JSON.parse(options.passport);
            var lastTime = util.matchTime(list.huExpireTime, 1);
            var huExpireTime = util.toDate(list.huExpireTime);
            var huCreateTime = util.toDate(list.huCreateTime);
            var huBoth = util.toDate(list.huBoth);
            var sendPass={};
            if(options.isScanning === 'true' ){
                sendPass=JSON.parse(options.passport);
                let huBirthPlace
                if(sendPass.huBirthPlace){
                   huBirthPlace = sendPass.huBirthPlace.split('/')[0]
                }else{
                    huBirthPlace = '';
                }
                sendPass =Object.assign(sendPass,{
                    'huExpireTime':util.toDate3(sendPass.huExpireTime),
                    'huCreateTime':util.toDate3(sendPass.huCreateTime),
                    'huBoth'      :util.toDate3(sendPass.huBoth),
                    'huBirthPlace':huBirthPlace,
                    'huIssuePlace':sendPass.huIssueplace
                });
            }
            if(options.isEdit === 'true'){
                sendPass=JSON.parse(options.passport);
                huExpireTime=util.toDate4(list.huExpireTime);
                huCreateTime=util.toDate4(list.huCreateTime);
                huBoth=util.toDate4(list.huBoth);
                this.data.oldHuNum=sendPass.huNumber;
                if(list.huBirthPlace == null || list.huBirthPlace == 'null') {
                    list.huBirthPlace = '请选择你的出生地'
                }
            }
            var pass=Object.assign({},list,{huExpireTime,huCreateTime,huBoth});
            if(pass.huIssueplace){
                pass.huIssuePlace=pass.huIssueplace;

            }
            if(pass.huBirthPlace){
                pass.huBirthPlace = pass.huBirthPlace.split('/')[0];
            }else{
                pass.huBirthPlace = '请选择你的出生地'
            }
            var index= pass.huSex === '男'? 0 :1;
            var sex=data.sex[index];
            const fromVisaFile = options.fromVisaFile ?options.fromVisaFile:false
            const isScanning = options.isScanning ?options.isScanning:false
            this.setData({
                passport: pass,
                huExpireTime: huExpireTime,
                huCreateTime: huCreateTime,
                huBoth: huBoth,
                sexIndex:index,
                sendPass:sendPass,
                huSex: list.huSex,
                lastTime: lastTime,
                isEdit:options.isEdit,
                fromVisaFile:fromVisaFile,
                isScanning:isScanning
            })
        }
        // this.setval('huSex',sex);
    },
    changePlace(e) {
        const value = e.detail.value;
        const name = e.currentTarget.dataset.name;
        let data= this.data;
        const changedVal = data[name][value];
        this.setval(name,changedVal);
    },
    bindCity:function(e){
        var value=util.trim(e.detail.value);
        this.setval('huIssuePlace',value);
        this.setval('huIssueplace',value)
    },
    bindName:function(e){
        var kind= e.currentTarget.dataset.kind;
        var value=util.trim(e.detail.value);
        this.setval('huName',value);
        return {
            value:value
        }
    },
    bindNum:function(e){
        var kind= e.currentTarget.dataset.kind;
        var value=util.trim(e.detail.value.toUpperCase());
        if(kind === '1'){
            this.setval('huNumber',value);
        }else if(kind === '2'){
            this.setval('huPinYin',value);
        }

        return {
            value:value
        }
    },

    bindDateChange: function(e) {
        var that=this;
        var sendPass=that.data.sendPass;
        var val=e.detail.value.split('-');
        var time=`${val[0]}年${val[1]}月${val[2]}日`;
        var value=e.detail.value;
        var kind= e.currentTarget.dataset.kind;
        var passport=this.data.passport;
        switch(kind){
            case '1':
                if(util.compareTime('huBoth',value,that)){
                    this.setval('huBoth',value);
                    this.setData({
                        huBoth:time
                    });
                }

                break;
            case '2':
                if(util.compareTime('huCreateTime',value,that,sendPass['huExpireTime'])){
                    this.setval('huCreateTime',value);
                    this.setData({
                        huCreateTime:time
                    });
                }

                break;
            case '3':
                if(util.compareTime('huExpireTime',value,that,sendPass['huCreateTime'])){
                    this.setval('huExpireTime',value);
                    this.setData({
                        huExpireTime:time
                    });
                }
                break;
        }

    },
    setval:function(name,val){
        var passport=this.data.passport;
        var sendPass=this.data.sendPass;
        passport[name]=val;
        sendPass[name]=val;
        this.setData({
            passport:passport,
            sendPass:sendPass
        })
    },
    bindSexChange: function(e) {
        this.setData({
            sexIndex: e.detail.value
        });
        var data=this.data;
        var sex=data.sex[data.sexIndex];
        this.setval('huSex',sex);
    },
    radioChange: function(e) {
        var value=e.detail.value;
        this.setval('huTag',value);
    },
    //保存编辑
    saveEdit:function(){
        var send=this.data.sendPass,
            url=app.globalData.huoLiBase+'updatePassPort',
            authToken=app.globalData.authToken,
            hId=send.id;
        var data={
            authToken:authToken,
            huName:send.huName,
            huPinYin:send.huPinYin,
            huIssuePlace:send.huIssuePlace,
            huBirthPlace:send.huBirthPlace,
            huSex:send.huSex,
            huCreateTime:send.huCreateTime,
            huExpireTime:send.huExpireTime,
            huBoth:send.huBoth,
            hId:hId};
        if(this.data.oldHuNum != send.huNumber){
            data['huNumber']=send.huNumber;
        }
        var err=util.check(send);
        if(!err.isCheck){
            this.showTopTips(err.errmsg);
            return;
        }
        util.http(url,data,function(){
            wx.redirectTo({
                url: '../passport/passport?id='+hId
            })
        });
    },
    //保存扫描
    saveScan:function(){
        var that=this;
        wx.showModal({
            title: '提示',
            content:'证件扫描结果可能存在失误，请你仔细核对。确认信息正确并提交？',
            cancelText:'再看看',
            cancelColor:'#b5bfcc',
            confirmColor:'#485465',
            success: function (res) {
                if (res.confirm) {
                    that.savePass();
                } else if (res.cancel) {

                }
            }
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
    //保存护照
    savePass:function(){
        const that = this;
        var url=app.globalData.huoLiBase+'savePassPort';
        var data=this.data;
        var passport=data.passport;
        if(data.isScanning === 'true' || data.isEdit === 'true'){
            passport=data.sendPass;
        }
        var authToken=app.globalData.authToken;
        passport.authToken=authToken;
        var err=util.check(passport);
        if(!err.isCheck){
            this.showTopTips(err.errmsg);
            return;
        }

        util.http(url,passport,function(data){
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
            } else {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000,
                    complete:function(){
                        if(that.data.fromVisaFile){
                            app.globalData.currentFile.id=data.object.huVFId;
                            app.globalData.currentFile.step =1;
                            app.globalData.currentFile.moveStep =0;
                            wx.redirectTo({
                                url:`../visaFiles/visaFiles?isVisaData=true&huVFId=${data.object.huVFId}`
                            });
                        }else{
                            if (!app.hasPhone()) {
                                wx.redirectTo({
                                    url:`../login/login?id=${data.object.huMessageId}`
                                });
                            }else{
                                // wx.redirectTo({
                                //     url: `../passport/passport?id=${data.object}`
                                // });
                                wx.switchTab({
                                    url: '../passportList/passportList'
                                })
                            }
                        }

                    }
                });
            }
        });
    }
});