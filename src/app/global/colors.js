import theme from "styled-theming";

export const Illuminating = '#F5DF4D'
export const UltimateGray = '#939597'
export const YueBai = 'rgb(214, 236, 240)'
export const Dousha = 'rgb(131, 175, 155)'
export const PureWhite = '#fff'
export const PureBlack = '#000'
export const LuoShenRed = 'rgb(210, 57, 24)'

export const btnBgColor = theme.variants('mode', 'variant', {
    default: { light: Illuminating, dark: Dousha },
});
export const btnColor = theme.variants('mode', 'variant', {
    default: { light: PureBlack, dark: YueBai },
});
export const btnActiveColor = theme.variants('mode', 'variant', {
    default: { light: PureBlack, dark: YueBai },
});
export const ItemBgColor = theme.variants('mode', 'variant', {
    default: { light: PureBlack, dark: PureWhite },
});
export const ItemColor = btnBgColor;
export const InfoBgColor = theme.variants('mode', 'variant', {
    default: { light: Illuminating, dark: Dousha },
});
export const InfoColor = theme.variants('mode', 'variant', {
    default: { light: PureBlack, dark: PureWhite },
});
export const ScrollBarColor = InfoBgColor;
export const StickyHeaderBgColor = theme.variants('mode', 'variant', {
    default: { light: PureBlack, dark: PureWhite },
});
export const CardBgColor = theme.variants('mode', 'variant', {
    default: { light: PureWhite, dark: PureWhite },
});
export const LoginTitleColor = theme.variants('mode', 'variant', {
    default: { light: Illuminating, dark: PureWhite }
})
