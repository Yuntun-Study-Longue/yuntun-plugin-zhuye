import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from "react-intl";
import { bindActionCreators } from 'redux';
import styled from "styled-components";
import { createForm } from 'rc-form';
import Page from '../../components/page';
import { loginUser, setOpenID } from '../../../modules/auth';
import { REACT_APP_ROOT } from "../../constants";
import sa from 'superagent';
import * as colors from '../../global/colors';
import * as tool from "luna-utils";
import message from "rc-message";
import "rc-message/assets/index.css"

const LoginGateWrap = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const LoginGate = styled.div`
  width: 320px;
  height: 240px;
  background-color: ${colors.UltimateGrayFn(.6)};
  label { margin-right: 1em; font-size: 12px; font-weight: bold ;height: 24px; line-height: 24px; color: ${colors.LoginTitleColor}; float: left; width: 100px; text-align: right; ::after { content: ':'} }
  input { display: block; padding: 0; color: ${colors.UltimateGray}; height: 24px; outline: none; border: none; padding: 0 0 0 1em; background-color: ${colors.YueBai};}
  input:-webkit-autofill, input:-internal-autofill-selected { color: ${colors.UltimateGray} !important };
`
LoginGate.defaultProps = { variant: 'default' }

const WelcomeBanner = styled.div`
  height: 30%;
  text-align: center;
  color: ${colors.LoginTitleColor};
  font-weight: bold;
  padding-top: 10px;
`
WelcomeBanner.defaultProps = { variant: 'default' }

const Button = styled.button`
  margin: 20px 0 0 0;
  color: ${colors.btnColor};
  background-color: ${colors.btnBgColor};
  border: none;
  outline: none;
  width: 120px;
  height: 40px;
`;
Button.defaultProps = { variant: 'default' }

const SubmitBtn = styled(Button)`
  transform: translateX(20%);
  float: left;
`
const RegistBtn = styled(Button)`
  transform: translateX(-20%);
  float: right;
`
const XinJieWrap = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url('https://yuntun-web.oss-cn-beijing.aliyuncs.com/2e3aef5c524ee3949956600bf6881d44') no-repeat fixed center;
`

const Login = props => {
  useEffect(() => {
    if (!tool.systemUtils.isServer()) {
      props.wx && props.wx.shareOnMoment({
        type: 'link',
        title: '欢迎加入云吞自习室',
        link: window.location.href,
        imgUrl: 'https://yuntun-web.oss-cn-beijing.aliyuncs.com/49d691adb21dad12cbf70090af1f3644'
      });
      props.wx && props.wx.shareOnChat({
        type: 'link',
        title: '欢迎加入云吞自习室',
        link: window.location.href,
        imgUrl: 'https://yuntun-web.oss-cn-beijing.aliyuncs.com/49d691adb21dad12cbf70090af1f3644',
        desc: '农历新年邀请好友加入赢好礼相送！',
        success: function (){},
        cancel: function (){}
      });
      // 微信环境静默授权，获取 openid
      if (tool.h5Env.isWX() && props.wx && !props.openid) {
        props.wx.wxFetchBaseInfo().then( res => {
          props.setOpenID(res.openid)
        })
      }
    }
  }, [props.wx])
  const { getFieldProps, validateFields } = props.form;
  const submit = () => validateFields((error, data) => {
    if (error) return
    tool.deviceUtils.generateSid(data.phone).then(sid => {
      let submitData = {...data, sid };
      if (props.openid) {
        submitData = { ...submitData, h5_openid: props.openid }
      }

      sa.get('/webcore/auth/base/yuntun/login', submitData).then(res => {
        const { code, msg, data } = res.body;
        const {redirect} = tool.domainUtils.getSearchJSON(props.location.search)
        if (!code) {
          props.loginUser(data)
          props.history.push(redirect || `${REACT_APP_ROOT}/shoplist/mine`)
          return message.success({ content: '登陆成功'})
        }
        return message.error({ content: '登陆失败:' + msg})
      })
    })
  });
  return <Page title="登录页面">
    <XinJieWrap>
      <LoginGateWrap>
        <LoginGate>
          <WelcomeBanner>登录页面</WelcomeBanner>
          <form>
            <label htmlFor="phone">请输入手机号</label>
            <input id='phone' type='text' placeholder="手机号" autoComplete="off"
            {...getFieldProps('phone', {
              initialValue: '',
              rules: [{required: true }]
            })} />
            <br/>
            <label htmlFor="passwd">请输入密码</label>
            <input id='passwd' type='password' placeholder="密码" autoComplete="new-password"
            {...getFieldProps('passwd', {
              initialValue: '',
              rules: [{ required: true, }]
            })} />
          </form>
          <SubmitBtn onClick={submit}>登录</SubmitBtn>
          <RegistBtn onClick={() => props.history.push(`${REACT_APP_ROOT}/regist`)}>注册</RegistBtn>
        </LoginGate>
      </LoginGateWrap>
    </XinJieWrap>
  </Page>
}

const mapStateToProps = state => ({
  wx: state.auth.wx,
  openid: state.auth.openid,
  isWxSubscribed: state.auth.isWxSubscribed,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loginUser, setOpenID }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  createForm()(Login)
);
