"use client";

import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface DonutNPFDatum {
  label: string;
  value: number;
  color: string;
}

interface LabelViewBox {
  cx?: number;
  cy?: number;
}

function formatRatio(value: number) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DonutNPF({
  data,
  ratio,
}: {
  data: DonutNPFDatum[];
  ratio: number;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-[320px] w-full max-w-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="88%"
              paddingAngle={2}
              isAnimationActive={false}
              stroke="#ffffff"
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  const box = viewBox as LabelViewBox | undefined;
                  const cx = box?.cx ?? 0;
                  const cy = box?.cy ?? 0;

                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy - 4}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-gray-900 text-[28px] font-bold"
                      >
                        {formatRatio(ratio)}%
                      </text>
                      <text
                        x={cx}
                        y={cy + 18}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-gray-500 text-xs"
                      >
                        Rasio NPF
                      </text>
                    </g>
                  );
                }}
              />
              {data.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | string | undefined) =>
                formatRupiah(Number(value ?? 0))
              }
              contentStyle={{
                borderRadius: 12,
                borderColor: "#e2e8f0",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid w-full max-w-[640px] gap-x-8 gap-y-3 text-sm text-gray-600 sm:grid-cols-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
