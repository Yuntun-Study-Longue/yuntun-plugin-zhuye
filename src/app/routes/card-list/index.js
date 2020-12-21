import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from "styled-components";
import * as colors from "../../global/colors";
import Page from '../../components/page';
import { REACT_APP_ROOT } from "../../constants";
import sa from 'superagent';

// const backgroundColor = theme.variants('variant', 'mode', {
//     default: { light: 'gray', dark: 'darkgray' },
//     primary: { light: 'blue', dark: 'darkblue' },
//     success: { light: 'green', dark: 'darkgreen' },
//     warning: { light: 'orange', dark: 'darkorange' },
// });
const NavigatorBar = styled.button`
    width: 100%;
    height: 80px;
    background-color: ${backgroundColor}
`;

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

const CardList = ({ fetchCardList }) => {
    return <Page title="自习卡列表">
        /* <NavigatorBar variant="default"></NavigatorBar> */
    </Page>
}

export default connect(
  null,
  mapDispatchToProps
)(CardList);