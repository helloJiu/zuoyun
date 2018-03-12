var app = getApp();
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xiaosh:'',
    list_pay_btn:true,
    store: false,
    pinche: false,
    account: '0',
    integral:'0',
    hidden_tip_text:1
  },
  tap_scanner:function(){
    wx.showActionSheet({
      itemList: ['订单核销'],
      success: function (res) {
        if (res.tapIndex==0){
         wx.navigateTo({
           url: '../../tc_store/pages/order_hexiao/page',
         });
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppColor();   

    userinfoUtil.getUserinfo();
    var that = this;
    that.setData({
      ubinfo: wx.getStorageSync('ubinfo'),
      store: app.globalData.store,
      pinche: app.globalData.pinche,
    });

   

    // setTimeout(function(){      

    //   that.setData({
    //     hidden_tip_text:0
    //   })
    // },10000);

    //app.util.footer(that);
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
    var that=this;
    that.load_account();

    app.util.request({
      'url': 'entry/wxapp/get_copyright',
      data: {
        openId: wx.getStorageSync('openId')
      },
      success(res) {
        var rpjson = res.data.data;
        that.setData({
          copyright: rpjson
        });
      }
    });
   


  },
  load_account:function(){

    var that = this;
    setTimeout(function () {
      that.setData({
        ubinfo: wx.getStorageSync('ubinfo')
      });

      var openid = app.globalData.openId;
      if (openid == '') {
        openid = wx.getStorageSync('openId');
      }

      app.util.request({
        'url': 'entry/wxapp/check_user_account',
        data: {
          openId: openid,
          ck_type: 'all'
        },
        success(res) {
          var rpjson = res.data.data;
          if (rpjson.have_user) {
            that.setData({
              account: rpjson.account,
              integral: rpjson.integral
            });

          }

        }
      });

    }, 500);
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
    console.log("下拉")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  console.log("上拉")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 我的发布
   */
  myuser_send:function(){
    wx.navigateTo({
      url: '../myuser_send/msg_list'
    })
  },
  /**
   * 我的发布
   */
  wallet_send: function () {
    wx.navigateTo({
      url: '../wallet/page'
    })
  },
  /**
   * 修改我的信息
   */
  myuser_info:function(){
    wx.navigateTo({
      url: '../myuser_info/myuser_info'
    })
  },
  /**
   * 幻灯出租信息
   */
  banner_send:function(){
    wx.navigateTo({
      url: '../myuser_banner/page'
    })
  },
  order_list:function(e){
    wx.navigateTo({
      url: '../../tc_store/pages/order_list_kefu/page',
    })
  },
  order_main:function(e){
    wx.navigateTo({
      url: '../../tc_store/pages/store_main/page',
    })
  }
  
  ,
  refresh_myuser_info:function(){
    //刷新用户信息
    app.globalData.openId='';
    app.globalData.userInfo=null;
    wx.removeStorageSync("openId");
    wx.removeStorageSync("ubinfo");
    userinfoUtil.getUserinfo();
    wx.showToast({
      title: '刷新用户信息成功!',
    })
  },
  tap_pay_taocan:function(e){
    wx.navigateTo({
      url: '../pay_taocan/page',
    })
  }



})