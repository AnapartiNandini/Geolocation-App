let baseURL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
let accessToken = "access_token=pk.eyJ1IjoibmFuZGluaS1hIiwiYSI6ImNrbW1iN2xqdjFqYmYycG80bmo2bDYwN24ifQ.GQN5FI2XaZYpt8KKxYcMQQ";
let form = document.querySelector("form");
let search = document.querySelector("input");
let poi = document.querySelector(".points-of-interest");
poi.innerHTML = "";
search.value = "";
let latitude;
let longitude;
let marker1;
let map;

function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return `${dist.toFixed(2)} km`;
  }
}

navigator.geolocation.getCurrentPosition(function (position) {
  console.log(position);
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  displayMap(longitude, latitude, 13, "My Location");
}, function error(err) {
  alert(`ERROR(${err.code}): ${err.message}
  DEFAULT LOCATION: (-74.5, 40)` );
  displayMap(-74.5, 40, 9, "Default Location");
}, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });

function displayMap(lng, lat, zoom, label) {
  mapboxgl.accessToken = 'pk.eyJ1IjoibmFuZGluaS1hIiwiYSI6ImNrbW1iN2xqdjFqYmYycG80bmo2bDYwN24ifQ.GQN5FI2XaZYpt8KKxYcMQQ';
  map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [lng, lat], // starting position [lng, lat]
    zoom: zoom // starting zoom
  });

  marker1 = new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .addTo(map)
    .setPopup(
      new mapboxgl.Popup()
        .setHTML(label)
        .addTo(map)
    );
}

form.onsubmit = e => {
  e.preventDefault();
  if (search.value.length > 0) {
    fetch(`${baseURL}/${search.value}.json?proximity=${longitude},${latitude}&country=CA&limit=10&${accessToken}`).then(response => response.json()).then(data => {
      console.log(data);
      if (data.features.length === 0) {
        poi.insertAdjacentHTML('afterbegin', `<li>No Results Found</li>`);
        poi.onclick = e => {
          let listElement = e.target.closest('li');
          if (listElement !== null) {
            poi.innerHTML = "";
            search.value = "";
          }
        }
      } else {
        displayLocations(data.features);
      }
    });
  }
}

function displayLocations(locations) {
  poi.innerHTML = "";
  for (let location of locations) {
    let place_nameData = location.place_name.split(",");
    let place_name = place_nameData[0];
    let place_location = place_nameData[1];
    let place_lng = location.center[0];
    let place_lat = location.center[1];
    let locationDistance = distance(latitude, longitude, place_lat, place_lng, 'K');

    poi.insertAdjacentHTML("beforeend", `
      <li class="poi" data-long="${location.geometry.coordinates[0]}" data-lat="${location.geometry.coordinates[1]}"">
        <ul>
          <li class="name">${place_name}</li>
          <li class="street-address">${place_location}</li>
          <li class="distance">${locationDistance}</li>
        </ul>
      </li>`
    );
  }
}

poi.onclick = e => {
  let poiListElement = e.target.closest('.poi');
  let poiULListElement = poiListElement.querySelector("ul .name");

  if (poiListElement !== null) {
    marker1.remove();
    displayMap(poiListElement.dataset.long, poiListElement.dataset.lat, 15, poiULListElement.innerHTML);
  }
}