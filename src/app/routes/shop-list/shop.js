import React, {useState, useEffect, Fragment} from 'react';
import GridLayout from 'react-grid-layout';
import styled from 'styled-components';
import * as colors from '../../global/colors';
import sa from "superagent";
import { LazyLoadImage } from 'react-lazy-load-image-component';
// const ResponsiveGridLayout = WidthProvider(Responsive);

const data = Array.from({ length: 4 }).map((_, i) => ({i: ''+i, x: 0, y: 2 * i, w: 5, h: 2, static: true}))
const layout = [
    {i: 'main', x: 5, y: 0, w: 7, h: 10, static: true},
].concat(data);

const ShopItem = styled.div`
    overflow: hidden;
    padding: 0 4px;
    color: ${colors.ItemColor};
    background-color: ${colors.ItemBgColor};
    h1 {font-size: 16px; line-height: 24px; font-weight: bold; i {font-size: 12px;}}
    span {font-size: 12px;}
    .addr, .tel, .wx, .tags, .scroll-info, .detail {font-size: 12px; }
    .scroll-info { height: 2em;}
    .wx { text-align: right; 
        /* line-height: 24px; */
    }
    .wx::before {content: '「+微信」'}
    .tags {
        line-height: 22px;
        word-break: keep-all;
        overflow-x: scroll;
        ::-webkit-scrollbar {display:none}
        i { color: ${colors.InfoColor}; background-color: ${colors.InfoBgColor}; margin: 0 3px; border-radius: 3px; padding: 0 .5em;}
        /* i:not(:last-child) { ::after {content: '-'} } */
    }
    .tel {
        text-align: right; line-height: 28px;
        a { text-decoration: none; color: ${colors.ItemColor}; margin: 0 2px; display: 'block'; }
    }
    .addr, .detail { margin-bottom: .5em; line-height: 18px; }
    .addr { ::before {content: "门店地址："}}
    .detail {::before {content: '简介：'}}
    &.link-us { display: flex; justify-content: center; align-items: center; * {font-size: 32px;font-weight: bolder;}}
    .container {
        /* ::-webkit-scrollbar
        {  
            width: 4px;  
            height: 4px;  
            background-color: ${colors.ScrollBarColor};  
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 4px;
           background: #000;
        } */
    }
`
ShopItem.defaultProps = { variant: 'default' }

const ImageList = styled.div`
    width: 100%;
    pointer-events:none; /* 禁止长按图片保存 */
    /* img {width: auto; height: 240px; object-fit: cover;} */
`
const StickyHeader = styled.div`
    padding-top: 1px;
    position: sticky;
    top : -1px;
    background-color: ${colors.StickyHeaderBgColor};
    h1 { float: left;}
`
StickyHeader.defaultProps = { variant: 'default' }

const Shop = () => {
    const [shopItems, setShopItems] = useState([]);
    const [itemData, setItemData] = useState(null);
    useEffect(() => {
        sa.get('/data/shop.json').then(res => setShopItems(res.body))
        return
    }, [])

    return <GridLayout className="layout" layout={layout} cols={12} rowHeight={40} width={document.body.clientWidth}>
        <ShopItem key="main" className="container" style={{overflowY: "auto"}}>
            {!itemData ? <p>show time</p> : <Fragment>
                <StickyHeader>
                    <h1>{itemData.name}介绍 </h1>
                    <p className="tel"><a href={`tel:${itemData.tels[0]}`}>联系门店管理员</a></p>
                </StickyHeader>
                <p className="addr">{itemData.addr}</p>
                <p className="detail">{itemData.detail || ''}</p>
                <ImageList>
                    {itemData.images.map((o,i) => <LazyLoadImage key={i} src={o} width={'100%'}/>)}
                </ImageList>
            </Fragment>
            }
        </ShopItem>
        {
            shopItems.length ? shopItems.map((item, i) => <ShopItem key={i.toString()} onClick={setItemData.bind(this, item)}>
                <h1><i>「{item.city}」</i>{item.name} </h1>
                <p className="tags">
                    { item.tags.map( tag => <i key={tag}>{tag}</i>)}
                </p>
                <p className="scroll-info"></p>
                <p className="wx">{item.wx}</p>
            </ShopItem>) : data.map(item => <ShopItem key={item.i}></ShopItem>)
        }
        {shopItems.length ? <ShopItem className="link-us" key={''+ shopItems.length}>
            <span className="add">「+」</span>
        </ShopItem> : <ShopItem key={data.length}></ShopItem>}
    </GridLayout>
}

export default Shop