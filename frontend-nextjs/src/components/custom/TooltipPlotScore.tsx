import React from "react";
import { TooltipProps } from "recharts";
// import { Payload } from "recharts/types/component/DefaultLegendContent";
// import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

type TooltipPlotScoreProps = {
  active?: boolean | undefined;
  payload?: TooltipProps<number, string>["payload"];
  label?: string;
};
export default function TooltipPlotScore({
  active,
  payload,
  label,
}: TooltipPlotScoreProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-semibold">
          {label}: {data.name}
        </p>

        <p className="text-xs text-muted-foreground">Điểm: {data?.score}</p>
      </div>
    );
  }

  return null;
}
