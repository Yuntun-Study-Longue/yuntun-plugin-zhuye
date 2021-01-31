import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOpenID } from '../../../modules/auth';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import styled from 'styled-components';
import * as colors from '../../global/colors';
import sa from "superagent";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Select from 'react-select';
import * as tool from "luna-utils";

import WechatJSSDK from 'wechat-jssdk';
// https://developers.weixin.qq.com/community/develop/article/doc/000a0cd7e586d028cddadad9459413
//Use MiniProgram directly
// const wx = new Wechat({
//     miniProgram: {
//       "appId": "wxd1489ee2a3ffa30c",
//       "appSecret": "f17207d6d52c8b77bc1b0a3e8e64d874",
//     }
// })
const getLayoutsFromSomewhere = () => {
    const lgLayout = Array.from({ length: 5 }).map((_, i) => ({i: ''+i, x: i*3%12, y: 0, w: 3, h: 2, static: true}))
    const mdLayout = Array.from({ length: 5 }).map((_, i) => ({i: ''+i, x: i%10, y: 0, w: 1, h: 2, static: true}))
    const smLayout = Array.from({ length: 5 }).map((_, i) => ({i: ''+i, x: i%6, y: 0, w: 1, h: 2, static: true}))
    const xsLayout = Array.from({ length: 5 }).map((_, i) => ({i: ''+i, x: i%2 ? (i-1)*2 : i*2, y: 0, w: 2, h: 2, static: true}))
    return { lg: lgLayout, md: mdLayout, xs: xsLayout }
}

const CardItem = styled.div`
    display: block;
    background-color: ${colors.CardBgColor};
    height: 240px;
    border: 2px solid ${colors.InfoBgColor};
    border-radius: 8px;
    overflow: hidden;
    img { border: none; outline: none; object-fit: contain; padding: 16px 0; background-color: #fff; border-bottom: 2px dashed ${colors.InfoBgColor}}
    .shop_selection, .desk_selection { 
        float: left; bottom: 0; background-color: ${colors.InfoBgColor}; width: 50%; 
        .react-select__menu-list { z-index: 999; }
        /* .rc-virtual-list-holder-inner { background-color: ${colors.InfoBgColor}; opacity: .6;} */
    }
`
CardItem.defaultProps = { variant: 'default' }

const PurchaseBtn = styled.button`
    width: 100%;
    height: 40px;
    outline: none;
    border: none;
    color: ${ props => !props.disabled && colors.btnBgColor};
    appearance: none;
    background-color: ${colors.CardBgColor};
    font-size: 16px;
    i { color: ${colors.LuoShenRed}; font-size: 28px; font-weight: bold; };
`
PurchaseBtn.defaultProps = { variant: 'default' }

const Card = props => {
    const document = !tool.systemUtils.isServer() ? window.document : { body: { clientWidth: 385 }};
    const layouts = getLayoutsFromSomewhere();
    const [cardItems, setCardItems] = useState([]);
    const [DeskItems, setDeskItems] = useState({});
    const [ShopOptions, setShopOptions] = useState([]);
    const [DeskOptions, setDeskOptions] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [selectedDesk, setSelectedDesk] = useState(null);
    useEffect(() => {
        // 微信环境静默授权，获取 openid
        if (tool.h5Env.isWX() && props.wx && !props.openid) {
            props.wx.wxFetchBaseInfo().then( res => {
                props.setOpenID(res.openid)
            })
        }
        sa.get('/data/card.json?t='+ new Date().getTime()).then(res => setCardItems(res.body))
        sa.get('/data/price.json?t='+ new Date().getTime()).then(res => {
            console.log(res.body)
            const options = Object.keys(res.body).map(item => ({ value: item, label: item }))
            setShopOptions(options);
            setDeskItems(res.body);
        })
        return
    }, [props.wx]);
    const handleSelectShop = (shop) => {
        const DeskTypes = DeskItems[shop.value].map(item => item.name);
        selectedDesk && shop !== selectedShop && !DeskTypes.includes(selectedDesk.value) && setSelectedDesk(null);
        setSelectedShop(shop);
        const options = DeskItems[shop.value].map(item => ({ value: item.name, label: item.name }));
        setDeskOptions(options);
    }
    return (
      <ResponsiveGridLayout className="layout" layouts={layouts}
        width={document.body.clientWidth}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
        { cardItems.length ? cardItems.map((card, i) => {
            if ( selectedShop && selectedDesk ) {
                const currentItem = DeskItems[selectedShop.value].find(item => item.name === selectedDesk.value);
                const priceData = currentItem.prices.find(item => item.type === card.name);
                const showPrice = !priceData ? '' : priceData.discount_price || priceData.price;
                return <CardItem key={'' + i}>
                    <Select placeholder="选择门店" className="shop_selection" value={selectedShop} onChange={handleSelectShop.bind(this)} options={ShopOptions} />
                    <Select placeholder="选择桌型" className="desk_selection" value={selectedDesk} onChange={setSelectedDesk.bind(this)} options={DeskOptions} />
                    <LazyLoadImage key={i} src={card.cover} height={'60%'} width={'100%'}/>
                    {showPrice ? <PurchaseBtn>支付<i>{showPrice}</i>元，购买{card.name}</PurchaseBtn>: <PurchaseBtn disabled>该卡已售罄</PurchaseBtn>}
                </CardItem>
            }
            return <CardItem key={'' + i}>
                <Select placeholder="选择门店" className="shop_selection" value={selectedShop} onChange={handleSelectShop.bind(this)} options={ShopOptions} />
                <Select placeholder="选择桌型" className="desk_selection" value={selectedDesk} onChange={setSelectedDesk.bind(this)} options={DeskOptions} />
                <LazyLoadImage key={i} src={card.cover} height={'60%'} width={'100%'}/>
                <PurchaseBtn disabled>选择门店和桌型后购买{card.name}</PurchaseBtn>
            </CardItem>
        }) :
        Array.from({ length: 6 }).map((item, i) => <CardItem key={'' + i}></CardItem>) }
      </ResponsiveGridLayout>
    )
}

const mapStateToProps = state => ({
    wx: state.auth.wx,
    openid: state.auth.openid,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ setOpenID }, dispatch);
  

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card)