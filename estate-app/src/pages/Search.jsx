import { useEffect } from "react";

const Search = () => {
  useEffect(() => {
    console.log("Search component mounted (minimal test)");
  }, []);

  return (
    <div>
      <h1>Property Search (minimal)</h1>
      <p>This is a minimal version of the Search page for testing.</p>
    </div>
  );
};

export default Search;
