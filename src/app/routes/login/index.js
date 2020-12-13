import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styled from "styled-components";
import { createForm } from "rc-form";
import Page from "../../components/page";

import { loginUser } from "../../../modules/auth";

const LoginGateWrap = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LoginGate = styled.div`
  width: 320px;
  height: 240px;
  background-color: rgb(147, 149, 151);
  label {
    margin-right: 1em;
    font-size: 12px;
    font-weight: bold;
    height: 24px;
    line-height: 24px;
    color: rgb(245, 223, 77);
    float: left;
    width: 120px;
    text-align: right;
    ::after {
      content: ":";
    }
  }
  input {
    display: block;
    padding: 0;
    color: #939597;
    height: 24px;
    outline: none;
    border: none;
    padding: 0 0 0 1em;
  }
  input:-webkit-autofill,
  input:-internal-autofill-selected {
    color: #939597 !important;
  }
`;

const WelcomeBanner = styled.div`
  height: 30%;
`;
const Button = styled.button`
  margin: 20px 0 0 0;
  color: #939597;
  background-color: #f5df4d;
  border: none;
  outline: none;
  width: 120px;
  height: 40px;
`;
const SubmitBtn = styled(Button)`
  transform: translateX(20%);
  float: left;
`;
const RegistBtn = styled(Button)`
  transform: translateX(-20%);
  float: right;
`;

const Login = props => {
  const { getFieldProps, validateFields } = props.form;
  const submit = () =>
    validateFields((error, value) => {
      console.log(error, value);
    });
  const regist = () => {};
  return (
    <Page title="Login">
      <LoginGateWrap>
        <LoginGate>
          <WelcomeBanner />
          <form>
            <label htmlFor="name">请输入用户名</label>
            <input
              id="name"
              type="text"
              placeholder="用户名"
              {...getFieldProps("username", {
                initialValue: ""
              })}
            />
            <br />
            <label htmlFor="passwd">请输入密码</label>
            <input
              id="passwd"
              type="password"
              placeholder="密码"
              {...getFieldProps("password", {
                initialValue: ""
              })}
            />
          </form>
          <SubmitBtn onClick={submit}>登录</SubmitBtn>
          <RegistBtn onClick={regist}>注册</RegistBtn>
        </LoginGate>
      </LoginGateWrap>
    </Page>
  );
};

const mapDispatchToProps = dispatch => bindActionCreators({ loginUser }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(createForm()(Login));
