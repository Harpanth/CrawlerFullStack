import React, { useState } from 'react';

const Input = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState("");

  const onChange = (e) => {
    setProduct(e.target.value);
  };

  const handleScrape = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen" >
      <div className = "max-w-lg ">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Product Search</h2>
      <input
        onChange={onChange}
        value={product}
        type="text"
        placeholder="Enter the product"
        className="w-full p-4 mb-6 border-2 border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-400"
      />
      <button
        onClick={handleScrape}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow-md hover:shadow-xl hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 transition-all duration-300"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      
      {error && (
        <div className="mt-6 text-red-500 text-lg font-medium">
          <p>Error: {error}</p>
        </div>
      )}
      </div>
      {results && (
        <div className="mt-6 text-left">
          <ul className="space-y-6">
            {Object.entries(results).map(([site, urls]) => (
              <li key={site}>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{site}</h3>
                <ul className="space-y-2">
                  {urls.map((url, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition duration-300"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Input;
