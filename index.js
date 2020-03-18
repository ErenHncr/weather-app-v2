const add = document.querySelector('.btn');
const textbox = document.querySelector('.textbox');

window.onload = function() {
  textbox.value = '';
  textbox.focus();
};

document.addEventListener('keypress', (e) => {
  if(e.key == 'Enter') {
    setCard();
  }
})

add.addEventListener('click',setCard);

async function setCard(e) {
  let city = textbox.value.toString();
  let weather = await getWeatherData(city);
  let cards = document.querySelector('.cards');
  let info = document.querySelector('#info');

  info.className = weather.error ? 'error': 'success';
  setTimeout(() => {
    info.className = '';
  },3000);

  if(!weather.error) {
    info.textContent = `${weather.city} was successfully added.`;
    cards.innerHTML += `
    <div class="card ${weather.condition}">
      <div class="location">
        <p>${weather.city}</p> <span>${weather.countryCode}</span>
      </div>
      <h1>${weather.temp}°C</h1>
      <img src="${weather.icon}">
      <p class="state">${weather.description}</p>
    </div>`
  }
  else {
    info.textContent = `${textbox.value} is not a valid city name!`;
  }
  textbox.value = '';

  console.log(weather);
 
}


async function getWeatherData(city) {
  const apiKey = 'd2a1e88a0e75d5ed58aa1925380c5a3f';
  let json, res;
  let weather = {
    error : true
  };
  res = await fetch (`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
  .then( async(data) => {
    json = await data.json();
    weather = {
      condition:'',
      icon: './images/' + json.weather[0].icon.substring(0,2) + '.png',
      temp: Math.floor(json.main.temp),
      countryCode: json.sys.country,
      city: json.name,
      description: json.weather[0].description,
      error: false
    }
    json = '';
    res = '';
  })
  .catch(()=>{
    weather.error = true;
  });

  if(!weather.error) {
    if(weather.temp <= 0) weather.condition = 'below0';
    else if (weather.temp > 0 && weather.temp <= 20) {
      weather.condition = 'b0-20C';
    }
    else weather.condition = 'above20';
  }
  return weather;
}

