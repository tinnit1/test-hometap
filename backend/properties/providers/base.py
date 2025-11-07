"""
Base provider abstract class for AVM (Automated Valuation Model) providers.
This abstraction makes it easy to swap out third-party APIs in the future.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class BaseProvider(ABC):
    """
    Abstract base class for property data providers.

    All provider implementations must inherit from this class and implement
    the required methods. This design pattern allows easy addition of new
    providers and swapping of existing ones.
    """

    def __init__(self, api_key: str, base_url: str):
        """
        Initialize the provider with authentication credentials.

        Args:
            api_key: API key for authentication
            base_url: Base URL for the provider's API
        """
        self.api_key = api_key
        self.base_url = base_url

    @abstractmethod
    def get_property_details(self, address: str) -> Dict[str, Any]:
        """
        Fetch property details from the provider's API.

        Args:
            address: Full address string (e.g., "123 Main St, Boston, MA 02101")

        Returns:
            Dictionary containing raw property data from the provider

        Raises:
            Exception: If the API request fails
        """
        pass

    @abstractmethod
    def get_provider_name(self) -> str:
        """
        Get the display name of this provider.

        Returns:
            Provider name string (e.g., "Provider 1")
        """
        pass

    def _get_headers(self) -> Dict[str, str]:
        """
        Build HTTP headers for API requests.

        Returns:
            Dictionary of HTTP headers including authentication
        """
        return {
            'X-API-KEY': self.api_key,
            'Accept': 'application/json'
        }
