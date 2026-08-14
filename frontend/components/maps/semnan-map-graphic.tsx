"use client";

import { provinceGeometry } from "../../dashboard/features/gis/data/province-geometry";
import { formatPersianNumber } from "../../lib/persian-numbers";

export type MapCounty = {
  code: string;
  name: string;
  projectCount: number;
  criticalProjectCount: number;
  averageProgress: number;
  isDemo?: boolean;
};

type SemnanMapGraphicProps = {
  counties: MapCounty[];
  selectedCode: string;
  onSelect: (code: string) => void;
  showProjects?: boolean;
  showAlerts?: boolean;
  showProgress?: boolean;
  className?: string;
};

export function SemnanMapGraphic({
  counties,
  selectedCode,
  onSelect,
  showProjects = true,
  showAlerts = true,
  showProgress = true,
  className = ""
}: SemnanMapGraphicProps) {
  return (
    <svg className={`semnan-svg ${className}`} viewBox="0 0 1000 500" role="img" aria-label="نقشه شهرستان‌های استان سمنان">
      <g className="province-shadow" transform="translate(8 8)">
        {provinceGeometry.map((county) => <path key={county.code} d={county.path} />)}
      </g>
      {provinceGeometry.map((geometry) => {
        const county = counties.find((item) => item.code === geometry.code);
        const classNames = [
          "county-shape",
          selectedCode === geometry.code ? "selected" : "",
          showAlerts && county?.criticalProjectCount ? "critical" : "",
          showProjects && !county?.projectCount ? "no-data" : ""
        ].filter(Boolean).join(" ");
        const selectCounty = () => onSelect(geometry.code);

        return (
          <g
            key={geometry.code}
            role="button"
            tabIndex={0}
            aria-label={`شهرستان ${geometry.label}`}
            aria-pressed={selectedCode === geometry.code}
            onClick={selectCounty}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectCounty();
              }
            }}
            onMouseEnter={selectCounty}
          >
            <path className={classNames} d={geometry.path} />
            <text className="county-label" x={geometry.labelX} y={geometry.labelY}>{geometry.label}</text>
            {showProgress && county?.projectCount ? (
              <text className="county-value" x={geometry.labelX} y={geometry.labelY + 25}>{formatPersianNumber(Math.round(county.averageProgress))}٪</text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
