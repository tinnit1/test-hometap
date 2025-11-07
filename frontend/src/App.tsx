import React, { useState } from 'react';
import { fetchPropertyDetails } from './services/property';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const handleSearch = async () => {
    try {
      const data = await fetchPropertyDetails(backendApiUrl, searchTerm);
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: 'Failed to fetch data' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Hometap Property Detail Search</h1>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter full address, including street, city, state, and zip"
          className="p-3 border border-gray-300 rounded-md w-[600px]"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      {apiResponse && (
        <div className="mt-6 bg-gray-200 p-4 rounded-md w-full max-w-xl text-left">
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
