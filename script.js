import { getScrollPortion, isTouchedOnBrowser, lerp } from "./assets/js/utils.js"
import { projects } from "./assets/js/list.js"

// create slides
function createSlides(slides){
    const slider = document.querySelector('.slider')
    slides.forEach(slide => {
        const slideElement = document.createElement('div')
        slideElement.classList.add('slide', slide.pos)
        slideElement.innerHTML = `        
            <div class="slide-img">
                <img src="${slide.image}" alt="">
            </div>
            <div class="slide-text">
                <p>${slide.name}</p>
                <p>${slide.type}</p>
            </div>
        `
        slider.appendChild(slideElement)
    })
}
// check and get maximum range of slide width
function getRangeOfSlideWidth(slideRange){
     return window.innerWidth > 1100 ? 
            slideRange.desktop : window.innerWidth > 600 ?
            slideRange.tablet : slideRange.mobile
}

// animation functions
function animateImage(){
    let target = getScrollPortion(heroSection)
    currentPos.hero = lerp(currentPos.hero, target, 0.1)
    let scale = Math.abs(currentPos.hero) < 0.1 ? 0.1 : Math.abs(currentPos.hero) // 0.1 ~ 1
    let rotate = (1 + currentPos.hero) * -240 // -240 ~ 0 // Math.floor 를 적용하면 이미지가 회전할때 뚝뚝 끊기면서 떨림현상이 발생함
    image.style.transform = `scale(${scale}) rotate(${rotate}deg)`
}
function animateAbout(){
    if(isTouchedOnBrowser(aboutSection, window.innerHeight * 0.1)){
        aboutContainer.classList.add('active')
    }
}
function animateSlider(){
    let target = getScrollPortion(projectSection)
    currentPos.projects = lerp(currentPos.projects, target, 0.1)
    let translateX = currentPos.projects * getRangeOfSlideWidth(slideRange)
    console.log(translateX)
    slider.style.transform = `translateX(${translateX}vw)`

}
function animate(){
    animateImage()
    animateAbout()
    animateSlider()
    requestAnimationFrame(animate)
}

// hero section
const heroSection = document.getElementById('hero')
const image = document.querySelector('img')

// about section
const aboutSection = document.getElementById('about')
const aboutContainer = document.querySelector('.about-container')

// projects section
const projectSection = document.getElementById('projects')
const slider = document.querySelector('.slider')
createSlides(projects)


// positions of sections 
const currentPos = { // 추후 확장
    hero: 0, // current position of heroSection 
    projects: 0
}
// slide width range
const slideRange = {
    desktop: 100,
    tablet: 300,
    mobile: 700 
}

animate()
