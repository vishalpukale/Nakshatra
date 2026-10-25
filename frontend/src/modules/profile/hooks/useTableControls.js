import { useState } from 'react';

const useTableControls = (initialPageSize = 10) => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [pageNumber, setPageNumber] = useState(1);
    const [remoteSort, setRemoteSort] = useState({
        field: null,
        direction: "asc",
    });

    const handleSortChange = (field, direction) => {
        setRemoteSort({ field, direction });
    };

    return {
        totalRecords,
        setTotalRecords,
        pageSize,
        setPageSize,
        pageNumber,
        setPageNumber,
        remoteSort,
        setRemoteSort,
        handleSortChange,
    };
};

export default useTableControls; 