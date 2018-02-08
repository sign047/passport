// template/load/load.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示
      value: '加载中'     
    },
    // 弹窗内容
    showLoad: {
      type: Boolean,
      value: false
    },
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
