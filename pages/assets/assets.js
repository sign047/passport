// pages/assets/assets.js
var util = require('../../utils/util');
var wxRequest = require('../../utils/wxRequest');
var app = getApp();
const device = wx.getSystemInfoSync();
const W = device.windowWidth;
const H = device.windowHeight - 50;
let cropper = require('../../template/welCropper/welCropper.js');

Page({
    data: {
        pageType:'propertyImg',
        picType: 3,
        showImage:[],
        count:'',
        cropperData: {
            hidden: true
        }
    },
    onLoad:function(options) {
        var that = this;
        // 初始化组件数据和绑定事件
        cropper.init.apply(that, [W,H,app]);
        this.getPicUrl()
    },
    onShow() {
        if(app.globalData.isPre){
            try {
                var showImage = wx.getStorageSync('showImage')
                app.globalData.isPre = false
                if (showImage) {
                    that.setData({
                        showImage
                    })
                    console.log(this.data.showImage)
                }
            } catch (e) {

            }

        }
    },
    showPreview(e) {
        const showIndex = e.currentTarget.dataset.index
        const { showImage, pageType}= this.data
        app.globalData.cropImg = {showIndex,showImage,pageType}
        wx.navigateTo({
            url: '/pages/preview/preview'
        })
    },
    savePic() {
        const that = this;
        const globalData = app.globalData;
        const file = globalData.currentFile;
        const url = globalData.httpBase+'/hzgjVisaFile/savePicToDB';
        const authToken = globalData.authToken;
        const vfId = globalData.currentFile.id;
        const picType = this.data.picType;
        const showIndex = this.data.showIndex;
        let cropperData = this.data.cropperData;
        let showImage = this.data.showImage;
        if(showImage.length <= 0) {
            return;
        }
        const picUrl = JSON.stringify(showImage);
        util.http(url,{picType,vfId,authToken,picUrl},function(res) {
            cropperData.hidden = true;
            if(showImage.length >= 1) {
                app.globalData.currentFile.propertyStatus = 1;
            }
            that.setData({
                cropperData
            })
            wx.navigateBack({
                delta: 1
            })
        })
    },
    getPicUrl() {
        const that = this;
        const url = app.globalData.httpBase+'/hzgjVisaFile/getPicUrl';
        const data= app.globalData;
        const authToken = data.authToken;
        const vfId = data.currentFile.id;
        const picType = this.data.picType;
         if(vfId == -1) return;
        util.http(url,{picType,vfId,authToken},function(res) {

            let data = res.object[0];
            let showImage;
            if(data) {
                showImage = JSON.parse(data.picUrl);
            }else{
                showImage = [];
            }

            that.setData({
                showImage
            })
        })
    }
})