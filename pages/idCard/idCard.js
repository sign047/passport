var util = require('../../utils/util');
var wxRequest = require('../../utils/wxRequest');
var app = getApp();
const device = wx.getSystemInfoSync();
const W = device.windowWidth;
const H = device.windowHeight - 50;
let cropper = require('../../template/welCropper/welCropper.js');

Page({
    data: {
        pageType:'idCardImg',
        picType: 0,
        showImage:['http://7xl2r0.com1.z0.glb.clouddn.com/passport/idcard.png','http://7xl2r0.com1.z0.glb.clouddn.com/passport/idcard2.png'],
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
    onShow(){
        const that = this;
        if(app.globalData.isPre){
            app.globalData.isPre = false
            try {
                var showImage = wx.getStorageSync('showImage')

                if (showImage) {
                    that.setData({
                        showImage
                    })
                }
            } catch (e) {

            }

        }
    },
    showPreview(e) {
        const showIndex = e.currentTarget.dataset.index
        const showImage= this.data.showImage
        const pageType = this.data.pageType;
        app.globalData.cropImg = {showIndex,showImage,pageType}
        setTimeout(() => {
            wx.navigateTo({
                url: '/pages/preview/preview'
            })
        },80)

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
        if(vfId === -1){
            wx.showToast({
                title: '请先上传护照首页',
                icon: "none",
                duration: 2000,
                complete:function() {
                    setTimeout(() => {
                        app.globalData.currentFile.moveStep = 0;
                        app.globalData.currentFile.step = 0;
                        wx.navigateBack({
                            delta:1
                        })
                    },1000)

                }
            })
            return
        }
        const picUrl = JSON.stringify(showImage);
        util.http(url,{picType,vfId,authToken,picUrl},function(res) {
            cropperData.hidden = true;
            if(showImage.length >= 2) {
                app.globalData.currentFile.idCardStatus = 1;
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
        util.http(url,{picType,vfId,authToken},function(res) {
            let data = res.object[0];
            let jsonStr = data ? data.picUrl : ''
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