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
function getDistance(x1, y1, x2,y2){
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}

function lerp(start, end, t){
    return start * (1 - t) + end * t
}

function delay(duration){
    return new Promise(resolve => setTimeout(() => resolve('done.'), duration))
}


export {
    getScrollPortion,
    getScrollAmount,
    getScrollBarWidth,
    converPxToViewport,
    isTouchedOnBrowser,
    getDistance,
    lerp,
    delay
}