// libs/shell/src/lib/components/crud-list/types.ts
import { ColumnType } from 'antd/lib/table';

// Pagination modes
export type PaginationMode = 'limit_offset' | 'page_per_page';

// Sort parameter configuration
export interface SortParamNames {
  field: string;
  direction: string;
}

// Entity service interface
export interface EntityService<T> {
  getEntries: (params: Partial<QueryParams>) => Promise<{ items: T[]; total: number }>;
  getDetailLink?: (record: T) => string;
  getCreateLink?: () => string;
  entityName?: string;
}

// Query parameters for fetching data
export interface QueryParams {
  // Limit/offset parameters
  limit?: number;
  offset?: number;
  
  // Page/per_page parameters
  page?: number;
  per_page?: number;
  
  // Sort parameters (configurable names)
  sortField?: string;
  sortDirection?: string;
  sort?: string;
  order?: string;
  
  // Filter parameters (configurable names)
  state?: string;
  filter?: string;
  
  // Search query
  query?: string;
  
  // Additional filters
  filters?: Record<string, any>;
  
  // Any other dynamic parameters
  [key: string]: any;
}

// Column configuration
export interface CrudColumn<T> extends ColumnType<T> {
  searchKey?: string;
  filterParameter?: string;
  sortParameter?: string;
}

// Custom filters props
export interface CustomFiltersProps {
  onFilter: (value: any) => void;
}

// Sort field configuration
export interface SortField {
  label: string;
  value: string;
}

export interface CrudListContainerProps<T extends object> {
  resource: {
    getEntries: (params?: any) => Promise<{ items: T[]; total: number }>;
    getDetailLink?: (record: T) => string | undefined;
    getCreateLink?: () => string | undefined;
    entityName?: string;
    config?: any;
  };
  entityName?: string;
  columns: any[];
  disableSearch?: boolean;
  statesForFiltering?: string[];
  defaultPayload?: Record<string, any>;
  additionalPayload?: Record<string, any>;
  withSorting?: boolean;
  sortFields?: Array<{ label: string; value: string }>;
  additionalPathname?: string;
  customFilters?: React.ComponentType<{ onFilter: (values: any) => void }>;
  rowKey?: string;
  
  // New props for configurability
  paginationMode?: PaginationMode;
  sortParamNames?: SortParamNames;
  filterParamName?: string;
}

// Default values for query parameters
export const DEFAULT_LIMIT = 20;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_PAGE = 1;
export const DEFAULT_SORT_FIELD = 'id';
export const DEFAULT_SORT_DIRECTION = 'desc';
export const DEFAULT_FILTERS = {};
export const DEFAULT_QUERY = '';

// Default parameter names
export const DEFAULT_SORT_PARAM_NAMES: SortParamNames = {
  field: 'sortField',
  direction: 'sortDirection'
};
export const DEFAULT_FILTER_PARAM_NAME = 'state';