"""
Property API views.

This module contains the API endpoint for fetching property details
from multiple AVM providers.
"""

import os
from django.http import JsonResponse
from .providers import Provider1, Provider2
from .services import PropertyAggregator


def property_view(request):
    """
    API endpoint for fetching property details.

    Query Parameters:
        address (str): Full property address

    Returns:
        JSON response with property data from all providers

    Example:
        GET /properties?address=123 Main St, Boston, MA 02101

    Response:
        {
            "providers": {
                "Provider 1": { ... },
                "Provider 2": { ... }
            }
        }
    """
    address = request.GET.get('address')

    if not address:
        return JsonResponse({"error": "Address is required"}, status=400)

    # Get API configuration from environment variables
    provider1_url = os.getenv(
        'PROVIDER_1_BASE_URL',
        'https://property-detail-api.fly.dev/provider-1/property'
    )
    provider1_key = os.getenv(
        'PROVIDER_1_API_KEY',
        '3e1a9f18-86c7-4e11-babe-4fd2c7e5e12d'
    )

    provider2_url = os.getenv(
        'PROVIDER_2_BASE_URL',
        'https://property-detail-api.fly.dev/provider-2/property'
    )
    provider2_key = os.getenv(
        'PROVIDER_2_API_KEY',
        '9f3b5c32-77a4-423c-b63f-90c123e6c1a8'
    )

    # Initialize providers
    provider1 = Provider1(api_key=provider1_key, base_url=provider1_url)
    provider2 = Provider2(api_key=provider2_key, base_url=provider2_url)

    # Create aggregator with all providers
    aggregator = PropertyAggregator(providers=[provider1, provider2])

    # Fetch and aggregate data from all providers
    try:
        data = aggregator.fetch_all(address)
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse(
            {"error": f"Failed to fetch property details: {str(e)}"},
            status=500
        )
