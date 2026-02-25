import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { getAllExpenses } from './expensesServices';

export default function BasicLineChart() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const expenses = await getAllExpenses();
        const byDate = {};
        expenses.forEach((e) => {
          const d = new Date(e.date).toISOString().slice(0, 10);
          byDate[d] = (byDate[d] || 0) + Number(e.price || 0);
        });
        const sorted = Object.entries(byDate)
          .sort((a, b) => new Date(a[0]) - new Date(b[0]))
          .map(([date, total]) => ({ date, total }));
        setPoints(sorted);
      } catch (err) {
        console.error('Failed to load expenses for chart', err);
      }
    };
    load();
  }, []);

  const xLabels = points.map((p) => p.date);
  const yValues = points.map((p) => p.total);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Spending over time</h2>
      <LineChart
        xAxis={[{ data: xLabels, scaleType: 'point' }]}
        series={[{ data: yValues }]}
        width={1200}
        height={500}
      />
    </div>
  );
}
