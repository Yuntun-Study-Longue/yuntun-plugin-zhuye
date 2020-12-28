import React, {useState, useEffect} from 'react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styled from 'styled-components';
import sa from "superagent";
import * as colors from '../../global/colors';


const data = Array.from({ length: 3 }).map((_, i) => ({i: ''+i}))
const getLayoutsFromSomewhere = () => {
    const lgLayout = Array.from({ length: 6 }).map((_, i) => ({i: ''+i, x: i*4, y: 0, w: 4, h: 3.1, static: true}))
    const xsLayout = Array.from({ length: 6 }).map((_, i) => ({i: ''+i, x: i, y: 0, w: 3, h: 3, static: true}))
    return { lg: lgLayout, xs: xsLayout }
}



const DeskItem = styled.div`
    color: ${colors.ItemColor};
    background-color: ${colors.ItemBgColor};
    h1 {font-size: 18px; text-align: center; line-height: 40px; font-weight: bold;};
    img { border: none; outline: none; object-fit: contain; border-radius: 5%;};
    
    span {font-size: 14px; padding: 1.5em 1em 0 1em; display: block; line-height: 22px;}
`
DeskItem.defaultProps = { variant: 'default' }

const Desk = () => {
    const [DeskItems, setDeskItems] = useState([]);

    useEffect(() => {
        sa.get('/data/desk.json').then(res => setDeskItems(res.body))

    });
    const layouts = getLayoutsFromSomewhere();
    return <ResponsiveGridLayout className="layout" layouts={layouts}
        width={document.body.clientWidth}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, xs: 4, xxs: 2}}>
        { data.map((item, i) => {
            if (!DeskItems.length) return <DeskItem key={item.i}></DeskItem>

            const current = DeskItems[i];
            return <DeskItem key={item.i}>
                <h1>{current.name}</h1>
                <LazyLoadImage key={i} src={current.cover} width={'100%'}/>
                <span>{current.description}</span>
            </DeskItem>
        }) }
    </ResponsiveGridLayout>
}

export default Desk