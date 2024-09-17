// utils functions 
function getScrollPortion(element, enableScrollBarWidth = false){ // if element has sticky sections, use this function
    let portion = 0
    let {top} = element.getBoundingClientRect()

    if(top <= 0){
        portion = top / getScrollAmount(element, enableScrollBarWidth) 
        portion = portion < -1 ? -1 : portion // 0 ~ -1  
    }
    return portion
}
function getScrollAmount(element, enableScrollBarWidth){
    return element.scrollHeight - window.innerHeight + (enableScrollBarWidth ? getScrollBarWidth() : 0) // compensate by the amount of scrollbar width
}
function getScrollBarWidth(){
    return window.innerWidth - document.documentElement.offsetWidth
}
function converPxToViewport(px, option = 'vh'){
    if(option === 'vh'){
        return px * (100 / document.documentElement.clientHeight)
    }else if(option === 'vw'){
        return px * (100 / document.documentElement.clientWidth)
    } 
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
    getScrollAmount,
    getScrollBarWidth,
    converPxToViewport,
    isTouchedOnBrowser,
    lerp,
}