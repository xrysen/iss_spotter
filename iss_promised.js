const request = require("request-promise-native");

const fetchMyIP = () => {
  return request("https://api.ipify.org/?format=json");
};

/* 
 * Makes a request to ip-api using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */

const fetchCoordsByIP = (body) => {
  const data = JSON.parse(body).ip;
  return request(`http://ip-api.com/json/${data}`);
};

const fetchISSFlyOverTimes = (body) => {
  const data = JSON.parse(body);
  return request(`http://api.open-notify.org/iss-pass.json?lat=${data.lat}&lon=${data.lon}`);
}

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = {
  nextISSTimesForMyLocation
};

