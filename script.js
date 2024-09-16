import { 
    getScrollPortion, 
    getScrollAmount,
    getScrollBarWidth, 
    converPxToViewport,
    isTouchedOnBrowser, 
    lerp 
} from "./assets/js/utils.js"
import { projects } from "./assets/js/list.js"

// create slides
function createSlides(slides){
    const slider = document.querySelector('.slider')
    slides.forEach(slide => {
        const slideElement = document.createElement('div')
        slideElement.classList.add('slide', slide.pos)
        slideElement.innerHTML = `        
            <div class="slide-img">
                <img src="${slide.image}" alt="${slide.image}">
            </div>
            <div class="slide-text">
                <p>${slide.name}</p>
                <p>${slide.type}</p>
            </div>
        `
        slider.appendChild(slideElement)
    })
}

// get maximum range of sliding distance for image 
function getRangeOfSlideImage(img){
    let slideImgWidth = img.offsetWidth
    let slideContainerWidth = img.parentElement.offsetWidth
    return (slideImgWidth - slideContainerWidth) / 2
}

// animation functions
function animateImage(){
    let target = getScrollPortion(heroSection)
    currentPos.hero = lerp(currentPos.hero, target, 0.1)
    let scale = Math.abs(currentPos.hero) < 0.1 ? 0.1 : Math.abs(currentPos.hero) // 0.1 ~ 1
    let rotate = (1 + currentPos.hero) * -240 // -240 ~ 0 // Math.floor 를 적용하면 이미지가 회전할때 뚝뚝 끊기면서 떨림현상이 발생함
    heroImg.style.transform = `scale(${scale}) rotate(${rotate}deg)`
}
function animateAbout(){
    if(isTouchedOnBrowser(aboutSection, window.innerHeight * 0.1)){
        aboutContainer.classList.add('active')
    }
}
function animateSlideImgs(target, current){
    let skewDiff = ((target - current) * 50).toFixed(3) 
    slideImgs.forEach((slideImg, idx) => {
        let left = parseFloat(((1 + currentPos.projects) * -getRangeOfSlideImage(slideImg)).toFixed(1)) // -30 ~ 0 / use toFixed function to enhance performance
        slideImg.style.left = `${left}px`
        slideImg.parentElement.style.transform = `skewX(${skewDiff}deg)`
    })
}
function animateSlider(){
    let target = getScrollPortion(projectSection)
    currentPos.projects = lerp(currentPos.projects, target, 0.05) // 0.05 : the less, the smoother
    let translateX = currentPos.projects * converPxToViewport(getScrollAmount(projectSection)) // should slide more by the amount of scrollbar width
    
    slider.style.transform = `translateX(${translateX}vw)`
    animateSlideImgs(target, currentPos.projects)
}
function animate(){
    animateImage()
    animateAbout()
    animateSlider()
    requestAnimationFrame(animate)
}

// hero section
const heroSection = document.getElementById('hero')
const heroImg = document.querySelector('.hero-img img')

// about section
const aboutSection = document.getElementById('about')
const aboutContainer = document.querySelector('.about-container')

// projects section
const projectSection = document.getElementById('projects')
const slider = document.querySelector('.slider')
createSlides(projects)
const slideImgs = document.querySelectorAll('.slide img')


// positions of sections 
const currentPos = { // 추후 확장
    hero: 0, // current position of heroSection 
    projects: 0
}

animate()
