mapboxgl.accessToken = mapToken;
// console.log(landmark)
const goodlandmark = JSON.parse(landmark);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/navigation-day-v1",
  center: goodlandmark.geometry.coordinates,
  zoom: 7, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
// Set options
var marker = new mapboxgl.Marker({
  color: "#4B0082",
  // draggable: true,
})
  .setLngLat(goodlandmark.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${goodlandmark.title}</h4><p>${goodlandmark.location}</p>`
    )
  )
  .addTo(map);
