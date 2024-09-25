import { 
    getScrollPortion, 
    getTotalScrollAmount,
    getScrollAmount,
    getScrollBarWidth, 
    converPxToViewport,
    isTouchedOnBrowser, 
    getDistance,
    lerp,
    delay,
    checkIsMobile,
    isNotShowing
} from "./assets/js/utils.js"
import { projects } from "./assets/js/list.js"


/////////////////// global variables ///////////////////////////////////

// positions of sections 
const elementInfos = { 
    hero: {current: 0, totalScrollAmount: 0}, 
    projects: {current: 0, totalScrollAmount: 0, sliderSize: 0},
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
function stop3dTextCommon(){
    identityLetters.forEach((letter, idx) => {  
        letter.style.transform = `translateX(0) translateY(0) translateZ(0)`
    })
}
function move3dTextMobile(e){
    // console.log(e.changedTouches[0].clientX)
    identityLetters.forEach((letter, idx) => {  
        const {left, top, width, height} = letter.getBoundingClientRect()
        const dist = getDistance(e.changedTouches[0].clientX, e.changedTouches[0].clientY, left + width / 2, top + height / 2)
        
        let translatez = 100000 * (1 / (dist + 1)); // dist가 작을수록 가중치 증가
        translatez = translatez > 1500 ? 1500 : translatez < 0 ? 0 : translatez
        letter.style.transform = `perspective(3000px) translateX(30px) translateY(-60px) translateZ(${parseFloat(translatez.toFixed(1))}px)`
    })
}


/////////////// init functions ///////////////////////////
function initImage(){
    elementInfos.hero.totalScrollAmount = getTotalScrollAmount(heroSection, false, main)
}
function initSlider(){
    elementInfos.projects.totalScrollAmount = getTotalScrollAmount(projectSection, true, main) // it has vertical scrollbar when scrolling horizontally, so slider should move more by the amount of scrollbar width
    elementInfos.projects.sliderSize = converPxToViewport(elementInfos.projects.totalScrollAmount)
    elementInfos.projects.slideRangeOfImg = -getRangeOfSlideImage(slideImgs[0])
}



/////////////// animation functions //////////////////////

function animateImage(){
    let target = getScrollPortion(heroSection, elementInfos.hero.totalScrollAmount) // this animation need not adding scrollbar width
    elementInfos.hero.current = lerp(elementInfos.hero.current, target, 0.1)
    if(isNotShowing(elementInfos.hero.current)) return // if this section is not showing, then don't play animation

    let scale = Math.abs(elementInfos.hero.current) < 0.1 ? 0.1 : Math.abs(elementInfos.hero.current) // 0.1 ~ 1
    let rotate = (1 + elementInfos.hero.current) * -240 // -240 ~ 0 // Math.floor 를 적용하면 이미지가 회전할때 뚝뚝 끊기면서 떨림현상이 발생함
    heroImg.style.transform = `scale(${scale}) rotate(${rotate}deg)`
}
async function animateAbout(){
    if(isTouchedOnBrowser(aboutSection, window.innerHeight * 0.1)){
        aboutContainer.classList.add('active')
    }
}
function animateSlideImgs(target, current){
    let skewDiff = ((target - current) * 50).toFixed(1)
    slideImgs.forEach((slideImg, idx) => {
        let left = ((1 + current) * elementInfos.projects.slideRangeOfImg).toFixed(1) // -30 ~ 0 / use toFixed function to enhance performance
        slideImg.style.left = `${left}px`
        slideImg.parentElement.style.transform = `skewX(${skewDiff}deg)`
    })
}
async function animateSlider(){
    let target = getScrollPortion(projectSection, elementInfos.projects.totalScrollAmount) // main has scrollbar
    elementInfos.projects.current = lerp(elementInfos.projects.current, target, 0.01) // 0.05 : the less, the smoother
    if(isNotShowing(elementInfos.projects.current)) return // if this section is not showing, then don't play animation
    
    let translateX = (elementInfos.projects.current * elementInfos.projects.sliderSize).toFixed(3) // main has scrollbar 
    slider.style.transform = `translateX(${translateX}svw)`
    animateSlideImgs(target, elementInfos.projects.current)
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
            if(!checkIsMobile()){
                identitySection.addEventListener('mousemove', move3dText)
                identitySection.addEventListener('mouseleave', stop3dTextCommon)
            }else{
                identitySection.addEventListener('touchmove', move3dTextMobile)
                identitySection.addEventListener('touchend', stop3dTextCommon)
            }
        }, identityLetters.length * 50)
    }
}

function init(){
    initImage()
    initSlider()
}

function animate(){
    animateImage()
    animateAbout()
    animateSlider()
    animateIdentity()
    requestAnimationFrame(animate)
}

init()
animate()
// console.log(getScrollBarWidth(main))

window.addEventListener('resize', init)





