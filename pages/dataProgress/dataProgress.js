// pages/dataProgress/dataProgress.js
const app = getApp()
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      currentFile:{},
      vfId:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var vfId = options.vfId
      if(vfId){
          this.setData({
              vfId
          })
      }
  },
  setStatus(file) {
      let currentFile
      if(file){
          if(file.step == 3){
              file.moveStep = 2;
          }else{
              file.moveStep = file.step;
          }
          currentFile = file
          app.globalData.currentFile = file;
      }else{
         currentFile = app.globalData.currentFile
      }
      const bases =[
          { txt: '身份证', isOk: currentFile.idCardStatus},
          { txt: '户口本', isOk: currentFile.accountBookStatus},
          { txt: '照片', isOk: currentFile.headStatus },
          { txt: '申请表', isOk: currentFile.applicationStatus }
      ]
      const choices = [
          { txt: '固定资产', isOk: currentFile.propertyStatus },
          { txt: '婚姻状况', isOk: currentFile.marriageStatus }
      ]
      this.setData({
          bases,choices,currentFile
      })
  },
  onShow: function () {
    const vfId = this.data.vfId;
    if(vfId){
       this.getVf(vfId)
    }else{
       this.setStatus()
    }
  },
  getVf(vfId) {
      var that = this;
      var url = app.globalData.httpBase + '/hzgjVisaFile/getVisaVFById';
      var authToken = app.globalData.authToken;
      util.http(url, {authToken: authToken,vfId},(data) => {
          let {code, object} = data;
          if(code == 200) {
              that.setStatus(object);
          }
      })
  },
  toEditFile() {
      wx.navigateTo({
          url: `../visaFiles/visaFiles`
      })
  }

})