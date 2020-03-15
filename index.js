const button = document.getElementsByClassName('ghost-button')[0];
const status = document.getElementById('status');
let lat,lon;

button.addEventListener('click',async(e)=>{
    const apiKey = 'd2a1e88a0e75d5ed58aa1925380c5a3f';
    if((lat&&lon!=undefined)||!"geolocation" in navigator){
        let res = await fetch (`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        let json = await res.json();
        status.textContent=json.main.temp+' degrees celsius in '+json.name;
    }
    else{
        status.textContent='Geolocation is not enabled on this browser. Please allow geolocation.';
    }
    e.preventDefault();
});

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
     function success(position) {
      lat = position.coords.latitude; 
      lon = position.coords.longitude;
     },
    function error(err) {
      console.error('An error has occured while retrieving location', err)
    });
  } 
  else {
    console.log('geolocation is not enabled on this browser')
  }
