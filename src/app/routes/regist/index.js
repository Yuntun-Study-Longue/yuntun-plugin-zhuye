import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from "styled-components";
import { createForm } from 'rc-form';
import Page from '../../components/page';
import { REACT_APP_ROOT } from "../../constants";
import { loginUser } from '../../../modules/auth';

const RegistGateWrap = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  `
const RegistGate = styled.div`
  position: relative;
  width: 320px;
  height: 360px;
  background-color: rgb(147, 149, 151);
  label { margin-right: 1em; font-size: 12px; font-weight: bold ;height: 24px; line-height: 24px; color: rgb(245, 223, 77); float: left; width: 120px; text-align: right; ::after { content: ':'} }
  input { display: block; padding: 0; color: #939597; height: 24px; outline: none; border: none; padding: 0 0 0 1em; background-color: rgb(214, 236, 240);}
  input::-webkit-textfield-decoration-container { background-color: rgb(214, 236, 240); }
  input:-webkit-autofill, input:-internal-autofill-selected { color: #939597 !important };
  input[id='smscode'] { width: 80px; float: left; }
`

const WelcomeBanner = styled.div`
  height: 20%;
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
  transform: translateX(-20%);
  float: right;
`
const ResetBtn = styled(Button)`
  transform: translateX(20%);
  float: left;
`
const BackBtn = styled(Button)`
  position: absolute;
  margin: 0;
  top: 0px;
  left: 0px;
  width: 60px;
  height: 30px;
`
const SmsCodeBtn = styled.button`
    outline: none;
    border: none;
    width: 65px;
    height: 24px; 
    font-size: 12px;
    background-color: #F5DF4D;
    color: #939597;
    padding: 0;
`


const Regist = props => {
  const { getFieldProps, validateFields } = props.form;
  let [countdown, setCount] = useState(0);

  useEffect(() => {
    if (countdown === 0) return
    const timer = setTimeout(() => setCount(--countdown), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const submit = () => validateFields((error, value) => {
    if (error) return
    console.log(error, value);
  });
  return <Page title="Login">
    <RegistGateWrap>
      <RegistGate>
        <BackBtn onClick={() => props.history.goBack()}>返回</BackBtn>
        <WelcomeBanner>注册页面</WelcomeBanner>
        <form>
          <label htmlFor="phone">手机号</label>
          <input id='phone' type='tel' placeholder="手机号" autoComplete="off"
          {...getFieldProps('phone', {
            initialValue: '',
            rules: [{required: true }]
          })} />
          <br/>
          <label htmlFor="smscode">验证码</label>
          <input id='smscode' type='number' placeholder="验证码" autoComplete="off"
          {...getFieldProps('smscode', {
            initialValue: '',
            rules: [{required: true }]
          })} />
          <SmsCodeBtn disabled={countdown} onClick={() => setCount(60)}>{ countdown || '获取验证码' }</SmsCodeBtn>
          <br/>
          <br/>
          <label htmlFor="passwd">新密码</label>
          <input id='passwd' type='password' placeholder="请输入新密码" autoComplete="new-password"
          {...getFieldProps('new-password', {
            initialValue: '',
            rules: [{ required: true, }]
          })} />
          <br/>
          <label htmlFor="passwd">密码</label>
          <input id='passwd' type='password' placeholder="请重复输入密码" autoComplete="password"
          {...getFieldProps('password', {
            initialValue: '',
            rules: [{ required: true, }]
          })} />
        </form>
        <ResetBtn onClick={() => props.form.resetFields()}>重置</ResetBtn>
        <SubmitBtn onClick={submit}>确定</SubmitBtn>
      </RegistGate>
    </RegistGateWrap>
  </Page>
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loginUser }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(
  createForm()(Regist)
);
