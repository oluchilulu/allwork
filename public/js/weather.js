const city = document.querySelector('#city'),
form = document.querySelector('form'),
container = document.querySelector('.container'),
display = document.querySelector('.display'),
temp = document.querySelector('#temp'),
humidity = document.querySelector('#humidity'),
submit= document.querySelector('#submit');


submit.addEventListener('click',()=>{
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&amp;appid=dde034dc2d0de4313343b792c84b065d`).then(res=>(res.json())).then(data=>allData(data))

    const allData = (data)=>{
        const tempOutput = Math.floor(data.main.temp-273.15) 
        temp.innerHTML =`${tempOutput}°C` 
        humidity.innerHTML =`${ data.main.humidity}%`

    }

    container.style.display = 'block'


})



form.addEventListener('submit',(e)=>{
    e.preventDefault()
})

city.addEventListener('input', ()=>{
    display.innerHTML = city.value
})