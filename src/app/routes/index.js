import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated-route";
import UnauthenticatedRoute from "../components/unauthenticated-route";
import Loadable from "react-loadable";
import { REACT_APP_ROOT } from "../constants";

import NotFound from "./not-found";
import cardList from "./shop-list";

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

const ShopList = Loadable({
  loader: () => import(/* webpackChunkName: "shoplist" */ "./shop-list"),
  loading: () => null,
  modules: ["shoplist"]
});

export default () => (
  <Switch>
    <Route exact path={REACT_APP_ROOT} component={Login} />
    <Route exact path={`${REACT_APP_ROOT}/policy`} component={Policy} />
    <UnauthenticatedRoute exact path={`${REACT_APP_ROOT}/regist`} component={Regist} />
    <UnauthenticatedRoute exact path={`${REACT_APP_ROOT}/login`} component={Login} />
    <AuthenticatedRoute exact path={`${REACT_APP_ROOT}/logout`} component={Logout} />
    <Route path={`${REACT_APP_ROOT}/shoplist`} component={ShopList} />
    <Route component={NotFound} />
  </Switch>
);
