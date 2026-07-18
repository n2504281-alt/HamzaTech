"use client";

import React, { useState } from "react";
import { DollarSign, BarChart3 } from "lucide-react";

interface DataPoint {
  label: string;
  revenue: number;
  orders: number;
}

export function AnalyticsChart() {
  const [activeTab, setActiveTab] = useState<"revenue" | "orders">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data: DataPoint[] = [
    { label: "Jan", revenue: 4500, orders: 12 },
    { label: "Feb", revenue: 7200, orders: 19 },
    { label: "Mar", revenue: 9800, orders: 25 },
    { label: "Apr", revenue: 8400, orders: 21 },
    { label: "May", revenue: 14200, orders: 38 },
    { label: "Jun", revenue: 18900, orders: 49 },
    { label: "Jul", revenue: 24500, orders: 64 },
    { label: "Aug", revenue: 21200, orders: 55 },
    { label: "Sep", revenue: 28400, orders: 74 },
    { label: "Oct", revenue: 32600, orders: 85 },
    { label: "Nov", revenue: 41200, orders: 108 },
    { label: "Dec", revenue: 54900, orders: 142 },
  ];

  // SVG Chart Dimensions
  const width = 800;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max calculations
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const maxOrders = Math.max(...data.map((d) => d.orders));

  const getCoordinates = () => {
    return data.map((d, index) => {
      const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
      const val = activeTab === "revenue" ? d.revenue : d.orders;
      const max = activeTab === "revenue" ? maxRevenue : maxOrders;
      const y = paddingTop + chartHeight - (val / max) * chartHeight;
      return { x, y };
    });
  };

  const coords = getCoordinates();

  // Create SVG path d attribute string for Line chart
  const pathD = coords.reduce((acc, c, idx) => {
    return idx === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
  }, "");

  // Create SVG Area path (closes at the bottom)
  const areaD = coords.length > 0 
    ? `${pathD} L ${coords[coords.length - 1].x} ${paddingTop + chartHeight} L ${coords[0].x} ${paddingTop + chartHeight} Z`
    : "";

  return (
    <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-6 text-left relative overflow-hidden select-none shadow-sm w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <h3 className="font-heading text-base font-black text-foreground uppercase tracking-wide">
            Performance Analytics
          </h3>
          <p className="text-[10px] text-muted-foreground font-light mt-0.5">
            Overview of store earnings and transaction rates for Aura X1.
          </p>
        </div>

        {/* Chart Selector Tabs */}
        <div className="flex bg-muted/15 p-1 rounded-full border border-border/60 self-start">
          <button
            onClick={() => setActiveTab("revenue")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold transition ${
              activeTab === "revenue" ? "bg-accent text-white shadow-md" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            Revenue
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold transition ${
              activeTab === "orders" ? "bg-accent text-white shadow-md" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Orders
          </button>
        </div>
      </div>

      {/* SVG Rendering Panel */}
      <div className="relative w-full h-[240px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Gradients */}
          <defs>
            <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
            const y = paddingTop + r * chartHeight;
            const labelVal = activeTab === "revenue" 
              ? `$${Math.round(maxRevenue * (1 - r) / 1000)}k`
              : Math.round(maxOrders * (1 - r));
            return (
              <g key={idx} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px] font-semibold"
                >
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Glowing Area Fill */}
          <path d={areaD} fill="url(#areaGlow)" className="transition-all duration-500" />

          {/* Main Chart Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#F97316"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500 shadow-xl"
          />

          {/* Month Labels */}
          {data.map((d, index) => {
            const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px] font-black uppercase tracking-wider"
              >
                {d.label}
              </text>
            );
          })}

          {/* Interactive Hover Indicators */}
          {coords.map((c, index) => (
            <g
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <rect
                x={c.x - chartWidth / (data.length * 2)}
                y={paddingTop}
                width={chartWidth / data.length}
                height={chartHeight}
                fill="transparent"
              />
              {hoveredIndex === index && (
                <g>
                  {/* Vertical bar guide */}
                  <line
                    x1={c.x}
                    y1={paddingTop}
                    x2={c.x}
                    y2={paddingTop + chartHeight}
                    stroke="#F97316"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  {/* Interactive Dot */}
                  <circle cx={c.x} cy={c.y} r="6" fill="#F97316" className="shadow-lg" />
                  <circle cx={c.x} cy={c.y} r="3" fill="#FFFFFF" />
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Live Hover Tooltip Panel */}
        {hoveredIndex !== null && (
          <div
            className="absolute bg-card border border-border p-3 rounded-2xl shadow-xl flex flex-col gap-0.5 pointer-events-none z-10 text-xs"
            style={{
              left: `${Math.min(
                width - 140,
                Math.max(
                  40,
                  (coords[hoveredIndex].x / width) * 100
                )
              )}%`,
              top: `${Math.max(10, (coords[hoveredIndex].y / height) * 100 - 30)}%`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider leading-none">
              {data[hoveredIndex].label} Overview
            </span>
            <span className="font-heading font-black text-foreground mt-1">
              {activeTab === "revenue"
                ? `$${data[hoveredIndex].revenue.toLocaleString()}`
                : `${data[hoveredIndex].orders} Total Orders`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
