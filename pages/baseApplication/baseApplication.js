// pages/baseApplication/baseApplication.js
const app = getApp();
var util=require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     huNum: '',
     fileName: '',
     application:{
       basicStatus:0,
       familyStatus:0,
       contactStatus:0,
       humessageStatus:0
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  getApplication() {
      const that = this;
      const globalData = app.globalData;
      const url=globalData.httpBase+'/hzgjVisaFile/getApplication';
      const authToken = globalData.authToken;
      const vfId = globalData.currentFile.id;
      const json = {
          authToken,
          vfId
      }

      util.http(url,json,(res) => {
          let application = res.object;
          let globalData = app.globalData;
          if(application !== null) {
              if (application.basicStatus == 1
                  && application.contactStatus == 1
                  && application.familyStatus == 1 && application.humessageStatus == 1) {
                  globalData.currentFile.applicationStatus = 1;
              }
              app.globalData.baseApplication = application;
          }else{
              application =  app.globalData.baseApplication;
          }

          const huNum = globalData.currentFile.visaFileDesc;
          const fileName = globalData.currentFile.visaFileName;
          this.setData({
              huNum,
              application,
              fileName
          })
      })
  },
  onShow() {
      this.getApplication();
  },
  toChild(e) {
      const name = e.currentTarget.dataset.name;
      wx.redirectTo({
          url:`../${name}/${name}`
      })
  }
})