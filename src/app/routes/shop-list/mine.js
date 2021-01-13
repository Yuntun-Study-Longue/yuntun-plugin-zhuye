import React, {useEffect} from 'react';
import { connect } from "react-redux";
import styled from 'styled-components';
import GridLayout from 'react-grid-layout';
import * as colors from '../../global/colors';
import UserEnum from '../../global/userenum';
import { REACT_APP_ROOT } from "../../constants";
import * as tool from "luna-utils";
// import { loginUser } from '../../../modules/auth';

const cardInfo = {i: "card", x: 0.5, y: 1, w: 3, h: 3, static: true };
const userInfo = {i: "user", x: 0.5, y: 4.2, w: 3, h: 3, static: true };
const layout = [cardInfo, userInfo];

const GateSecret = styled.div`

`

const MineInfo = styled.div`
    position: relative;
    margin: 50px;  
    /* .container { width: 90%; color: ${colors.btnColor}; margin: 0 auto;} */
    hr {
        margin:0;
        border-style: solid; 
        border-color: #fff; 
        border-width: 1px 0 0 0; 
    };
    `
MineInfo.defaultProps = { variant: 'default' }
const InfoItem = styled.div`
    padding: 10px 0 0 0;
    line-height: 30px;  
    color: ${colors.btnColor};
    background-color: ${colors.btnBgColor};
    .user {
        display: block;
        background-color: ${colors.CardBgColor};
        height: 240px;
        border: 2px solid ${colors.InfoBgColor};
        border-radius: 8px;
        overflow: hidden;
        img { border: none; outline: none; object-fit: contain; padding: 16px 0; background-color: #fff; border-bottom: 2px dashed ${colors.InfoBgColor}}
    };
    label { width: 100px; display: inline-block; text-align: right;}
    span {margin-left: 10px;} 
`
InfoItem.defaultProps = { variant: 'default' }

const Mine = ({ history, currentUser, isAuthenticated }) => {
    const document = !tool.systemUtils.isServer() ? window.document : { body: { clientWidth: 385 }};
    useEffect(() => {
        if (!isAuthenticated) setTimeout(() => history.replace(`${REACT_APP_ROOT}/login`), 50);
    }, [])

return <GridLayout className="layout" layout={layout} cols={4} rowHeight={60} width={document.body.clientWidth}>
        <InfoItem key='card' className="card">
            <div>
                <label>购买的卡：</label>
                <span>暂未购买自习卡</span>
            </div>
            <hr></hr>
            <div>
                <label>有效日期：</label>
                <span>暂未购买自习卡</span>
            </div>
            <hr></hr>
            <div>
                <label>剩余次数：</label>
                <span>暂未购买自习卡</span>
            </div>
            <hr></hr>
            <div>
                <label>门禁密码：</label>
                <span>暂未购买自习卡</span>
            </div>
        </InfoItem>
        <InfoItem key='user' className="user">
            <div>
                <label>用户名：</label>
                <span>{currentUser.username}</span>
            </div>
            <hr></hr>
            <div>
                <label>绑定手机：</label>
                <span>{currentUser.phone}</span>
            </div>
            <hr></hr>
            <div>
                <label>账号等级：</label>
                <span>{UserEnum[currentUser.role_id]}</span>
            </div>
        </InfoItem>
    </GridLayout>
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.currentUser
});

export default connect(
    mapStateToProps,
    null
)(Mine)