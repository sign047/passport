var util = require('../../utils/util');
var wxApi = require('../../utils/wxApi');
var wxRequest = require('../../utils/wxRequest');
var app = getApp();
const device = wx.getSystemInfoSync();
const W = device.windowWidth;
const H = device.windowHeight - 50;
let cropper = require('../../template/welCropper/welCropper.js');
const boys = ['http://7xl2r0.com1.z0.glb.clouddn.com/passport/boy1.png',
    'http://7xl2r0.com1.z0.glb.clouddn.com/passport/boy2.png',
    'http://7xl2r0.com1.z0.glb.clouddn.com/passport/boy3.png'
]
const girls = ['http://7xl2r0.com1.z0.glb.clouddn.com/passport/girl1.png',
    'http://7xl2r0.com1.z0.glb.clouddn.com/passport/girl2.png',
    'http://7xl2r0.com1.z0.glb.clouddn.com/passport/girl3.png',
    'http://7xl2r0.com1.z0.glb.clouddn.com/passport/girl4.png'
]
Page({
    /**
     * 页面的初始数据
     */
    data: {
        passportList:[],
        startTime:'',
        isGo: false,
        isLeft:true,
        isRight:true,
        showLoad:true,
        showCard:false,
        name:[],
        count:0,
        pageType:'passport'
    },
    onPullDownRefresh: function () {
        var that=this;
        app.login(that.getList);
        wx.stopPullDownRefresh();
    },
    // showTips() {
    //     this.setData({
    //         showCard:true
    //     })
    // },
    //转发
    onShareAppMessage: function (res) {
        var id = this.data.id;
        var passport = this.data.passport;
        if (res.from === 'button') {

        }
        return {
            title:'护照管家',
            path: `/pages/passportList/passportList`,
            imageUrl:'http://7xj7u1.com1.z0.glb.clouddn.com/passport/share1.png',
            success: function (res) {

            },
            fail: function (res) {

            }
        }
    },
    getUserInfo:function(e){
        var that=this;
        var type=e.target.dataset.type;
        this.setData({
            showCard:false
        })
        if(type === '1'){
            app.login(that.toPhoto);
        }
        if(type === '2'){
            app.login(that.toWrite);
        }

    },
    toPhoto:function(){
        app.login((load) => {
          if(load) return;
          wx.navigateTo({
            url:'../pic/pic'
            })
        })

    },
    toAddchoice() {
        wx.navigateTo({
            url:'../addChoice/addChoice'
        })
    },
    toWrite:function(){
        if( !app.isLogin()) return;
        wx.navigateTo({
            url:'../addpassport/addpassport'
        })
    },
    throttle(delay, fn) {
        let ctx;
        let args;
        // 记录上次触发事件
        let previous = Date.now();

        let later = function () {
            fn.apply(ctx, args);
        };
        return function () {
            ctx = this;
            args = arguments;
            var now = Date.now();
            // 本次事件触发与上一次的时间比较
            var diff = now - previous - delay;

            // 如果隔间时间超过设定时间，即再次设置事件触发的定时器
            if (diff >= 0) {
                // 更新最近事件触发的时间
                previous = now;
                setTimeout(later, delay);
            }}
    },
    scrollLeft() {
        let len = this.data.passportList.length;
        if(!len ) return;
        let count = this.data.count;
        if(len<=2){
            if(count <= 0) return;
        }
        this.changeName(2);
        let arr= this.data.name;
        count--;
        arr.unshift(arr.pop());
        this.setData({
            name:arr,
            count
        })

    },
    goPic() {
        wx.navigateTo({
            url:`../pic/pic`
        });
    },
    changeName(type) {
        let name = this.data.name;

        if(type === 1){
            name = name.map((item,index) => {
                switch(item) {
                case 'r1':
                    item = 'sr1';
                    break;
                case 'r2':
                    item = 'sr2';
                    break;
                case 'sl1':
                    item='l1'
                    break;
                case 'sl2':
                    item = 'l2'
                    break;
                }
                return item
            })
            this.setData({
                name
            })
        }
        if(type === 2){
            name = name.map((item,index) => {
                switch(item) {
                case 'l1':
                    item = 'sl1';
                    break;
                case 'l2':
                    item = 'sl2';
                    break;
                case 'sr1':
                    item='r1'
                    break;
                case 'sr2':
                    item = 'r2'
                    break;
                }
                return item
            })
            this.setData({
                name
            })
        }
    },
    scrollRight() {
        let len = this.data.passportList.length;
        if(!len) return;
        let count = this.data.count;
        if(len<=2){
            if(count > 0) return;
        }
        this.changeName(1);

        let arr = this.data.name;
        arr.push(arr.shift());
        count++;
        this.setData({
            name:arr,
            count
        })

    },
    //触摸开始事件
    touchstart: function (e) {
        const len = this.data.passportList.length;
        if(len <= 0) return;
        this.data.touchDot = e.touches[0].pageX;
        if(this.start) return
        this.start = true;
        var that = this;


        clearInterval(this.data.interval);
        this.data.interval = setInterval(() => {
            this.data.time += 1;
        }, 100);
    },
    //触摸移动事件
    touchmove: function (e) {
        if(!this.start) return;
        let touchMove = e.touches[0].pageX;
        let touchDot = this.data.touchDot;
        let time = this.data.time;

        //向左滑动
        if (touchMove - touchDot <= -30 && time < 8 && !this.data.done) {
            this.data.done = true;
            this.scrollLeft();
        }
        //向右滑动
        if (touchMove - touchDot >= 30 && time < 8 && !this.data.done) {
            this.data.done = true;
            this.scrollRight();
        }
    },
    //触摸结束事件
    touchend: function (e) {
        clearInterval(this.data.interval);

            this.data.time = 0;
            this.data.done = false;
            this.start = false;


    },
    toVisa(ev) {
        const newsId = ev.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../passport/passport?id=${newsId}&visaHidden=true`,
            success() {
                app.globalData.currentPassport = newsId
            }
        })
    },
    toPort: function (ev) {
        const that = this;
        const newsId = ev.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../passport/passport?id=${newsId}`,
            success() {
                app.globalData.currentPassport = newsId
            }
        })
    },
    del: function (ev) {
        var url = app.globalData.huoLiBase + 'delPassport';
        var huId = ev.currentTarget.dataset.id;
        var index = ev.currentTarget.dataset.index;
        var authToken = app.globalData.authToken;
        var that = this;
        wx.showModal({
            title: '是否删除护照',
            success: function (res) {
                if (res.confirm) {
                    util.http(url, {huId: huId, authToken: authToken}, function () {
                        var list = that.data.passportList;
                        list.splice(index, 1);
                        that.setData({
                            passportList: list
                        })
                        that.chooseName(list);
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    formatList: function (list) {
        let len = list.length;
        if(!len ) return;
        for (var i = 0; i < len; i++) {
            var item = list[i];
            if(!item.headPhoto || item.headPhoto === null) { //头像
                item.headPhoto = item.huSex === '女' ? girls[i%4]:boys[i%3]
            }else{
                item.headPhoto = JSON.parse( item.headPhoto)[0]
            }

            item.lastTime = util.matchTime(item.huExpireTime, 1);
            item.huExpireTime = util.formatDate(item.huExpireTime);
            item.huBoth = util.formatDate(item.huBoth);
            item.huCreateTime = util.formatDate(item.huCreateTime);
        }
        return list;
    },
   shuffle(arr) {
        let input = arr;
        for (var i = input.length-1; i >=0; i--) {
            var randomIndex = Math.floor(Math.random()*(i+1));
            var itemAtIndex = input[randomIndex];
            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        return input;
    },
    inList(list,id) {
        for(let i =0;i<list.length;i++) {
            let item = list[i]
            if(item.id == id) {
                return i
            }
        }
        return false
    },
    chooseName(list) {
        const len = list.length;
        if(!len) return;
        const id = app.globalData.currentPassport;

        let everIndex
        if(id) {
           everIndex = this.inList(list,id)
        }
        let name = ['l2','l1','cur','r1','r2'];
        let catchItem;
        switch(len) {
            case 1:
                name = name.splice(2,1);
                break;
            case 2:
                name= name.splice(1,3);
                if(everIndex !== undefined) {
                    catchItem = list[everIndex]
                    list[everIndex] = list[1]
                    list[1] = catchItem

                }
                else{
                    catchItem = list[0]
                    list[0] = list[1]
                    list[1] = catchItem

                }
                break;
            case 3:
                name= name.splice(1,3);
                if(everIndex !== undefined) {
                    catchItem = list[everIndex]
                    list[everIndex] =  list[1]
                    list[1] = catchItem
                }
                else{
                    catchItem = list[0]
                    list[0] = list[1]
                    list[1] = catchItem
                }
                break;
            case 4:
                name=name.splice(0,4);
                if(everIndex !== undefined) {
                    catchItem = list[everIndex]
                    list[everIndex] =  list[2]
                    list[2] = catchItem
                }
                else{
                    catchItem = list[0]
                    list[0] = list[2]
                    list[2] = catchItem
                }
                break;
        }
        if(len >= 5){
            var arr = new Array(len);
            for(var i =0;i<len;i++) {
                if(i<5){
                    arr[i] = name[i];
                }else{
                    arr[i] = ''
                }
            }
            if(everIndex !== undefined) {
                catchItem = list[everIndex]
                list[everIndex] =  list[2]
                list[2] = catchItem
            }
            else{
                catchItem = list[0]
                list[0] = list[2]
                list[2] = catchItem
            }
            name = arr;
        }
        this.setData({
            name,passportList: list
        })
    },
    toVisaData(event) {
        console.log(event);
        const num  = event.currentTarget.dataset.num;
        const id   = event.currentTarget.dataset.id;
        const vfId = event.currentTarget.dataset.vfid;
        wx.navigateTo({
            url:`../dataProgress/dataProgress?vfId=${vfId}`,
            success() {
                app.globalData.currentNumber= num
                app.globalData.currentPassport = id
            }
        })
    },
    getList: function (load) {
        if(load && load.showLoad == false) {
            this.setData({
                showLoad:false,passportList:[]
            })
            return
        }
        var that = this;
        var url = app.globalData.huoLiBase + 'getPassPort';
        var authToken = app.globalData.authToken;
        const count  = 0;
        util.http(url, {authToken: authToken}, function (data) {
            let passportList =  that.formatList(data.object);
            that.chooseName(passportList);
            that.setData({
                count,showLoad: false
            });
            wx.stopPullDownRefresh();
        },function(){
            that.setData({
                passportList:[],count,showLoad: false
            })
        })
    },
    toHid(event) {
        this.setData({
            showCard:false
        })

    },
    onGotUserInfo:function(){
        var that=this;
        app.login(that.choice);
    },
    choice:function(){
        wx.switchTab({
            url:'../addChoice/addChoice'
        })
    },
    showRedDot() {
        let RedDot = wx.getStorageSync('RedDot')
        if(!RedDot) {
            wx.showTabBarRedDot({
                index:1
            })
        }
    },
    onShow:function(){
        var that=this;
        // this.showRedDot()
        app.login(that.getList);
    }
});