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
function animateImage(current){
    let scale = Math.abs(current) < 0.1 ? 0.1 : Math.abs(current) // 0.1 ~ 1
    let rotate = (1 + current) * -240 // -240 ~ 0 // Math.floor 를 적용하면 이미지가 회전할때 뚝뚝 끊기면서 떨림현상이 발생함
    image.style.transform = `scale(${scale}) rotate(${rotate}deg)`
}
function animate(){
    current = lerp(current, portion, 0.1)
    animateImage(current)
    requestAnimationFrame(animate)
}

const heroSection = document.getElementById('hero')
const image = document.querySelector('img')
let current = 0
let portion = 0 // target

window.addEventListener('scroll', () => {
    portion = getScrollPortion(heroSection)
})

animate()
