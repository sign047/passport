// pages/visaFiles/visaFiles.js
var util = require('../../utils/util');
var wxRequest = require('../../utils/wxRequest');
var app = getApp();
const device = wx.getSystemInfoSync();
const W = device.windowWidth;
const H = device.windowHeight - 50;
let cropper = require('../../template/welCropper/welCropper.js');
Page({
    data: {
        pageType: 'passportShow',
        showImage: [],
        picType: 5,
        cropperData: {
            hidden: true
        },
        currentFile: [],
        temHidden:true,
        hideLoading:false,
        statusArr: [{
            txt: '护照首页',
            isOk: true
        }, {
            txt: '基础资料',
            isOk: false
        }, {
            txt: '选填资料',
            isOk: false
        }
        ]
    },
    getPicUrl() {
        const that = this;
        const url = app.globalData.httpBase + '/hzgjVisaFile/getPicUrl';
        const data = app.globalData;
        const authToken = data.authToken;
        const vfId = data.currentFile.id;
        const picType = this.data.picType;

        util.http(url, {picType, vfId, authToken}, function (res) {
            let data = res.object[0];
            const showImage = [data.picUrl];
            that.setData({
                showImage
            })
        })
    },
    onLoad:function(options) {
        var that = this;
        // 初始化组件数据和绑定事件
        setTimeout(() => {
            cropper.init.apply(that, [W,H,app]);
        },20)


    },
    showPreview(e) {
        const showIndex = e.currentTarget.dataset.index
        const { showImage, pageType}= this.data
        app.globalData.cropImg = {showIndex,showImage,pageType}
        app.globalData.isPre = true;
        setTimeout(() =>{
            wx.navigateTo({
                url: '/pages/preview/preview'
            })
        },20)

    },

    onShow() {
        if(app.globalData.currentFile.id !== -1 && this.data.showImage <= 0) {
            this.getPicUrl();
        }
        const currentFile = app.globalData.currentFile;
        if(currentFile.step == 1){
            if(currentFile.applicationStatus == 1 &&
                currentFile.accountBookStatus == 1
                && currentFile.idCardStatus ==1 && currentFile.headStatus == 1) {
                app.globalData.currentFile.step = 2;
                app.globalData.currentFile.moveStep = 2;
            }
        }
        if(currentFile.step == 2){
            if(currentFile.marriageStatus === 1 && currentFile.propertyStatus === 1){
                wx.switchTab({
                    url: '/pages/addVisaData/addVisaData'
                })
            }
        }
        if(currentFile.id < 0) {
            app.globalData.currentFile.moveStep = 0;
            app.globalData.currentFile.step = 0;
        }
        this.changeStatus(currentFile.moveStep,currentFile.step,1)

        this.setData({
            currentFile
        })
    },
    changeStatus(step,num,type) {
        let statusArr = this.data.statusArr;
        if( num >= statusArr.length) {
            num = statusArr.length -1
        }
        statusArr = statusArr.map((item, index) => {

            if(num > step) {
                if(type == 2) {
                    return item;
                }else{
                    if(index !== num){
                        item.isOk = false
                    }
                    if (index === step) {
                        item.isOk = true
                    }
                }

            }
            if(num <= step){
                if(index !== num){
                    item.isOk = false;}
                if (index === num) {
                    item.isOk = true
                    app.globalData.currentFile.moveStep = num;

                }
            }
            return item
        })

        this.setData({
            statusArr
        })

    },
    changeTab(event) {
        const num = event.currentTarget.dataset.id;
        const currentFile = this.data.currentFile;
        this.changeStatus(currentFile.step,num,2);
    }
})