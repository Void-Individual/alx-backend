#!/usr/bin/env python3
"""Module to create a caching system inheriting from basecaching"""

BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """Class to implement the fifo system"""

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
                    for x, last_key in enumerate(self.cache_data.keys()):
                        if x == 3:
                            del self.cache_data[last_key]
                            print(f"Discard: {last_key}")
                            break
            self.cache_data[key] = item

    def get(self, key):
        """Method to retrieve the value of the key linked to the dict
        if it doesn't exist, retuen none"""

        if key and key in self.cache_data:
            return self.cache_data[key]

        return None
