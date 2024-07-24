#!/usr/bin/env python3
"""Module to create a caching system inheriting from basecaching"""

BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """Class to implement the First in First Out algorithm"""

    def __init__(self):
        """Instantiation"""

        super().__init__()

    def put(self, key, item):
        """Method to add a new key, value data to the inherited
        self.cache_data dict"""

        if key and item:
            if key in self.cache_data:
                del self.cache_data[key]
            else:
                if len(self.cache_data) == self.MAX_ITEMS:
                    for first_key in self.cache_data.keys():
                        del self.cache_data[first_key]
                        print(f"Discard: {first_key}")
                        break
            self.cache_data[key] = item

    def get(self, key):
        """Method to retrieve the value of the key linked to the dict
        if it doesn't exist, retuen none"""

        if key and key in self.cache_data:
            return self.cache_data[key]

        return None
