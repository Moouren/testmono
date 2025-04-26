import React, { useState, useEffect } from 'react';
import { Card, Radio, Space, Input, Select, Button, Row, Col, Slider, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface InventoryFiltersProps {
  onFilter: (values: any) => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({ onFilter }) => {
  // State for filter values
  const [filterType, setFilterType] = useState<'درصدی' | 'تعدادی'>('درصدی');
  const [percentValue, setPercentValue] = useState<string>('۲۰٪');
  const [sliderValue, setSliderValue] = useState<number>(20);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [channels, setChannels] = useState<Array<{ id: string, name: string }>>([]);
  
  // Fetch available channels for the filter dropdown
  useEffect(() => {
    // In a real implementation, you'd fetch this from your API
    // For now, we'll use dummy data based on the screenshot
    setChannels([
      { id: '1', name: 'اسم چنل ۱' },
      { id: '2', name: 'اسم چنل ۲' },
      { id: '3', name: 'اسم چنل ۳' },
      { id: '4', name: 'اسم چنل ۴' },
    ]);
  }, []);

  // Handle filter type change (percentage or quantity)
  const handleFilterTypeChange = (e: any) => {
    setFilterType(e.target.value);
  };

  // Handle slider change for percentage
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setPercentValue(`${value}٪`);
  };

  // Handle channel selection
  const handleChannelChange = (value: string) => {
    setSelectedChannel(value);
  };

  // Apply filters
  const applyFilters = () => {
    onFilter({
      filterType,
      percentValue: sliderValue,
      channelId: selectedChannel
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilterType('درصدی');
    setSliderValue(20);
    setPercentValue('۲۰٪');
    setSelectedChannel('');
    onFilter({});
  };

  return (
    <Card style={{ marginBottom: 16, direction: 'rtl' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Radio.Group value={filterType} onChange={handleFilterTypeChange}>
              <Radio.Button value="تعدادی">تعدادی</Radio.Button>
              <Radio.Button value="درصدی">درصدی</Radio.Button>
            </Radio.Group>
          </Col>
          
          <Col flex="auto">
            <Row gutter={16} align="middle">
              <Col span={2}>
                <Input 
                  value={percentValue}
                  disabled
                  style={{ textAlign: 'center' }}
                />
              </Col>
              <Col span={10}>
                <Slider
                  min={0}
                  max={100}
                  value={sliderValue}
                  onChange={handleSliderChange}
                />
              </Col>
              <Col span={6}>
                <Select
                  placeholder="اسم چنل"
                  style={{ width: '100%' }}
                  value={selectedChannel || undefined}
                  onChange={handleChannelChange}
                  suffixIcon={<div>▼</div>}
                >
                  {channels.map(channel => (
                    <Select.Option key={channel.id} value={channel.id}>
                      {channel.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={applyFilters}
                  >
                    افزودن چنل
                  </Button>
                  <Button onClick={resetFilters}>
                    انصراف
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <Typography.Text type="secondary">
              جمع تخصیص یافته: {sliderValue}٪
            </Typography.Text>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default InventoryFilters;