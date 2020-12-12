// The basics
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import {
  IntlProvider,
  addLocaleData,
  FormattedMessage,
  FormattedTime
} from "react-intl";
import styled from "styled-components";

// Action creators and helpers
import { establishCurrentUser } from "../modules/auth";
import { isServer } from "../store";

import Header from "./header";
import Routes from "./routes";

import "./app.css";

import zhTranslationMessages from "./lang/message/zh";
import enTranslationMessages from "./lang/message/en";

const initialLang = "zh";
addLocaleData(require(`react-intl/locale-data/${initialLang}`));

const messages = {
  en: enTranslationMessages,
  zh: zhTranslationMessages
};

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

class App extends Component {
  state = { lang: initialLang };
  componentWillMount() {
    if (!isServer) {
      this.props.establishCurrentUser();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.lang !== this.state.lang) {
      console.log("fetch message from remote");
      return true;
    } else if (nextProps !== this.props) {
      return true;
    }
    return false;
  }

  render() {
    const { lang } = this.state;
    return (
      <IntlProvider locale={lang} messages={messages[lang]}>
        <div id="app">
          <Title>我是Styled Component</Title>
          <p>
            <FormattedMessage id="app.home.subtitle" />
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ lang: "zh" });
            }}
          >
            中文
          </button>
          <button
            type="button"
            onClick={() => {
              this.setState({ lang: "en" });
            }}
          >
            英文
          </button>
          <p>
            The time is: <FormattedTime value={new Date().getTime()} />
          </p>
          <Header
            isAuthenticated={this.props.isAuthenticated}
            current={this.props.location.pathname}
          />
          <div id="content">
            <Routes />
          </div>
        </div>
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ establishCurrentUser }, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
