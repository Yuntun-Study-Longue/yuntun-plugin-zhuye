import React from 'react';
import { connect } from "react-redux";
import Page from '../../components/page';
const queryString = require('query-string');

const OAuth = ({ wx, location }) => {
  let query = queryString.parse(location.search);

  wx && query.code && wx.oauth.getUserInfo(query.code).then(userProfile => console.log(userProfile));

  return <Page
    id="oauth-callback"
    title="三方绑定授权页面"
    description="wait a minute..."
    noCrawl
  >
    <p>Wait a minute...</p>
  </Page>
}

const mapStateToProps = state => ({
  wx: state.auth.wx
});

export default connect(
  mapStateToProps,
  null
)(OAuth);
