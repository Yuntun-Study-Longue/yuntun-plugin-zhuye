import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated-route";
import UnauthenticatedRoute from "../components/unauthenticated-route";
import Loadable from "react-loadable";
import { REACT_APP_ROOT } from "../constants";

import NotFound from "./not-found";

const Login = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ "./login"),
  loading: () => null,
  modules: ["login"]
});

const Logout = Loadable({
  loader: () => import(/* webpackChunkName: "logout" */ "./logout"),
  loading: () => null,
  modules: ["logout"]
});

export default () => (
  <Switch>
    <Route exact path={REACT_APP_ROOT} component={Login} />
    <UnauthenticatedRoute exact path={`${REACT_APP_ROOT}/login`} component={Login} />
    <AuthenticatedRoute exact path={`${REACT_APP_ROOT}/logout`} component={Logout} />
    <Route component={NotFound} />
  </Switch>
);
