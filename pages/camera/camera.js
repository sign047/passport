// camera.js
var app = getApp();
const device = wx.getSystemInfoSync();
const W = device.windowWidth;
const H = device.windowHeight;
console.log(device);
let cropper = require('../../template/welCropper/welCropper.js');
Page({
  data:{
    pageType: 'passport'
  },
  onLoad: function () {
    var that = this;
    // 初始化组件数据和绑定事件
    cropper.init.apply(that, [W, H, app]);
  },
  album() {
    this.choice()
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    const that= this
    ctx.takePhoto({
      quality: 'high',
      success: ({tempImagePath}) => {
        that.showCropper({
          src: tempImagePath,
          mode: 'quadrectangle',
          sizeType: ['compressed']
        }
        )
      },
      fail:(err) => {
        console.log(err);
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }
})