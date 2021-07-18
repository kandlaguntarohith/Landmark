mapboxgl.accessToken = mapToken;
// console.log(landmark)
const goodlandmark = JSON.parse(landmark);
const center = [...goodlandmark.geometry.coordinates];
center[0] -= 3;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/navigation-day-v1",
  center: center,

  zoom: 7, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
// map.addControl(nav, 'bottom-right');
map.addControl(new mapboxgl.FullscreenControl(),'bottom-right');
map.scrollZoom.disable();
//======================================================================
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
