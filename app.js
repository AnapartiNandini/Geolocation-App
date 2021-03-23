let latitude;
let longitude

navigator.geolocation.getCurrentPosition(function (position) {
  console.log(position);
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
}, function (error) {
  console.error(error);
}, {enableHighAccuracy: true, timeout: 10000});
