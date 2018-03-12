var app=getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: false,
    pinche: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({     
      store: app.globalData.store,
      pinche: app.globalData.pinche,
    });
    app.setAppColor();
    that.load_list();

  },
  load_list: function () {
    var that = this;
    //加载消息分类
    app.util.request({
      'url': 'entry/wxapp/get_mtype_list',
      data: {
        referenceType: 'sendChooseType'
      },
      success(res) {
        that.setData({
          menu_list: res.data.data
        });
      }
    });
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.load_list();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 点击类类型
   */
  open_mlist: function (e) {
    //redirectTo
    //navigateTo
    var that = this;
    var tg = e.currentTarget.dataset;
    var is_parent_open = tg.is_parent_open;
    if (is_parent_open == '0') {
      wx.navigateTo({
        url: '../pages/msg_send/msg_send?tid=' + tg.tid + '&tname=' + tg.tname + '&parent_tid=' + 0 + '&parent_tname='
      });
    } else {
      var parent_types = tg.parent_types;
      that.setData({
        tid: tg.tid,
        tname: tg.tname,
        mtype_list: parent_types
      });

      that.util_model('open');
      // 
      // //console.log(parent_types)
      // //var parentList=new Array();
      // var alist=new Array();
      // for (var i = 0, len = parent_types.length;i<len;i++){
      //   alist.push(parent_types[i].tname);
      // }
      // wx.showActionSheet({
      //   itemList: alist,
      //   success: function (res) {          
      //     var tapIndex=res.tapIndex;
      //     if(tapIndex>=0){          
      //     var parent_tid = parent_types[tapIndex].id;
      //     var parent_tname = parent_types[tapIndex].tname
      //     //console.log(parent_tid);
      //     //console.log(parent_tname);

      //     wx.redirectTo({
      //       url: '../msg_send/msg_send?tid=' + tg.tid + '&tname=' + tg.tname + '&parent_tid=' + parent_tid + '&parent_tname=' + parent_tname
      //     });

      //     }
      //   },
      //   fail: function (res) {
      //     console.log(res.errMsg)
      //   }
      // });

    }
  },
  /**
   * sheet打开菜单
   */
  tap_add_sheet: function (e) {
    var that = this;
    var tg = e.currentTarget.dataset;
    that.util_model('close');
    wx.navigateTo({
      url: '../pages/msg_send/msg_send?tid=' + tg.tid + '&tname=' + tg.tname + '&parent_tid=' + tg.pid + '&parent_tname=' + tg.pname
    });

  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util_model(currentStatu)
  },
  util_model: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });
    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    });
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      });
      //关闭  
      if (currentStatu == "close") {
        this.setData({
          showModalStatus_sheet: false
        });
      }
    }.bind(this), 200);
    // 显示  
    if (currentStatu == "open") {
      this.setData({
        showModalStatus_sheet: true
      });
    }
  },
  /**
   * 入驻商圈
   */
  tap_store:function(){
    wx.navigateTo({
      url: '../tc_store/pages/stroe_add/page?nav_type=send',
    });
  },
  tap_pinche:function(){
    wx.switchTab({
      url: '../tc_pinche/pages/main/page?nav_type=send',
    });
  }
})