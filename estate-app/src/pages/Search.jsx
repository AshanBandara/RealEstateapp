import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import data from "../data/properties.json";
import { useNavigate } from "react-router-dom";


const Search = () => {
  // 🔹 Search state
  const [type, setType] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");
  const [dateAdded, setDateAdded] = useState(null);
  const [postcode, setPostcode] = useState("");


  const properties = data.properties;
  const navigate = useNavigate();


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

navigate("/results", { state: { results: filteredProperties } });
};


  return (
    <div>
      <h1>Property Search</h1>

      {/* PROPERTY TYPE */}
      <label>Property Type</label>
      <Select
        options={[
          { value: "house", label: "House" },
          { value: "apartment", label: "Apartment" }
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

