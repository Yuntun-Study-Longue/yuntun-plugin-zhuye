import React, {useState, useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOpenID, logoutUser } from '../../../modules/auth';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import styled from 'styled-components';
import * as colors from '../../global/colors';
import sa from "superagent";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Select from 'react-select';
import * as tool from "luna-utils";

import WechatJSSDK from 'wechat-jssdk';
import { REACT_APP_ROOT } from '../../constants';
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
    appearance: none;
    font-size: 16px;
    color: ${ props => !props.disabled && colors.btnBgColor};
    background-color: ${colors.CardBgColor};
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
        const btn = document.getElementById('subscribe-btn');
        const handleSubClick = function (e) {
            alert('ok click')
        }
        if (btn) {
            btn.addEventListener('success', handleSubClick);   
            btn.addEventListener('error',function (e) {             
            console.log('fail', e.detail);
            });
        }
        return () => {
            btn && btn.removeEventListener('success', handleSubClick);
        }
    }, [selectedShop && selectedDesk])

    useEffect(() => {
        if (!tool.systemUtils.isServer()) {
            props.wx && props.wx.shareOnMoment({
              type: 'link',
              title: '云吞自习室收费标准',
              link: window.location.href,
              imgUrl: 'https://yuntun-web.oss-cn-beijing.aliyuncs.com/49d691adb21dad12cbf70090af1f3644'
            });
            props.wx && props.wx.shareOnChat({
              type: 'link',
              title: '云吞自习室收费标准',
              link: window.location.href,
              imgUrl: 'https://yuntun-web.oss-cn-beijing.aliyuncs.com/49d691adb21dad12cbf70090af1f3644',
              desc: '请进入页面后选择门店和桌型',
              success: function (){},
              cancel: function (){}
            });
        }

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
    }, [props.wx]);

    const handleSelectShop = (shop) => {
        const DeskTypes = DeskItems[shop.value].map(item => item.name);
        selectedDesk && shop !== selectedShop && !DeskTypes.includes(selectedDesk.value) && setSelectedDesk(null);
        setSelectedShop(shop);
        const options = DeskItems[shop.value].map(item => ({ value: item.name, label: item.name }));
        setDeskOptions(options);
    }
    const handlePaySuccess = async (res) => {

    }
    const handleCreateOrder = async (productInfo) => {
        const token = await tool.deviceUtils.fetchTokenFromCookie('yuntun-website');
        const {mode} = tool.domainUtils.getSearchJSON(props.location.search)
        const isNotSandBox = mode !== 'sandbox'
        if (!props.openid) {
            console.log('系统获取openid异常')
            return ''
        }
        tool.deviceUtils.generateShortId().then(order_id => {
            console.log(order_id, '== order id')
            sa.post(`/webcore/wx/seats/${tool.domainUtils.getWebAppId()}/create_order/${props.openid}`)
            .set('Authorization', token)
            .send({
                mode: isNotSandBox,
                order_id,
                product_name: `${productInfo.deskType}-${productInfo.name}`,
                shop_name: productInfo.shopName,
                order_price: window.location.host === 'm.yuntun-bj.com' && isNotSandBox ? productInfo.price : 0.01,
            })
            .use(request => {
                request.ok(res => {
                    if (res.unauthorized) {
                        props.logoutUser();
                        props.history.push(`${REACT_APP_ROOT}/login?redirect=${props.location.pathname}`)
                        return false
                    }
                    return true
                })
                return request
            })
            .then(res => {
                isNotSandBox ? 
                    props.wx.callWechatApi('chooseWXPay', { ...res.body.data, timestamp: res.body.data.timeStamp, success: handlePaySuccess }) : 
                    handlePaySuccess(); 
            })
        })
    }
    return (
    <div>
        <ResponsiveGridLayout className="layout" layouts={layouts}
        width={document.body.clientWidth}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
        
        { cardItems.length ? cardItems.map((card, i) => {
            if ( selectedShop && selectedDesk ) {
                const currentItem = DeskItems[selectedShop.value].find(item => item.name === selectedDesk.value);
                const priceData = currentItem.prices.find(item => item.type === card.name);
                const showPrice = !priceData ? '' : priceData.discount_price || priceData.price;
                const productInfo = {
                    ...card,
                    price: showPrice,
                    shopName: selectedShop.value,
                    deskType: selectedDesk.value,
                }

                return <CardItem key={'' + i}>
                    <Select placeholder="选择门店" className="shop_selection" value={selectedShop} onChange={handleSelectShop.bind(this)} options={ShopOptions} />
                    <Select placeholder="选择桌型" className="desk_selection" value={selectedDesk} onChange={setSelectedDesk.bind(this)} options={DeskOptions} />
                    <LazyLoadImage key={i} src={card.cover} height={'60%'} width={'100%'}/>
                    {showPrice ? <PurchaseBtn dangerouslySetInnerHTML={{
                        __html: `
                        <wx-open-subscribe template="Ip4TSQ2dgPgzTvq-GMoeuNYPW1O_1BrIHrGL1N1fA0o" id="subscribe-btn">
                            <template slot="style">
                                <style>
                                .subscribe-btn {
                                    width: 100%;
                                    height: 40px;
                                    outline: none;
                                    border: none;
                                    appearance: none;
                                    font-size: 16px;
                                    color: #000;
                                    background-color: #fff;
                                }
                                .subscribe-btn > i {
                                    color: #D23918; font-size: 28px; font-weight: bold;
                                }
                                </style>
                            </template>
                            <template>
                                <button class="subscribe-btn">
                                    支付<i>${showPrice}</i>元，购买${card.name}              
                                </button>
                            </template>
                        </wx-open-subscribe>
                        <script>
                            var btn = document.getElementById('subscribe-btn');
                            btn.addEventListener('success', function (e) {            
                            console.log('success', e.detail);
                            });   
                            btn.addEventListener('error',function (e) {             
                            console.log('fail', e.detail);
                            });
                        </script>
                        `
                        }}>
                    </PurchaseBtn> 
                    : <PurchaseBtn disabled>该卡已售罄</PurchaseBtn>}
                    {/* <PurchaseBtn onClick={handleCreateOrder.bind(this, productInfo)}>支付<i>{showPrice}</i>元，购买{card.name}</PurchaseBtn> */}
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
    </div>
    )
}

const mapStateToProps = state => ({
    wx: state.auth.wx,
    openid: state.auth.openid,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ setOpenID, logoutUser }, dispatch);
  

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card)