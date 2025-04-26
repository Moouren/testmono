'use client';
import React, { useState, useEffect } from 'react';
import inventoryService, { InventoryItem, Allocation } from '@/services/productManagement.service';
import { CrudListContainer } from '@nx/shell';

// Define column type to match CrudListContainer expectations
interface ColumnType {
  title: string | React.ReactNode;
  dataIndex?: string;
  key: string;
  width: number;
  align: 'center' | 'left' | 'right';
  className?: string;
  render?: (text: string, record: InventoryItem) => React.ReactNode;
}

const ProductTable: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  
  useEffect(() => {
    // Function to get the first page of data to extract inventory sources
    const fetchFirstPage = async (): Promise<void> => {
      try {
        // Call getEntries to get the first page of data
        const result = await inventoryService.getEntries({ page: 1, limit: 1 });
        
        // If we have data and the first item has allocations
        if (result.items && result.items.length > 0 && 'allocations' in result.items[0]) {
          // Get the allocations of the first item to determine sources
          const { allocations } = result.items[0] as any;
          
          // Create base columns (these don't change)
          const baseColumns: ColumnType[] = [
            {
              title: 'آیتم',
              dataIndex: 'itemNum',
              key: 'itemNum',
              width: 50,
              align: 'center',
              className: 'text-gray-600',
            },
            {
              title: 'DKPC',
              dataIndex: 'sku',
              key: 'dkpc',
              width: 120,
              align: 'center',
              render: (text: string) => <div>{text || '(DKPC)'}</div>,
            },
            {
              title: 'نام کالا',
              dataIndex: 'name',
              key: 'productName',
              width: 200,
              align: 'right',
              render: (text: string) => <div>{text || '(نام کالا)'}</div>,
            },
            {
              title: 'تعداد سریال',
              dataIndex: 'serialCount',
              key: 'serialCount',
              width: 100,
              align: 'center',
            },
          ];
          
          // Create dynamic columns for each source with percentages in the header
          const sourceColumns: ColumnType[] = allocations.map((allocation: Allocation) => ({
            title: (
              <div className="text-center">
                <div>{allocation.sourceName || '(اسم چنل)'}</div>
                {allocation.percent && (
                  <div className="text-xs text-gray-500">{allocation.percent}</div>
                )}
              </div>
            ),
            key: `channel_${allocation.sourceId}`,
            width: 80,
            align: 'center',
            render: (_: any, record: InventoryItem) => {
              const recordWithAllocations = record as any;
              const alloc = recordWithAllocations.allocations?.find(
                (a: Allocation) => a.sourceId === allocation.sourceId
              );
              return <div>{alloc?.value || 0}</div>;
            },
          }));
          
          // Add the last column for total allocation
          const totalColumn: ColumnType = {
            title: (
              <div className="text-center">
                <div>تخصیص یافته</div>
                <div className="text-xs text-gray-500">۱۰۰٪</div>
              </div>
            ),
            key: 'allocated',
            width: 80,
            align: 'center',
            className: 'text-gray-800 font-medium',
            render: (_: string, record: InventoryItem) => {
              const recordWithAllocations = record as any;
              const total = recordWithAllocations.allocations?.reduce(
                (sum: number, alloc: Allocation) => sum + (alloc?.value || 0),
                0
              );
              return <div>{total || 0}</div>;
            },
          };
          
          // Combine all columns
          setColumns([...baseColumns, ...sourceColumns, totalColumn]);
        }
      } catch (error) {
        console.error('Error fetching columns data:', error);
      }
    };
    
    fetchFirstPage();
  }, []);
  
  // If columns are still loading, show a loading state
  if (columns.length === 0) {
    return <div>Loading columns...</div>;
  }
  
  // Once columns are ready, render the CrudListContainer
  return (
    <CrudListContainer
      resource={inventoryService}
      columns={columns}
      paginationMode='page_per_page'
    />
  );
};

export default ProductTable;