import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, Link } from "react-router-dom";
import styled from "styled-components";
import * as colors from "../../global/colors";
import Page from '../../components/page';
import { REACT_APP_ROOT } from "../../constants";
import sa from 'axios';
import Shop from './shop';
import Card from './card';
import Desk from './desk';
import Mine from './mine';

const ViewBox = styled.div`
    width: 100%;
`;

const NavigatorBar = styled.div`
    width: 100%;
    height: 80px;
    border: none;
    background-color: ${colors.btnBgColor};
    /* position: absolute; */
    bottom: 0;
    ul.button-list { 
        width: 100%; display: inline-flex; border: none; outline: 0 
        li { 
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            color: ${colors.btnColor};
            transition: font-size .1s linear;
            width: 25%; height: 80px; display: flex; align-items: center; justify-content:center; cursor: pointer; a: { text-decoration: none; display: block; color: #000}}
        li.active { font-weight: bold; color: ${colors.btnActiveColor}; font-size:22px; }
    }
    

`;

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

const ShopList = ({match, history}) => {
    const [active, setActive] = useState('');
    const links = {
        '门店': match.path + '/shop',
        '自习卡': match.path + '/card', 
        '桌型': match.path + '/desk', 
        '我的': match.path + '/mine',
    };

    return <Page title={active ? active + "列表" : ''}>
        <NavigatorBar variant="default">
            <ul className='button-list' onClick={(e) => {
                e.stopPropagation()
                const name = e.target.innerText;
                setActive(name)
                history.push(links[name])
            }}>
                {['门店', '自习卡', '桌型', '我的'].map((name, i) => {
                    return name === active ? <li className='active' key={i}>{name}</li> : <li key={i}>{name}</li>
                })}
            </ul>
        </NavigatorBar>
        <ViewBox>
            <Switch>
                <Route exact path={links['门店']} component={Shop} />
                <Route exact path={links['自习卡']} component={Card} />
                <Route exact path={links['桌型']} component={Desk} />
                <Route exact path={links['我的']} component={Mine} />
            </Switch>
        </ViewBox>
    </Page>
}

export default connect(
  null,
  mapDispatchToProps
)(ShopList);