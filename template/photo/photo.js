// template/photo/photo.js
let cropper = require('../welCropper/welCropper.js');

const device = wx.getSystemInfoSync();
const W = device.windowWidth;
const H = device.windowHeight - 50;

Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    properties: {
        imgSrc: {
            type: String,
            value:''
        },
        isCamera:{
            type: Boolean,
            value:false,
            observer:function(newVal, oldVal) {
              if(newVal) {
                this.showAction();
              }
            }
        }        // 属性名
                // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
                 // 属性初始值（可选），如果未指定则会根据类型选择一个

    },

    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染
     */
    data: {
        filePath:'',
        sourceType:['camera'],
        image_photo:[],
        load:false,
        src:'',
        hidden:true
    },
    created: function() {

    },
    attached: function(){
        var that = this;
        // 初始化组件数据和绑定事件
        cropper.init.apply(that, [W, H]);
    },
    moved: function(){},
    detached: function(){},
    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
        //图片选择
        showAction:function(){
            var that=this;

            wx.showActionSheet({
                itemList: ['拍照', '从手机相册选择'],
                success: function(res) {

                    if(res.tapIndex == 0){
                        that.setData({
                            sourceType:['camera']
                        })
                    }else if(res.tapIndex == 1){
                        that.setData({
                            sourceType:['album']
                        })
                    }
                    that.choice();
                },
                fail: function(res) {

                }
            })
        },
        choice: function () {
            var that = this;
            var sourceType=this.data.sourceType;

            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType:sourceType, // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths;
                    const crop = {
                        imgSrc:tempFilePaths[0],
                        hidden:true
                    }
                    that._initEdit(crop);
                    // that.uploadPhoto();
                },
                fail:function(res){

                }
            })
        },
        parsePlace:function (str){
            var strArr =str.split('/');
            return strArr[0];
        },
        //上传图片
        uploadPhoto: function () {
            var that = this;
            that.setData({
                load:true
            });
            wx.uploadFile({
                url: app.globalData.huoLiBase+'upLoadJpg',
                filePath: that.data.image_photo[0],
                header: {"Content-Type": "multipart/form-data"},
                name: 'passport',
                // formData: {
                //
                // },
                success: function (res) {

                    if(res.statusCode !== 200) {
                        that.setData({
                            load:false
                        });
                        wx.showModal({
                            title:'解析出错,请上传符合规格的图片',
                            showCancel:false
                        });
                        return;
                    }
                    var data = JSON.parse(res.data);
                    if(data.code === 200){

                        data.object.huIssueplace=that.parsePlace(data.object.huIssueplace);
                        wx.redirectTo({
                            url:'../addpassport/addpassport?isScanning=true&passport='+JSON.stringify(data.object)
                        });
                    }else{
                        wx.showModal({
                            title:'解析出错,请上传符合规格的图片',
                            showCancel:false
                        })
                    }
                },

                fail:function(err){

                },
                complete:function(){
                    that.setData({
                        load:false
                    });
                }
            })
        },
        _initEdit(crop) {
            this.triggerEvent("initEdit",crop);

        }
    }
})