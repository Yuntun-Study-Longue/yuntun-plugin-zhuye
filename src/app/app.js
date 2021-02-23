// The basics
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { IntlProvider, addLocaleData, FormattedMessage, FormattedTime } from "react-intl";
import theme from "styled-theming";
import styled, { ThemeProvider } from "styled-components";
import * as colors from "./global/colors";

// Action creators and helpers
import { establishCurrentUser, logoutUser } from "../modules/auth";
import { isServer } from "../store";

import Routes from "./routes";

import { GlobalStyle } from "./global/style";

import enTranslationMessages from "./lang/message/en";
import zhTranslationMessages from "./lang/message/zh";
const messages = {
  en: enTranslationMessages,
  zh: zhTranslationMessages
};

class App extends Component {
  state = { lang: "en", mode: "dark" };
  componentWillMount() {
    if (!isServer) {
      const initialLang = navigator.language.split("-").shift() || "en";
      addLocaleData(require(`react-intl/locale-data/${initialLang}`));
      this.props.establishCurrentUser();
    }
  }

  // loadLocaleData(locale) {
  //   switch (locale) {
  //     case 'fr':
  //       return import('compiled-lang/fr.json')
  //     default:
  //       return import('compiled-lang/en.json')
  //   }
  // }

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
    const { lang, mode } = this.state;
    // const messages = await loadLocaleData(lang)

    return (
      <Fragment>
        <GlobalStyle />
        <ThemeProvider theme={{ mode }}>
          <IntlProvider locale={lang} messages={messages[lang]}>
            <div id="app">
              <LoginOut isShow={this.props.isAuthenticated}>
                <button name='logout' onClick={this.props.logoutUser.bind(this)}>登出</button>
              </LoginOut>
              <LangSwitchBtn lang={lang}>
                <button name='zh' type="button" onClick={() => { this.setState({ lang: "en", mode: "dark" }); }} > {" "} 中文{" "} </button>
                <button name='en' type="button" onClick={() => { this.setState({ lang: "zh", mode: "light" }); }} > {" "} 英文{" "} </button>
              </LangSwitchBtn>
              {/* <p> The time is: <FormattedTime value={new Date().getTime()} /> </p> */}
              <div id="content">
                <Routes />
              </div>
            </div>
          </IntlProvider>
        </ThemeProvider>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => bindActionCreators({ establishCurrentUser, logoutUser }, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);

const LoginOut = styled.div`
  display: ${ props => props.isShow ? 'block' : 'none' };
  z-index: 999;
  position: fixed;
  right: 0;
  bottom: 32px;
  opacity: 0.6;
  button { outline: none; border: none; width: 60px; height: 32px;}
`

const LangSwitchBtn = styled.div`
  z-index: 999;
  position: fixed;
  right: 0;
  bottom: 0;
  opacity: 0.6;
  button { outline: none; border: none; width: 60px; height: 32px;}
  button[name='zh'] { background-color: #F5DF4D; display: ${props => props.lang === 'zh' ? 'block' : 'none' } }
  button[name='en'] { background-color: ${colors.Dousha}; color: #fff; display: ${props => props.lang === 'en' ? 'block' : 'none' } }
`;

const titleColor = theme("mode", {
  light: "#ff9100",
  dark: "#000"
});

const Title = styled.h1`
  font-size: 1.5em;
  color: ${titleColor};
`;
