'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { CrudListContainer } from '@nx/shell';
import {
  Typography,
  Tooltip,
  theme,
} from 'antd';
import type { ColumnType } from 'antd/es/table';
import PurchaseService, { PurchaseItem, InventorySource } from '@/services/purchaseManagement.service';

const { Text } = Typography;


interface PurchaseManagementTableProps {
    warehouseId: number;
  }

const PurchaseManagementTable: React.FC<PurchaseManagementTableProps> = ({ warehouseId }) => {
  const [inventorySources, setInventorySources] = useState<InventorySource[]>([]);


  const { useToken } = theme;
  const { token } = useToken();

  useEffect(() => {
    // Fetch inventory sources for reference
    const fetchInventorySources = async () => {
      try {
        await PurchaseService.fetchInventorySources(warehouseId);
        setInventorySources(PurchaseService.getInventorySources());
      } catch (error) {
        console.error('Error fetching inventory sources:', error);
      }
    };

    fetchInventorySources();
  }, []);

  // Calculate total quantity for a purchase
  const getTotalQuantity = (sources: { id: number; qty: number }[]) => {
    return sources.reduce((total, source) => total + source.qty, 0);
  };

  // Base columns - these match your screenshot
  const baseColumns: ColumnType<PurchaseItem>[] = [
    {
      title: 'آیتم',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
      align: 'center',
    },
    {
      title: 'PO شماره',
      dataIndex: 'purchase_id',
      key: 'purchase_id',
      render: (id) => (
        <Text strong>
          (PO شماره)
        </Text>
      ),
      align: 'right',
    },
    {
      title: 'نام تامین‌کننده',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      align: 'right',
    },
    {
      title: 'تاریخ PO - روزهای در انبار',
      dataIndex: 'purchase_date',
      key: 'purchase_date',
      render: (date, record) => {
        if (record.purchase_id === -1) {
          return '';
        }
        
        const dateObj = new Date(date);
        const now = new Date();
        const daysAgo = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
        
        // Determine color level based on days ago
        let bgColor;
        let textColor;
        
        if (daysAgo > 30) {
          bgColor = token.colorError;
          textColor = token.colorWhite;
        } else if (daysAgo > 20) {
          bgColor = token.colorErrorHover;
          textColor = token.colorWhite;
        } else if (daysAgo > 10) {
          bgColor = token.colorErrorActive;
          textColor = token.colorErrorTextHover;
        } else if (daysAgo > 5) {
          bgColor = token.colorErrorBorder;
          textColor = token.colorErrorText;
        } else {
          bgColor = token.colorErrorBg;
          textColor = token.colorErrorText;
        }
        
        return (
          <div style={{ 
            backgroundColor: bgColor, 
            color: textColor, 
            padding: `${token.paddingXS}px ${token.paddingSM}px`,
            borderRadius: token.borderRadiusSM,
            textAlign: 'center',
            fontWeight: token.fontWeightStrong,
            display: 'inline-block'
          }}>
            {`${daysAgo} روز - ${date.split(' ')[0]}`}
          </div>
        );
      },
      align: 'right',
    },
    {
      title: 'تعداد سریال',
      dataIndex: 'inventory_sources',
      key: 'total_qty',
      render: (sources) => getTotalQuantity(sources),
      align: 'center',
    },
  ];

  // Dynamic columns for inventory sources based on the design
  const generateSourceColumns = () => {
    return inventorySources.map(source => ({
      title: (
        <Tooltip title={`${source.name}: ${source.rule.percent}%`}>
          <div >
            <div >{source.name}</div>
            <div>{source.rule.percent}%</div>
          </div>
        </Tooltip>
      ),
      dataIndex: 'inventory_sources',
      key: `source_${source.id}`,
      render: (sources: { id: number; qty: number }[], record: { purchase_id: number; }) => {
        const sourceData = sources.find(s => s.id === source.id);
        const qty = sourceData?.qty || 0;
        
        if (record.purchase_id === -1) {
          // Special styling for unallocated row
          return (
            <div>
              {qty}
            </div>
          );
        }
        
        return (
          <div >
            {qty > 0 ? qty : <span >-</span>}
          </div>
        );
      },
      align: 'center' as const,
      width: 80,
    }));
  };

  // Combine base columns with dynamic source columns
  const columns = useMemo(() => {
    return [...baseColumns, ...generateSourceColumns()];
  }, [baseColumns, inventorySources]);



  return (
        <CrudListContainer
          resource={PurchaseService}
          columns={columns}
          paginationMode="page_per_page"
          key={warehouseId}
          additionalPayload={{ warehouse_id: warehouseId }} 
          />
  );
};

export default PurchaseManagementTable;