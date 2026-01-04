import { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import data from "../data/properties.json";
import { Link } from "react-router-dom";



const Search = () => {
  const [type, setType] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");
  const [dateAdded, setDateAdded] = useState(null);
  const [postcode, setPostcode] = useState("");


  const properties = data.properties;
  const [results, setResults] = useState([]);
  const [favourites, setFavourites] = useState(() => {
  const saved = localStorage.getItem("favourites");
  return saved ? JSON.parse(saved) : [];
    });

    // use to save fav in local
    useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites]);



const handleSearch = () => {
const filteredProperties = properties.filter((property) => {

    // TYPE
    if (type && property.type !== type) return false;

    // PRICE
    if (minPrice && property.price < parseInt(minPrice)) return false;
    if (maxPrice && property.price > parseInt(maxPrice)) return false;

    // BEDROOMS
    if (minBeds && property.bedrooms < parseInt(minBeds)) return false;
    if (maxBeds && property.bedrooms > parseInt(maxBeds)) return false;

    // DATE
    if (dateAdded) {
    const propertyDate = new Date(
        `${property.added.month} ${property.added.day}, ${property.added.year}`
    );
    if (propertyDate < dateAdded) return false;
    }

    // POSTCODE
    if (
    postcode &&
    !property.location.toUpperCase().includes(postcode)
    ) {
    return false;
    }

    return true;
});

setResults(filteredProperties);
};

const addToFavourites = (property) => {
  // prevent duplicates
  if (favourites.find((fav) => fav.id === property.id)) return;

  setFavourites([...favourites, property]);
};

const removeFromFavourites = (id) => {
  setFavourites(favourites.filter((fav) => fav.id !== id));
};

const clearFavourites = () => {
  setFavourites([]);
};

