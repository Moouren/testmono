import { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Input, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Pagination, 
  Space,
  Select,
  Radio,
  Card,
  RadioChangeEvent,
  Spin
} from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'react-use';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  CrudListContainerProps, 
  QueryParams,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SORT_FIELD,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_PARAM_NAMES,
  DEFAULT_FILTER_PARAM_NAME
} from './types';

const { Title } = Typography;
const { Option } = Select;

/**
 * CrudListContainer - A reusable component for displaying and managing list views of entities
 * 
 * This component handles:
 * - Fetching and displaying data in a table with React Query
 * - Pagination (configurable between limit/offset and page/per_page)
 * - Sorting (configurable parameter names)
 * - Searching (with debounce)
 * - Filtering (configurable parameter name)
 * - Navigation to detail and create views
 */
export function CrudListContainer<T extends object>({
  resource,
  entityName,
  columns,
  disableSearch = false,
  statesForFiltering,
  defaultPayload = {},
  additionalPayload = {},
  withSorting = false,
  sortFields = [],
  additionalPathname,
  customFilters: CustomFilters,
  rowKey = 'id',
  paginationMode = 'limit_offset', // New prop to configure pagination mode
  sortParamNames = DEFAULT_SORT_PARAM_NAMES, // New prop to configure sort parameter names
  filterParamName = DEFAULT_FILTER_PARAM_NAME // New prop to configure filter parameter name
}: CrudListContainerProps<T>) {
  // Next.js router and URL handling
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Determine URL parameter names based on pagination mode
  const pageParamName = paginationMode === 'page_per_page' ? 'page' : 'page';
  const sortFieldParamName = sortParamNames.field;
  const sortDirectionParamName = sortParamNames.direction;
  
  // Get query params from URL
  const urlPage = searchParams.get(pageParamName);
  const urlSearch = searchParams.get('search');
  const urlFilter = searchParams.get(filterParamName);
  const urlSort = searchParams.get(sortFieldParamName);
  const urlSortDir = searchParams.get(sortDirectionParamName);
  
  // Component state with URL values as defaults
  const [currentPage, setCurrentPage] = useState<number>(urlPage ? +urlPage : DEFAULT_PAGE);
  const [searchValue, setSearchValue] = useState<string>(urlSearch || '');
  const [debouncedSearch, setDebouncedSearch] = useState<string>(urlSearch || '');
  const [filterValue, setFilterValue] = useState<string>(urlFilter || '');
  const [customFilterValue, setCustomFilterValue] = useState<any>({});
  const [sortField, setSortField] = useState<string | undefined>(
    urlSort || defaultPayload[sortFieldParamName] || DEFAULT_SORT_FIELD
  );
  const [sortDirection, setSortDirection] = useState<string | undefined>(
    urlSortDir || defaultPayload[sortDirectionParamName] || DEFAULT_SORT_DIRECTION
  );
  
  // Debounce search input to prevent excessive API calls
  useDebounce(
    () => {
      setDebouncedSearch(searchValue);
    },
    300,
    [searchValue]
  );
  
  // Update URL parameters
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update params
    params.set(pageParamName, currentPage.toString());
    if (debouncedSearch) params.set('search', debouncedSearch);
    else params.delete('search');
    
    if (filterValue) params.set(filterParamName, filterValue);
    else params.delete(filterParamName);
    
    if (sortField && sortField !== DEFAULT_SORT_FIELD) params.set(sortFieldParamName, sortField);
    else params.delete(sortFieldParamName);
    
    if (sortDirection && sortDirection !== DEFAULT_SORT_DIRECTION) params.set(sortDirectionParamName, sortDirection);
    else params.delete(sortDirectionParamName);
    
    // Update URL without triggering navigation
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    pathname, 
    router, 
    searchParams, 
    pageParamName,
    sortFieldParamName,
    sortDirectionParamName,
    filterParamName,
    currentPage, 
    debouncedSearch, 
    filterValue, 
    sortField, 
    sortDirection
  ]);
  
  // Update URL when query parameters change
  useEffect(() => {
    updateUrlParams();
  }, [updateUrlParams]);
  
  // Reset to page 1 when search, filter, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterValue, sortField, sortDirection, customFilterValue]);
  
  // Create query key array for React Query caching
  const queryKey = [
    resource.entityName || entityName,
    currentPage,
    debouncedSearch,
    filterValue,
    sortField,
    sortDirection,
    additionalPathname,
    JSON.stringify(additionalPayload),
    JSON.stringify(customFilterValue),
    paginationMode, // Add pagination mode to cache key
    sortParamNames, // Add sort parameter names to cache key
    filterParamName // Add filter parameter name to cache key
  ];
  
  // QueryClient for manual cache invalidation
  const queryClient = useQueryClient();
  
  // Fetch data using React Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      // Configure pathname if provided
      if (additionalPathname && resource.config) {
        resource.config.additionalPathname = additionalPathname;
      }
      
      // Prepare payload based on pagination mode
      let payload: Partial<QueryParams> = {
        ...additionalPayload,
        ...customFilterValue
      };
      
      if (paginationMode === 'limit_offset') {
        // Offset-based pagination
        const offset = (currentPage - 1) * DEFAULT_LIMIT;
        payload = {
          ...payload,
          limit: DEFAULT_LIMIT,
          offset
        };
      } else {
        // Page-based pagination
        payload = {
          ...payload,
          page: currentPage,
          per_page: DEFAULT_LIMIT
        };
      }
      
      // Add sorting parameters based on configuration
      payload[sortFieldParamName] = sortField;
      payload[sortDirectionParamName] = sortDirection;
      
      // Add search query
      if (debouncedSearch) {
        payload.query = debouncedSearch;
      }
      
      // Add filter state with the configured parameter name
      if (filterValue) {
        payload[filterParamName] = filterValue;
      }
      
      // Return the API response
      return await resource.getEntries(payload);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Extract data for rendering
  const entries = data?.items || [];
  const totalItems = data?.total || 0;
  
  // Navigate to detail view
  const handleRowClick = useCallback((record: T) => {
    if (!resource.getDetailLink) return;
    
    const link = resource.getDetailLink(record);
    if (link) {
      router.push(link);
    }
  }, [resource, router]);
  
  // Navigate to create view
  const handleCreateClick = useCallback(() => {
    if (!resource.getCreateLink) return;
    
    const link = resource.getCreateLink();
    if (link) {
      router.push(link);
    }
  }, [resource, router]);
  
  // Handle search input change
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value.trim());
  }, []);
  
  // Handle filter selection
  const handleFilter = useCallback((value: string) => {
    setFilterValue(value);
  }, []);
  
  // Handle custom filter
  const handleCustomFilter = useCallback((value: any) => {
    setCustomFilterValue(value);
  }, []);
  
  // Handle sort field change
  const handleSortChange = useCallback((value: string) => {
    setSortField(value);
  }, []);
  
  // Handle sort direction change
  const handleSortDirectionChange = useCallback((e: RadioChangeEvent) => {
    setSortDirection(e.target.value);
  }, []);
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKey.slice(0, 1) });
    refetch();
  }, [queryClient, refetch, queryKey]);
  
  // Handle pagination change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Force a data refetch when page changes
    setTimeout(() => refetch(), 0);
  }, [refetch]);

  const tableProps = {
    rowKey,
    loading: isLoading,
    dataSource: entries,
    columns,
    pagination: false as const, // Use 'as const' to make TypeScript treat this as literal false
    onRow: (record: T) => ({
      onClick: () => handleRowClick(record),
      style: { cursor: resource.getDetailLink ? 'pointer' : 'default' }
    })
  };
  
  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Title level={4}>
                {resource.entityName || entityName}
              </Title>
              {isLoading && <Spin size="small" />}
            </Space>
          </Col>
          <Col>
            <Space size="small" wrap>
              {!disableSearch && (
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => handleSearch(e.target.value)}
                  value={searchValue}
                  style={{ width: 200 }}
                  allowClear
                />
              )}
              
              {statesForFiltering && statesForFiltering.length > 0 && (
                <Select
                  placeholder="Filter by state"
                  style={{ width: 150 }}
                  onChange={handleFilter}
                  value={filterValue}
                  allowClear
                >
                  {statesForFiltering.map((state) => (
                    <Option key={state} value={state}>
                      {state}
                    </Option>
                  ))}
                </Select>
              )}
              
              {withSorting && sortFields.length > 0 && (
                <>
                  <Select
                    placeholder="Sort by"
                    style={{ width: 150 }}
                    onChange={handleSortChange}
                    value={sortField}
                  >
                    {sortFields.map((field) => (
                      <Option key={field.value} value={field.value}>
                        {field.label}
                      </Option>
                    ))}
                  </Select>
                  
                  <Radio.Group
                    onChange={handleSortDirectionChange}
                    value={sortDirection}
                  >
                    <Radio.Button value="asc">Asc</Radio.Button>
                    <Radio.Button value="desc">Desc</Radio.Button>
                  </Radio.Group>
                </>
              )}
              
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={isLoading}
              >
                Refresh
              </Button>
              
              {resource.getCreateLink && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateClick}
                >
                  Create
                </Button>
              )}
            </Space>
          </Col>
        </Row>
        
        {CustomFilters && (
          <CustomFilters onFilter={handleCustomFilter} />
        )}
        
        {isError && (
          <Card type="inner" style={{ backgroundColor: '#fff2f0', borderColor: '#ffccc7' }}>
            <Typography.Text type="danger">
              Error loading data. Please try refreshing or contact support.
            </Typography.Text>
          </Card>
        )}
        
        <Table {...tableProps} />
        
        <Row justify="end">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={DEFAULT_LIMIT}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={(total) => `Total ${total} items`}
            disabled={isLoading}
          />
        </Row>
      </Space>
    </Card>
  );
}