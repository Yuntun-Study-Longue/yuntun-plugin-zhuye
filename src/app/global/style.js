import { createGlobalStyle } from 'styled-components'
import * as colors from './colors';

export const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	overflow-y: scroll;
    line-height: 1;
    font-family: PingFangSC-Light, Microsoft YaHei, sans-serif;
    background-color: ${colors.YueBai}
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

article {
	position: relative;
	font-size: 20px;
	margin: 0 auto;
	padding-bottom: 2em;
    font-family: "Fira Sans", "Verdana", "Geneva", sans-serif;
    font-weight: 300;
    line-height: 1.4;
	text-align: center;
	* { text-align: left; }
	h1 { margin-top: 1em; margin-bottom: .5em; font-weight: 700; font-size: 24px !important; text-align: center; }
	h2,h3 { margin-top: 1em; margin-bottom: .5em; font-weight: 300; font-size: 16px; font-weight: bold;}
	h2 {text-indent:0; font-size: 12px !important;font-weight: 200; line-height: 16px; margin: .5em 0;}

	p { margin-top: 0; margin-bottom: .5em; font-size: 14px; text-indent: 1em;}
	img { width: 90%; }
	a {
		background-image: linear-gradient(#449, #449);
		background-size: 0.06em 0.06em;
		background-repeat: repeat-x;
		background-position-y: 93%;
		background-position-x: 0;
		color: #449;
		text-decoration: none;
		transition: 0.15s;
	}
	code, pre, samp, var { font-size: 95%; font-family: "Roboto Mono", monospace; font-weight: 300; }
	blockquote { margin:0; padding: .2em 1em; font-size: .8em; font-style: bold; line-height: 2; p {text-align:center;padding: 0;margin:0;} h2 {text-align: center;} }
}
`