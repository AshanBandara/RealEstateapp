import { useParams } from "react-router-dom";
import { useState } from "react";
import data from "../data/properties.json";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const Property = () => {
	const { id } = useParams();
  const properties = data.properties;

	const property = properties.find((p) => p.id === id);

	const [mainImage, setMainImage] = useState(
    property ? property.previewPicture : ""
  );

  if (!property) {
    return <h2>Property not found</h2>;
  }

  return (
    <div>
      <h1>Property Details</h1>

      {/* MAIN IMAGE */}
      <img
        src={mainImage}
        alt="property"
        width="450"
      />

      {/* THUMBNAILS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {[property.previewPicture, ...property.pictures].map((img, index) => (
          <img
            key={index}
            src={img}
            alt="thumb"
            width="80"
            style={{ cursor: "pointer", border: "1px solid #ccc" }}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>

      <h2>Rs.{property.price.toLocaleString()}</h2>
      <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
      <p><strong>Location:</strong> {property.location}</p>

      {/* TABS */}
      <Tabs>
        <TabList>
          <Tab>Description</Tab>
          <Tab>Floor Plan</Tab>
          <Tab>Map</Tab>
        </TabList>

        <TabPanel>
          <p>{property.description}</p>
        </TabPanel>

        <TabPanel>
          <img
            src={property.floorPlan}
            alt="floor plan"
            width="400"
          />
        </TabPanel>

        <TabPanel>
          <iframe
            title="map"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              property.location
            )}&output=embed`}
          ></iframe>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Property;

