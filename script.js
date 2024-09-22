import { 
    getScrollPortion, 
    getScrollAmount,
    getScrollBarWidth, 
    converPxToViewport,
    isTouchedOnBrowser, 
    getDistance,
    lerp,
    delay
} from "./assets/js/utils.js"
import { projects } from "./assets/js/list.js"


/////////////////// global variables ///////////////////////////////////

// positions of sections 
const currentPos = { // 추후 확장
    hero: 0, // current position of heroSection 
    projects: 0,
}
let tagOptions = [
    {key: 'the', tag: '<br/>'},
    {key: 'future', tag: '<br/>'},
]


//////////////////////// dom serarch ///////////////////////////////
// main element
const main = document.querySelector('main')

// hero section
const heroSection = document.getElementById('hero')
const heroImg = heroSection.querySelector('.hero-img img')

// about section
const aboutSection = document.getElementById('about')
const aboutContainer = aboutSection.querySelector('.about-container')

// projects section
const projectSection = document.getElementById('projects')
const slider = projectSection.querySelector('.slider')
createSlides(projects)
const slideImgs = slider.querySelectorAll('.slide img')

// identity section
const identitySection = document.getElementById('identity')
const identityContainer = identitySection.querySelector('.identity-container')
const identityText = identityContainer.querySelector('.identity-text')
tagOptions = searchPosOfAddTagOnText(identityText, tagOptions)
identityText.innerHTML = sliceText(identityText, tagOptions)
const identityLetters = identityText.querySelectorAll('span')
// console.log(identityLetters)


//////////////////// application functions ////////////////////////

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

// slice into letter and wrap in span tag 
function sliceText(element, options){
    let text = element.innerText.split('')
    text = text.reduce((newText, letter, idx) => {
        newText = addTagOnText(newText, options, idx)
        newText += `<span class="text">${letter}</span>`
        return newText
    }, '')
    return text 
}
// search some positions on text to add tag
function searchPosOfAddTagOnText(element, options){
    let text = element.innerText.toLowerCase()

    options.forEach(option => {
        option.indexes = []
        let key = option.key.toLowerCase()
        let searchedIndex = text.indexOf(key)
        while(searchedIndex !== -1){
            option.indexes.push(searchedIndex)
            searchedIndex = text.indexOf(key, searchedIndex + key.length + option.tag.length)
        }
    })
    return options
}
// add some tag at some position on text
function addTagOnText(text, options, idx){
    options.forEach(option => {
        if(option.indexes.includes(idx)){
            text += option.tag
        }
    })
    return text
}

/////////////// even listeners ///////////////////////
function move3dText(e){
    identityLetters.forEach((letter, idx) => {  
        const {left, top, width, height} = letter.getBoundingClientRect()
        const dist = getDistance(e.clientX, e.clientY, left + width / 2, top + height / 2)
        
        let translatez = 300000 * (1 / (dist + 1)); // dist가 작을수록 가중치 증가
        translatez = translatez > 2000 ? 2000 : translatez < 0 ? 0 : translatez
        letter.style.transform = `perspective(3000px) translateX(50px) translateY(-100px) translateZ(${parseFloat(translatez.toFixed(1))}px)`
    })
}




/////////////// animation functions //////////////////////

function animateImage(){
    let target = getScrollPortion(heroSection)
    currentPos.hero = lerp(currentPos.hero, target, 0.1)
    let scale = Math.abs(currentPos.hero) < 0.1 ? 0.1 : Math.abs(currentPos.hero) // 0.1 ~ 1
    let rotate = (1 + currentPos.hero) * -240 // -240 ~ 0 // Math.floor 를 적용하면 이미지가 회전할때 뚝뚝 끊기면서 떨림현상이 발생함
    heroImg.style.transform = `scale(${scale}) rotate(${rotate}deg)`
}
async function animateAbout(){
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
    let enableScrollBarWidth = true // it has vertical scrollbar when scrolling horizontally, so slider should move more by the amount of scrollbar width
    let target = getScrollPortion(projectSection, enableScrollBarWidth)
    currentPos.projects = lerp(currentPos.projects, target, 0.05) // 0.05 : the less, the smoother
    let translateX = currentPos.projects * converPxToViewport(getScrollAmount(projectSection, enableScrollBarWidth)) 
    
    slider.style.transform = `translateX(${translateX}svw)`
    animateSlideImgs(target, currentPos.projects)
}
function animateIdentity(){
    if(isTouchedOnBrowser(identitySection, window.innerHeight * 0.3)){
        identityLetters.forEach((letter, idx) => {
            setTimeout(() => {
                letter.classList.add('active')
            }, idx * 30)
        })
        setTimeout(() => {
            identityText.classList.add('active')
            identitySection.addEventListener('mousemove', move3dText)
        }, identityLetters.length * 50)
    }
}
function init(){
    main.style.height = `${document.body.scrollHeight}px`
}
function animate(){
    animateImage()
    animateAbout()
    animateSlider()
    animateIdentity()
    requestAnimationFrame(animate)
}
// init()
animate()
console.log(getScrollBarWidth())




