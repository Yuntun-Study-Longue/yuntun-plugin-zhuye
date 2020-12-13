// The basics
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { IntlProvider, addLocaleData, FormattedMessage, FormattedTime } from "react-intl";
import theme from "styled-theming";
import styled, { ThemeProvider } from "styled-components";

// Action creators and helpers
import { establishCurrentUser } from "../modules/auth";
import { isServer } from "../store";

import Header from "./header";
import Routes from "./routes";

import { GlobalStyle } from "./global/style";

import enTranslationMessages from "./lang/message/en";
import zhTranslationMessages from "./lang/message/zh";
const messages = {
  en: enTranslationMessages,
  zh: zhTranslationMessages
};

class App extends Component {
  state = { lang: "en", mode: "light" };
  componentWillMount() {
    if (!isServer) {
      const initialLang = navigator.language.split("-").shift() || "en";
      addLocaleData(require(`react-intl/locale-data/${initialLang}`));
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
    const { lang, mode } = this.state;
    return (
      <Fragment>
        <GlobalStyle />
        <ThemeProvider theme={{ mode }}>
          <IntlProvider locale={lang} messages={messages[lang]}>
            <div id="app">
              <LangSwitchBtn lang={lang}>
                <button name='zh' type="button" onClick={() => { this.setState({ lang: "en", mode: "light" }); }} > {" "} 中文{" "} </button>
                <button name='en' type="button" onClick={() => { this.setState({ lang: "zh", mode: "dark" }); }} > {" "} 英文{" "} </button>
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

const mapDispatchToProps = dispatch => bindActionCreators({ establishCurrentUser }, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);

const LangSwitchBtn = styled.div`
  position: absolute;
  right: 0;
  button { outline: none; border: none; width: 60px; height: 32px;}
  button[name='zh'] { background-color: #F5DF4D; display: ${props => props.lang === 'zh' ? 'block' : 'none' } }
  button[name='en'] { background-color: #939597; color: #fff; display: ${props => props.lang === 'en' ? 'block' : 'none' } }
`;

const titleColor = theme("mode", {
  light: "#ff9100",
  dark: "#000"
});

const Title = styled.h1`
  font-size: 1.5em;
  color: ${titleColor};
`;
