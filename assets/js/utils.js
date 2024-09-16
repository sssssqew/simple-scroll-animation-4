// utils functions 
function getScrollPortion(element){ // if element has sticky sections
    let portion = 0
    let {top} = element.getBoundingClientRect()

    if(top <= 0){
        portion = top / (element.scrollHeight - window.innerHeight) 
        portion = portion < -1 ? -1 : portion // 0 ~ -1  
    }
    return portion
}
function getScrollBarWidth(){
    return window.innerWidth - document.documentElement.offsetWidth
}
function converPxToViewport(px){
    return px * (100 / document.documentElement.clientWidth)
}
function isTouchedOnBrowser(element, threshold = 0){ // if element has no sticky sections 
    let {top} = element.getBoundingClientRect()
    return top <= threshold
}

function lerp(start, end, t){
    return start * (1 - t) + end * t
}

export {
    getScrollPortion,
    getScrollBarWidth,
    converPxToViewport,
    isTouchedOnBrowser,
    lerp,
}