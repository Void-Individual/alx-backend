#!/usr/bin/env python3
"""Module to contain a pagination function"""

from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int]:
    """Function to return a tuple of 2 containing a start index
    and an end index corresponding to the range of indexes to return
    a list for pagination parameters"""

    start_index = (page - 1) * page_size
    end_index = start_index + page_size

    return (start_index, end_index)
