from django.test import TestCase
from django.urls import reverse

class PropertyViewTests(TestCase):
    def test_properties_endpoint_with_address(self):
        # Specify the query parameter
        response = self.client.get(reverse('property_view'), data={'address': '123 Main St'})
        
        # Check the response status
        self.assertEqual(response.status_code, 200)
        
        # Parse the JSON response
        data = response.json()
        
        # Verify the response structure
        self.assertIn('providers', data)
        self.assertIn('Provider 1', data['providers'])
        self.assertIn('Normalized Address', data['providers']['Provider 1'])

    def test_properties_endpoint_without_address(self):
        # Call the endpoint without query parameters
        response = self.client.get(reverse('property_view'))
        
        # Assert 400 response
        self.assertEqual(response.status_code, 400)
        
        # Verify error message
        data = response.json()
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'Address is required')
