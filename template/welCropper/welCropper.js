// 获取选中区域的(x, y, w, h)
const getCropRect = (cropperMovableItems) => {
    let maxX = 0, maxY = 0
    for (let key in cropperMovableItems) {
        let item = cropperMovableItems[key]
        maxX = item.x > maxX ? item.x : maxX
        maxY = item.y > maxY ? item.y : maxY
    }

    let minX = maxX, minY = maxY
    for (let key in cropperMovableItems) {
        let item = cropperMovableItems[key]
        minX = item.x < minX ? item.x : minX
        minY = item.y < minY ? item.y : minY
    }
    return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY
    }
}

const getRandomStr = function (len) {
    var data=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var result="";
    for(var i=0;i<len;i++){
        var r=Math.floor(Math.random()*data.length);
        if(r>data.length-1) {
            r = data.length;
        }
        result+=data[r];
    }

    return result;
}

// 获取适应屏幕的图片显示大小
const getAdjustSize = (W, H, width, height) => {
    if (width > (W)) {
        height = (W) / width * height
        width = W
    }

    if (height > H) {
        width = H / height * width
        height = H
    }

    return {
        width: width,
        height: height
    }
}

// http://www.geeksforgeeks.org/convex-hull-set-1-jarviss-algorithm-or-wrapping/

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {
    var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0;  // collinear
    return (val > 0) ? 1 : 2; // clock or counterclock wise
}

// Prints convex hull of a set of n points.
function convexHull(points, n) {
    // There must be at least 3 points
    if (n < 3) return;

    // Initialize Result
    var hull = [];

    // Find the leftmost point
    var l = 0;
    for (var i = 1; i < n; i++) {
        if (points[i].x < points[l].x) {
            l = i;
        }
    }
    // Start from leftmost point, keep moving
    // counterclockwise until reach the start point
    // again. This loop runs O(h) times where h is
    // number of points in result or output.
    var p = l, q;
    do {
        // Add current point to result
        // Prevent duplicates object
        // if (hull.findIndex(i => i.x == points[p].x && i.y == points[p].y)==-1){
        hull.push(points[p]);
        // }

        // Search for a point 'q' such that
        // orientation(p, x, q) is counterclockwise
        // for all points 'x'. The idea is to keep
        // track of last visited most counterclock-
        // wise point in q. If any point 'i' is more
        // counterclock-wise than q, then update q.
        q = (p + 1) % n;

        for (var i = 0; i < n; i++) {
            // If i is more counterclockwise than
            // current q, then update q
            if (orientation(points[p], points[i], points[q]) == 2)
                q = i;
        }

        // Now q is the most counterclockwise with
        // respect to p. Set p as q for next iteration,
        // so that q is added to result 'hull'
        p = q;

    } while (p != l);  // While we don't come to first
    // point

    // Print Result
    // for (var i in hull) {
    //     var temp = hull[i]
    // }
    return hull
}

function drawImageWithDegree(canvasId, path, width, height, degree,rotate) {
    let ctx = wx.createCanvasContext(canvasId)

    let isVertical = degree % 180 > 0

    let drawWidth = isVertical ? height : width
    let drawHeight = isVertical ? width : height

    let centerX = width / 2
    let cneterY = height / 2

    let drawCenterX = drawWidth / 2
    let drawCneterY = drawHeight / 2

    let d = Math.abs(width - height) / 2

    // ctx.translate(drawCenterX, drawCneterY)
    // ctx.rotate(degree * Math.PI / 180)
    // ctx.translate(-drawCenterX, -drawCneterY)
    if(rotate){
        ctx.translate(centerX, cneterY)
        ctx.rotate(degree * Math.PI / 180)
        ctx.translate(-centerX, -cneterY)
    }


    // ctx.translate(-d, d)
    if (isVertical) {
        if (drawHeight > drawWidth) {
            ctx.drawImage(path, d, -d, drawWidth, drawHeight)
        }
        else {
            ctx.drawImage(path, -d, d, drawWidth, drawHeight)
        }
    }
    else {
        ctx.drawImage(path, 0, 0, drawWidth, drawHeight)
    }

    ctx.draw()
}

