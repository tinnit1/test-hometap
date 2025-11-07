"""
Provider 2 implementation for property data aggregation.
API Documentation: https://property-detail-api.fly.dev/provider-2/property
"""

import urllib.parse
import urllib.request
import json
from typing import Dict, Any
from .base import BaseProvider


class Provider2(BaseProvider):
    """
    Implementation for Provider 2 AVM API.

    This provider returns property data in PascalCase format.
    Response is cached for up to 24 hours by the provider.
    """

    def get_provider_name(self) -> str:
        """Get the display name of this provider."""
        return "Provider 2"

    def get_property_details(self, address: str) -> Dict[str, Any]:
        """
        Fetch property details from Provider 2 API.

        Args:
            address: Full address string

        Returns:
            Dictionary containing property data from Provider 2

        Raises:
            Exception: If the API request fails or returns an error
        """
        # Encode the address for URL query parameter
        encoded_address = urllib.parse.quote(address)
        url = f"{self.base_url}?address={encoded_address}"

        # Create request with headers
        request = urllib.request.Request(url, headers=self._get_headers())

        try:
            # Make the API request
            with urllib.request.urlopen(request, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
                return data

        except urllib.error.HTTPError as e:
            error_message = e.read().decode('utf-8') if e.fp else str(e)
            raise Exception(
                f"Provider 2 API error (HTTP {e.code}): {error_message}"
            )
        except urllib.error.URLError as e:
            raise Exception(f"Provider 2 network error: {str(e.reason)}")
        except json.JSONDecodeError as e:
            raise Exception(f"Provider 2 invalid JSON response: {str(e)}")
        except Exception as e:
            raise Exception(f"Provider 2 unexpected error: {str(e)}")
