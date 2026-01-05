import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import data from "../data/properties.json";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Badge from "../components/Badge";

const Property = () => {
  const { id } = useParams();
  const properties = data.properties;
  const property = properties.find((p) => p.id === id);

  // Favourites State
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Handle Image Normalization (memoized so identity is stable between renders)
  const normalizeSrc = (src) => {
    if (!src) return "";
    // If it's an absolute HTTP(s) URL, return as-is
    if (src.startsWith("http")) return src;

    // Use Vite's BASE_URL so assets resolve correctly when deployed under a subpath
    const base = import.meta.env.BASE_URL || "/";
    const cleaned = src.replace(/^\/+/, ""); // remove leading slash to avoid //
    return `${base}${cleaned}`;
  };

  const images = useMemo(() => {
    if (!property) return [];
    return [property.previewPicture ?? property.picture, ...(Array.isArray(property.pictures) ? property.pictures : [])]
      .filter(Boolean)
      .map(normalizeSrc);
  }, [property]);
  const [mainImage, setMainImage] = useState(images[0] ?? "");

  // Update main image if property changes or images load
  useEffect(() => {
    if (images.length > 0) {
      setMainImage((prev) => (prev && images.includes(prev) ? prev : images[0]));
    } else {
      setMainImage("");
    }
  }, [images]);


  const addToFavourites = () => {
    if (favourites.find((fav) => fav.id === property.id)) return;
    setFavourites([...favourites, property]);
  };

  const isFavourite = property && favourites.some(fav => fav.id === property.id);

  if (!property) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Property not found</h2>
        <Link to="/">
          <Button variant="primary">Back to Search</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="site-header">
        <div className="header-inner">
          <div className="logo"><Link to="/">EstateMart.</Link></div>
          <Link to="/">
            <Button variant="ghost" size="sm">← Back to Search</Button>
          </Link>
        </div>
      </header>

      <main className="site-main">
        <div className="container" style={{ marginTop: '2rem' }}>
          {/* Header Details */}
          <div className="property-header-section">
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Badge variant="primary">{property.type}</Badge>
                <Badge variant="secondary">{property.tenure || 'Freehold'}</Badge>
              </div>
              <h1 className="property-page-title">{property.title}</h1>
              <p className="property-page-location">📍 {property.location}</p>
            </div>
            <div className="property-price-action">
              <div className="property-page-price">
                Rs.{property.price.toLocaleString()}
              </div>
              <Button
                variant={isFavourite ? "accent" : "primary"}
                onClick={addToFavourites}
                disabled={isFavourite}
              >
                {isFavourite ? "Saved to Favourites ❤️" : "Add to Favourites ♡"}
              </Button>
            </div>
          </div>

          <div className="property-grid-layout">
            {/* LEFT: Images */}
            <div className="property-visuals">
              <div className="main-image-wrapper">
                <img src={mainImage} alt={property.title} className="main-image-display" />
              </div>
              <div className="thumbnails-grid">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail-wrapper ${mainImage === img ? 'active' : ''}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`View ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Details & Tabs */}
            <div className="property-info-panel">
              <div className="info-card">
                <h3>Property Details</h3>
                <div className="facts-grid">
                  <div className="fact-item">
                    <span className="fact-label">Bedrooms</span>
                    <span className="fact-value">{property.bedrooms}</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Type</span>
                    <span className="fact-value" style={{ textTransform: 'capitalize' }}>{property.type}</span>
                  </div>
                  <div className="fact-item">
                    <span className="fact-label">Added</span>
                    <span className="fact-value">{property.added.month} {property.added.day}, {property.added.year}</span>
                  </div>
                </div>
              </div>

              <Tabs className="custom-tabs">
                <TabList>
                  <Tab>Description</Tab>
                  <Tab>Floor Plan</Tab>
                  <Tab>Google Map</Tab>
                </TabList>

                <TabPanel>
                  <div className="tab-content">
                    <p>{property.description}</p>
                    {property.longDescription && (
                      <>
                        <br />
                        <p>{property.longDescription}</p>
                      </>
                    )}
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="tab-content center-content">
                    {property.floorPlan ? (
                      <img src={normalizeSrc(property.floorPlan)} alt="Floor Plan" style={{ maxWidth: '100%' }} />
                    ) : (
                      <p className="text-muted">No floor plan available.</p>
                    )}
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="tab-content">
                    <iframe
                      title="map"
                      width="100%"
                      height="400"
                      style={{ border: 0, borderRadius: '8px' }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                    ></iframe>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>&copy; 2026 EstateMart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Property;
