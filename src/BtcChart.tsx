import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function BtcChart() {
  // إعدادات ومؤشرات رسم البيتكوين البياني (WEB-103)
  const option = {
    title: {
      text: 'Bitcoin (BTC) Price History',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
      min: 60000,
    },
    series: [
      {
        data: [61000, 62500, 62000, 64000, 63500, 65000, 66000],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#ff9900', // لون برتقالي لبيتكوين
          width: 3,
        },
      },
    ],
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
    </div>
  );
}return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      {/* @ts-ignore */}
      <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
    </div>
  );