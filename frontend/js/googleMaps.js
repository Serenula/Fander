let map;

function initMap() {
  const address = new URLSearchParams(window.location.search).get("address");
  if (address) {
    getCoordinates(address)
      .then((location) => {
        map = new google.maps.Map(document.getElementById("map"), {
          center: location,
          zoom: 15,
        });
        new google.maps.marker.AdvancedMarkerElement({
          position: location,
          map: map,
          title: address,
        });
      })
      .catch((error) => {
        console.error("Error getting coordinates:", error);
      });
  } else {
    console.error("Address not provided in query parameters");
  }
}

function getCoordinates(address) {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        return data.results[0].geometry.location;
      } else {
        throw new Error(data.status);
      }
    });
}

window.initMap = initMap;
