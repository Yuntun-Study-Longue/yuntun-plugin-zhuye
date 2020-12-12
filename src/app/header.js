import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { REACT_APP_ROOT } from "./constants";

const links = [
  {
    to: `${REACT_APP_ROOT}`,
    text: <FormattedMessage id="app.header.homepage" />
  },
  {
    to: `${REACT_APP_ROOT}/about`,
    text: <FormattedMessage id="app.header.about" />
  },
  {
    to: `${REACT_APP_ROOT}/profile/1`,
    text: <FormattedMessage id="app.header.profile1" />
  },
  {
    to: `${REACT_APP_ROOT}/profile/2`,
    text: <FormattedMessage id="app.header.profile2" />
  },
  {
    to: `${REACT_APP_ROOT}/login`,
    text: <FormattedMessage id="app.header.login" />,
    auth: false
  },
  {
    to: `${REACT_APP_ROOT}/dashboard`,
    text: <FormattedMessage id="app.header.dashboard" />,
    auth: true
  },
  {
    to: `${REACT_APP_ROOT}/logout`,
    text: <FormattedMessage id="app.header.logout" />,
    auth: true
  },
  {
    to: `${REACT_APP_ROOT}/this-is-broken`,
    text: <FormattedMessage id="app.header.this-is-broken" />
  }
];

const isCurrent = (to, current) => {
  if (to === REACT_APP_ROOT && current === to) {
    return true;
  } else if (to !== REACT_APP_ROOT && current.includes(to)) {
    return true;
  }

  return false;
};

const HeaderLink = ({ to, text, current }) => (
  <li className={isCurrent(to, current) ? "current" : ""}>
    <Link to={to}>{text}</Link>
  </li>
);

export default ({ isAuthenticated, current }) => (
  <header id="header">
    <h1 id="title">Yuntun Plugin Demo</h1>
    <ul id="links">
      {links.map((link, index) => {
        const TheLink = <HeaderLink key={index} current={current} {...link} />;

        if (link.hasOwnProperty("auth")) {
          if (link.auth && isAuthenticated) {
            return TheLink;
          } else if (!link.auth && !isAuthenticated) {
            return TheLink;
          }

          return null;
        }

        return TheLink;
      })}
    </ul>
  </header>
);
