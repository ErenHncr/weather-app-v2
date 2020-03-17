const add = document.querySelector('.btn');
const textbox = document.querySelector('.textbox');

add.addEventListener('click', async(e) => {
  let city = textbox.value.toString();
  let weather = await getWeatherData(city);
  let cards = document.querySelector('.cards');
  
  cards.innerHTML += `
  <div class="card ${weather.condition}">
    <div class="location">
      <p>${weather.city}</p> <span>${weather.countryCode}</span>
    </div>
    <h1>${weather.temp}°C</h1>
    <img src="${weather.icon}">
    <p class="state">${weather.description}</p>
  </div>`

  console.log(weather);
 
});


async function getWeatherData(city) {
  const apiKey = 'd2a1e88a0e75d5ed58aa1925380c5a3f';
  let json, weather, res;
  res = await fetch (`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
  .then( async(data) => {
    json = await data.json();
    weather = {
      condition:'',
      icon: './images/' + json.weather[0].icon.substring(0,2) + '.png',
      temp: Math.floor(json.main.temp),
      countryCode: json.sys.country,
      city: json.name,
      description: json.weather[0].description
    }
    json = '';
    res = '';
  })
  .catch(()=>{
    console.log('hebele');
  });

  if(weather.temp <= 0) weather.condition = 'below0';
  else if (weather.temp > 0 && weather.temp <= 20) {
  weather.condition = 'b0-20C';
  }
  else weather.condition = 'above20';

  return weather;
}

