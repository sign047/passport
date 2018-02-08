var util = require('../../utils/util');
var wxRequest = require('../../utils/wxRequest');
var app = getApp();
const device = wx.getSystemInfoSync();
const W = device.windowWidth;
const H = device.windowHeight - 50;
let cropper = require('../../template/welCropper/welCropper.js');
Page({
    data:{
        pageType:'passport'
    },
    onLoad:function() {
        var that = this;
        // 初始化组件数据和绑定事件
        cropper.init.apply(that, [W,H,app]);
    },
    goCamera() {
        wx.navigateTo({
            url:'/pages/camera/camera'
        })
    }
});