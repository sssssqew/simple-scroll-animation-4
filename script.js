// utils functions 
function getScrollPortion(element){
    let portion = 0
    let {top} = element.getBoundingClientRect()
    if(top <= 0){
        portion = top / (element.scrollHeight - window.innerHeight)
        portion = portion < -1 ? -1 : portion // 0 ~ -1  
    }
    return portion
}

function lerp(start, end, t){
    return start * (1 - t) + end * t
}

// animation functions
function animateImage(){
    let portion = getScrollPortion(heroSection)
    cPortions.hero = lerp(cPortions.hero, portion, 0.1)
    let scale = Math.abs(cPortions.hero) < 0.1 ? 0.1 : Math.abs(cPortions.hero) // 0.1 ~ 1
    let rotate = (1 + cPortions.hero) * -240 // -240 ~ 0 // Math.floor 를 적용하면 이미지가 회전할때 뚝뚝 끊기면서 떨림현상이 발생함
    image.style.transform = `scale(${scale}) rotate(${rotate}deg)`
}
function animate(){
    animateImage()
    requestAnimationFrame(animate)
}

const heroSection = document.getElementById('hero')
const image = document.querySelector('img')

const cPortions = { // 추후 확장
    hero: 0, // current position of heroSection 
}

animate()