const clearResults = () => setResults([]);


  return (
    <div>
        <header className="site-header">
            <div className="header-inner">
            <div className="logo">EM</div>
            </div>
        </header>

        <main className="site-main">
            <div className="hero">
                <h1>
                    Estate Mart
                </h1>
                <p>
                    Curated premium properties for those who demand excellence.
                    Use the advanced filters below to begin your journey home.
                </p>
            </div>


            {/* PAGE LAYOUT */}
            <div className="page-container">

                {/* LEFT CONTENT */}
                <div>
                    <div className="search-card">
                        <div className="search-title">
                            🔍 <span>Search Criteria</span>
                        </div>
                        <div className="search-grid">
                            {/* PROPERTY TYPE */}
                            <div className="field property-type">
                                <label>Property Type</label>
                                <Select className="property-type-select"
                                    options={[
                                    { value: "house", label: "House" },
                                    { value: "apartment", label: "Apartment" },
                                    {value: "flat", label: "Flat"}
                                    ]}
                                    isClearable
                                    onChange={(option) => setType(option?.value || null)}
                                />
                            </div>

                            {/* PRICE */}
                            <div className="field">

                                <label>Min Price</label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label>Max Price</label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>

                            <div className="field empty"></div>

                            {/* BEDROOMS */}
                            <div className="field">
                                <label>Min Bedrooms</label>
                                <input
                                    type="number"
                                    value={minBeds}
                                    onChange={(e) => setMinBeds(e.target.value)}
                                />
                            </div>
                            
                            <div className="field">
                                <label>Max Bedrooms</label>
                                <input
                                    type="number"
                                    value={maxBeds}
                                    onChange={(e) => setMaxBeds(e.target.value)}
                                />
                            </div>

                            <div className="field empty"></div>

                            {/* DATE */}
                            <div className="field">
                                <label>Date Added After</label>
                                <DatePicker
                                    selected={dateAdded}
                                    onChange={(date) => setDateAdded(date)}
                                    placeholderText="Select date"
                                />
                            </div>

                            {/* POSTCODE */}
                            <div className="field">
                                <label>Postcode Area</label>
                                <input
                                    type="text"
                                    placeholder="e.g. BR1"
                                    value={postcode}
                                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                                />
                            </div>

                            <br /><br />

                            <div className="search-actions">
                            <button className="search-btn" onClick={handleSearch}>
                                Search
                            </button>

                            <button className="clear-btn" onClick={clearResults}>
                                Clear
                            </button>
                            </div>

                        </div>
                    </div>
                    <hr />
                        
                        {/* show results section */}
                    <section>
                        <div className="results-header">
                            <h2>Results ({results.length})</h2>
                        </div>
                            <div className="results-grid">
                                {results.length === 0 && <p>No properties found.</p>}

                                {results.map((property) => {
                                const imgSrc = property.previewPicture ?? property.picture ?? "";

                                return (
                                    <div className="property-card"
                                        key={property.id}
                                        draggable
                                        onDragStart={(e) =>
                                            e.dataTransfer.setData(
                                            "property",
                                            JSON.stringify(property)
                                            )}
                                        style={{
                                            border: "1px solid #eee",
                                            borderRadius: "12px",
                                            padding: "15px",
                                            position: "relative"
                                        }}
                                        >

                                        <span className="property-tag">
                                        {property.type.toUpperCase()}
                                        </span>

                                        {/* HEART ICON */}
                                        <button className="heart-btn"
                                            onClick={() => addToFavourites(property)}
                                            style={{
                                            position: "absolute",
                                            top: "15px",
                                            right: "15px",
                                            border: "none",
                                            background: "white",
                                            cursor: "pointer",
                                            fontSize: "22px"
                                            }}
                                        >
                                            ❤️
                                        </button>

                                        {imgSrc && <img src={imgSrc} alt="property" width="200" />}
                                        <div className="property-info">
                                            <h4 className="property-title-result">{property.title}</h4>
                                            <h3 style={{color:" #fd7f2bff"}}>Rs.{property.price.toLocaleString()}</h3>
                                            <p>{property.location}</p>
                                            <p>{property.bedrooms} bedrooms</p>
                                        </div>

                                        <Link to={`/property/${property.id}`}>View Property</Link>
                                    </div>

                                );
                                })}
                            </div>
                    </section>
                </div>
                {/* FAVOURITES SIDEBAR */}
                <aside className="favorites-panel"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            const droppedProperty = JSON.parse(
                                e.dataTransfer.getData("property")
                            );
                            addToFavourites(droppedProperty);
                        }}
                        style={{
                            position: "fixed",
                            right: "20px",
                            top: "120px",
                            width: "280px",
                            background: "#ffffffff",
                            borderRadius: "16px",
                            padding: "16px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
                        }} >
                        
                        <h3>❤️ Favorites</h3>

                        {favourites.length === 0 && (
                            <div className="favorites-empty">
                                ➕ <br />
                                Drag properties here<br />to save them
                            </div>
                        )}

                        {favourites.map((fav) => (
                            <div
                            key={fav.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "10px"
                            }}
                            >
                            <div>
                                <strong>{fav.type}</strong>
                                <div className="property-price">
                                Rs.{fav.price.toLocaleString()}
                                </div>
                            </div>

                            <button className="fav-button"
                                onClick={() => removeFromFavourites(fav.id)}
                            >
                                ❌
                            </button>
                            </div>
                        ))}

                        {favourites.length > 0 && (
                            <button
                            onClick={clearFavourites}
                            style={{
                                marginTop: "10px",
                                width: "100%",
                                padding: "8px",
                                borderRadius: "8px",
                                border: "1px solid red",
                                background: "white",
                                color: "red",
                                cursor: "pointer"
                            }}
                            >
                            Clear All
                            </button>
                        )}
                    </aside>


            </div>
        </main>
        <footer className="site-footer">
            <p>© 2026 Estate Mart. All rights reserved.</p>
        </footer>
        {/* debug */}
      {/* <pre>
        {JSON.stringify(
        { type, minPrice, maxPrice, minBeds, maxBeds, dateAdded, postcode },
        null,
        2
        )}
        </pre> */}

    </div>
  );
};




export default Search;


