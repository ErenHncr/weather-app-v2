const add = document.querySelector('.btn');


add.addEventListener('click', async(e) => {
  console.log('tık');
  let city = 'london';
  let weather = await getWeatherData(city);
  let cards = document.querySelectorAll('.card');
  let z = document.querySelector('.z');
  
  z.innerHTML += `
  <div class="card ">
    <div class="location">
      <p>${weather.city}</p> <span>${weather.countryCode}</span>
    </div>
    <h1>${weather.temp}°C</h1>
    <img src="${weather.icon}">
    <p class="state">${weather.description}</p>
  </div>`


  // console.log(weather);
 
});


async function getWeatherData(city) {
  const apiKey = 'd2a1e88a0e75d5ed58aa1925380c5a3f';
  let json, weather, res;
  res = await fetch (`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
  .then( async(data) => {
    json = await data.json();
    weather = {
      icon: json.weather[0],
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

  return weather;
}
