// apps/supply/src/services/inventoryManagement.service.ts
import { EntityResource } from '@nx/shell';
import { AxiosRequestConfig } from 'axios';
import { QueryParams } from '@nx/shell';

// Define the base inventory item interface
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  location: string;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder';
}

// Define allocation structure
export interface Allocation {
  sourceId: string | number;
  sourceName?: string;
  value: number;
  percent: string | null;
}

// Define a type that extends InventoryItem with the additional properties we need
export interface ExtendedInventoryItem extends InventoryItem {
  key?: string;
  name?: string;
  itemNum?: number | string;
  serialCount?: number;
  allocations?: Allocation[];
}

// Create the inventory management service using the EntityResource class
class InventoryManagementService extends EntityResource<InventoryItem> {
  constructor(config: any) {
    super(config);
    console.log('Inventory Management Service initialized with:', {
      apiURL: this.config.apiURL,
      entityURL: this.config.entityURL
    });
  }
  
  // Override the getEntries method with the correct return type and implementation
  override async getEntries(
    params: Partial<QueryParams> = {}, 
    config?: AxiosRequestConfig
  ): Promise<{ items: InventoryItem[]; total: number }> {
    try {
      // Use the EntityResource's axios instance to make the request
      const response = await this.api.get(this.getEntityUrl(), { 
        params,
        ...config
      });
      
      // Process the response based on expected data structure
      const { data } = response;
      
      if (!data || !data.data) {
        return { items: [], total: 0 };
      }
      
      // Map the API response to the table structure
      const items = data.data.map((item: any, index: number) => {
        const itemPosition = (data.meta.current_page - 1) * data.meta.per_page + index + 1;
        
        // Get the inventory sources
        const inventorySources = data.inventory_sources || [];
        
        // Map the inventory sources to allocations
        const allocations = inventorySources.map((source: any) => {
          const sourceData = item.inventory_sources.find((is: any) => is.id === source.id);
          return {
            sourceId: source.id,
            sourceName: source.name,
            value: sourceData?.physical_qty || 0,
            // Include the percentage from the rule
            percent: source.rule && typeof source.rule.percent === 'number' 
              ? `${source.rule.percent}٪` 
              : null
          };
        });
        
        // Calculate serial count
        const serialCount = item.inventory_sources.reduce(
          (sum: number, src: any) => sum + (src.physical_qty || 0), 
          0
        );
        
        // Create a complete inventory item with all required properties
        return {
          // Original properties from the InventoryItem interface
          id: item.id,
          productId: item.product_id || "",
          productName: item.name || "",
          sku: item.sku || "",
          quantity: serialCount || 0,
          location: "",
          minStockLevel: 0,
          maxStockLevel: 0,
          reorderPoint: 0,
          lastUpdated: new Date().toISOString(),
          status: "in_stock",
          
          // Additional properties for the table display
          key: item.id,
          name: item.name,
          itemNum: itemPosition,
          serialCount,
          allocations
        } as ExtendedInventoryItem;
      });
      
      return {
        items: items as InventoryItem[],
        total: data.meta.total || 0
      };
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      return { items: [], total: 0 };
    }
  }
}

// Create and export an instance
const inventoryService = new InventoryManagementService({
  apiURL: process.env.NEXT_PUBLIC_SUPPLY_BACKEND_URL,
  entityURL: 'product-inventories',
  detailLink: '/product',
  createLink: '/product/create'
});

export default inventoryService;