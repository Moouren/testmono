'use client';
import React, { useState, useEffect } from 'react';
import { Select, Card, Spin, Space, Typography, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import PurchaseManagementTable from './table';
import { useRouter, useSearchParams } from 'next/navigation';
import PurchaseService from '@/services/purchaseManagement.service';
import { WarehouseIcon } from 'lucide-react';

const { Option } = Select;
const { Title, Text } = Typography;

const PurchaseManagementWrapper: React.FC = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch warehouses using React Query
  const { data: warehouseResponse, isLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => PurchaseService.fetchWarehouses(),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
  const warehouses = (warehouseResponse as any)?.data || [];

  // Set initial warehouse from URL or default to first one when data is available
  useEffect(() => {
    if (!warehouses.length) return;
    
    // Check if warehouse_id is in URL
    const warehouseIdParam = searchParams.get('warehouse_id');
    
    if (warehouseIdParam) {
      // If warehouse ID is in URL, select it
      setSelectedWarehouse(Number(warehouseIdParam));
    } else if (warehouses.length > 0) {
      setSelectedWarehouse(warehouses[0].id);
      updateUrlParam(warehouses[0].id);
    }
  }, [warehouses, searchParams]);

  const updateUrlParam = (warehouseId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('warehouse_id', warehouseId.toString());
    router.push(`?${params.toString()}`);
  };

  const handleWarehouseChange = (value: number) => {
    setSelectedWarehouse(value);
    updateUrlParam(value);
  };


  console.log('selectedWarehouse',selectedWarehouse);
  return (
    <Card title={
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4}>مدیریت خرید</Title>
        </Col>
        <Col>
          <Space>
            <Text>انبار:</Text>
            <Select
              style={{ width: 200 }}
              value={selectedWarehouse}
              onChange={handleWarehouseChange}
              loading={isLoading}
              placeholder="انتخاب انبار"
              suffixIcon={<WarehouseIcon />}
              disabled={isLoading}
            >
              {warehouses.map(warehouse => (
                <Option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </Option>
              ))}
            </Select>
          </Space>
        </Col>
      </Row>
    }>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0', minHeight: '200px' }}>
          <Spin>
            <div style={{ width: '100%', height: '200px' }} />
          </Spin>
        </div>
      ) : selectedWarehouse ? (
        <PurchaseManagementTable warehouseId={selectedWarehouse} />
      ) : null}
    </Card>
  );
};

export default PurchaseManagementWrapper;