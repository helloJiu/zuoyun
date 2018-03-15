/**
 * Created by jimmy-jiang on 2016/11/21.
 */
import {Token} from 'token.js';
import {Config} from 'config.js';

class Base {
    constructor() {
        "use strict";
        this.baseRestUrl = Config.restUrl;
        this.onPay = Config.onPay;
    }

    //http 请求类, 当noRefech为true时，不做未授权重试机制
    request(params, noRefetch) {
        var that = this,
            url = this.baseRestUrl + params.url;
        if (!params.type) {
            params.type = 'get';
        }
        /*不需要再次组装地址*/
        if (params.setUpUrl == false) {
            url = params.url;
        }
        wx.request({
            url: url,
            data: params.data,
            method: params.type,
            header: {
                'content-type': 'application/json',
                'token': wx.getStorageSync('token')
            },
            success: function (res) {

                // 判断以2（2xx)开头的状态码为正确
                // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
                var code = res.statusCode.toString();
                var startChar = code.charAt(0);
                if (startChar == '2') {
                    params.sCallback && params.sCallback(res.data);
                } else {
                    if (code == '401') {
                        if (!noRefetch) {
                            that._refetch(params);
                        }
                    }
                    that._processError(res);
                    params.eCallback && params.eCallback(res.data);
                }
            },
            fail: function (err) {
                //wx.hideNavigationBarLoading();
                that._processError(err);
                // params.eCallback && params.eCallback(err);
            }
        });
    }

    _processError(err) {
        console.log(err);
    }

    _refetch(param) {
        var token = new Token();
        token.getTokenFromServer((token) => {
            this.request(param, true);
        });
    }

    /*获得元素上的绑定的值*/
    getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    };

    getUserInfo() {
        var that = this;

        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.getUserInfo({
                        success: function (data) {

                            // that.getUserInfo_det(res.code);
                        }, fail: function () {
                            wx.showModal({
                                title: '提示',
                                content: '授权获取用户信息失败,将不可发布消息和评论!',
                                confirmText: '去设置',
                                success: function (mres) {
                                    if (mres.confirm) {
                                        wx.openSetting({
                                            success: function (pdata) {
                                                if (pdata) {
                                                    if (pdata.authSetting["scope.userInfo"] == true) {
                                                        console.log('取得用户信息授权成功');

                                                        wx.login({
                                                            success: function (twores) {
                                                                if (twores.code) {
                                                                    // that.getUserInfo_det(twores.code);
                                                                }
                                                            }
                                                        });


                                                    } else {
                                                        that.getUserInfo();
                                                    }
                                                }
                                            }
                                        });
                                    } else {
                                        that.getUserInfo();
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });


    }

}
;

export {Base};
