#!/usr/bin/env python3
"""Module containging subclass of basecaching"""

BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """Class inheriting from Basecaching"""

    def __init__(self):
        """Instantiation"""
        super().__init__()

    def put(self, key, item):
        """Must assign the item to the key to the
        dict self.cache_data"""

        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """Must return the value in cache_data linked to
        the passed key"""

        if key and key in self.cache_data:
            return self.cache_data[key]

        return None
