"""
Property data aggregator service.

This service coordinates fetching property data from multiple providers
and aggregating the results into a single response.
"""

from typing import Dict, Any, List
from ..providers import BaseProvider
from .standardizer import PropertyStandardizer


class PropertyAggregator:
    """
    Aggregates property data from multiple AVM providers.

    This class handles:
    - Parallel or sequential fetching from providers
    - Error handling for individual provider failures
    - Data standardization
    - Response aggregation
    """

    def __init__(self, providers: List[BaseProvider]):
        """
        Initialize the aggregator with a list of providers.

        Args:
            providers: List of BaseProvider instances to fetch data from
        """
        self.providers = providers
        self.standardizer = PropertyStandardizer()

    def fetch_all(self, address: str) -> Dict[str, Any]:
        """
        Fetch property details from all configured providers.

        Args:
            address: Full address string to look up

        Returns:
            Dictionary with 'providers' key containing data from each provider:
            {
                "providers": {
                    "Provider 1": { standardized data },
                    "Provider 2": { standardized data }
                }
            }

        Note:
            If a provider fails, it will be included in the response with
            an 'error' key instead of property data.
        """
        results = {}

        for provider in self.providers:
            provider_name = provider.get_provider_name()

            try:
                # Fetch raw data from provider
                raw_data = provider.get_property_details(address)

                # Standardize the data based on provider type
                if provider_name == "Provider 1":
                    standardized = self.standardizer.standardize_provider1(raw_data)
                elif provider_name == "Provider 2":
                    standardized = self.standardizer.standardize_provider2(raw_data)
                else:
                    # Fallback for unknown providers
                    standardized = raw_data

                results[provider_name] = standardized

            except Exception as e:
                # Include error information for this provider
                results[provider_name] = {
                    'error': str(e),
                    'address': None,
                    'squareFootage': None,
                    'lotSize': None,
                    'yearBuilt': None,
                    'propertyType': None,
                    'bedrooms': None,
                    'bathrooms': None,
                    'roomCount': None,
                    'septicSystem': None,
                    'salePrice': None,
                    'cached': False
                }

        return {
            'providers': results
        }
