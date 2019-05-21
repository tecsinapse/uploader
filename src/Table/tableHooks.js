import { useEffect } from 'react';
import { resolveObj } from '@tecsinapse/es-utils/core/object';
import { isRemoteData } from './tableFunctions';

export const useInitialData = (originalData, setData) => {
  useEffect(() => {
    if (!isRemoteData(originalData)) {
      setData([...originalData]);
    }
  }, [originalData]);
};
export const useInitialCheckboxData = (selectedData, setSelectedRows) => {
  useEffect(() => {
    if (selectedData) {
      setSelectedRows(selectedData);
    }
  }, [selectedData]);
};

export const useUpdateData = (
  data,
  setLoading,
  setData,
  filters,
  setTotalCount
) => {
  useEffect(() => {
    setLoading(true);

    if (isRemoteData(data)) {
      data(filters).then(({ data: resultData, totalCount }) => {
        setTotalCount(totalCount);
        setData([...resultData]);
        setLoading(false);
      });
    } else {
      let filteredData = [...data];
      const { headerFilters } = filters;

      Object.keys(headerFilters).forEach(field => {
        const filterValue = headerFilters[field];

        filteredData = filteredData.filter(row => {
          const valueField = resolveObj(field, row);

          if (!filterValue) {
            return true;
          }

          if (typeof valueField === 'object') {
            return true;
          }
          if (typeof valueField === 'string') {
            return valueField.toLowerCase().includes(filterValue.toLowerCase());
          }
          return false;
        });
      });
      setTotalCount(filteredData.length);
      setData(filteredData);
      setLoading(false);
    }
  }, [filters, data]);
};

export const useUpdatePageData = (
  isRemote,
  data,
  setPageData,
  { page, rowsPerPage }
) => {
  useEffect(() => {
    if (isRemote || !rowsPerPage || rowsPerPage === 0) {
      setPageData(data);
    } else {
      setPageData(
        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      );
    }
  }, [data]);
};
