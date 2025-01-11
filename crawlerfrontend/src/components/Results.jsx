import React from "react";

const Results = ({ results, error }) => {
  if (error) {
    return (
      <div className="text-red-500 mt-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!results) {
    return null; // Do not render anything if there are no results yet
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold">Results:</h2>
      <ul className="list-disc pl-4">
        {Object.entries(results).map(([site, urls]) => (
          <li key={site} className="mb-2">
            <h3 className="font-semibold">{site.toUpperCase()}</h3>
            {urls.length > 0 ? (
              <ul className="list-inside list-none">
                {urls.map((url, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No results found for this site.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
