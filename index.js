const add = document.querySelector('.btn');
const textbox = document.querySelector('.textbox');
let cards = document.querySelector('.cards');
window.onload = function() {
  textbox.value = '';
  textbox.focus();
  let cities = JSON.parse(localStorage.getItem('cities'));
  if(cities != undefined) {
    cities.forEach(city => {
      loadFromLocal(city);
    });
  }  
};

document.addEventListener('keypress', (e) => {
  if(e.key == 'Enter') {
    setCard();
  }
})

cards.addEventListener('click', (e) => {

  if(e.target.parentElement.className.includes('card')) {
    deleteFromLocal(e.target.children[0].textContent);
    e.currentTarget.removeChild(e.target.parentElement);

  }
  else {
    (e.path).forEach(e => {
      if(e.className != undefined &&
      e.className.includes(' ') &&
      e.className.split(' ')[0] === 'card') {
        deleteFromLocal(e.children[0].children[0].textContent)
        e.parentNode.removeChild(e);  
      }
    });
  }
})

add.addEventListener('click',setCard);

async function setCard() {
  let city = textbox.value.toString();
  let weather = await getWeatherData(city);
  let info = document.querySelector('#info');

  info.className = weather.error ? 'error': 'success';
  info.style.opacity = 100;
  setTimeout(() => {
    info.style.opacity = 0;
  },3000);

  let checkAvailable = saveToLocal(weather.city, weather.error);
  if(!weather.error && !checkAvailable) {
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
  else if (checkAvailable) {
    info.className = 'error';
    info.textContent = `${weather.city} already exists.`;
  }
  else {
    info.textContent = `${textbox.value} is not a valid city name!`;
  }

  if(textbox.value == '') {
    info.textContent = `Enter a city name!`;
  }
  textbox.value = '';
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
      countryCode: json.sys.country == undefined ? '0' : json.sys.country,
      city:city[0].toUpperCase() + city.substring(1),
      description: json.weather[0].description,
      error: false
    }
  })
  .catch(()=>{
    weather.error = true;
  });

  if(!weather.error) {
    // css by temperature
    if(weather.temp <= 0) weather.condition = 'below0';
    else if (weather.temp > 0 && weather.temp <= 20) {
      weather.condition = 'b0-20C';
    }
    else weather.condition = 'above20';
  }
  
  return weather;
}

function saveToLocal(city, error) {
  let arr = [], checkAvailable = false;
  if(!error) {
    if(localStorage.getItem('cities') == undefined) {
      arr.push(city);
      localStorage.setItem('cities', JSON.stringify(arr));
    }

    else {
      arr = JSON.parse(localStorage.getItem('cities'));
      checkAvailable = arr.includes(city);
      if(!checkAvailable) {
        arr.push(city);
        localStorage.setItem('cities', JSON.stringify(arr));
      }
    }
  }
  return checkAvailable;
}

function deleteFromLocal(remove) {
  let cities =  JSON.parse(localStorage.getItem('cities'));
  cities = cities.filter((value) => {
    return value != remove;
  })
  localStorage.setItem('cities', JSON.stringify(cities));
}

async function loadFromLocal(city) {
  let weather = await getWeatherData(city);
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

