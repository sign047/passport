function http(url,data,callBack,fail) {
    let that = this;
    if(data.load || data.load == undefined) {
        navLoad()
    }
    wx.request({
        url: url,
        method: 'GET',
        data: data,
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            var data = res.data;
            navLoaded();
            if (res.statusCode >= 500) {
                showModel({content:'服务器出错了',showCancel:false});
                return;
            }
            if (data.code == 200) {
                callBack&&callBack(data);
            } else {
                if(data.content != 'noPort') {
                    showModel({title: data.content,showCancel: false});
                }
                fail&&fail(data);
                navLoaded();
            }
        },
        fail: function (err) {
            console.log(err)
            navLoaded();
            showModel({title: '访问出错了', content: '请刷新重试！', showCancel: false});
        }
    })
}
function navLoad() {
    wx.showNavigationBarLoading()
}
function navLoaded() {
    wx.hideNavigationBarLoading()
}
function showLoad() {
    wx.showLoading({
        mask: true
    })
}

function hideLoad() {
    wx.hideLoading();
}

function showToast() {
    wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
    })
}
// 时间格式化
function toDate(time) {
    var str = new Date(time).toLocaleDateString(),
        strArr = str.split('/');
    return `${strArr[0]}年${zero(strArr[1])}月${zero(strArr[2])}日`;
}

function toDate2(time) {
    var str = new Date(time).toLocaleDateString(),
        strArr = str.split('/');

    return `${strArr[0]}.${strArr[1]}.${strArr[2]}`;
}

function toDate3(time) {
    var str = new Date(time).toLocaleDateString(),
        strArr = str.split('/');
    return `${strArr[0]}-${strArr[1]}-${strArr[2]}`;
}

function toDate4(time){
    var strArr = time.split('-');
    return `${strArr[0]}年${zero(strArr[1])}月${zero(strArr[2])}日`;
}

//model
function showModel(json) {
    wx.showModal({
        title: json.title ? json.title : '',
        content: json.content ? json.content : '',
        showCancel: json.showCancel ? json.showCancel : false,
        success: function (res) {
            if (res.confirm) {
                json.confirm && json.confirm()
            } else if (res.cancel) {
                json.cancel && json.cancel()
            }
        }
    })
}

//计算过期时间
function matchTime(str1, kind) {
    var n1 = str1;
    var n2 = new Date().getTime();
    if (n1 - n2 <= 0) {
        if (kind == 1) {
            return '护照已过期'
        }
        if (kind == 2) {
            return '签证已过期'
        }
    }
    else {
        var expire = n1 - n2;
        return formatTime2(expire);
    }
}

function matchTime2(str1) {
    var n1 = Date.parse(new Date(str1));
    var n2 = new Date().getTime();
    if (n1 - n2 <= 0) {
        return '护照已过期'
    }
    else {
        var expire = n1 - n2;
        return formatTime2(expire);
    }
}

//设置标题
function setTitle(title) {
    wx.showNavigationBarLoading();
    wx.setNavigationBarTitle({
        title: title,
        success: function () {
            wx.hideNavigationBarLoading();
        },
        complete: function () {
            wx.hideNavigationBarLoading();
        }
    })
}

function formatTime2(time) {
    time = Math.floor(time / 1000);
    var ds = 86400;
    var ms = 86400 * 365 / 12;
    var ys = 86400 * 365;
    var year = Math.floor(time / ys);
    time = time % ys;
    var month = Math.floor(time / ms);
    time = time % ms;
    var day = Math.floor(time / ds);
    if (year == 0 && month == 0 && day == 0) {
        return '剩余1天过期'
    }
    return `剩余${year}年${month}月${day}天`;
}

//补零
function zero(s) {
    return s < 10 ? '0' + s : s + '';
}
//过滤空格

function trim(str){
    var re = /\s+/g;
    return str.replace(re,'');
}

