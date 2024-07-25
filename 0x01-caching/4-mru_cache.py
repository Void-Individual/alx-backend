#!/usr/bin/env python3
"""Modul to implement MRU caching"""

BaseCaching = __import__('base_caching').BaseCaching


class MRUCache(BaseCaching):
    """Class to implement caching, inheriting from base,
    implementing the most recently used algorithm"""

    def __init__(self):
        """Instantiation"""

        self.access_times = {}
        self.current_timer = 0
        super().__init__()

    def increment_timer(self):
        """Method to count the no of actions"""

        self.current_timer += 1

    def mru(self):
        """Method implementing the mru algorithm"""

        if len(self.cache_data) == self.MAX_ITEMS:
            mru_key = max(self.access_times, key=self.access_times.get)
            print(f"DISCARD: {mru_key}")
            del self.cache_data[mru_key]
            del self.access_times[mru_key]

    def put(self, key, item):
        """Method to insert a new key in the dict"""

        if key is None and item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
        else:
            self.mru()
            self.cache_data[key] = item

        self.increment_timer()
        self.access_times[key] = self.current_timer

    def get(self, key):
        """Method to retrieve an item with a key"""

        if key and key in self.cache_data:
            self.increment_timer()
            self.access_times[key] += self.current_timer
            return self.cache_data[key]

        return None
