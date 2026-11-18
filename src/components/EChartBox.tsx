import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartBoxProps {
  option: echarts.EChartsOption;
  height?: number;
  ariaLabel: string;
}

export const EChartBox: React.FC<EChartBoxProps> = ({ option, height = 320, ariaLabel }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = echarts.init(containerRef.current);
    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [option]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', maxWidth: '100%', height: `${height}px` }}
    />
  );
};