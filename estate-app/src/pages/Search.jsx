import { useState } from "react";
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
  const [favourites, setFavourites] = useState([]);



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
      <h1>Property Search</h1>

      {/* PROPERTY TYPE */}
      <label>Property Type</label>
      <Select
        options={[
          { value: "house", label: "House" },
          { value: "apartment", label: "Apartment" },
          {value: "flat", label: "Flat"}
        ]}
        isClearable
        onChange={(option) => setType(option?.value || null)}
      />

      {/* PRICE */}
      <label>Min Price</label>
      <input
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <label>Max Price</label>
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      {/* BEDROOMS */}
      <label>Min Bedrooms</label>
      <input
        type="number"
        value={minBeds}
        onChange={(e) => setMinBeds(e.target.value)}
      />

      <label>Max Bedrooms</label>
      <input
        type="number"
        value={maxBeds}
        onChange={(e) => setMaxBeds(e.target.value)}
      />

      {/* DATE */}
      <label>Date Added After</label>
      <DatePicker
        selected={dateAdded}
        onChange={(date) => setDateAdded(date)}
        placeholderText="Select date"
      />

      {/* POSTCODE */}
      <label>Postcode Area</label>
      <input
        type="text"
        placeholder="e.g. BR1"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
      />

      <br /><br />

      <button onClick={handleSearch}>Search</button>
      <button onClick={clearResults} style={{ marginLeft: 8 }}>Clear</button>

      <hr />
        
        {/* show results section */}
      <section>
            <h2>Results ({results.length})</h2>

            {results.length === 0 && <p>No properties found.</p>}

            {results.map((property) => {
            const imgSrc = property.previewPicture ?? property.picture ?? "";

            return (
                <div
                    key={property.id}
                    style={{
                        border: "1px solid #eee",
                        borderRadius: "12px",
                        padding: "15px",
                        position: "relative"
                    }}
                    >
                    {/* HEART ICON */}
                    <button
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
                    <h3>Rs.{property.price.toLocaleString()}</h3>
                    <p>{property.location}</p>
                    <p>{property.bedrooms} bedrooms</p>

                    <Link to={`/property/${property.id}`}>View Property</Link>
                </div>

            );
            })}
      </section>
            {/* FAVOURITES SIDEBAR */}
      <aside
            style={{
                position: "fixed",
                right: "20px",
                top: "120px",
                width: "280px",
                background: "#352d2dff",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
            }}
            >
            <h3>❤️ Favorites</h3>

            {favourites.length === 0 && <p>No favourites yet</p>}

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
                    <div style={{ color: "#5B4DFF" }}>
                    Rs.{fav.price.toLocaleString()}
                    </div>
                </div>

                <button
                    onClick={() => removeFromFavourites(fav.id)}
                    style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "18px"
                    }}
                >
                    ✖
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


