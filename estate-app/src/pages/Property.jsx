import { useParams } from "react-router-dom";
import { useState , useEffect } from "react";
import data from "../data/properties.json";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "../styles/property.css";
import { Link } from "react-router-dom";




const Property = () => {
	const { id } = useParams();
  const properties = data.properties;

  const property = properties.find((p) => p.id === id);

  // Build a normalized images list (supports legacy `picture` and `pictures` fields)
  const rawImages = property
    ? [property.previewPicture ?? property.picture, ...(Array.isArray(property.pictures) ? property.pictures : [])]
        .filter(Boolean)
    : [];

  const normalizeSrc = (src) => {
    if (!src) return "";
    if (src.startsWith("/") || src.startsWith("http")) return src;
    return `/${src}`; // make paths absolute so they work on nested routes
  };

  const images = rawImages.map(normalizeSrc);

  const [mainImage, setMainImage] = useState(images[0] ?? "");
  const [favourites, setFavourites] = useState(() => {
  const saved = localStorage.getItem("favourites");
  return saved ? JSON.parse(saved) : [];
    });

    // use to save fav in local
    useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites]);

  const addToFavourites = (property) => {
  // prevent duplicates
  if (favourites.find((fav) => fav.id === property.id)) return;

  setFavourites([...favourites, property]);
};

  if (!property) {
    return <h2>Property not found</h2>;
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="logo">EM</div>
        </div>
      </header>

      <div className="property-page">
      <div className="property-grid">
        <div className="property-visual">
          <div className="property-images">
            {/* TOP ACTION BAR (overlay) */}
            <div className="property-top-bar">
              <Link to="/" className="back-btn">← Back to Search</Link>

              <button className="fav-btn" onClick={() => addToFavourites(property)}>
                ❤️ Add to Favourite
              </button>
            </div>

            <img
              src={mainImage}
              alt="property"
              className="main-image"
            />

            {/* THUMBNAILS */}
            <div className="thumbnail-row">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${mainImage === img ? "active" : ""}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="property-details">
          <h1 className="property-title">{property.title}</h1>
          <h2 className="property-price">Rs.{property.price.toLocaleString()}</h2>
          <div className="property-facts">
            <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
            <p><strong>Location:</strong> {property.location}</p>
          </div>

          <Tabs className="property-tabs">
            <TabList>
              <Tab>Description</Tab>
              <Tab>Floor Plan</Tab>
              <Tab>Map</Tab>
            </TabList>

            <TabPanel>
              <p className="property-description">
                {property.description}
              </p>
            </TabPanel>

            <TabPanel>
                {property.floorPlan ? (
                  <img
                    src={normalizeSrc(property.floorPlan)}
                    alt="Floor Plan"
                    className="floor-plan"
                  />
                ) : (
                  <p>No floor plan available.</p>
                )}
            </TabPanel>

            <TabPanel>
              <iframe
                title="map"
                width="100%"
                height="350"
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
      </div>
      </div>

      <footer className="site-footer">
        <p>© 2026 Estate Mart. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Property;

