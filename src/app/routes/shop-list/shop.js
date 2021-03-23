import React, {useState, useEffect, Fragment} from 'react';
import { render } from 'react-dom';
import GridLayout from 'react-grid-layout';
import styled from 'styled-components';
import * as colors from '../../global/colors';
import sa from "superagent";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import marked from 'marked';
import * as tool from "luna-utils";
// const ResponsiveGridLayout = WidthProvider(Responsive);
const data = Array.from({ length: 4 }).map((_, i) => ({i: ''+i, x: 0, y: 2 * i, w: 5, h: 2, static: true}))
const layout = [
    {i: 'main', x: 5, y: 0, w: 7, h: 17, minH:10, maxH:20, static: true},
].concat(data);

const ShopItem = styled.div`
    overflow: hidden;
    padding: 0 4px;
    color: ${colors.ItemColor};
    background-color: ${colors.ItemBgColor};
    a { text-decoration: none;};
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
    /* &.link-us { * {font-size: 32px;}} */
    .add {position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);}
    .ci, .ca, .cp, .cb {position: absolute; bottom: .5em; color: ${colors.ItemColor};font-size:8px;width: 95%; text-align: left;}
    .ci { bottom: 6.5em;}
    .ca { bottom: 4.5em;}
    .cp { bottom: 2.5em;}
    .i-container { display: flex; justify-content: center; align-items: center;}
    .lh {color: ${colors.ItemColor};font-size:8px; text-align: left; text-decoration: underline; bottom: }
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

const YearlyArticle = styled.article`
    /* width: auto !important; */
`
YearlyArticle.defaultProps = { variant: 'default' }

const Shop = () => {
    const document = !tool.systemUtils.isServer() ? window.document : { body: { clientWidth: 385 }};
    const [shopItems, setShopItems] = useState([]);
    const [itemData, setItemData] = useState(null);
    const [content, setContent] = useState('');
    useEffect(() => {
        sa.get('/data/shop.json?t='+ new Date().getTime()).then(res => setShopItems(res.body))
        sa.get('/data/2021_ZH.md?t=' + new Date().getTime()).then(res => setContent(res.text))
        return
    }, [])
    return <GridLayout className="layout" layout={layout} cols={12} rowHeight={40} width={document.body.clientWidth}>
        <ShopItem key="main" className="container" style={{overflowY: "auto", height: '100vh !important'}}>
                {!itemData ? <YearlyArticle dangerouslySetInnerHTML={{__html: marked(content)}}></YearlyArticle> : <Fragment>
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
            {/* <span className="add">「+」</span> */}
            <div className='i-container'>
                <p className="ci">云吞（北京）教育科技有限公司</p>
                <p className="ca">北京市海淀区文慧园路6号1号楼3层A341室</p>
                <p className="cp">联系我们：400-0670-996</p>
                <p className="cb">©2021 YUNTUN <a href="https://beian.miit.gov.cn" target="_blank"><span className="lh">京ICP备19017278号-1</span></a></p> 
            </div>
        </ShopItem> : <ShopItem key={data.length}></ShopItem>}
    </GridLayout>
}

export default Shop