import theme from "styled-theming";

export const Illuminating = '#F5DF4D'
export const UltimateGray = '#939597'
export const YueBai = `rgb(214, 236, 240)`
export const backgroundColor = theme('mode', {
    light: '#fff',
    dark: '#000',
});
export const btnColor = theme.variants('variant', 'mode', {
    default: { light: Illuminating, dark: UltimateGray },
    primary: { light: 'blue', dark: 'darkblue' },
    success: { light: 'green', dark: 'darkgreen' },
    warning: { light: 'orange', dark: 'darkorange' },
});
