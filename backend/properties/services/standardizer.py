"""
Data standardization service for normalizing property data from different providers.

This service transforms provider-specific response formats into a consistent,
standardized structure that the frontend can easily consume.
"""

from typing import Dict, Any, Optional


class PropertyStandardizer:
    """
    Standardizes property data from different AVM providers into a unified format.

    This class handles the differences between providers:
    - Provider 1 uses camelCase
    - Provider 2 uses PascalCase
    - Different field names and nested structures
    - Different units (sqft vs acres for lot size)
    """

    @staticmethod
    def standardize_provider1(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Standardize Provider 1 response into common format.

        Provider 1 returns data in camelCase with nested 'features' object.

        Args:
            raw_data: Raw response from Provider 1 API

        Returns:
            Standardized property data dictionary
        """
        data = raw_data.get('data', {})
        features = data.get('features', {})

        return {
            'address': data.get('formattedAddress'),
            'squareFootage': data.get('squareFootage'),
            'lotSize': PropertyStandardizer._convert_sqft_to_acres(
                data.get('lotSizeSqFt')
            ),
            'yearBuilt': data.get('yearBuilt'),
            'propertyType': data.get('propertyType'),
            'bedrooms': data.get('bedrooms'),
            'bathrooms': data.get('bathrooms'),
            'roomCount': features.get('roomCount'),
            'septicSystem': features.get('septicSystem'),
            'salePrice': data.get('lastSalePrice'),
            'cached': raw_data.get('cached', False)
        }

    @staticmethod
    def standardize_provider2(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Standardize Provider 2 response into common format.

        Provider 2 returns data in PascalCase with flat structure.

        Args:
            raw_data: Raw response from Provider 2 API

        Returns:
            Standardized property data dictionary
        """
        data = raw_data.get('data', {})

        return {
            'address': data.get('NormalizedAddress'),
            'squareFootage': data.get('SquareFootage'),
            'lotSize': data.get('LotSizeAcres'),  # Already in acres
            'yearBuilt': data.get('YearConstructed'),
            'propertyType': data.get('PropertyType'),
            'bedrooms': data.get('Bedrooms'),
            'bathrooms': data.get('Bathrooms'),
            'roomCount': data.get('RoomCount'),
            'septicSystem': data.get('SepticSystem'),
            'salePrice': data.get('SalePrice'),
            'cached': raw_data.get('cached', False)
        }

    @staticmethod
    def _convert_sqft_to_acres(sqft: Optional[float]) -> Optional[float]:
        """
        Convert square feet to acres.

        Args:
            sqft: Area in square feet

        Returns:
            Area in acres, rounded to 2 decimal places, or None if input is None
        """
        if sqft is None:
            return None
        # 1 acre = 43,560 square feet
        acres = sqft / 43560
        return round(acres, 2)

    @staticmethod
    def format_lot_size(acres: Optional[float]) -> str:
        """
        Format lot size for display.

        Args:
            acres: Lot size in acres

        Returns:
            Formatted string (e.g., "0.18 Acres") or "N/A"
        """
        if acres is None:
            return "N/A"
        return f"{acres:.2f} Acres"

    @staticmethod
    def format_boolean(value: Optional[bool]) -> str:
        """
        Format boolean values for display.

        Args:
            value: Boolean value

        Returns:
            "Yes", "No", or "N/A"
        """
        if value is None:
            return "N/A"
        return "Yes" if value else "No"
