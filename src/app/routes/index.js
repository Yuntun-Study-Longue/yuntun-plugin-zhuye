import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "../components/authenticated-route";
import UnauthenticatedRoute from "../components/unauthenticated-route";
import Loadable from "react-loadable";
import { REACT_APP_ROOT } from "../constants";

import NotFound from "./not-found";
        
const Homepage = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ "./homepage"),
  loading: () => null,
  modules: ["homepage"]
});

const About = Loadable({
  loader: () => import(/* webpackChunkName: "about" */ "./about"),
  loading: () => null,
  modules: ["about"]
});

const Dashboard = Loadable({
  loader: () => import(/* webpackChunkName: "dashboard" */ "./dashboard"),
  loading: () => null,
  modules: ["dashboard"]
});

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

const Profile = Loadable({
  loader: () => import(/* webpackChunkName: "profile" */ "./profile"),
  loading: () => null,
  modules: ["profile"]
});

export default () => (
  <Switch>
    <Route exact path={REACT_APP_ROOT} component={Homepage} />
    <Route exact path={`${REACT_APP_ROOT}/about`} component={About} />

    <Route exact path={`${REACT_APP_ROOT}/profile/:id`} component={Profile} />

    <AuthenticatedRoute
      exact
      path={`${REACT_APP_ROOT}/dashboard`}
      component={Dashboard}
    />

    <UnauthenticatedRoute
      exact
      path={`${REACT_APP_ROOT}/login`}
      component={Login}
    />
    <AuthenticatedRoute
      exact
      path={`${REACT_APP_ROOT}/logout`}
      component={Logout}
    />
    <Route component={NotFound} />
  </Switch>
);
