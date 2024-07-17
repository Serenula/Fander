let map;
let userLocation;

function initMap() {
  // Attempt to get the user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Center the map on the user's location
        map = new google.maps.Map(document.getElementById("map"), {
          center: userLocation,
          zoom: 12,
        });
        // Load stalls and add markers
        loadStalls();
      },
      () => {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 1.3521, lng: 103.8198 }, // Default to Singapore
    zoom: 12,
  });
  loadStalls();
}

const baseUrl = "http://127.0.0.1:5001"; // Set your base URL

function loadStalls() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.accessToken) {
    console.error("No access token found");
    return;
  }

  console.log("Access token:", user.accessToken); // Debugging line

  fetch(`${baseUrl}/api/stalls/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(
            "Network response was not ok: " + JSON.stringify(error)
          );
        });
      }
      return response.json();
    })
    .then((stalls) => {
      console.log("Stalls response:", stalls); // Debugging line
      if (!Array.isArray(stalls)) {
        throw new Error("Response is not an array");
      }
      stalls.forEach((stall) => {
        const marker = new google.maps.Marker({
          position: {
            lat: stall.location.coordinates[1],
            lng: stall.location.coordinates[0],
          },
          map: map,
          title: stall.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
          <div>
            <h3>${stall.name}</h3>
            <p><strong>Address:</strong> ${stall.address}</p>
            <p><strong>Meat:</strong> ${stall.meat}</p>
            <p><strong>Vegetable:</strong> ${stall.vegetable}</p>
            <p><strong>Fish:</strong> ${stall.fish}</p>
            <p><strong>Misc:</strong> ${stall.misc}</p>
          </div>
        `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching stalls:", error);
    });
}

function getGeocode(address) {
  return fetch(`/api/maps/geocode?address=${encodeURIComponent(address)}`)
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
