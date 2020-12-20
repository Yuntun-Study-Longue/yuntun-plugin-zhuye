import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from "styled-components";
import { createForm } from 'rc-form';
import Page from '../../components/page';
import { REACT_APP_ROOT } from "../../constants";
import sa from 'superagent';
import * as tool from "luna-utils";
import message from "rc-message";
import "rc-message/assets/index.css"

const RegistGateWrap = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const RegistGate = styled.div`
  position: relative;
  width: 320px;
  height: 380px;
  background-color: rgb(147, 149, 151);
  label { margin-right: 1em; font-size: 12px; font-weight: bold ;height: 24px; line-height: 24px; color: rgb(245, 223, 77); float: left; width: 100px; text-align: right; ::after { content: ':'} }
  input { display: block; padding: 0; color: #939597; width: 145px; height: 24px; outline: none; border: none; padding: 0 0 0 1em; background-color: rgb(214, 236, 240);}
  input::-webkit-textfield-decoration-container { background-color: rgb(214, 236, 240); }
  input:-webkit-autofill, input:-internal-autofill-selected { color: #939597 !important };
  input[id='code'] { width: 80px; float: left; }
  input[id='rule'] { float: left; width: auto; outline: none; ::before { background: #000; }; margin-right: 5px;}
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
const RegistRule = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  input, label { margin: 0 }
  label { width: auto; margin-left: 5px; ::after { content: ''} }
  label a { color: #F5DF4D }
`
const RuleList = styled.ul`
  width: 45%;
  margin: 0 auto;
  font-size: 12px;
  li {
    font-weight: bold;
    margin: 5px 0;
    text-decoration: underline;
    color: #F5DF4D;
    a { color: #F5DF4D; }
    ::before { content: '《' }
    ::after { content: '》' }
  }
`

const Regist = props => {
  const { getFieldProps, validateFields } = props.form;
  let [countdown, setCount] = useState(0);

  useEffect(() => {
    if (countdown === 0) return
    const timer = setTimeout(() => setCount(--countdown), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // 获取验证码
  function requestCode(e) {
    e.preventDefault()
    const phone = document.querySelector('input[type=tel]').value
    if (!phone) return message.warning({ content: '手机号未填写' })

    tool.deviceUtils.generateSid(phone).then(sid => {
      sa.get('/webcore/auth/base/yuntun/bind_phone', { phone, sid, type: 'regist'}).then(res => {
        message.success({ content: '验证码已发送' })
        setCount(60)
      })
    })
  }

  // 注册
  function submit(e) {
    e.preventDefault()
    validateFields((error, data) => {
      if (error) return
      tool.deviceUtils.generateSid(data.phone).then(sid => {
        sa.post('/webcore/auth/base/yuntun/regist', {...data, sid }).then(res => {
          const { code, msg, data } = res.body;
          if (!code) {
            props.history.push(`${REACT_APP_ROOT}/login`);
            return message.success({ content: '注册成功' })
          }
          return message.error({ content: msg })
        })
      })
    });
  }
  
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
          <label htmlFor="code">验证码</label>
          <input id='code' type='number' placeholder="验证码" autoComplete="off"
          {...getFieldProps('code', {
            initialValue: '',
            rules: [{required: true }]
          })} />
          <SmsCodeBtn disabled={countdown} onClick={requestCode.bind(this)}>{ countdown || '获取验证码' }</SmsCodeBtn>
          <br/>
          <br/>
          <label htmlFor="passwd">新密码</label>
          <input id='passwd' type='password' placeholder="请输入新密码" autoComplete="new-password"
          {...getFieldProps('new_passwd', {
            initialValue: '',
            rules: [{ required: true, }]
          })} />
          <br/>
          <label htmlFor="passwd">密码</label>
          <input id='passwd' type='password' placeholder="请重复输入密码" autoComplete="password"
          {...getFieldProps('repeat_passwd', {
            initialValue: '',
            rules: [{ required: true, }]
          })} />
          <br/>
          <RegistRule>
            <label>
              <input id="rule" type='checkbox' />
              <span></span>
              我已阅读并同意以下条款
            </label>
          </RegistRule>
          <RuleList>
            <li><a target='_blank' href={`${REACT_APP_ROOT}/policy`}>云吞自习室注册协议</a></li>
          </RuleList>
        </form>
        <ResetBtn onClick={() => props.form.resetFields()}>重置</ResetBtn>
        <SubmitBtn onClick={submit.bind(this)}>确定</SubmitBtn>
      </RegistGate>
    </RegistGateWrap>
  </Page>
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(
  createForm()(Regist)
);
