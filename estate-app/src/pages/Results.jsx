import { useLocation, Link } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const results = location.state?.results || [];

  return (
    <div>
      <h1>Search Results</h1>

      {results.length === 0 && <p>No properties found.</p>}

      {results.map((property) => {
        const imgSrc = property.pictures?.[0] ?? property.picture ?? "";

        return (
          <div key={property.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            {imgSrc && (
              <img
                src={imgSrc}
                alt="property"
                width="200"
              />
            )}
          <h3>£{property.price}</h3>
          <p>{property.location}</p>
          <p>{property.bedrooms} bedrooms</p>

          <Link to={`/property/${property.id}`}>View Property</Link>
        </div>
      ))}
    </div>
  );
};

export default Results;