//提交校验
var pass = [
    {name: 'huNumber',errmsg: '请填写护照号码',baseTxt:'',regTit:'护照号码格式错误',regErrTxt:'请输入正确的护照号码,中国护照号共9个字符,以G、P、S、D、E开头，后面为阿拉伯数字',regExp: /^[E|P|S|G|D]([a-zA-Z]\d{7}|\d{8})$/},
    {name: 'huName',errmsg: '请填写姓名',regErrTxt:'请输入正确的中文姓名',baseTxt:'',regExp:/^([\u4E00-\u9FA5])*$/},
    {name: 'huPinYin',errmsg: '请填写姓名拼音',baseTxt:''},
    {name: 'huSex', errmsg: '请填写性别',baseTxt:''},
    {name: 'huBoth', errmsg: '请选择出生日期', baseTxt: '请选择你的出生年月'},
    {name: 'huIssueplace', errmsg: '请选择签发地点',baseTxt:'请输入你的护照签发地'},
    {name: 'huIssuePlace', errmsg: '请选择签发地点',baseTxt:'请输入你的护照签发地'},
    {name: 'huCreateTime', errmsg: '请选择签发时间',baseTxt:'请选择你的护照签发日期'},
    {name: 'huExpireTime', errmsg: '请选择到期时间',baseTxt:'请选择你的护照有效期'}];

function check(json,rules) {
    if(!rules || rules == null) {
        rules = pass;
    }
    for (var i = 0, len = rules.length; i < len; i++) {
        var err = rules[i];
        for (var name in json) {

            if (name == err['name']) {
                if (!json[name] || json[name].length === 0 || json[name] === json['baseTxt']) {
                    // showModel({title: err.errmsg, showCancel: false});
                    return {isCheck:false,errmsg:err.errmsg};
                }else{
                   var regTit=err.regTit ?err.regTit:'';
                   var regExp = new RegExp(err['regExp']);
                   if(err['regExp'] !== undefined && !regExp.test(json[name])){
                       // showModel({title:regTit,content: err.regErrTxt, showCancel: false});
                       return {isCheck:false,errmsg:err.regErrTxt};
                   }
                }
            }
        }
    }
    return {isCheck:true}
}

//校验visa
function checkVisa(arr) {
    if (!arr) return;
    if (arr.length > 0) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            if (!item.createTime || item.createTime == '请选择签证签发时间') {
                showModel({title: `请选择${item.visaName}签证签发时间`, showCancel: false});
                return false;
            }
            if (!item.expireTime || item.expireTime == '请选择签证到期时间') {
                showModel({title: `请选择${item.visaName}签证到期时间`, showCancel: false});
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}
function date2String(value){
    var old=value.split('-'),
        timeString=new Date(old[0],old[1]-1,old[2]);
    return timeString;
}
//签证 护照 事件校验
function compareTime (name,value,that,compare){
    var errTxt='';
    var matchTime="";
    switch(name){
        case 'huBoth':
            var now=new Date().getTime();
            var time=date2String(value);
            matchTime=Number(now)-Number(time);
            errTxt='请选择正确的出生日期';
            break;
        case 'huCreateTime':
            var Expire= compare;
            if(Expire === undefined || !Expire || Expire === '请选择签证到期时间'){
                matchTime=1;
            }else{
                var expireTime=date2String(Expire);
                var createTime=date2String(value);
                matchTime=Number(expireTime)-Number(createTime);
            }
            errTxt='签发日期不能大于有效日期';

            break;
        case 'huExpireTime':
            var Create=compare;
            if(Create === undefined || !Create || Create ===  "请选择签证签发时间"){
                matchTime=1;
            }else{
                var expireTime=date2String(value);
                var createTime=date2String(Create);
                matchTime=Number(expireTime)-Number(createTime);
            }
            errTxt='有效日期不能小于签发日期';

            break;
    }
    //
    if(matchTime > 0){
        return true
    }else{
        that.showTopTips(errTxt);
        return false;
    }

}

function formatTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(formatNumber).join('/')
}
function parseDate(time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(formatNumber).join('-')
}
function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
}

module.exports = {
    http: http,
    formatTime:formatTime,
    matchTime: matchTime,
    matchTime2: matchTime2,
    compareTime:compareTime,
    toDate: toDate,
    toDate2: toDate2,
    toDate3: toDate3,
    toDate4:toDate4,
    setTitle: setTitle,
    check: check,
    trim:trim,
    checkVisa: checkVisa,
    formatDate,
    parseDate
};