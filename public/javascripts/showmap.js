mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/navigation-night-v1", // style URL
  center: mapCenter, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

const marker = new mapboxgl.Marker()
  .setLngLat(mapCenter)
  .setPopup(
    new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(mapCenter)
      .setHTML(`<h5>${campName} - </h5><h6>${mapLocation}</h6>`)
  )
  .addTo(map);
