#!/usr/bin/env python3
"""Modul to implement MRU caching"""

BaseCaching = __import__('base_caching').BaseCaching


class LFUCache(BaseCaching):
    """Class to implement caching, inheriting from base,
    implementing the least frequetly used algorithm"""

    def __init__(self):
        """Instantiation"""

        self.access_times = {}
        self.access_freq = {}
        self.current_timer = 0
        super().__init__()

    def increment_timer(self):
        """Method to count the no of actions"""

        self.current_timer += 1

    def lfu(self):
        """Method to implement lfu deletion"""

        if len(self.cache_data) == BaseCaching.MAX_ITEMS:
            lowest = min(self.access_freq.values())
            low_keys = [key for key, value in self.access_freq.items()
                        if value == lowest]
            self.lru(low_keys)

    def lru(self, keys):
        """Method to enable the lru deletion"""

        lru_key = min(keys, key=self.access_times.get)
        print(f"DISCARD: {lru_key}")
        del self.cache_data[lru_key]
        del self.access_times[lru_key]
        del self.access_freq[lru_key]

    def put(self, key, item):
        """Method to insert a new key in the dict"""

        if key and item:

            if key in self.cache_data:
                self.cache_data[key] = item
            else:
                self.lfu()
                self.cache_data[key] = item

            if key not in self.access_freq:
                self.access_freq[key] = 0
            self.access_freq[key] += 1
            self.increment_timer()
            self.access_times[key] = self.current_timer

    def get(self, key):
        """Method to retrieve an item with a key"""

        if key and key in self.cache_data:
            self.access_freq[key] += 1
            # self.increment_timer()
            # self.access_times[key] += self.current_timer
            return self.cache_data[key]

        return None
