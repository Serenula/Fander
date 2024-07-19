let map;
let userLocation;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map = new google.maps.Map(document.getElementById("map"), {
          center: userLocation,
          zoom: 12,
        });
        loadStalls();
      },
      () => {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
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

const baseUrl = "http://127.0.0.1:5001";

function loadStalls() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.accessToken) {
    console.error("No access token found in localStorage");
    return;
  }

  console.log("Token Received Successfully");

  fetch(`${baseUrl}/api/stalls/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.accessToken}`,
    },
  })
    .then((response) => {
      console.log("Fetch response status:", response.status);
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(
            "Network response was not ok: " + JSON.stringify(data)
          );
        });
      }
      return response.json();
    })
    .then((stalls) => {
      console.log("Stalls response:", stalls);
      if (!Array.isArray(stalls)) {
        throw new Error("Response is not an array");
      }

      // Update the HTML content
      const stallList = document.getElementById("stall-list");
      stallList.innerHTML = stalls
        .map(
          (stall) => `
          <div class="stall-card">
            <h3>${stall.name}</h3>
            <p><strong>Address:</strong> ${stall.address}</p>
            <p><strong>Meat:</strong> ${stall.meat}</p>
            <p><strong>Vegetable:</strong> ${stall.vegetable}</p>
            <p><strong>Fish:</strong> ${stall.fish}</p>
            <p><strong>Misc:</strong> ${stall.misc}</p>
          </div>
        `
        )
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching stalls:", error);
    });
}

window.initMap = initMap;
