import Cookies from 'js-cookie';
import * as tool from "luna-utils";
import sa from 'superagent';

export const AUTHENTICATE = 'auth/AUTHENTICATE';
export const SET_CURRENT_USER = 'auth/SET_CURRENT_USER';

const initialState = {
  isAuthenticated: false,
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
        // import WechatJSSDK from 'wechat-jssdk';
        sa.post('/webcore/base/wx_config').send({ web_url: window.location.href.split('#')[0] }).then(res => {
          console.log(res.body, '=== body')
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
