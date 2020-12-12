import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { REACT_APP_ROOT } from "../../constants";

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={`${REACT_APP_ROOT}/login?redirect=${props.location.pathname}`}
        />
      )
    }
  />
);

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  null
)(AuthenticatedRoute);
