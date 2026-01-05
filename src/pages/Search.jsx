import { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import data from "../data/properties.json";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import FavouritesPanel from "../components/FavouritesPanel";

const Search = () => {
    // Search States
    const [type, setType] = useState(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minBeds, setMinBeds] = useState("");
    const [maxBeds, setMaxBeds] = useState("");
    const [dateAdded, setDateAdded] = useState(null);
    const [postcode, setPostcode] = useState("");

    const properties = data.properties;
    const [results, setResults] = useState(properties); // Show all initially or none? User requirement: "Display the properties that correspond to the search". Initially empty? Or all? Let's show all initially for UX.

    // Favourites State
    const [favourites, setFavourites] = useState(() => {
        const saved = localStorage.getItem("favourites");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites]);

    // Search Logic
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
                    property.added.year,
                    // Month in ID is string, need to convert or standardise in JSON. 
                    // In JSON it is "October", "September".
                    // Let's create a map or use Date.parse
                    new Date(Date.parse(property.added.month + " 1, 2000")).getMonth(),
                    property.added.day
                );
                if (propertyDate < dateAdded) return false;
            }

            // POSTCODE: "1st part of the postcode, e.g. BR1, NW1"
            // The location field has "Colombo 07, Sri Lanka, C07". The JSON actually has postcode? 
            // JSON has "location" string. Let's look at it.
            // JSON items: "location":"Colombo 07, Sri Lanka, C07". The last part looks like postcode.
            // Requirements: "postcode area (1st part of the postcode)".
            // Let's assume the user searches by string match on the location or specific postcode field.
            // Actually, looking at JSON from Step 25, there is NO separate postcode field, just "location".
            // Wait, let's re-read Step 25.
            // "location":"Colombo 07, Sri Lanka, C07"
            // Ah, I should check if the search logic matches this. A simple includes check is robust enough given the data.
            if (postcode && !property.location.toUpperCase().includes(postcode)) {
                return false;
            }

            return true;
        });

        setResults(filteredProperties);
    };

    const clearResults = () => {
        // Reset filters
        setType(null);
        setMinPrice("");
        setMaxPrice("");
        setMinBeds("");
        setMaxBeds("");
        setDateAdded(null);
        setPostcode("");
        setResults(properties); // Reset to show all or empty. Let's show all.
    };

    // Favourites Logic
    const addToFavourites = (property) => {
        if (favourites.some((fav) => fav.id === property.id)) return;
        setFavourites([...favourites, property]);
    };

    const removeFromFavourites = (id) => {
        setFavourites(favourites.filter((fav) => fav.id !== id));
    };

    const clearFavourites = () => {
        setFavourites([]);
    };

    // Drag & Drop
    const handleDragStart = (e, property) => {
        e.dataTransfer.setData("property", JSON.stringify(property));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedProperty = JSON.parse(e.dataTransfer.getData("property"));
        addToFavourites(droppedProperty);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <header className="site-header">
                <div className="header-inner">
                    <div className="logo">EstateMart.</div>
                </div>
            </header>

            <main className="site-main">
                <div className="hero">
                    <h1>Find Your Dream Home</h1>
                    <p>Search properties by type, price, location, and more.</p>
                </div>

                <div className="page-container">
                    {/* LEFT CONTENT: Search & Results */}
                    <div>
                        <div className="search-card">
                            <div className="search-title">
                                Filter Properties
                            </div>
                            <div className="search-grid">
                                {/* PROPERTY TYPE */}
                                <div className="field">
                                    <label>Property Type</label>
                                    <Select
                                        value={type ? { value: type, label: type.charAt(0).toUpperCase() + type.slice(1) } : null}
                                        options={[
                                            { value: "house", label: "House" },
                                            { value: "apartment", label: "Apartment" },
                                            { value: "flat", label: "Flat" }
                                        ]}
                                        isClearable
                                        onChange={(option) => setType(option?.value || null)}
                                        placeholder="Any"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '0.5rem',
                                                borderColor: '#e2e8f0',
                                                padding: '2px'
                                            })
                                        }}
                                    />
                                </div>

                                {/* PRICE */}
                                <div className="field">
                                    <label>Min Price</label>
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min Price (LKR)"
                                    />
                                </div>

                                <div className="field">
                                    <label>Max Price</label>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max Price (LKR)"
                                    />
                                </div>

                                {/* BEDROOMS */}
                                <div className="field">
                                    <label>Min Bedrooms</label>
                                    <input
                                        type="number"
                                        value={minBeds}
                                        onChange={(e) => setMinBeds(e.target.value)}
                                        placeholder="Min Beds"
                                    />
                                </div>

                                <div className="field">
                                    <label>Max Bedrooms</label>
                                    <input
                                        type="number"
                                        value={maxBeds}
                                        onChange={(e) => setMaxBeds(e.target.value)}
                                        placeholder="Max Beds"
                                    />
                                </div>

                                {/* DATE */}
                                <div className="field">
                                    <label>Added After</label>
                                    <DatePicker
                                        selected={dateAdded}
                                        onChange={(date) => setDateAdded(date)}
                                        placeholderText="Select date"
                                        className="w-full" // Use CSS to style this input properly if className doesn't work, actually defaults apply but input styling in components.css targets .field input so it should be fine if DatePicker renders input
                                        customInput={<input />}
                                    />
                                </div>

                                {/* POSTCODE */}
                                <div className="field">
                                    <label>Postcode / Area</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. C07"
                                        value={postcode}
                                        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                                    />
                                </div>

                                <div className="search-actions" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                                    <Button onClick={handleSearch} variant="primary" size="md">
                                        Search Properties
                                    </Button>
                                    <Button onClick={clearResults} variant="ghost" size="md">
                                        Clear Filters
                                    </Button>
                                </div>

                            </div>
                        </div>

                        {/* RESULTS */}
                        <div className="results-header">
                            <h2>Search Results <Badge variant="secondary">{results.length}</Badge></h2>
                        </div>

                        <div className="results-grid">
                            {results.length === 0 && (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>No properties found matching your criteria.</p>
                                    <Button variant="ghost" onClick={clearResults} style={{ marginTop: '1rem' }}>Reset Filters</Button>
                                </div>
                            )}

                            {results.map((property) => (
                                <div
                                    key={property.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, property)}
                                    style={{ height: '100%' }} // key for drag consistency
                                >
                                    <Card
                                        property={property}
                                        onFavourite={() => addToFavourites(property)}
                                        isFavourite={favourites.some(f => f.id === property.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAVOURITES SIDEBAR */}
                    <FavouritesPanel
                        favourites={favourites}
                        onRemove={removeFromFavourites}
                        onClear={clearFavourites}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    />

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

export default Search;
