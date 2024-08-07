#!/usr/bin/env python3
"""Module to contain a pagination function"""

import csv
import math
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int]:
    """Function to return a tuple of 2 containing a start index
    and an end index corresponding to the range of indexes to return
    a list for pagination parameters"""

    start_index = (page - 1) * page_size
    end_index = start_index + page_size

    return (start_index, end_index)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """A Method to retrieve the pages request for"""

        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0

        files = []
        start, end = index_range(page, page_size)
        data = self.dataset()

        for pg in range(start, end):
            try:
                files.append(data[pg])
            except IndexError:
                return files

        return files

    def get_hyper(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Method to implement and return a dict of important data"""

        page_data = self.get_page(page, page_size)

        try:
            assert len(self.get_page(page + 1, page_size))
            next_page = page + 1
        except AssertionError:
            next_page = None

        prev_page = page - 1
        if not prev_page:
            prev_page = None

        data = self.__dataset
        total_pages = len(data) / page_size

        return {
            "page_size": len(page_data),
            "page": page,
            "data": page_data,
            "next_page": next_page,
            "prev_page": prev_page,
            "total_pages": math.ceil(total_pages),
        }
