import theme from "styled-theming";

export const Illuminating = '#F5DF4D'
export const UltimateGray = '#939597'
export const YueBai = `rgb(214, 236, 240)`

export const btnColor = theme.variants('mode', 'variant', {
    default: { light: Illuminating, dark: UltimateGray },
    primary: { light: 'blue', dark: 'darkblue' },
    success: { light: 'green', dark: 'darkgreen' },
    warning: { light: 'orange', dark: 'darkorange' },
});
