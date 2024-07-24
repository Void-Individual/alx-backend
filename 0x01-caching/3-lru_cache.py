#!/usr/bin/env python3
"""Modul to implement LRU caching"""

BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """Class to implement caching, inheriting from base"""

    def __init__(self):
        """Instantiation"""

        self.accessed_times = {}
        self.current_timer = 0
        super().__init__()

    def increment_timer(self):
        """Method to count the no of actions"""

        self.current_timer += 1

    def put(self, key, item):
        """Method to insert a new key in the dict"""
        if key and item:
            if key in self.cache_data:
                self.cache_data[key] = item
            else:
                if len(self.cache_data) == self.MAX_ITEMS:
                    lru_key = min(self.accessed_times,
                                  key=self.accessed_times.get)
                    print(f"Discard: {lru_key}")
                    del self.cache_data[lru_key]
                    del self.accessed_times[lru_key]
                self.cache_data[key] = item

            self.increment_timer()
            self.accessed_times[key] = self.current_timer

    def get(self, key):
        """Method to retrieve an item with a key"""

        if key and key in self.cache_data:
            # self.increment_timer()
            # self.accessed_times[key] += self.current_timer
            return self.cache_data[key]

        return None
