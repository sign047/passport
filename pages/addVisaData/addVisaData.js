var util = require('../../utils/util');
var wxApi = require('../../utils/wxApi');
var wxRequest = require('../../utils/wxRequest');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     hideCard:false,
     visaFiles:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  hideCard() {
    this.setData({
        hideCard:true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      const that = this;
      app.login(that.isNeedSynchronize)
  },
  showRedDot() {
      let RedDot = wx.getStorageSync('RedDot')
      if(!RedDot) {
          wx.setStorageSync('RedDot', true)
      }
      wx.hideTabBarRedDot({
          index:1
      })
  },
  toEditFile(e) {
      let file = e.currentTarget.dataset.file;
      if(file.step == 3){
          file.moveStep = 2;
      }else{
          file.moveStep = file.step;
      }
      app.globalData.currentFile = file;
      wx.navigateTo({
          url: `../dataProgress/dataProgress`
      })
  },
  inList(list,id) {
        for(let i =0;i<list.length;i++) {
            let item = list[i]
            if(item.visaFileDesc == id) {
                return i
            }
        }
        return false
  },
  getVisaFiles(authToken) {
      const that =this;
      const url = app.globalData.httpBase+'/hzgjVisaFile/getVisaVF';
      const num = app.globalData.currentNumber;
      util.http(url,{authToken},function(res){
         let visaFiles = res.object;
          visaFiles.sort((visa1,visa2) => {
              return visa2.createTime - visa1.createTime
          })
         if(num && visaFiles!== undefined && visaFiles !== []) {
            let index = that.inList(visaFiles,num)
            if(index) {
                const catchItem = visaFiles[index]
                visaFiles[index] = visaFiles[0]
                visaFiles[0] = catchItem
            }
         }
         that.setData({
             visaFiles
         })
      })
  },
  saveVisaFile(authToken) {
    const that = this;
    const url = app.globalData.httpBase+'/hzgjVisaFile/saveVisaFile'
      util.http(url,{authToken},function(res){
           if(res.code == 200) {
               that.getVisaFiles(authToken)
           }
      })
  },
  isNeedSynchronize(load) {
      if(load) return;
      const that = this;
      const url = app.globalData.httpBase+'/hzgjVisaFile/isNeedSynchronize';
      const authToken=app.globalData.authToken;
      util.http(url,{authToken},function(res){
         const flag = res.object.isNeedSynchronize;
         if(flag) {
            that.saveVisaFile(authToken)
         }else{
            that.getVisaFiles(authToken)
         }
      })
  },
  toNewFile(res) {
      app.login((load) => {
          if(load) {
              return
          }
          app.globalData.currentFile = {
          accountBookStatus: null,
          applicationStatus: null,
          headStatus: null,
          id: -1,
          idCardStatus: 0,
          marriageStatus: null,
          propertyStatus: null,
          step:0,
          moveStep:0,
          visaFileDesc: "",
          visaFileName: "",
          visaFileUserName: null
      }
          app.globalData.application = {
          basicStatus: 0,
          contactStatus: 0,
          familyStatus: 0,
          humessageStatus: 0,
          id: '',
          vfId: ''
      }
          wx.navigateTo({
          url: `../visaFiles/visaFiles?isNew=true`
      })
    })
  }

})