const cropperUtil = {
    getCropRect,
    getAdjustSize,
    convexHull,
    drawImageWithDegree,
    getRandomStr
}

var util = require('../../utils/util');
var init = function (W, H,app) {
    let that = this
    that.setData({
        filePath:'',
        sourceType: ['album'],
        image_photo:[],
        load:false,
        showPre:false,
        saveImage:{
            src: '',
            w: '',
            h: '',
            showImage: false
        },
        showIndex:0,
        showImage: [],
        cropperData: {
            hidden: true,
            left: 0,
            top: 0,
            width: W,
            height: H,
            itemLength: 50,
            imageInfo: {
                path: '',
                width: 0,
                height: 0
            },
            scaleInfo: {
                x: 1,
                y: 1
            },
            cropCallback: null,
            sizeType: ['compressed'],    //'original'(default) | 'compressed'
            original: false,  // 默认压缩，压缩比例为截图的0.4
            mode: 'rectangle', //默认矩形
        },
        cropperMovableItems: {
            topleft: {
                x: 50,
                y: 50
            },
            topright: {
                x: W - 50,
                y: 50
            },
            bottomleft: {
                x: 50,
                y: H - 50
            },
            bottomright: {
                x: W - 50,
                y: H - 50
            }
        },
        cropperChangableData: {
            canCrop: true,
            rotateDegree: 0,
            originalSize: {
                width: 0,
                height: 0
            },
            scaleSize: {
                width: 0,
                height: 0
            }
        }
    })
    //图片选择
    that.showAction = function(e){
        var that=this;
        const index= e.currentTarget.dataset.index;
        this.setData({
            showIndex:index
        })

        wx.showActionSheet({
            itemList: ['拍照', '从手机相册选择'],
            success: function(res) {
                if(res.tapIndex == 0){
                    that.setData({
                        sourceType: ['camera']
                    })
                }else if(res.tapIndex == 1){
                    that.setData({
                        sourceType: ['album']
                    })
                }
                that.choice();
            },
            fail: function(res) {

            }
        })
    }
    that.choice=function () {
        var that = this;
        var sourceType=this.data.sourceType;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType:sourceType, // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                that.showCropper({
                    src: tempFilePaths[0],
                    mode: 'quadrectangle',
                    sizeType: ['compressed']}
                )
            },
            fail:function(res){

            }
        })
    }
    that.parsePlace=function (str){
        var strArr =str.split('/');
        return strArr[0];
    }
    that.upLoad = function() {
        let pageType = this.data.pageType;
        let url = app.globalData.huoLiBase+'upLoadJpg';

        if(pageType === 'passport' || pageType === 'passportShow') {
            that.uploadPassport(pageType,url)
        }else{
            url = app.globalData.httpBase+'/hzgjVisaFile/savePic';
            that.uploadPic(pageType,url)
        }
    },
    that.delImage = function() {
        wx.showModal({
            title: '是否删除图片',
            success: function (res) {
                if (res.confirm) {
                    const current = that.data.showIndex;
                    const showImage = JSON.parse(that.data.jsonStr)
                    console.log(showImage)
                    showImage.splice(current, 1);
                    console.log(showImage)
                    that.setData({
                        showImage
                    })
                    console.log(that);
                    that.savePic();
                } else if (res.cancel) {

                }
            }
        })
    },
    that.uploadPic = function(pageType,url) {
        const showIndex = this.data.showIndex;
        const saveImage = that.data.saveImage;
        let showImage = this.data.showImage;
        that.uploadFile(pageType,url).then((res) => {
            if(res.code == 200){
                showImage[showIndex] = res.object;
                that.setData({
                    showImage
                })
                that.hideCropper()
                if(that.data.preHandle) {
                    const pages = getCurrentPages();
                    const previousPage = pages[pages.length-2];
                    const url = previousPage.route;
                    previousPage.setData({
                        showImage
                    })
                    try {
                        wx.setStorageSync('showImage', showImage)
                    } catch (e) {

                    }
                    app.globalData.cropImg.showImage = showImage
                    app.globalData.isPre = true
                    this.setData({
                        preHandle: false
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    },100)

                }
            }
    }).catch((err) => {

          console.log(err);
        })
    }
    that.reload = () => {
        that.hideCropper()
        if(this.data.preHandle){
            that.showPreviews()
        }
    }
    that.uploadFile = function(pageType,url) {
        var that = this;
        const saveImage = that.data.saveImage;
        const random = cropperUtil.getRandomStr(4);
        that.setData({
            load:true
        });
        const huNum = app.globalData.currentFile.visaFileDesc;
        const name = `${huNum}-${pageType}${random}`;
        var pro = new Promise(function(resolve, reject){
            const uploadTask = wx.uploadFile({
                url: url,
                filePath: saveImage.src,
                header: {"Content-Type": "multipart/form-data"},
                name: name,
                // formData: {
                //     'picType': pageType
                // },
                success: function (res) {
                    if(res.statusCode !== 200) {
                        that.setData({
                            load:false
                        });
                        wx.showModal({
                            content: '上传失败'
                        })
                      reject(res);
                    }
                    if(!res.data){
                        wx.showModal({
                            title:'图片太大了,请换图上传',
                            showCancel:false
                        })
                        return;
                    }
                    const data = JSON.parse(res.data);
                    if(data.code === 200){
                      resolve(data);
                    }else{
                        wx.showModal({
                            content: '上传失败'
                        })
                     reject(data);
                    }
                },
                fail:function(err){
                    console.log(err);
                    reject(err);
                },
                complete:function(){
                    that.setData({
                        load:false
                    });
                }
            })
        })
        return pro
    }
    that.preHidden = function() {
        that.setData({
            showPre:false
        })
    }
    //上传图片
    that.uploadPassport = function (pageType,url) {
        this.uploadFile(pageType, url)
        .then((data) => {
            if(data.object && data.object !== null) {
                if(data.object.huIssueplace || data.object.huIssueplace !== null ) {
                    data.object.huIssueplace=that.parsePlace(data.object.huIssueplace);
                }
                const passpoort = JSON.stringify(data.object);
                if(pageType === 'passport') {
                    wx.redirectTo({
                      url: '../addpassport/addpassport?isScanning=true&passport='+passpoort
                    });
                }
                if(pageType === 'passportShow') {
                    wx.redirectTo({
                      url: '../addpassport/addpassport?fromVisaFile=true&isScanning=true&passport='+passpoort
                    });
                }
            }
    })
    .catch((err) => {
            console.log(err);
            wx.showModal({
            title:'解析出错,请上传符合规格的图片',
            showCancel:false
        })
        return;
    })
        var that = this;
        const saveImage = that.data.saveImage;
        that.setData({
            load:true
        });

    }
    that.showPreviews = () => {
       let cropImg = app.globalData.cropImg;
       let { showIndex, showImage, pageType} = cropImg
       that.setData({
           pageType,
           showPre:true,
           preHandle:true,
           showIndex,
           showImage
       })
    }
    // 显示cropper，如果有图片则载入
    that.showCropper = (options) => {
        let that = this
        let src = options.src
        let callback = options.callback
        let sizeType = options.sizeType
        let mode = options.mode
        let filterType = []
        if (sizeType.indexOf('original') > -1) {
            filterType.push('original')
        }
        if (sizeType.indexOf('compressed') > -1) {
            filterType.push('compressed')
        }
        if (filterType.length == 1 && filterType.indexOf('original') > -1) {
            that.data.cropperData.original = true
        }
        if (mode) {
            that.data.cropperData.mode = mode
        }
        that.data.cropperData.hidden = false
        that.data.cropperData.cropCallback = callback
        that.data.cropperData.sizeType = filterType

        that.setData({
            showPre:false,
            cropperData: that.data.cropperData
        })

        if (src) {

            wx.getImageInfo({
                src: src,
                success: function (res) {
                    var w = res.width, h = res.height
                    that.loadImage(src, w, h, false)
                }
            })
        }
    }

    // 隐藏cropper
    that.hideCropper = () => {
        let that = this

        that.data.cropperData.hidden = true
        that.data.cropperData.cropCallback = null

        that.setData({
            saveImage:{
                src:'',
                w:'',
                h:''
            },
            cropperData: that.data.cropperData,
            cropperMovableItems: {
                topleft: {
                    x: -1,
                    y: -1
                },
                topright: {
                    x: -1,
                    y: -1
                },
                bottomleft: {
                    x: -1,
                    y: -1
                },
                bottomright: {
                    x: -1,
                    y: -1
                }
            },
            cropperChangableData: {
                canCrop: true,
                rotateDegree: 0
            }
        })

        that.clearCanvas(that.data.cropperData.imageInfo)
    }

    // 原图按钮被点击
    that.originalChange = () => {
        let that = this
        let imageInfo = that.data.cropperData.imageInfo
        let originalSize = that.data.cropperChangableData.originalSize
        let width = originalSize.width
        let height = originalSize.height
        let original = !that.data.cropperData.original

        let compressedScale = original ? 1.0 : 0.4
        let size = cropperUtil.getAdjustSize(W, H, width, height)
        that.data.cropperData.original = original
        that.data.cropperData.scaleInfo = {
            x: width * compressedScale / size.width,
            y: height * compressedScale / size.height
        }

        // 之所以要设置cropperMovableItems，然后延时在设置一次，是因为改变cropperData后，movable-view会莫名其妙移动到左上角
        let cropperMovableItemsCopy = that.data.cropperMovableItems
        let cropperMovableItems = {
            topleft: {
                x: 0,
                y: 0
            },
            topright: {
                x: 0,
                y: 0
            },
            bottomleft: {
                x: 0,
                y: 0
            },
            bottomright: {
                x: 0,
                y: 0
            }
        }

        that.setData({
            cropperData: that.data.cropperData,
            cropperMovableItems: cropperMovableItems
        })

        setTimeout(() => {
            that.setData({
            cropperMovableItems: cropperMovableItemsCopy
        })
    }, 100)

        that.drawOriginalImage()
    }

    // 截取选中图片，如果有回调，则调用
    that.cropImage = () => {
        let that = this
        let cropperData = that.data.cropperData
        let mode = cropperData.mode
        let scaleInfo = cropperData.scaleInfo
        let width = cropperData.width
        let height = cropperData.height
        let cropperChangableData = this.data.cropperChangableData
        let cropperMovableItems = that.data.cropperMovableItems
        //
        if (mode == 'rectangle' || mode == 'quadrectangle') {
            let maxX = 0, maxY = 0
            for (let key in cropperMovableItems) {
                let item = cropperMovableItems[key]
                maxX = item.x > maxX ? item.x : maxX
                maxY = item.y > maxY ? item.y : maxY
            }

            let minX = maxX, minY = maxY
            for (let key in cropperMovableItems) {
                let item = cropperMovableItems[key]
                minX = item.x < minX ? item.x : minX
                minY = item.y < minY ? item.y : minY
            }

            let w = maxX - minX, h = maxY - minY;

            // w *= scaleInfo.x
            // h *= scaleInfo.y
            // let x = minX * scaleInfo.x, y = minY * scaleInfo.y
            let x = minX/cropperChangableData.scaleSize.width*cropperChangableData.originalSize.width,
            y = minY/cropperChangableData.scaleSize.height*cropperChangableData.originalSize.height
            w = w/cropperChangableData.scaleSize.width*cropperChangableData.originalSize.width
            h = h/cropperChangableData.scaleSize.height*cropperChangableData.originalSize.height
            let ctx = wx.createCanvasContext("originalCanvas")
            wx.showLoading({
                title: '正在截取...'
            })
            wx.canvasToTempFilePath({
                x: x,
                y: y,
                width: w,
                height: h,
                destWidth: w,
                destHeight: h,
                fileType: 'jpg',
                quality: 0.8,
                canvasId: 'originalCanvas',
                success: function (res) {
                    const tempFilePath = res.tempFilePath;
                    wx.hideLoading()
                    wx.getFileInfo({
                        filePath:tempFilePath,
                        success(res) {
                            if(res.size > 1024*1024){
                                wx.showModal({
                                    title:'图片太大了,请换图上传',
                                    showCancel:false
                                })
                                return;
                            }else{
                                let saveImage = {
                                    src:tempFilePath,
                                    w:300,
                                    h:300,
                                    showImage:true
                                }
                                saveImage.src=tempFilePath
                                that.setData({
                                    saveImage
                                })
                            }
                        }
                    })


                },
                fail(res) {
                    wx.hideLoading()
                }
            })
        }
        else {
            let res = [[0, 0], [0, 0], [0, 0], [0, 0]]
            let points = []
            for (let key in cropperMovableItems) {
                let x = Math.ceil(cropperMovableItems[key].x * scaleInfo.x)
                let y = Math.ceil(cropperMovableItems[key].y * scaleInfo.y)


                let index = 0
                if (key == 'topleft') {
                    index = 0
                }
                else if (key == 'bottomleft') {
                    index = 1
                }
                else if (key == 'bottomright') {
                    index = 2
                }
                else if (key == 'topright') {
                    index = 3
                }
                res[index] = [x, y]

                points.push({ x, y })
            }

            cropperUtil.convexHull(points, points.length)

            if (that.data.cropperData.cropCallback) {
                that.data.cropperData.cropCallback(res)
            }
        }
    }

    // 旋转图片
    that.rotateImage = () => {

        let that = this
        let imageInfo = that.data.cropperData.imageInfo
        let width = imageInfo.width
        let height = imageInfo.height
        let rotateDegree = that.data.cropperChangableData.rotateDegree

        rotateDegree = rotateDegree == 360 ? 90 : rotateDegree + 90

        // 判断是否为垂直方向
        let isVertical = rotateDegree % 180 > 0
        let rotateWidth = isVertical ? height : width
        let rotateHeight = isVertical ? width : height

        let size = cropperUtil.getAdjustSize(W, H, rotateWidth, rotateHeight)

        // 适应屏幕的位置
        let left = (W - size.width) / 2
        let top = (H - size.height) / 2
        let cropperData = that.data.cropperData
        cropperData.left = left
        cropperData.top = top
        let cropperChangableData = that.data.cropperChangableData
        cropperChangableData.originalSize = {
            width: rotateWidth,
            height: rotateHeight
        }
        cropperChangableData.scaleSize = {
            width: size.width,
            height: size.height
        }
        cropperChangableData.rotateDegree = rotateDegree

        that.setData({
            cropperChangableData: cropperChangableData,
            cropperData: cropperData
        })

        that.loadImage(imageInfo.path, rotateWidth, rotateHeight, true)


    }

    // 根据图片大小设置canvas大小，并绘制图片
    that.loadImage = (src, width, height, isRotate) => {
        let that = this
        let size = cropperUtil.getAdjustSize(W, H, width, height)
        // 适应屏幕的位置
        let left = (W - size.width) / 2
        let top = (H - size.height) / 2
        // set data
        let updateData = {}
        let cropperData = that.data.cropperData
        if (!isRotate) {
            cropperData.imageInfo = {
                path: src,
                width: width,
                height: height
            }
        }
        cropperData.left = left
        cropperData.top = top
        cropperData.width = size.width
        cropperData.height = size.height

        let compressedScale = that.data.cropperData.original ? 1.0 : 0.4
        // let scaleSize = cropperUtil.getAdjustSize(W, H, width, height)

        cropperData.scaleInfo = {
            x: width * compressedScale / size.width,
            y: height * compressedScale / size.height
        }

        updateData.cropperData = cropperData

        updateData.cropperMovableItems = {
            topleft: {
                x: 50,
                y: 50
            },
            topright: {
                x: size.width - 50,
                y: 50
            },
            bottomleft: {
                x: 50,
                y: size.height - 50
            },
            bottomright: {
                x: size.width - 50,
                y: size.height - 50
            }
        }

        let cropperChangableData = that.data.cropperChangableData
        cropperChangableData.originalSize = {
            width: width,
            height: height
        }
        cropperChangableData.scaleSize = {
            width: size.width,
            height: size.height
        }

        updateData.cropperChangableData = cropperChangableData

        that.setData(updateData)

        that.drawImage({
            path: that.data.cropperData.imageInfo.path,
            width: width,
            height: height,
            isRotate
        })
        // that.drawImage(that.data.cropperData.imageInfo)
        setTimeout(() => {
            that.drawLines(that.data.cropperMovableItems, that.data.cropperData.imageInfo)
        },10)

    }

    // 清空canvas上的数据
    that.clearCanvas = (imageInfo) => {
        let cropperData = that.data.cropperData
        let size = cropperUtil.getAdjustSize(W, H, imageInfo.width, imageInfo.height)

        if (imageInfo.path != '') {
            let compressedScale = that.data.cropperData.original ? 1.0 : 0.4

            //清空原图
            let ctx = wx.createCanvasContext("originalCanvas")
            ctx.clearRect(0, 0, imageInfo.width * compressedScale, imageInfo.height * compressedScale)
            ctx.draw()

            //清空选择区图片
            let canvas = wx.createCanvasContext("canvas")
            canvas.clearRect(0, 0, size.width, size.height)
            canvas.draw()

            // 清空白线框
            let moveCanvas = wx.createCanvasContext("moveCanvas")
            moveCanvas.clearRect(0, 0, size.width, size.height)
            moveCanvas.draw()
        }
    }

    //绘制图片
    that.drawImage = (imageInfo) => {
        let that = this
        let cropperData = that.data.cropperData
        let size = cropperUtil.getAdjustSize(W, H, imageInfo.width, imageInfo.height)

        if (imageInfo.path != '') {
            let path = imageInfo.path
            let compressedScale = that.data.cropperData.original ? 1.0 : 0.4
            let rotateDegree = that.data.cropperChangableData.rotateDegree
            if(!imageInfo.isRotate){


            //绘制选择区图片
            cropperUtil.drawImageWithDegree("canvas", path, size.width, size.height, rotateDegree,imageInfo.isRotate)

            //绘制原图
                cropperUtil.drawImageWithDegree(
                    "originalCanvas",
                    path,
                    imageInfo.width ,
                    imageInfo.height,
                    rotateDegree,
                    imageInfo.isRotate
                )
            }else{
                setTimeout(() => {
                    //绘制选择区图片
                    cropperUtil.drawImageWithDegree(
                    "originalCanvas",
                    path,
                    imageInfo.width ,
                    imageInfo.height,
                    rotateDegree,
                    imageInfo.isRotate
                )
               cropperUtil.drawImageWithDegree("canvas", path, size.width, size.height, rotateDegree,imageInfo.isRotate)

                //绘制原图

                },5)
            }
            // let originalCanvas = wx.createCanvasContext("originalCanvas")
            // originalCanvas.drawImage(path, 0, 0, imageInfo.width * compressedScale, imageInfo.height * compressedScale)
            // originalCanvas.draw()

            // let canvas = wx.createCanvasContext("canvas")
            // canvas.drawImage(path, 0, 0, size.width, size.height)
            // canvas.draw()
        }
    }

    // 单独绘制原图，当切换原图与非原图时使用
    that.drawOriginalImage = () => {
        let that = this
        let cropperData = that.data.cropperData
        let imageInfo = cropperData.imageInfo
        let originalSize = that.data.cropperChangableData.originalSize

        if (imageInfo.path != '') {
            let path = imageInfo.path
            let compressedScale = that.data.cropperData.original ? 1.0 : 0.4
            let rotateDegree = that.data.cropperChangableData.rotateDegree

            //绘制原图
            cropperUtil.drawImageWithDegree(
                "originalCanvas",
                path,
                originalSize.width * compressedScale,
                originalSize.height * compressedScale,
                rotateDegree
            )
            // let originalCanvas = wx.createCanvasContext("originalCanvas")
            // originalCanvas.drawImage(path, 0, 0, imageInfo.width * compressedScale, imageInfo.height * compressedScale)
            // originalCanvas.draw()
        }
    }

    //绘制选框
    that.drawLines = (cropperMovableItems, imageInfo, callback) => {
        let that = this
        let cropperData = that.data.cropperData
        let mode = cropperData.mode
        let size = cropperUtil.getAdjustSize(W, H, imageInfo.width, imageInfo.height)

        let convexDots = []
        let orderedDots = []
        orderedDots.push(cropperMovableItems['topleft'])
        orderedDots.push(cropperMovableItems['topright'])
        orderedDots.push(cropperMovableItems['bottomright'])
        orderedDots.push(cropperMovableItems['bottomleft'])
        // 获取凸边形的点
        convexDots = cropperUtil.convexHull(orderedDots, orderedDots.length)
        // 四个点组成的四边形是不是凸四边形
        let canCrop = convexDots.length == 4
        if (callback) {
            callback(canCrop)
        }

        let ctx = wx.createCanvasContext("moveCanvas")

        //绘制高亮选中区域
        let rect = cropperUtil.getCropRect(convexDots)

        if (mode == 'rectangle') {
            // 绘制半透明遮罩
            ctx.setFillStyle('rgba(0,0,0,0.5)')
            ctx.fillRect(0, 0, size.width, size.height)

            // 清除选中区域的半透明遮罩，使选中区域高亮
            ctx.setFillStyle('rgba(0,0,0,0)')
            ctx.clearRect(rect.x, rect.y, rect.w, rect.h)

            //绘制选中边框
            ctx.setStrokeStyle('white')
            ctx.setLineWidth(2)
            ctx.beginPath()
            ctx.moveTo(rect.x, rect.y)
            ctx.lineTo(rect.x + rect.w, rect.y)
            ctx.lineTo(rect.x + rect.w, rect.y + rect.h)
            ctx.lineTo(rect.x, rect.y + rect.h)
            ctx.lineTo(rect.x, rect.y)

            ctx.stroke()
            ctx.closePath()
        }
        else {
            //绘制选中边框
            // 如果四个点组成的四边形不是凸四边形，则显示红色，表示不可取

            let color = canCrop ? '#cdcaca' : 'red'
            ctx.setStrokeStyle(color)
            ctx.setLineWidth(2)
            ctx.beginPath()
            for (let i = 0, len = orderedDots.length; i < len; i++) {
                let dot = orderedDots[i]
                if (i == 0) {
                    ctx.moveTo(dot.x, dot.y)
                }
                else {
                    ctx.lineTo(dot.x, dot.y)
                }
            }
            let dot = orderedDots[0]
            ctx.lineTo(dot.x, dot.y)

            ctx.stroke()
            ctx.closePath()
        }
        //绘制四个角
        let cornerType = mode == 'rectangle' ? 'rect' : 'circle'
        ctx.setFillStyle('#cdcaca')
        ctx.setStrokeStyle('#cdcaca')

        // 绘制不同样式的角
        if (cornerType == 'circle') {

            for (let i = 0, len = orderedDots.length; i < len; i++) {
                let dot = orderedDots[i]

                ctx.beginPath()
                ctx.arc(dot.x, dot.y, 10, 0, 2 * Math.PI, true)
                ctx.fill()
                ctx.closePath()
            }
        }
        else if (cornerType == 'rect') {
            let len = 20, w = 3.0, offset = w / 2.0

            ctx.setLineWidth(w)
            ctx.beginPath()

            ctx.moveTo(rect.x - offset, rect.y - offset + len)
            ctx.lineTo(rect.x - offset, rect.y - offset)
            ctx.lineTo(rect.x - offset + len, rect.y - offset)

            ctx.moveTo(rect.x + offset + rect.w - len, rect.y - offset)
            ctx.lineTo(rect.x + offset + rect.w, rect.y - offset)
            ctx.lineTo(rect.x + offset + rect.w, rect.y - offset + len)

            ctx.moveTo(rect.x + offset + rect.w, rect.y + offset + rect.h - len)
            ctx.lineTo(rect.x + offset + rect.w, rect.y + offset + rect.h)
            ctx.lineTo(rect.x + offset + rect.w - len, rect.y + offset + rect.h)

            ctx.moveTo(rect.x - offset, rect.y + offset + rect.h - len)
            ctx.lineTo(rect.x - offset, rect.y + offset + rect.h)
            ctx.lineTo(rect.x - offset + len, rect.y + offset + rect.h)

            ctx.stroke()

            ctx.closePath()
        }

        ctx.draw()
    }

    // move events
    that.setupMoveItem = (key, changedTouches, imageInfo, callback) => {
        let that = this
        let cropperData = that.data.cropperData
        let cropperMovableItems = that.data.cropperMovableItems
        let left = cropperData.left
        let top = cropperData.top
        let mode = cropperData.mode
        let size = cropperUtil.getAdjustSize(W, H, imageInfo.width, imageInfo.height)
        if (changedTouches.length == 1) {
            let touch = changedTouches[0]
            let x = touch.clientX
            let y = touch.clientY

            // 相对画布的点
            x = x - left
            y = y - top


            cropperMovableItems[key].x = x
            cropperMovableItems[key].y = y

            // 边界检测，使截图不超出截图区域
            x = x < 0 ? 0 : (x > size.width ? size.width : x)
            y = y < 0 ? 0 : (y > size.height ? size.height : y)
            cropperMovableItems[key].x = x
            cropperMovableItems[key].y = y

            // 如果是在矩形模式下
            if (mode == 'rectangle') {
                // 同时设置相连两个点的位置，是相邻的两个点跟随着移动点动，保证选框为矩形
                if (key == 'topleft') {
                    cropperMovableItems['bottomleft'].x = x
                    cropperMovableItems['topright'].y = y
                }
                else if (key == 'topright') {
                    cropperMovableItems['bottomright'].x = x
                    cropperMovableItems['topleft'].y = y
                }
                else if (key == 'bottomleft') {
                    cropperMovableItems['topleft'].x = x
                    cropperMovableItems['bottomright'].y = y
                }
                else if (key == 'bottomright') {
                    cropperMovableItems['topright'].x = x
                    cropperMovableItems['bottomleft'].y = y
                }
            }

            that.drawLines(cropperMovableItems, imageInfo, function (canCrop) {
                if (callback) {
                    callback(cropperMovableItems, canCrop)
                }
            })
        }
    }

    // moveable-view touchmove
    that.moveEvent = (e) => {
        let that = this
        let key = e.currentTarget.dataset.key
        let originalSize = that.data.cropperChangableData.originalSize

        that.setupMoveItem(key, e.changedTouches, {
            path: that.data.cropperData.imageInfo.path,
            width: originalSize.width,
            height: originalSize.height
        })
    }

    // moveable-view touchend，end的时候设置movable-view的位置，如果在move阶段设置位置，选中会不流畅
    that.endEvent = (e) => {
        let that = this
        let cropperData = that.data.cropperData
        let cropperMovableItems = that.data.cropperMovableItems
        let cropperChangableData = that.data.cropperChangableData
        let originalSize = cropperChangableData.originalSize
        let key = e.currentTarget.dataset.key

        that.setupMoveItem(key, e.changedTouches, {
            path: that.data.cropperData.imageInfo.path,
            width: originalSize.width,
            height: originalSize.height
        }, (cropperMovableItems, canCrop) => {
            cropperChangableData.canCrop = canCrop
        that.setData({
            cropperChangableData: cropperChangableData,
            cropperMovableItems: cropperMovableItems
        })
    })
    }
}


module.exports = {
    init
}

