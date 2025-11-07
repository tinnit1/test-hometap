export const fetchPropertyDetails = async (backendApiUrl: string, address: string) => {
    const url = `${backendApiUrl}/properties?address=${encodeURIComponent(address)}`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching property details:', error);
      throw error;
    }
  };
  