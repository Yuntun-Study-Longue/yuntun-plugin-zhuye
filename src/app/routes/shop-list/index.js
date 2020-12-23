import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, Link } from "react-router-dom";
import styled from "styled-components";
import * as colors from "../../global/colors";
import Page from '../../components/page';
import { REACT_APP_ROOT } from "../../constants";
import sa from 'superagent';
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
    background-color: ${colors.btnColor};
    position: absolute;
    bottom: 0;
    ul.button-list { 
        width: 100%; display: inline-flex; border: none; outline: 0 
        li { width: 25%; height: 80px; display: flex; align-items: center; justify-content:center; color: ${colors.UltimateGray}; cursor: pointer; a: { text-decoration: none; display: block; color: #000}}
        li.active { font-weight: bold; color: #000 }
    }
    

`;

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

const ShopList = ({match, history}) => {
    const [active, setActive] = useState('门店');
    const links = {
        '门店': match.path + '/shop',
        '自习卡': match.path + '/card', 
        '桌型': match.path + '/desk', 
        '我的': match.path + '/mine',
    };
    console.log(match, links)
    return <Page title="自习卡列表">
        <ViewBox>
            <Switch>
                <Route exact path={links['门店']} component={Shop} />
                <Route exact path={links['自习卡']} component={Card} />
                <Route exact path={links['桌型']} component={Desk} />
                <Route exact path={links['我的']} component={Mine} />
            </Switch>
        </ViewBox>
        <NavigatorBar variant="default">
            <ul className='button-list' onClick={(e) => {
                e.stopPropagation()
                const name = e.target.innerText;
                setActive(name)
                history.push(links[name])
            }}>
                {
                    ['门店', '自习卡', '桌型', '我的'].map((name, i) => {
                        console.log(links[name], 'heer')
                    return name === active ? <li className='active' key={i}>{name}</li> : <li key={i}>{name}</li>
                    })
                }
            </ul>
        </NavigatorBar>
    </Page>
}

export default connect(
  null,
  mapDispatchToProps
)(ShopList);