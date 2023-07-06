import { MapContainer, TileLayer, Polyline, Polygon } from 'react-leaflet';
import { useState } from 'react';
import * as vec3 from 'gl-matrix/vec3';

function MapComponent() {
  const [heading, setHeading] = useState(0); // Default heading value
  const [altitude, setAltitude] = useState(10000); // Default altitude value
  const [elevation, setElevation] = useState(90); // Default elevation value
  const [latitude, setLatitude] = useState(32); // Default latitude value
  const [longitude, setLongitude] = useState(34.8); // Default longitude value
  const [coneAngle, setConeAngle] = useState(5); // Default sensor cone angle value

  // Convert Geodetic to ECEF coordinates
  const geodeticToECEF = (lat, long, alt) => {
    // alt *= 0.3048; // convert feet to meters
    let a = 6378137; // semi-major axis of the Earth (meters)
    let f = 1/298.257223563; // flattening
    let e = Math.sqrt(2*f - f*f); // eccentricity

    let latRad = lat * Math.PI / 180;
    let lonRad = long * Math.PI / 180;

    let N = a / Math.sqrt(1 - e*e * Math.sin(latRad)*Math.sin(latRad));
    let x = (N + alt) * Math.cos(latRad) * Math.cos(lonRad);
    let y = (N + alt) * Math.cos(latRad) * Math.sin(lonRad);
    let z = (N * (1 - e*e) + alt) * Math.sin(latRad);

    return [x, y, z];
  };

  function ECEFtoGeodetic(ECEFCoords) {
    const a = 6378137; // semi-major axis of the Earth (meters)
    const f = 1/298.257223563; // flattening
    const b = a * (1 - f); // semi-minor axis
    const e = Math.sqrt(2*f - f*f); // eccentricity
  
    const [x, y, z] = ECEFCoords;
    const lon = Math.atan2(y, x);
    const r = Math.sqrt(x*x + y*y);
    const E = Math.sqrt(a*a - b*b);
    const F = 54 * b*b * z*z;
    const G = r*r + (1 - e*e)*z*z - e*e*E*E;
    const c = (e*e*e*F*r*r)/(G*G*G);
    const s = Math.pow(1 + c + Math.sqrt(c*c + 2*c), 1/3);
    const P = F / (3 * Math.pow((s + 1/s + 1), 2) * G*G);
    const Q = Math.sqrt(1 + 2 * e*e*e*P);
    const r0 =  -(P*e*r)/(1+Q) + Math.sqrt(0.5*a*a*(1 + 1/Q) - P*(1 - e*e)*z*z/(Q*(1 + Q)) - 0.5*P*r*r);
    const U = Math.sqrt(Math.pow(r - e*r0, 2) + z*z);
    const V = Math.sqrt(Math.pow(r - e*r0, 2) + (1 - e*e)*z*z);
    const Z0 = b*b*z / (a*V);
    const h = U*(1 - b*b/(a*V));
    const lat = Math.atan((z + e*e*Z0)/r);
  
    // Convert back to degrees and feet
    const lonDeg = lon * 180 / Math.PI;
    const latDeg = lat * 180 / Math.PI;
    const hFt = h * 3.28084; // convert from meters to feet
  
    return [latDeg, lonDeg, hFt];
  }

  const positionECEF = geodeticToECEF(latitude, longitude, altitude * 0.3048); // Convert altitude to meters
  console.log("Position ECEF: ", positionECEF);
  // Calculate the intersection of the sensor and the ground.
  // This is a placeholder and should be replaced by your intersection calculation function.
  // !!! ATTENTION!!! Assumption of perfect sphere is used
  const calculateIntersection = () => {
    // Constants
    const earthRadius = 6371000; // Earth's mean radius in meters
    const sensorConeAngle = coneAngle * Math.PI / 180; // Convert angle to radians
    const sensorElevationAngle = elevation * Math.PI / 180; // Convert angle to radians
  
    // Calculate unit vector for sensor direction
    const sensorDirection = vec3.fromValues(
      Math.sin(sensorElevationAngle) * Math.cos(heading * Math.PI / 180),
      Math.sin(sensorElevationAngle) * Math.sin(heading * Math.PI / 180),
      Math.cos(sensorElevationAngle)
    );
  
    // Calculate distance from sensor to Earth's surface along sensor direction
    const distanceToSurface = altitude / Math.cos(sensorElevationAngle);
  
    // Calculate the radius of the cone at the Earth's surface
    const coneRadiusAtSurface = Math.tan(sensorConeAngle) * distanceToSurface;
  
    // Calculate intersection points
    let intersectionPointsECEF = [];
    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 180) {
      // Calculate unit vector for this point on the circle
      let pointOnCircle = vec3.fromValues(
        Math.cos(angle),
        Math.sin(angle),
        0
      );
  
      // Rotate point to align with sensor direction
      let rotatedPoint = vec3.rotateZ(vec3.create(), pointOnCircle, vec3.fromValues(0, 0, 0), sensorDirection);
  
      // Scale by cone radius
      vec3.scale(rotatedPoint, rotatedPoint, coneRadiusAtSurface);
  
      // Convert from local to global ECEF coordinates
      vec3.add(rotatedPoint, rotatedPoint, positionECEF);
  
      // Add to intersection points
      intersectionPointsECEF.push(rotatedPoint);
    }
  
    return intersectionPointsECEF;
  };

  const intersectionPointsECEF = calculateIntersection();

  // Convert the intersection points back to Geodetic coordinates for plotting
  const intersectionPoints = intersectionPointsECEF.map(ECEFtoGeodetic);

  // Filter the points based on whether they form a circle or ellipse
  const validPoints = intersectionPoints.filter(point => {
    // Replace this with your circle/ellipse checking function.
    return true;
  });

  // Calculate the arrow endpoint based on the heading angle
  const arrowEndpoint = [
    latitude + Math.cos((heading * Math.PI) / 180) / 50,
    longitude + Math.sin((heading * Math.PI) / 180) / 50
  ];

  return (
    <div id="map">
      <MapContainer style={{ height: '100%' }} center={[latitude, longitude]} zoom={12} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={[[latitude, longitude], arrowEndpoint]} color="red" />
        {validPoints.length > 2 && (
          <Polygon positions={validPoints} color="blue" />
        )}
      </MapContainer>
      <div className="menu">
        <div className="menu-item">
          <label htmlFor="heading-input">Heading:</label>
          <input
            id="heading-input"
            type="number"
            value={heading}
            onChange={(e) => setHeading(parseFloat(e.target.value))}
          />
        </div>
        <div className="menu-item">
          <label htmlFor="altitude-input">Altitude (ft):</label>
          <input
            id="altitude-input"
            type="number"
            value={altitude}
            onChange={(e) => setAltitude(parseInt(e.target.value))}
          />
        </div>
        <div className="menu-item">
          <label htmlFor="elevation-input">Elevation (degrees):</label>
          <input
            id="elevation-input"
            type="number"
            value={elevation}
            onChange={(e) => setElevation(parseFloat(e.target.value))}
          />
        </div>
        <div className="menu-item">
          <label htmlFor="latitude-input">Latitude:</label>
          <input
            id="latitude-input"
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
          />
        </div>
        <div className="menu-item">
          <label htmlFor="longitude-input">Longitude:</label>
          <input id="longitude-input" type="number" value={longitude} onChange={e => setLongitude(parseFloat(e.target.value))} />
        </div>
        <div className="menu-item">
          <label htmlFor="coneangle-input">Lens angle:</label>
          <input id="coneangle-input" type="number" value={coneAngle} onChange={e => setConeAngle(parseFloat(e.target.value))} />
        </div>
      </div>
    </div>
  )
}

export default MapComponent