import { EntityResource } from '@nx/shell';
import { AxiosRequestConfig } from 'axios';
import { QueryParams } from '@nx/shell';

// Define the inventory source interface
export interface InventorySource {
  id: number;
  name: string;
  channels: {
    id: number;
    name: string;
  }[];
  rule: {
    percent: number;
  };
}
export interface Warehouse{
  id:string,
  name:string
}

// Define the purchase item interface
export interface PurchaseItem {
  purchase_id: number;
  supplier_name: string;
  purchase_date: string;
  inventory_sources: {
    id: number;
    qty: number;
  }[];
}

// API response interface
export interface PurchaseResponse {
  success: boolean;
  data: PurchaseItem[];
  meta: {
    total: number;
    count: number;
    current_page: number;
    per_page: number;
    last_page: number;
    from: number;
    to: number;
  };
  inventory_sources: InventorySource[];
}

// Create the purchase management service using the EntityResource class
class PurchaseManagementService extends EntityResource<PurchaseItem> {
  private _inventorySources: InventorySource[] = [];

  constructor(config: any) {
    super(config);
    console.log('Purchase Management Service initialized with:', {
      apiURL: this.config.apiURL,
      entityURL: this.config.entityURL
    });
  }
  
  // Override the getEntries method with the correct return type and implementation
  override async getEntries(
    params: Partial<QueryParams> = {}, 
    config?: AxiosRequestConfig
  ): Promise<{ items: PurchaseItem[]; total: number }> {
    try {
      // Use the EntityResource's axios instance to make the request
      const response = await this.api.get<PurchaseResponse>(this.getEntityUrl(), {
        params,
        ...config
      });
      
      // Process the response based on expected data structure
      const { data } = response;
      
      if (!data || !data.data) {
        return { items: [], total: 0 };
      }
      
      // Store inventory sources for later use
      if (data.inventory_sources) {
        this._inventorySources = data.inventory_sources;
      }
      
      // Add unallocated row
      const items = [...data.data];
    
      return {
        items: items,
        total: data.meta.total || 0
      };
    } catch (error) {
      console.error('Error fetching purchase items:', error);
      return { items: [], total: 0 };
    }
  }

  async fetchWarehouses(): Promise<[]> {
    try {
      const response = await this.api.get('/warehouses');
      
      if (response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      return [];
    }
  }

  // Add method to get inventory sources
  getInventorySources(): InventorySource[] {
    return this._inventorySources;
  }
  
  async fetchInventorySources(warehouseId?: number): Promise<InventorySource[]> {
    try {
      const url = this.getEntityUrl();
      const params: Record<string, any> = {};
      
      if (warehouseId) {
        params.warehouse_id = warehouseId;
      }
      
      const response = await this.api.get<PurchaseResponse>(url, { params });
      if (response.data && response.data.inventory_sources) {
        this._inventorySources = response.data.inventory_sources;
        return this._inventorySources;
      }
      return this._inventorySources;
    } catch (error) {
      console.error('Error fetching inventory sources:', error);
      return [];
    }
  }


}

// Create and export an instance
const PurchaseService = new PurchaseManagementService({
  apiURL: process.env.NEXT_PUBLIC_SUPPLY_BACKEND_URL,
  entityURL: 'purchase-inventories',
  detailLink: '/purchase',
  createLink: '/purchase/create'
});

export default PurchaseService;