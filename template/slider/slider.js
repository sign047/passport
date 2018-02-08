// template/slider.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
      len: {
          type: Number,
          value: 0
      },
      list: {
          type: Object,
          value: []
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      name:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
      scrollRight() {
          let len = this.data.len;
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
      //触摸开始事件
      touchstart: function (e) {
          const len = this.data.len;
          if(len <= 0) return;
          this.data.touchDot = e.touches[0].pageX;
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
      },
      scrollLeft() {
          let len = this.data.len;
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
      }
  }
})
