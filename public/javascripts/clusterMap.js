const createClusteredMap = async () => {
  // console.log(landmarks);
  let longitude = -103.59179687498357;
  let latitude = 40.66995747013945;
  const data = await fetch("https://ipapi.co/json/");
  const info = await data.json();
  // console.log("location", info);

  latitude = info.latitude;
  longitude = info.longitude;
  // console.log(latitude, longitude);
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "cluster-map",
    style: "mapbox://styles/mapbox/light-v10",
    // style: "mapbox://styles/mapbox/navigation-day-v1",
    center: [longitude, latitude],
    zoom: 8,
  });
  //controlls ========================================================
  map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
  map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
  //==================================================================
  map.on("load", function () {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource("landmarks", {
      type: "geojson",
      data: landmarks, //{features : []}
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "landmarks",
      filter: ["has", "point_count"],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#00BCD4",
          10,
          "#2196F3",
          30,
          "#3F51B5",
        ],
        "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "landmarks",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "landmarks",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    // inspect a cluster on click
    map.on("click", "clusters", function (e) {
      // console.log("clustered");
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("landmarks")
        .getClusterExpansionZoom(clusterId, function (err, zoom) {
          if (err) return;
          // console.log(features[0].geometry.coordinates);
          // features[0].geometry.coordinates[0] -= (zoom * 0.001);
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on("click", "unclustered-point", function (e) {
      const { popUpMarkup } = e.features[0].properties;
      // console.log("unclustered");
      const coordinates = e.features[0].geometry.coordinates.slice();
      // console.log(e.features);
      // console.log(popUpMarkup);

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(popUpMarkup)
        .addTo(map);
    });

    map.on("mouseenter", "clusters", function () {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", function () {
      map.getCanvas().style.cursor = "";
    });
  });
};
// fetch("https://ipapi.co/json/")
//   .then((data) => data.json())
//   .then((data) => console.log(data));
createClusteredMap();

// window.addEventListener("scroll", () => {
//   const category = document.querySelector("#category").value;
//   const search = document.querySelector("#search").value;

//   // console.log(
//   //   window.scrollY,
//   //   "   ",
//   //   window.innerHeight,
//   //   "   ",
//   //   document.documentElement.scrollHeight
//   // );
//   console.log(category, search);
//   if (
//     window.scrollY + window.innerHeight + 1000 >=
//     document.documentElement.scrollHeight
//   ) {
//     // console.log("End of the page !");
//     window.location.replace(`/landmarks?page=${page + 1}`);
//   }
// });
