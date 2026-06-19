import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

// 1. Point to the blueprint file you just created
import geoUrl from "../assets/delhi-districts.json"; 

// 2. Color scale: 0 = Green, 10 = Yellow, 20+ = Red
const colorScale = scaleLinear()
  .domain([0, 10, 20]) 
  .range(["#10b981", "#f59e0b", "#ef4444"]); 

export default function DistrictMap({ liveData }) {
  return (
    <div className="w-full h-full relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 60000, // Zoom level (increase if map is too small)
          center: [77.1025, 28.7041] // GPS center of Delhi
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // Extract the name from the GeoJSON. It's usually under properties.district or properties.name
              const districtName = geo.properties.P_CNST_NM || ""; 
              
              // Find the matching data from your live database
              const districtData = liveData.find(
            (d) => d.name.toLowerCase() === districtName.toLowerCase()
             );
              
              // Apply color based on critical alerts, default to gray if no data
              const fillColor = districtData ? colorScale(districtData.critical) : "#E2E8F0";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none", transition: "all 250ms" },
                    hover: { fill: "#6366f1", outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                  title={`${districtName}: ${districtData ? districtData.critical : 0} Critical Alerts`}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}