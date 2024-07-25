#!/usr/bin/env python3
"""Module to create a caching system inheriting from basecaching"""

from collections import OrderedDict
BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """Class to implement the First in First Out algorithm"""

    def __init__(self):
        """Instantiation"""

        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Method to add a new key, value data to the inherited
        self.cache_data dict"""

        if key is None or item is None:
            return

        self.cache_data[key] = item
        if len(self.cache_data) > self.MAX_ITEMS:
            first_key, _ = self.cache_data.popitem(False)
            print(f"Discard: {first_key}")

    def get(self, key):
        """Method to retrieve the value of the key linked to the dict
        if it doesn't exist, retuen none"""

        return self.cache_data.get(key, None)
