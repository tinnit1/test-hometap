import React, { useState } from 'react';
import { fetchPropertyDetails } from './services/property';

interface PropertyData {
  address: string | null;
  squareFootage: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  propertyType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  roomCount: number | null;
  septicSystem: boolean | null;
  salePrice: number | null;
  cached: boolean;
  error?: string;
}

interface ApiResponse {
  providers: {
    [key: string]: PropertyData;
  };
  error?: string;
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a valid address');
      return;
    }

    setLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const data = await fetchPropertyDetails(backendApiUrl, searchTerm);
      setApiResponse(data);
    } catch (err) {
      setError('Failed to fetch property details. Please try again.');
      console.error('Error fetching property details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatCurrency = (value: number | null): string => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number | null): string => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatLotSize = (value: number | null): string => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}`;
  };

  const formatBoolean = (value: boolean | null): string => {
    if (value === null || value === undefined) return 'N/A';
    return value ? 'Yes' : 'No';
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Hometap Property Detail Search
        </h1>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter full address (e.g., 123 Main St, Boston, MA 02101)"
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {apiResponse && apiResponse.providers && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Normalized Address Header */}
            {(() => {
              const providers = Object.values(apiResponse.providers);
              const address = providers.find(p => p.address)?.address;
              return address ? (
                <div className="bg-gray-100 px-8 py-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">
                    <span className="text-gray-600">Normalized Address:</span> {address}
                  </h2>
                </div>
              ) : null;
            })()}

            {/* Provider Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-8 py-4 text-left text-gray-600 font-semibold">Property Details</th>
                    {Object.keys(apiResponse.providers).map((providerName) => (
                      <th key={providerName} className="px-8 py-4 text-center text-gray-800 font-bold text-xl">
                        {providerName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Square Footage */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-8 py-4 font-semibold text-gray-800">Square Footage</td>
                    {Object.values(apiResponse.providers).map((provider, idx) => (
                      <td key={idx} className="px-8 py-4 text-center text-gray-700">
                        {provider.error ? (
                          <span className="text-red-600 text-sm">Error: {provider.error}</span>
                        ) : (
                          formatNumber(provider.squareFootage)
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Lot Size */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-8 py-4 font-semibold text-gray-800">Lot Size (Acres)</td>
                    {Object.values(apiResponse.providers).map((provider, idx) => (
                      <td key={idx} className="px-8 py-4 text-center text-gray-700">
                        {provider.error ? '-' : formatLotSize(provider.lotSize)}
                      </td>
                    ))}
                  </tr>

                  {/* Year Built */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-8 py-4 font-semibold text-gray-800">Year Built</td>
                    {Object.values(apiResponse.providers).map((provider, idx) => (
                      <td key={idx} className="px-8 py-4 text-center text-gray-700">
                        {provider.error ? '-' : formatValue(provider.yearBuilt)}
                      </td>
                    ))}
                  </tr>

                  {/* Property Type */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-8 py-4 font-semibold text-gray-800">Property Type</td>
                    {Object.values(apiResponse.providers).map((provider, idx) => (
                      <td key={idx} className="px-8 py-4 text-center text-gray-700">
                        {provider.error ? '-' : formatValue(provider.propertyType)}
                      </td>
                    ))}
                  </tr>

                  {/* Bedrooms */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-8 py-4 font-semibold text-gray-800">Bedrooms</td>
                    {Object.values(apiResponse.providers).map((provider, idx) => (
                      <td key={idx} className="px-8 py-4 text-center text-gray-700">
                        {provider.error ? '-' : formatValue(provider.bedrooms)}
                      </td>
                    ))}
                  </tr>

                  {/* Bathrooms */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-8 py-4 font-semibold text-gray-800">Bathrooms</td>
                    {Object.values(apiResponse.providers).map((provider, idx) => (
                      <td key={idx} className="px-8 py-4 text-center text-gray-700">
                        {provider.error ? '-' : formatValue(provider.bathrooms)}
                      </td>
                    ))}
                  </tr>

                  {/* Room Count */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-8 py-4 font-semibold text-gray-800">Room Count</td>
                    {Object.values(apiResponse.providers).map((provider, idx) => (
                      <td key={idx} className="px-8 py-4 text-center text-gray-700">
                        {provider.error ? '-' : formatValue(provider.roomCount)}
                      </td>
                    ))}
                  </tr>

                  {/* Septic System */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-8 py-4 font-semibold text-gray-800">Septic System</td>
                    {Object.values(apiResponse.providers).map((provider, idx) => (
                      <td key={idx} className="px-8 py-4 text-center text-gray-700">
                        {provider.error ? '-' : formatBoolean(provider.septicSystem)}
                      </td>
                    ))}
                  </tr>

                  {/* Sale Price */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-4 font-semibold text-gray-800">Sale Price</td>
                    {Object.values(apiResponse.providers).map((provider, idx) => (
                      <td key={idx} className="px-8 py-4 text-center text-gray-700 font-semibold">
                        {provider.error ? '-' : formatCurrency(provider.salePrice)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cache Status */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex gap-8 text-sm text-gray-600">
                {Object.entries(apiResponse.providers).map(([name, provider]) => (
                  <div key={name}>
                    <span className="font-semibold">{name}:</span>{' '}
                    {provider.cached ? (
                      <span className="text-blue-600">Cached data (up to 24hrs old)</span>
                    ) : (
                      <span className="text-green-600">Fresh data</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
