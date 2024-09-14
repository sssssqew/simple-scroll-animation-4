function getScrollPortion(element){
    let portion = 0
    let {top} = element.getBoundingClientRect()
    if(top <= 0){
        portion = top / (element.scrollHeight - window.innerHeight)
        portion = portion < -1 ? -1 : portion // 0 ~ -1  
    }
    return portion
}

const heroSection = document.getElementById('hero')
const image = document.querySelector('img')

window.addEventListener('scroll', () => {
    let portion = getScrollPortion(heroSection)
    let scale = Math.abs(portion) < 0.1 ? 0.1 : Math.abs(portion) // 0.1 ~ 1
    let rotate = Math.floor((1 + portion) * -240) // -240 ~ 0

    image.style.transform = `scale(${scale}) rotate(${rotate}deg)`
})