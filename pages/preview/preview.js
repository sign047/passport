// pages/crop/crop.js
var util = require('../../utils/util');
var wxRequest = require('../../utils/wxRequest');
var app = getApp();
const device = wx.getSystemInfoSync();
const W = device.windowWidth;
const H = device.windowHeight - 50;
let cropper = require('../../template/welCropper/welCropper.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageType: '',
    picType: '',
    showImage: [],
    current:'',
    showPre:true,
    cropperData: {
       hidden: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 初始化组件数据和绑定事件
    cropper.init.apply(that, [W, H, app]);

    this.showPreviews()
  },
  onShow() {
      // this.showPreviews()
  }
})