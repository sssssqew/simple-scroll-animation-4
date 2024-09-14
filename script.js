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
    // console.log(portion)
    portion = Math.abs(portion) / 2 + 0.5 // 0.5 ~ 1
    image.style.transform = `scale(${portion})`
})