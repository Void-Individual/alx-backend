#!/usr/bin/env python3
"""Module to create a caching system inheriting from basecaching"""

from collections import OrderedDict
BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """Class to implement the Last in First Out algorithm"""

    def __init__(self):
        """Instantiation"""

        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Method to add a new key, value data to the inherited
        self.cache_data dict"""

        if key is None or item is None:
            return

        if key not in self.cache_data:
            if len(self.cache_data) + 1 == self.MAX_ITEMS:
                last_key, _ = self.cache_data.popitem(last=True)
                print(f"DISCARD: {last_key}")
            self.cache_data[key] = item
            self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """Method to retrieve the value of the key linked to the dict
        if it doesn't exist, retuen none"""

        if key and key in self.cache_data:
            return self.cache_data[key]

        return None
