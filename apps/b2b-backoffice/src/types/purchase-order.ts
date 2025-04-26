// types/purchase-order.ts

// API Response Interfaces
export interface Channel {
    id: number;
    name: string;
  }
  
  export interface Rule {
    percent: number;
  }
  
  export interface InventorySource {
    id: number;
    name: string;
    channels: Channel[];
    rule: Rule;
  }
  
  export interface ProductInventorySource {
    id: number;
    physical_qty: number;
    qty: number;
  }
  
  export interface Product {
    id: number;
    sku: string;
    name: string;
    inventory_sources: ProductInventorySource[];
  }
  
  export interface Meta {
    total: number;
    count: number;
    current_page: number;
    per_page: number;
    last_page: number;
    from: number;
    to: number;
  }
  
  export interface ApiResponse {
    success: boolean;
    data: Product[];
    meta: Meta;
    inventory_sources: InventorySource[];
  }
  
  // Table Data Interfaces
  export interface Allocation {
    value: number;
    percent: string | null;
  }
  
  export interface TableRowData {
    key: number;
    itemNum: number;
    poNumber: string;
    supplierName: string;
    poDate: string;
    daysInInventory: number;
    serialCount: number;
    allocations: Allocation[];
    availableQty: number;
  }
  
  // Component Props
  export interface PurchaseOrderTableProps {
    initialPage?: number;
    pageSize?: number;
    onRefresh?: () => void;
  }
  
  // Theme Configuration
  export interface ThemeConfig {
    token: {
      colorPrimary: string;
      colorSuccess: string;
      colorWarning: string;
      colorError: string;
      colorInfo: string;
      borderRadius: number;
      fontSize: number;
      colorBgContainer: string;
      colorBgLayout: string;
      colorBorder: string;
      boxShadow: string;
    };
    components: {
      Button: {
        algorithm: boolean;
        controlHeight: number;
        paddingInline: number;
      };
      Table: {
        colorBgContainer: string;
        headerBg: string;
      };
      Menu: {
        darkItemColor: string;
        darkItemSelectedColor: string;
        darkItemSelectedBg: string;
        darkItemHoverColor: string;
        darkItemHoverBg: string;
        darkPopupBg: string;
        itemHeight: number;
        itemMarginBlock: number;
        itemBorderRadius: number;
        itemPaddingInline: number;
      };
      Layout: {
        siderBg: string;
        colorBgHeader: string;
        colorBgBody: string;
      };
    };
  }
  
  // Custom pagination props
  export interface CustomPaginationProps {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  }