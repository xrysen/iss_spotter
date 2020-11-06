/**
 * Makes a single API Request to retrive user's IP Address
 * Input:
 *  - A callback (to pass back an error or IP string)
 * Returns (Via Callback)
 *  -An Error, if any (nullable)
 *  -An IP Address as a string (null if error). Example: "152.245.144.123"
 *
 */

const request = require('request');

const fetchMyIP = (callback) => {
  // Use request  to fetch IP address from JSON API
  request("https://api.ipify.org/?format=json", (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Respone ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    callback(null, data.ip);

  });
};

const fetchCoordsByIP = (ip, callback) => {
  // Use request to fetch Long/Lat from JSON API
  request(`http://ip-api.com/json/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    const data = JSON.parse(body);

    if (data.status === "fail") {
      const msg = `Status code ${data.status} when fetching IP. Response ${body}`;
      callback(Error(msg), null);
      return;
    }

    const returnData = {
      latitude: data.lat,
      longitude: data.lon
    };

    callback(null, returnData);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching coords. Response ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    callback(null, data);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, flyTimes) => {
        if (error) {
          callback(error, null);
        }
        callback(null, flyTimes);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
