import { useState } from "react";
import "./Distance.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Distance = () => {
  const [l1, setLocation1] = useState("");
  const [l2, setLocation2] = useState("");
  const [distance, setDistance] = useState(null);

  const [vehicle, setVehicle] = useState("");
  const [travelTime, setTravelTime] = useState(null);

  const toDisable = !l1 || !l2 || !vehicle;

  const cities = [
    "Bengaluru",
    "Chennai",
    "Delhi",
    "Hyderabad",
    "Kolkata",
    "Mumbai",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Chandigarh",
    "Kochi",
    "Trivandrum",
    "Coimbatore",
    "Madurai",
    "Trichy",
    "Vijayawada",
    "Visakhapatnam",
    "Guntur",
    "Warangal",
    "Nagpur",
  ];

  // 👉 NEW
  const vehicleConfig = {
    twoWheeler: { avgSpeed: 55 },
    fourWheeler: { avgSpeed: 65 },
  };

  async function getLatLng(place) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const data = await res.json();
    if (!data.length) throw new Error("Location not found");

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  }

  // 👉 NEW
  function calculateTravelTime(distanceKm, vehicleType) {
    const speed = vehicleConfig[vehicleType].avgSpeed;
    const time = distanceKm / speed;

    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);

    return `${hours}h ${minutes}m`;
  }

  async function calculateDistance() {
    try {
      const loc1 = await getLatLng(l1);
      const loc2 = await getLatLng(l2);

      const dist = haversine(loc1.lat, loc1.lon, loc2.lat, loc2.lon);
      setDistance(dist);

      const time = calculateTravelTime(dist, vehicle);
      setTravelTime(time);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="Distance_main">
      <center>
        <h3 style={{ color: "red" }}>Calculate Distance</h3>

        <div className="distance_second">
          <div className="distance_div">
            <label>From</label>
            <select value={l1} onChange={(e) => setLocation1(e.target.value)}>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <FontAwesomeIcon icon={faArrowRight} />

            <label>To</label>
            <select value={l2} onChange={(e) => setLocation2(e.target.value)}>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <br />
          <select
            style={{ width: "142px" }}
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          >
            <option value="">Select Your Vehicle</option>
            <option value="twoWheeler">🛵 Two Wheeler</option>
            <option value="fourWheeler">🚗 Four Wheeler</option>
          </select>

          <div className="Btn-div">
            <button
              onClick={calculateDistance}
              disabled={toDisable}
              style={{ cursor: toDisable ? "not-allowed" : "pointer" }}
            >
              Calculate
            </button>

            {distance && (
              <>
                <h3 className="distance_text">Distance: {distance} KM</h3>
                <h4 className="distance_text">
                  Estimated Time: {travelTime}
                </h4>{" "}
              </>
            )}
          </div>
        </div>
      </center>
    </div>
  );
};

export default Distance;
