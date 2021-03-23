let form = document.querySelector("form");
let search = document.querySelector("input");
let latitude;
let longitude;
let marker1;
let map;

navigator.geolocation.getCurrentPosition(function (position) {
  console.log(position);
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  displayMap();
}, function error(err) {
  alert(`ERROR(${err.code}): ${err.message}
  DEFAULT LOCATION: (-74.5, 40)` );
  mapboxgl.accessToken = 'pk.eyJ1IjoibmFuZGluaS1hIiwiYSI6ImNrbW1iN2xqdjFqYmYycG80bmo2bDYwN24ifQ.GQN5FI2XaZYpt8KKxYcMQQ';
  map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
  });
}, {enableHighAccuracy: true, timeout: 5000, maximumAge: 0});

function displayMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoibmFuZGluaS1hIiwiYSI6ImNrbW1iN2xqdjFqYmYycG80bmo2bDYwN24ifQ.GQN5FI2XaZYpt8KKxYcMQQ';
  map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 13 // starting zoom
  });
  marker1 = new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .addTo(map);
}