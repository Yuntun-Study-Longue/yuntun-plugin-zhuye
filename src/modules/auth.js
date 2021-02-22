import Cookies from 'js-cookie';
import * as tool from "luna-utils";
import sa from 'superagent';

export const AUTHENTICATE = 'auth/AUTHENTICATE';
export const WXSUBSCRIBE = 'auth/WXSUBSCRIBE';
export const SET_CURRENT_USER = 'auth/SET_CURRENT_USER';
export const SET_WX_INSTANCE = 'auth/SET_WX_INSTANCE';
export const SET_WX_OPENID = 'auth/SET_WX_OPENID';

const initialState = {
  wx: null,
  isAuthenticated: false, // 是否登录
  openid: null,
  isWxSubscribed: false, // 是否关注公众号 0: 未关注 | 1: 已关注
  currentUser: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: action.authenticated
      };
    case WXSUBSCRIBE:
      return {
        ...state,
        isWxSubscribed: action.isWxSubscribed
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.user
      };
    case SET_WX_INSTANCE:
      return {
        ...state,
        wx: action.wx
      };
    case SET_WX_OPENID:
      return {
        ...state,
        openid: action.openid
      }

    default:
      return state;
  }
};

export const setCurrentUser = user => dispatch =>
  new Promise(resolve => {
    dispatch({
      type: SET_CURRENT_USER,
      user
    });

    Cookies.set('yuntun-website', user, { expires: 7 });
    if (user.token) {
      dispatch({
        type: AUTHENTICATE,
        authenticated: true
      });
    }

    resolve(user);
  });

export const establishCurrentUser = () => dispatch =>
  new Promise(resolve => {
    let userFromCookie = Cookies.getJSON('yuntun-website');

    // 如果是微信环境, 初始化config信息 + 微信用户信息 + 系统用户信息
    if (tool.h5Env.isWX()) {
      // 初始化h5 console工具库
      // setTimeout(() => {
      //   tool.h5Env.init()
      // }, 0);

      // 微信环境从缓存获取 openid，避免多次授权
      let openidFromCookie = Cookies.get('openid');
      if (openidFromCookie) {
        dispatch(setOpenID(openidFromCookie));
        tool.authorizeUtils.wxFetchUserInfoByOpenID(openidFromCookie).then( userinfo => {
          dispatch(setCurrentUser({
            ...userFromCookie,
            unionid: userinfo.unionid,
            avatar: !userFromCookie ? userinfo.headimgurl : userFromCookie.avatar,
          }));

          dispatch({
            type: WXSUBSCRIBE,
            isWxSubscribed: userinfo.subscribe === 1
          });
        })
      }

      // 微信环境初始化，获取 OpenID
      const WechatJSSDK = require('yuntun-wechat-jssdk')
      // 微信jssdk config配置
      sa.post(`${tool.domainUtils.getHost()}/webcore/wx/base/wx9b261f80ad7c8c47/wx_config`).send({ web_url: window.location.href.split('#')[0] }).then(res => {
        const wx = new WechatJSSDK({
          //below are mandatory options to finish the wechat signature verification
          //the 4 options below should be received like api '/get-signature' above
          'appId': res.body.appid,
          'nonceStr': res.body.noncestr,
          'signature': res.body.signature,
          'timestamp': res.body.timestamp,
          //below are optional
          //enable debug mode, same as debug
          'debug': false,
          'jsApiList': [
            'onMenuShareTimeline', 
            'onMenuShareAppMessage',
            'chooseWXPay',
          ], //optional, pass all the jsapi you want, the default will be ['onMenuShareTimeline', 'onMenuShareAppMessage']
          'openTagList': [
            'wx-open-launch-weapp',
            'wx-open-subscribe'
          ],
          'customUrl': 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js' //set custom weixin js script url, usually you don't need to add this js manually
        })
        wx.initialize().then( w => dispatch({ type: SET_WX_INSTANCE, wx: { 
          shareOnMoment: w.shareOnMoment.bind(w),
          shareOnChat: w.shareOnChat.bind(w),
          callWechatApi: w.callWechatApi.bind(w),
          wxThirdPartLogin: tool.authorizeUtils.wxThirdPartLogin,
          wxFetchUserInfo: tool.authorizeUtils.wxFetchUserInfo,
          wxFetchBaseInfo: tool.authorizeUtils.wxFetchBaseInfo,
          wxFetchUserInfoByOpenID: tool.authorizeUtils.wxFetchUserInfoByOpenID,
        }}) );
      })
    }
    else if (userFromCookie) {
      dispatch(setCurrentUser(userFromCookie));
      resolve(userFromCookie);
    }

    resolve({});
  });

export const setOpenID = openid => dispatch =>
  new Promise(resolve => {
    dispatch({
      type: SET_WX_OPENID,
      openid
    });

    Cookies.set('openid', openid, { expires: 7 });
    resolve(openid);
  })

export const loginUser = (user) => dispatch =>
  new Promise((resolve, reject) => {
    let userinfo = user;
    if (tool.h5Env.isWX()) {
      let openidFromCookie = Cookies.get('openid');
      userinfo = openidFromCookie ? { ...user, openid: openidFromCookie } : user;
    }
    dispatch(setCurrentUser(userinfo));
    resolve(userinfo);
  });

export const logoutUser = () => dispatch =>
  new Promise(resolve => {
    dispatch({
      type: AUTHENTICATE,
      authenticated: false
    });

    dispatch({
      type: SET_CURRENT_USER,
      user: {}
    });

    Cookies.remove('yuntun-website');
    resolve({});
  });
