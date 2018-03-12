var app = getApp();
var page_0 = 1;
var page_1 = 1;
var page_2 = 1;
//var md5 = require('../../../we7/resource/js/md5.js');
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
//var WxNotificationCenter = require("../../../we7/resource/plugin/WxNotificationCenter/WxNotificationCenter.js");
Page({
    data: {
        // pmdList: [
        //   {title: "公告：多地首套房贷利率上浮 热点城市渐迎零折扣时代AAAAAAAAAAAAAAAAAAAAB" }
        //  ],
        // marquee: {
        //   width: 1,
        //   text: '一条会滚动的文字滚来滚去的文字跑马灯，哈哈哈哈哈哈哈哈这是'
        // },
        scrollTop: 0,
        shmoney: '',
        shmoney_choonse: false,//打赏金额选择
        showModalStatus_shang: false,//打赏状态
        showModalStatus_sheet: false,
        currentTabmenu: '0',
        run_pmd_isopen: '0',
        pmd_text: '',
        marqueePace: 1,//滚动速度
        marqueeDistance: 60,//初始滚动距离
        marqueeDistance2: 0,
        marquee2copy_status: false,
        marquee2_margin: 60,
        size: 14,
        orientation: 'left',//滚动方向
        interval_run: 40, // 时间间隔

        issearch: false,//是否搜索
        inputVal: '',
        ismore: true,//是否有更多
        bannser_show: false,
        indicatorDots: true,
        autoplay: true,
        interval: 4000,
        duration: 1500,
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,//首页tab 序列
        m_list_0: [],
        m_list_1: [],
        m_list_2: [],
        idx: 0//更新内容ID
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    /**清空搜索 */
    clearInput: function () {
        var that = this;
        this.setData({
            inputVal: "",
            inputShowed: false
        });
        //如果搜索过刷新
        if (that.data.wxSearchFn) {
            that.load_list_init();
        }
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: app.globalData.share_name + '-首页',
            path: '/' + app.globalData.wx_model_name + '/pages/index/index',
            success: function (res) {
                // 转发成功
                console.log('转发成功')
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    check_smrzbyuser: function () {
        var that = this;
        app.util.request({
            'url': 'entry/wxapp/check_smrzbyuser',
            data: {openId: wx.getStorageSync('openId')},
            success(res) {
                var json = res.data.data;
                console.log('实名认证检查开关');
                console.log(json);
                //实名认证启用
                if (json.smrz_isopen == '1') {
                    //console.log('记用')
                    if (json.smrz_state == false) {
                        wx.navigateTo({
                            url: '../myuser_smrz_p_info/smrz_p_info',
                        });
                    }
                }

            }
        });
    },
    testNotificationFn: function (njson) {
        console.log(njson)
    },
    onLoad: function (options) {
        var that = this;

        // WxNotificationCenter.addNotification("testNotificationName", that.testNotificationFn, that)
        //that.check_smrzbyuser();
        app.setAppColor();
        //console.log(window)
        //加载底部菜单
        // app.util.footer(that);


        setTimeout(function () {
            that.load_pmd();
        }, 1000);
        //加载消息分类
        var snycmlist = wx.getStorageSync('snycmlist');
        if (snycmlist != '') {
            that.setData({
                menu_list: snycmlist
            });
        } else {
            setTimeout(function () {
                that.load_mtypes();
            }, 450);
        }

        //加载幻灯片
        setTimeout(function () {
            that.load_banners();
        }, 300);

        //获取用户信息
        setTimeout(function () {
            userinfoUtil.getUserinfo();
        }, 50);

        //userinfoUtil.getOpenId();
        setTimeout(function () {
            // that.load_list(0, page_0);
            that.load_list_init();
        }, 650);


        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollTop: res.windowHeight
                });
            }
        });

    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        var that = this;
        that.hideModal();
        //查询消息标志 刷新数据
        app.util.request({
            'url': 'entry/wxapp/get_msg_refresh_status',
            data: {},
            success(res) {
                if (res.data.data.refresh_status == 1) {
                    that.load_list_init();
                }
            }
        })

    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
        // var that = this
        // WxNotificationCenter.removeNotification('testNotificationName', that)
    },
    /**
     * 加载菜单类型
     */
    load_mtypes: function () {
        var that = this;
        app.util.request({
            'url': 'entry/wxapp/get_mtype_list',
            data: {referenceType: 'index'},
            success(res) {
                //console.log('同城分页消息');
                // console.log(res.data);
                that.setData({
                    menu_list: res.data.data,
                    // menu_type: res.data.message
                });
                //显示3页tab
                that.setData({
                    currentTabmenu: 1
                });
                // wx.setStorageSync('snycmlist', res.data.data);
            }
        });
    }
    ,
    /**
     * 加载跑马灯
     */
    load_pmd: function () {
        var that = this;
        app.util.request({
            'url': 'entry/wxapp/get_pmd',
            data: {},
            success(res) {
                var rpjson = res.data.data;
                that.setData({
                    pmdList: rpjson.pmd_list,
                    run_pmd_isopen: rpjson.run_pmd_isopen,
                    pmd_text: rpjson.run_pmd_text,
                    pmd_text_length: rpjson.run_pmd_text.length
                });
                if (res.data.data.run_pmd_isopen == '1') {
                }

            }
        });


    },
    //加载幻灯片
    load_banners: function () {
        var that = this;
        app.util.request({
            'url': 'entry/wxapp/get_banners',
            data: {btype: '0'},
            success(res) {
                if (res.data.data.length > 0) {
                    that.setData({bannser_show: true});
                }
                that.setData({banners: res.data.data});
            }
        });
    }
    ,
    //加载幻灯片信息详细
    tapBanner_det: function (e) {
        var mtype = e.currentTarget.dataset.msg_type;
        if (mtype == '0') {
            wx.navigateTo({
                url: '../banner_info/banner_info?bid=' + e.currentTarget.dataset.bid
            });
        } else {
            wx.navigateTo({
                url: '../msg_info/msg_info?mid=' + e.currentTarget.dataset.mid
            });
        }
    },
    /**
     * 切换栏目
     */
    swichNav: function (e) {
        var that = this;
        if (that.data.currentTab === e.currentTarget.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.currentTarget.dataset.current
            });
        }

        if (that.data.currentTab == 0) {
            that.setData({m_list_0: []});
            that.load_list(0, page_0);
        } else if (that.data.currentTab == 1) {

            if (wx.getStorageSync('latitude') == '' && wx.getStorageSync('longitude') == '') {
                wx.getLocation({
                    complete: function (res) {
                        wx.setStorageSync('latitude', res.latitude);
                        wx.setStorageSync('longitude', res.longitude);
                        that.setData({m_list_1: []});
                        that.load_list(1, page_1);
                    }
                });
            } else {
                that.setData({m_list_1: []});
                that.load_list(1, page_1);
            }

            //取地址信息
            //that.gpsloc();


        } else if (that.data.currentTab == 2) {
            that.setData({m_list_2: []});
            that.load_list(2, page_2);
        }

    },
    /**
     * 取同城信息内容
     */
    load_list: function (m_type, _page) {
        var that = this;
        var openid = app.globalData.openId;
        if (openid == '') {
            openid = wx.getStorageSync('openid');
        }
        app.util.request({
            'url': 'entry/wxapp/get_msg_list',
            data: {
                page: _page,
                pagesize: 10,
                m_type: m_type,
                openid: openid,
                lon: wx.getStorageSync('longitude'),
                lat: wx.getStorageSync('latitude'),
                sql_text: that.data.inputVal,
            },
            success(res) {
                //console.log(res.data);
                var len = res.data.data.length;

                if (that.data.currentTab == 0) {
                    var list_t = that.data.m_list_0;
                    for (var i = 0; i < len; i++) {
                        list_t.push(res.data.data[i]);
                    }
                    if (len == 0) {
                        that.setData({m_list_0_last: 1});
                    }
                    that.setData({m_list_0: list_t});
                    that.setData({ismore: len > 0});

                } else if (that.data.currentTab == 1) {
                    var list_t = that.data.m_list_1;
                    for (var i = 0; i < len; i++) {
                        list_t.push(res.data.data[i]);
                    }
                    if (len == 0) {
                        that.setData({m_list_1_last: 1});
                    }
                    that.setData({m_list_1: list_t});
                    that.setData({ismore: len > 0});
                } else if (that.data.currentTab == 2) {
                    var list_t = that.data.m_list_2;
                    for (var i = 0; i < len; i++) {
                        list_t.push(res.data.data[i]);
                    }
                    if (len == 0) {
                        that.setData({m_list_2_last: 1});
                    }
                    that.setData({m_list_2: list_t});
                    that.setData({ismore: len > 0});
                }

            }
        });

    },
    // /**
    //  * 取用户的openid unid
    //  */
    // getU_openid: function () {
    //     var that = this;
    //     if (app.globalData.openId == '') {
    //         wx.login({
    //             success: function (ires) {
    //                 app.util.request({
    //                     'url': 'entry/wxapp/get_userinfo',//Userinfo
    //                     data: {code: ires.code},
    //                     success(res) {
    //                         var rpjosn = res.data.data;
    //                         wx.hideLoading();
    //                         console.log(res.data)
    //                         console.log('自请求rpjosn:' + rpjosn);
    //                         if (rpjosn != null) {
    //                             console.log('自请求');
    //                             console.log(rpjosn)
    //                             console.log("取openid:" + rpjosn.openid);
    //                             that.setData({
    //                                 openId: rpjosn.openid
    //                             });
    //                             app.globalData.openId = rpjosn.openid;
    //                             wx.setStorageSync('openId', rpjosn.openid);
    //                         } else {
    //                             console.log('===============')
    //                         }
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // },
    // ,
    // /**
    //  * 用户信息获取
    //  */
    // getuser_info_openid:function(){
    //   var that = this;
    //   //that.getU_openid();

    //   var snycopenid = wx.getStorageSync('openId');
    //   if (snycopenid != '' && snycopenid != null){
    //     that.setData({
    //       openId: snycopenid
    //     });
    //     app.globalData.openId = snycopenid;
    //   }else{
    //     if (app.globalData.openId == '' && app.globalData.openId!=null) {
    //       that.getU_openid();
    //     } else {
    //       that.setData({
    //         openId: app.globalData.openId
    //       });
    //     }
    //   }

    //   var snycubinfo = wx.getStorageSync('ubinfo');
    //   if (snycubinfo != '' && snycubinfo!=null) {
    //     that.setData({ ubinfo: snycubinfo});
    //     app.globalData.userInfo = snycubinfo;
    //   }else{

    //     if (app.globalData.userInfo == null) {
    //       app.util.getUserInfo(function (userInfo) {
    //         //更新数据
    //         console.log('================')
    //         console.log(userInfo.wxInfo)
    //         app.globalData.userInfo = userInfo.wxInfo;
    //         that.setData({ ubinfo: userInfo.wxInfo });
    //         wx.setStorageSync('ubinfo', userInfo.wxInfo);
    //         setTimeout(function () {
    //           if (app.globalData.openId == '') {
    //             that.getU_openid();
    //           }
    //         }, 1500);

    //       });

    //     } else {
    //       that.setData({ ubinfo: app.globalData.userInfo });
    //     }

    //   }


    // },
    // /**
    //  * 取用户信息-验证授权
    //  */
    // userLogin: function () {
    //   var that=this;
    //   wx.login({
    //     success: function (ires) {
    //       if (ires.code) {
    //         wx.getUserInfo({
    //           success: function (data) {
    //             console.log('suc');
    //             that.getuser_info_openid();
    //           }, fail: function () {
    //            wx.showModal({
    //              title: '提示',
    //              content: '授权获取用户信息失败,将不可发布消息和评论!',
    //              confirmText:'去设置',
    //              success: function (mres) {
    //                if (mres.confirm) {
    //                  wx.openSetting({
    //                    success: function (pdata) {
    //                      if (pdata) {
    //                        if (pdata.authSetting["scope.userInfo"] == true) {
    //                         console.log('取得信息成功');
    //                         that.getuser_info_openid();

    //                        }else{
    //                          that.userLogin();
    //                        }
    //                      }
    //                    }
    //                  });
    //                }
    //              }
    //            });
    //           }
    //         });
    //       }
    //     }
    //   });

    // },
    gpsloc: function () {

        if (wx.getStorageSync('latitude') == '' && wx.getStorageSync('longitude') == '') {
            wx.getLocation({
                success: function (res) {
                    wx.setStorageSync('latitude', res.latitude);
                    wx.setStorageSync('longitude', res.longitude);
                }
            });
        }

    },
    //图片预览
    previewImage: function (e) {
        var that = this;
        wx.previewImage({
            current: e.currentTarget.dataset.img,
            urls: e.currentTarget.dataset.imgs
        })
    },
    /**
     * 弹出评论窗口
     */
    show_comments: function (e) {
        var that = this;
        that.check_smrzbyuser();
        that.setData({
            pl_mid: e.currentTarget.dataset.mid,
            pl_ctype: e.currentTarget.dataset.ctype,
            plname: e.currentTarget.dataset.plname,
            attr: e.currentTarget.dataset.attr,
            attrtp: e.currentTarget.dataset.attrtp,
            plid: e.currentTarget.dataset.plid,
            idx: e.currentTarget.dataset.idx
        });
        that.showModal();
    },
    /**
     * 评论发布
     */
    formSubmit_send_comments: function (e) {
        var formID = e.detail.formId;
        var that = this;
        var formobj = e.detail.value;
        formobj.formID = formID;

        formobj.u_unionid = app.globalData.unionId;
        formobj.u_openid = app.globalData.openId;
        formobj.u_nickname = app.globalData.userInfo.nickName;
        formobj.u_city = app.globalData.userInfo.city;
        formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;
        formobj.u_gender = app.globalData.userInfo.gender;
        formobj.u_province = app.globalData.userInfo.province;
        formobj.u_country = app.globalData.userInfo.country;

        //console.log(formobj)
        if (formobj.u_nickname == '' || formobj.u_openid == '') {
            wx.showToast({
                title: '用户授权信息无,不可发布评论!',
            });
        } else if (formobj.pl_content == '') {
            wx.showToast({
                title: '评论内容不能为空!',
            })
        } else {

            console.log(formobj)
            //return false;
            app.util.request({
                'url': 'entry/wxapp/send_comments',
                data: formobj,
                success(res) {
                    //console.log(res.data);
                    that.hideModal();
                    //刷新评论
                    var m_idx = that.data.idx;
                    if (that.data.currentTab == 0) {
                        var list_t = that.data.m_list_0;
                        list_t[m_idx].comments = res.data.data;
                        list_t[m_idx].comments_cnt = parseInt(list_t[m_idx].comments_cnt) + 1;
                        that.setData({m_list_0: list_t});
                    } else if (that.data.currentTab == 1) {
                        var list_t = that.data.m_list_1;
                        list_t[m_idx].comments = res.data.data;
                        list_t[m_idx].comments_cnt = parseInt(list_t[m_idx].comments_cnt) + 1;
                        that.setData({m_list_1: list_t});
                    } else if (that.data.currentTab == 2) {
                        var list_t = that.data.m_list_2;
                        list_t[m_idx].comments = res.data.data;
                        list_t[m_idx].comments_cnt = parseInt(list_t[m_idx].comments_cnt) + 1;
                        that.setData({m_list_2: list_t});
                    }
                    //刷新评论结束
                }
            });

        }
        //console.log(formobj)

    },
    showModal: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },
    /**
     * 用户点赞
     */
    ck_goods: function (e) {
        var that = this;
        var m_idx = e.currentTarget.dataset.idx;
        var formobj = app.globalData.userInfo;
        formobj.openId = wx.getStorageSync('openId');
        formobj.mid = e.currentTarget.dataset.mid;
        console.log(formobj)
        app.util.request({
            'url': 'entry/wxapp/send_goods',
            data: formobj,
            success(res) {
                // console.log(res.data.data);
                //刷新评论
                //list_t[m_idx].comments = ;
                if (that.data.currentTab == 0) {
                    var list_t = that.data.m_list_0;
                    list_t[m_idx].isgoods = res.data.data.isgoods;
                    list_t[m_idx].goods_cnt = res.data.data.allgoods;
                    that.setData({m_list_0: list_t});
                } else if (that.data.currentTab == 1) {
                    var list_t = that.data.m_list_1;
                    list_t[m_idx].isgoods = res.data.data.isgoods;
                    list_t[m_idx].goods_cnt = res.data.data.allgoods;
                    that.setData({m_list_1: list_t});
                } else if (that.data.currentTab == 2) {
                    var list_t = that.data.m_list_2;
                    list_t[m_idx].isgoods = res.data.data.isgoods;
                    list_t[m_idx].goods_cnt = res.data.data.allgoods;
                    that.setData({m_list_2: list_t});
                }
                //刷新评论结束
            }
        });
    },
    /**
     * 打开打赏界面
     */
    open_shang_win: function (e) {
        var that = this;
        var tg = e.currentTarget.dataset;
        var mid = tg.mid;
        var idx = tg.idx;
        that.setData({
            shang_mid: mid,
            shang_idx: idx
        });

        that.util_model('open', 'shang');
    },
    /**
     * 打赏金额选择
     */
    tap_choonse_money: function (e) {
        this.setData({
            shmoney: e.currentTarget.dataset.shmoney,
            shmoney_choonse: true,
            clear_inshmoney: ''
        });
    },
    /**
     * 输入框输入金额取消选择状态和金额
     */
    clear_shmoney_choonse: function () {
        this.setData({
            shmoney: '',
            shmoney_choonse: false
        });
    },
    /**
     * 打赏表单提交
     */
    formSubmit_shange: function (e) {
        var that = this;
        var formID = e.detail.formId;
        var formobj = e.detail.value;
        formobj.formID = formID;
        var data_shmoney_choonse = that.data.shmoney_choonse;
        var data_shmoney = that.data.shmoney;

        console.log(data_shmoney_choonse)
        if (data_shmoney_choonse) {
            formobj.shmoney = data_shmoney;
            that.pay_shang(formobj);
        } else {
            if (formobj.shmoney == '') {
                wx.showToast({
                    image: '../../resource/images/static/error.png',
                    title: '打赏金额不能为空,请重新输入!',
                });
            } else {
                that.pay_shang(formobj);
            }

        }
    },
    /**
     * 打赏支付
     */
    pay_shang: function (formobj) {
        var that = this;
        //console.log(formobj);
        var that = this;
        app.util.request({
            'url': 'entry/wxapp/check_user_account',
            data: {
                openId: app.globalData.openId,
                ck_type: 'account_only',//只检查帐户
                ck_money: formobj.shmoney
            },
            success(crpres) {
                var rpjson = crpres.data.data;
                console.log(rpjson)
                if (rpjson.have_user) {
                    if (rpjson.ck_status) {
                        wx.showModal({
                            title: '提示',
                            content: '帐户可支付，确认支付' + formobj.shmoney + '元？',
                            cancelText: '取消',
                            confirmText: '帐户支付',
                            success: function (res) {
                                if (res.confirm) {
                                    // console.log('支付' + money+oncode+'account');
                                    app.util.request({
                                        'url': 'entry/wxapp/update_pay_auditstatus',
                                        data: {
                                            pay_channel: 'account',
                                            oncode: formobj.shang_mid,
                                            status: 1,
                                            ptype: "shang",
                                            openid: app.globalData.openId,
                                            fee: formobj.shmoney,
                                            u_nickname: app.globalData.userInfo.nickName,
                                            u_avatarurl: app.globalData.userInfo.avatarUrl
                                        },
                                        success(crpres) {

                                            console.log('支付回调检查:');
                                            console.log(crpres.data.data);
                                            that.util_model('close', 'shang');

                                            if (that.data.currentTab == 0) {
                                                var list_t = that.data.m_list_0;

                                                list_t[that.data.shang_idx].shang_cnt++;
                                                that.setData({m_list_0: list_t});
                                            } else if (that.data.currentTab == 1) {
                                                var list_t = that.data.m_list_1;

                                                list_t[that.data.shang_idx].shang_cnt++;
                                                that.setData({m_list_1: list_t});
                                            } else if (that.data.currentTab == 2) {
                                                var list_t = that.data.m_list_2;

                                                list_t[that.data.shang_idx].shang_cnt++;
                                                that.setData({m_list_2: list_t});
                                            }

                                            wx.showToast({
                                                title: '帐户打赏成功!',
                                            });

                                        }
                                    });

                                } else {
                                    //转向我的发布
                                    that.wx_api_pay(formobj);
                                }
                            }
                        });
                    } else {
                        //  wx.showToast({
                        //    image: '../../resource/images/static/error.png',
                        //    title: '帐户金币不足,微信支付',
                        //  });

                        that.wx_api_pay(formobj);
                    }

                } else {
                    //没有该用户直接微信支付
                    that.wx_api_pay(formobj);
                }
            }
        });

    },
    /**
     * 打赏支付界面唤起
     */
    wx_api_pay: function (formobj) {
        var that = this;

        console.log(formobj);
        var min = 1000, max = 9999;
        var rnum = Math.floor(Math.random() * (max - min + 1) + min) + new Date().getTime();
        //console.log(rnum)
        if (parseFloat(formobj.shmoney) < 1) {
            wx.showToast({
                image: '../../resource/images/static/error.png',
                title: '请输入至少为1元!',
            });
            return false;
        }
        //formobj.shmoney = 0.01;

        var prepay_id = "";
        app.util.request({
            'url': 'entry/wxapp/pay',
            data: {
                openid: app.globalData.openId,
                sum: formobj.shmoney,
                oncode: formobj.shang_mid + "," + rnum,
                ptype: "shang"
            },
            'cachetime': '0',
            success(res) {
                console.log('支付信息');
                prepay_id = res.data.data.package;
                console.log("prepay_id:" + prepay_id);
                console.log(res.data)
                if (res.data && res.data.data) {
                    wx.requestPayment({
                        'timeStamp': res.data.data.timeStamp,
                        'nonceStr': res.data.data.nonceStr,
                        'package': res.data.data.package,
                        'signType': 'MD5',
                        'paySign': res.data.data.paySign,
                        'success': function (res) {
                            //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
                            console.log('成功');
                            //
                            //检查支付回调成功
                            app.util.request({
                                'url': 'entry/wxapp/update_pay_auditstatus',
                                data: {
                                    pay_channel: 'wx',
                                    oncode: formobj.shang_mid,
                                    status: 1,
                                    ptype: "shang",
                                    openid: app.globalData.openId,
                                    fee: formobj.shmoney,
                                    u_nickname: app.globalData.userInfo.nickName,
                                    u_avatarurl: app.globalData.userInfo.avatarUrl,
                                    rnum: rnum
                                },
                                success(crpres) {
                                    console.log('支付回调检查:');
                                    console.log(crpres.data.data);
                                    that.util_model('close', 'shang');

                                    if (that.data.currentTab == 0) {
                                        var list_t = that.data.m_list_0;

                                        list_t[that.data.shang_idx].shang_cnt++;
                                        that.setData({m_list_0: list_t});
                                    } else if (that.data.currentTab == 1) {
                                        var list_t = that.data.m_list_1;

                                        list_t[that.data.shang_idx].shang_cnt++;
                                        that.setData({m_list_1: list_t});
                                    } else if (that.data.currentTab == 2) {
                                        var list_t = that.data.m_list_2;

                                        list_t[that.data.shang_idx].shang_cnt++;
                                        that.setData({m_list_2: list_t});
                                    }
                                    //更新支付
                                    wx.showToast({
                                        title: '微信打赏成功!',
                                    });

                                }
                            });
                        },
                        'fail': function (res) {
                            that.util_model('close', 'shang');
                            //支付失败后，
                            // console.log(res)
                            //转向我的发布
                            // wx.redirectTo({
                            //   url: '../myuser_send/msg_list',
                            // });

                        }
                    });
                }


            },
            fail: function (res) {
                //请求支付失败
                if (res.data.errno == 1) {
                    wx.showToast({
                        image: '../../resource/images/static/error.png',
                        title: res.data.message.message
                    })
                }
                //
            }
        });


    },
    /**
     * 加载初始化
     */
    load_list_init: function () {
        var that = this;
        if (that.data.currentTab == 0) {
            page_0 = 1;
            that.setData({m_list_0: []});
            that.setData({m_list_0_last: null});
            that.load_list(0, page_0);
        } else if (that.data.currentTab == 1) {
            page_1 = 1;
            that.setData({m_list_1: []});
            that.setData({m_list_1_last: null});
            that.load_list(1, page_1);
        } else if (that.data.currentTab == 2) {
            page_2 = 1;
            that.setData({m_list_2: []});
            that.setData({m_list_2_last: null});
            that.load_list(2, page_2);
        }
    },
    /**滚动到顶部 */
    tap_gotop: function (e) {
        console.log('============')

        this.setData({
            scrollTop: 0
        })

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        var that = this;
        that.setData({to_top_status: false});
        // wx.showToast({
        //   title: '下拉',
        // })
        that.load_list_init();
        //更新幻灯片
        that.load_banners();
        //加载菜单类型
        that.load_mtypes();
        //加载跑马灯
        that.load_pmd();
        wx.stopPullDownRefresh();
    }
    /**
     * 页面上拉触底事件的处理函数
     */
    , onReachBottom: function () {
        var that = this;
        //that.setData({to_top_status:true});
        if (that.data.ismore) {
            wx.showToast({
                title: '加载更多...',
            });
            if (that.data.currentTab == 0) {
                page_0++;
                that.load_list(0, page_0);
            } else if (that.data.currentTab == 1) {
                page_1++;
                that.load_list(1, page_1);
            } else if (that.data.currentTab == 2) {
                page_2++;
                that.load_list(2, page_2);
            }
        } else {
            wx.showToast({
                title: app.globalData.nomoretext
            });
        }
    },
    ffff: function (e) {
        console.log(e)
    },
    /**
     * 消息内容详细页
     */
    nav_msg_info: function (e) {
        wx.navigateTo({
            url: '../msg_info/msg_info?msg_id=' + e.currentTarget.dataset.msg_id
        })
    },
    /**
     * 列表分类打开
     */
    tap_open_mlist: function (e) {
        var tg = e.currentTarget.dataset;
        console.log(tg);
        var menu_id = tg.menu_id;
        var menu_name = tg.menu_name;
        wx.navigateTo({
            url: '../msg_list/msg_list?menu_id=' + menu_id + '&menu_name=' + menu_name
        });
    },
    /**
     * 打开消息类型页面
     */
    open_mlist: function (e) {
        var that = this;
        var tg = e.currentTarget.dataset;

        var menu_id = tg.menu_id;
        var menu_name = tg.menu_name;
        console.log('=====首页菜单===')
        console.log(tg);
        //return false;

        //分类跳转
        wx.navigateTo({
            url: '../msg_list/msg_list?menu_id=' + menu_id + '&menu_name=' + menu_name
        });


    },
    /**
     * sheet打开菜单
     */
    tap_add_sheet: function (e) {
        var that = this;
        var tg = e.currentTarget.dataset;
        var vtype = tg.type;
        var menu_id = tg.menu_id;
        var menu_name = tg.menu_name;

        console.log('=====菜单明细===' + vtype)
        console.log(tg)

        //return false;
        that.util_model('close', 'menu');
        if (vtype == '0') {
            //分类跳转

            wx.navigateTo({
                url: '../msg_list/msg_list?menu_id=' + menu_id + '&menu_name=' + menu_name + '&parent_menu_id=' + tg.pid + '&parent_menu_name=' + tg.pname
            });

        } else if (vtype == '1') {
            //小程序跳转
            var rd_wx_appid = tg.rd_wx_appid;
            var rd_wx_path = tg.rd_wx_path;
            var rd_wx_extradata = tg.rd_wx_extradata;
            var rd_wx_envversion = tg.rd_wx_envversion;
            that.tap_wxapp(rd_wx_appid, rd_wx_path, rd_wx_extradata, rd_wx_envversion);
        } else if (vtype == '2') {
            //内容图文
            that.tap_tw_win(tg.pid, tg.rd_tw_title);
        }

    },
    /**
     * 跳转小程序
     */
    tap_wxapp: function (rd_wx_appid, rd_wx_path, rd_wx_extradata, rd_wx_envversion) {
        var that = this;
        // console.log(rd_wx_appid);
        // console.log(rd_wx_path);
        // console.log(rd_wx_extradata);
        // console.log(rd_wx_envversion);
        if (rd_wx_extradata != '') {
            rd_wx_extradata = rd_wx_extradata.replace(/&quot;/g, '"');
            var j_rd_wx_extradata = JSON.parse(rd_wx_extradata);
            // console.log(rd_wx_extradata);
            // console.log('============')
            // console.log(JSON.parse(rd_wx_extradata))
            //参数不为空
            wx.navigateToMiniProgram({
                appId: rd_wx_appid,
                path: rd_wx_path,
                extraData: JSON.parse(rd_wx_extradata),
                envVersion: rd_wx_envversion,
                success(res) {
                    // 打开成功
                    wx.showToast({
                        title: '跳转小程序成功!',
                    });
                    that.util_model('close', 'menu');
                },
                fail(res) {
                    wx.showToast({
                        image: '../../resource/images/static/error.png',
                        title: '跳转小程序失败!',
                    });
                    that.util_model('close', 'menu');
                }
            });

        } else {
            wx.navigateToMiniProgram({
                appId: rd_wx_appid,
                path: rd_wx_path,
                extraData: {},
                envVersion: rd_wx_envversion,
                success(res) {
                    // 打开成功
                    wx.showToast({
                        title: '跳转小程序成功!',
                    });
                    that.util_model('close', 'menu');
                },
                fail(res) {
                    wx.showToast({
                        image: '../../resource/images/static/error.png',
                        title: '跳转小程序失败!',
                    });
                    that.util_model('close', 'menu');
                }
            });
        }

    },
    /**
     * 跳转到内部图文
     */
    tap_tw_win: function (tid, tanme) {
        //console.log('跳转图文'+tid+"|"+tanme)
        wx.navigateTo({url: '../banner_info/tw_info?bid=' + tid + "&tanme=" + tanme});
    }
    ,
    /**
     * 联系他
     */
    tap_lianxita: function (e) {
        var phone = e.currentTarget.dataset.uphone;
        wx.makePhoneCall({phoneNumber: phone});
    },
    /**
     * 搜索框
     */
    wxSearchInput: function (e) {
        console.log(e.detail.value)
        var that = this;
        that.setData({
            inputVal: e.detail.value
        });
    },
    clearCInput: function () {
        console.log('清除')
        this.setData({
            inputVal: ''
        });
    },
    wxSearchFn: function () {
        var that = this;
        //console.log('查询' + that.data.inputVal)
        that.setData({
            wxSearchFn: true
        });
        that.load_list_init();
    },
    run_pmd: function () {
        // 页面显示
        var vm = this;
        var length = vm.data.pmd_text.length * vm.data.size;//文字长度
        var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
        vm.setData({
            length: length,
            windowWidth: windowWidth,
            marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
        });
        vm.run1();// 水平一行字滚动完了再按照原来的方向滚动
    },
    run1: function () {
        var vm = this;
        var interval = setInterval(function () {
            if (-vm.data.marqueeDistance < vm.data.length) {
                vm.setData({
                    marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
                });
            } else {
                clearInterval(interval);
                vm.setData({
                    marqueeDistance: vm.data.windowWidth
                });
                vm.run1();
            }
        }, vm.data.interval_run);
    },
    /**
     * 打开地图标注
     */
    open_map: function (e) {
        //console.log(e.currentTarget.dataset)
        var lat = e.currentTarget.dataset.lat;
        var lon = e.currentTarget.dataset.lon;
        if (lat != '0') {
            wx.openLocation({
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                scale: 28
            });
        } else {
            wx.showToast({
                image: '../../resource/images/static/error.png',
                title: '座标错误,无法定位!',
            });
        }

    },
    /**
     * 打开用户列表
     */
    tapbyuserlist: function (e) {
        if (e.currentTarget.dataset.openid != '') {
            wx.setStorageSync('byuser', e.currentTarget.dataset.openid);
            wx.setStorageSync('unickname', e.currentTarget.dataset.nkname);
            wx.navigateTo({
                url: '../msg_list_byuser/msg_list',
            });
        } else {
            wx.showToast({
                image: '../../resource/images/static/error.png',
                title: '不可查看,该用户点赞时未授权!',
            });
        }
    },
    /**
     * 菜单
     */
    powerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.util_model(currentStatu, e.currentTarget.dataset.mtype);
    },
    util_model: function (currentStatu, mtype) {
        var that = this;
        /* 动画部分 */
        // 第1步：创建动画实例
        var animation = wx.createAnimation({
            duration: 200,  //动画时长
            timingFunction: "linear", //线性
            delay: 0  //0则不延迟
        });
        // 第2步：这个动画实例赋给当前的动画实例
        that.animation = animation;
        // 第3步：执行第一组动画
        animation.opacity(0).rotateX(-100).step();
        // 第4步：导出动画对象赋给数据对象储存
        that.setData({
            animationData: animation.export()
        });
        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function () {
            // 执行第二组动画
            animation.opacity(1).rotateX(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            that.setData({
                animationData: animation
            });
            //关闭
            if (currentStatu == "close") {
                if (mtype == 'menu') {
                    that.setData({
                        showModalStatus_sheet: false
                    });
                } else if (mtype == 'shang') {
                    that.setData({
                        showModalStatus_shang: false
                    });

                }
            }
        }.bind(that), 200);
        // 显示
        if (currentStatu == "open") {

            if (mtype == 'menu') {
                that.setData({
                    showModalStatus_sheet: true
                });
            } else if (mtype == 'shang') {
                that.setData({
                    showModalStatus_shang: true
                });

            }

        }
    }


})