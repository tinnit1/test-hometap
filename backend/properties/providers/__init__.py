"""
Provider package for property data aggregation.
This module contains the abstraction layer for third-party AVM providers.
"""

from .base import BaseProvider
from .provider1 import Provider1
from .provider2 import Provider2

__all__ = ['BaseProvider', 'Provider1', 'Provider2']
