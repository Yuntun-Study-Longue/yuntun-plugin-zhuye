import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from "styled-components";
import { createForm } from 'rc-form';
import Page from '../../components/page';
import { loginUser } from '../../../modules/auth';
import { REACT_APP_ROOT } from "../../constants";
import sa from 'superagent';
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
  background-color: rgb(147, 149, 151);
  label { margin-right: 1em; font-size: 12px; font-weight: bold ;height: 24px; line-height: 24px; color: rgb(245, 223, 77); float: left; width: 120px; text-align: right; ::after { content: ':'} }
  input { display: block; padding: 0; color: #939597; height: 24px; outline: none; border: none; padding: 0 0 0 1em; background-color: rgb(214, 236, 240);}
  input:-webkit-autofill, input:-internal-autofill-selected { color: #939597 !important };
`

const WelcomeBanner = styled.div`
  height: 30%;
  text-align: center;
  color: #F5DF4D;
  font-weight: bold;
  padding-top: 10px;
`
const Button = styled.button`
  margin: 20px 0 0 0;
  color: #939597;
  background-color: #F5DF4D;
  border: none;
  outline: none;
  width: 120px;
  height: 40px;
`;
const SubmitBtn = styled(Button)`
  transform: translateX(20%);
  float: left;
`
const RegistBtn = styled(Button)`
  transform: translateX(-20%);
  float: right;
`

const Login = props => {
  const { getFieldProps, validateFields } = props.form;
  const submit = () => validateFields((error, data) => {
    if (error) return
    tool.deviceUtils.generateSid(data.phone).then(sid => {
      sa.get('/webcore/auth/base/yuntun/login', {...data, sid }).then(res => {
        const { code, msg, data } = res.body;
        if (!code) {
          props.loginUser(data)
          return message.success({ content: '登陆成功'})
        }
        return message.error({ content: '登陆失败:' + msg})
      })
    })
  });
  return <Page title="Login">
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
  </Page>
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loginUser }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(
  createForm()(Login)
);
