import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated-route";
import UnauthenticatedRoute from "../components/unauthenticated-route";
import Loadable from "react-loadable";
import { REACT_APP_ROOT } from "../constants";

import NotFound from "./not-found";
import cardList from "./card-list";

const Regist = Loadable({
  loader: () => import(/* webpackChunkName: "regist" */ "./regist"),
  loading: () => null,
  modules: ["regist"]
})

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

const Policy = Loadable({
  loader: () => import(/* webpackChunkName: "policy" */ "./policy"),
  loading: () => null,
  modules: ["policy"]
});

const CardList = Loadable({
  loader: () => import(/* webpackChunkName: "cardlist" */ "./card-list"),
  loading: () => null,
  modules: ["cardlist"]
});

export default () => (
  <Switch>
    <Route exact path={REACT_APP_ROOT} component={Login} />
    <Route exact path={`${REACT_APP_ROOT}/policy`} component={Policy} />
    <Route exact path={`${REACT_APP_ROOT}/cardlist`} component={CardList} />
    <UnauthenticatedRoute exact path={`${REACT_APP_ROOT}/regist`} component={Regist} />
    <UnauthenticatedRoute exact path={`${REACT_APP_ROOT}/login`} component={Login} />
    <AuthenticatedRoute exact path={`${REACT_APP_ROOT}/logout`} component={Logout} />
    <Route component={NotFound} />
  </Switch>
);
