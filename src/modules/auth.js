import Cookies from 'js-cookie';
import * as tool from "luna-utils";
import sa from 'superagent';

export const AUTHENTICATE = 'auth/AUTHENTICATE';
export const SET_CURRENT_USER = 'auth/SET_CURRENT_USER';
export const SET_WX_INSTANCE = 'auth/SET_WX_INSTANCE';

const initialState = {
  wx: null,
  isAuthenticated: false, // 是否登录
  isWxSubscribed: false, // 是否关注公众号
  currentUser: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: action.authenticated
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
    
    dispatch({
      type: AUTHENTICATE,
      authenticated: true
    });

    resolve(user);
  });

export const establishCurrentUser = () => dispatch =>
  new Promise(resolve => {
    let userFromCookie = Cookies.getJSON('yuntun-website');

    if (userFromCookie) {
      dispatch(setCurrentUser(userFromCookie));
      resolve(userFromCookie);
    } else {
      // 判断所处的环境
      if (tool.h5Env.isWX()) {
        // 微信环境初始化，获取 OpenID
        const WechatJSSDK = require('wechat-jssdk')
        sa.post('/webcore/wx/base/wx9b261f80ad7c8c47/wx_config').send({ web_url: window.location.href.split('#')[0] }).then(res => {
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
              'onMenuShareAppMessage'
            ], //optional, pass all the jsapi you want, the default will be ['onMenuShareTimeline', 'onMenuShareAppMessage']
            'customUrl': '' //set custom weixin js script url, usually you don't need to add this js manually
          })
          wx.initialize().then( w => dispatch({ type: SET_WX_INSTANCE, wx: { 
            shareOnMoment: w.shareOnMoment.bind(w),
            shareOnChat: w.shareOnChat.bind(w),
            wxThirdPartLogin: tool.authorizeUtils.wxThirdPartLogin,
            wxFetchUserInfo: tool.authorizeUtils.wxFetchUserInfo,
          }}) );
        })
      }

      resolve({});
    }
  });

export const loginUser = (user) => dispatch =>
  new Promise((resolve, reject) => {

    dispatch(setCurrentUser(user));
    resolve(user);
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
