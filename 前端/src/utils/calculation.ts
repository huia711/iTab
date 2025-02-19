function hexToRgb(pageColorStyle: any){
    const r = parseInt(pageColorStyle.substring(1,3),16)
    const g = parseInt(pageColorStyle.substring(3,5),16)
    const b = parseInt(pageColorStyle.substring(5,7),16)
    return {r,g,b}
}

function rgbaToObj(colorStyle: any){
    const rS = colorStyle.R.toString(16)
    const gS = colorStyle.G.toString(16)
    const bS = colorStyle.B.toString(16)
    return Object({
        hex:"#" + (rS < 10 ? "0" : "") + rS + (gS < 10 ? "0" : "") + gS + (bS < 10 ? "0" : "") + bS,
        alpha: colorStyle.alpha/100
    })
}

function rgbaTextSpawn(objWithoutAlpha: any,alpha: any){
    return "rgba(" + String(objWithoutAlpha.r) + ',' + String(objWithoutAlpha.g) + ',' + String(objWithoutAlpha.b) + ',' + String(alpha) + ')'
}

function min(a: number,b: number){
    return a < b ? a : b
}

function max(a: number,b: number){
    return a > b ? a : b;
}

function abs(a: number){
    return a > 0 ? a : -a;
}

export default {
    hexToRgb,
    rgbaToObj,
    rgbaTextSpawn,
    min,
    max,
    abs
};