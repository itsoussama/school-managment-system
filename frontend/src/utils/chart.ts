import { ApexOptions } from "apexcharts";
import { BrandColor, colorPalette} from "./colors";

const borderComplementaryColor = {
  indigo: "lime",
  purple: "lime",
  pink: "green",
  blue: "orange",
  cyan: "lime",
  green: "cyan",
  lime: "purple",
  red: "cyan",
  teal: "orange",
  yellow: "indigo",
}

const getColor = (mode: 'dark' | 'light' | 'auto', lightColor: string, darkColor: string) => {
  if (mode === 'auto') {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? darkColor : lightColor;
  }
  return mode === 'dark' ? darkColor : lightColor;
};

const commonOptions = (mode: 'dark' | 'light' | 'auto', brandColor: string) : ApexOptions => ({
  chart: {
    toolbar: {
      show: false,
      tools: {
        download: false,
      },
    },
    height: "auto",
    width: "100%",
  },
  grid: {
    show: true,
    borderColor: getColor(mode, colorPalette.gray[200], colorPalette.gray[700]),
    strokeDashArray: 0,
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  legend: {
    show: true,
    labels: {
      colors: getColor(mode, colorPalette.gray[600], colorPalette.gray[500]),
      useSeriesColors: false,
    },
    markers: {
      size: 5,
      fillColors: [colorPalette[brandColor as BrandColor][600], colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][500]],
      shape: "circle",
      strokeWidth: 2,
      offsetX: -5,
    },
    itemMargin: {
      horizontal: 8,
      vertical: 0,
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: mode,
}
});

const barChartOptions = <T>(mode: 'dark' | 'light' | 'auto', brandColor: string, label: Array<T>) : ApexOptions => ({
  ...commonOptions(mode, brandColor),
  plotOptions: {
    bar: {
      borderRadius: 5,
      rangeBarOverlap: true,
      borderRadiusApplication: "end",
      columnWidth: "45%",
    },
  },
  fill: {
    type: ["gradient", "solid"],
    colors: [colorPalette[brandColor as BrandColor][600]],
    gradient: {
      shade: "dark",
      type: "vertical",
      shadeIntensity: 0,
      opacityFrom: 1,
      opacityTo: 0.4,
      stops: [0, 90, 100],
    },
  },
  stroke: {
    width: [0, 4],
    colors: [undefined, colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][500]],
    curve: "smooth",
  },
  dataLabels: {
    enabled: false,
    enabledOnSeries: [1],
  },
  yaxis: {
    labels: {
      style: {
        colors: colorPalette.gray[500],
      },
    },
  },
  xaxis: {
    type: "category",
    categories: label,
    labels: {
      style: {
        colors: colorPalette.gray[500],
      },
    },
    axisBorder: {
      show: true,
      color: getColor(mode, colorPalette.gray[300], colorPalette.gray[600]),
      // height: 1,
      // width: "100%",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      color: getColor(mode, colorPalette.gray[300], colorPalette.gray[600]),
      height: 6,
      offsetX: 0,
      offsetY: 0,
    },
  },
});

const barAreaChartOptions = <T>(mode: 'dark' | 'light' | 'auto', brandColor: string, label: Array<T>) : ApexOptions => ({
  ...commonOptions(mode, brandColor),
  plotOptions: {
    bar: {
      borderRadius: 5,
      rangeBarOverlap: true,
      borderRadiusApplication: "end",
      columnWidth: "45%",
    },
  },

  fill: {
    type: ['gradient', 'gradient'],
    colors: [getColor(mode, colorPalette[brandColor as BrandColor][400], colorPalette[brandColor as BrandColor][600]), getColor(mode, colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][400], colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][500])],
    gradient: {
      shade: "dark",
      type: "vertical",
      shadeIntensity: 0,
      opacityFrom: [1, 0.5],
      opacityTo: [0.4, 0.1],
      stops: [0, 95, 100],
    },
  },
  stroke: {
    width: [0, 4],
    colors: [undefined, getColor(mode, colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][400], colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][500])],
    curve: "smooth",
  },
  dataLabels: {
    enabled: false,
    enabledOnSeries: [1],
  },
  yaxis: {
    labels: {
      style: {
        colors: colorPalette.gray[500],
      },
    },
  },
  xaxis: {
    type: "category",
    categories: label,
    labels: {
      style: {
        colors: colorPalette.gray[500],
      },
    },
    axisBorder: {
      show: true,
      color: getColor(mode, colorPalette.gray[300], colorPalette.gray[600]),
      // height: 1,
      // width: "100%",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      color: getColor(mode, colorPalette.gray[300], colorPalette.gray[600]),
      height: 6,
      offsetX: 0,
      offsetY: 0,
    },
  },
});

const barLineChartOptions = <T>(mode: 'dark' | 'light' | 'auto', brandColor: string, label: Array<T>) : ApexOptions => ({
  ...commonOptions(mode, brandColor),
  plotOptions: {
    bar: {
      borderRadius: 5,
      rangeBarOverlap: true,
      borderRadiusApplication: "end",
      columnWidth: "45%",
    },
  },
  fill: {
    type: ["gradient", "solid"],
    colors: [getColor(mode, colorPalette[brandColor as BrandColor][400], colorPalette[brandColor as BrandColor][600]), getColor(mode, colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][400], colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][500])],
    gradient: {
      shade: "dark",
      type: "vertical",
      shadeIntensity: 0,
      opacityFrom: 1,
      opacityTo: 0.4,
      stops: [0, 90, 100],
    },
  },
  stroke: {
    width: [0, 4],
    colors: [undefined, getColor(mode, colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][400], colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][500])],
    curve: "smooth",
  },
  dataLabels: {
    enabled: false,
    enabledOnSeries: [1],
  },
  yaxis: [
    {
      labels: {
        style: {
          colors: colorPalette.gray[500],
        },
      },
    },
    {
      opposite: true,
      labels: {
        style: {
          colors: colorPalette.gray[500],
        },
      },
    },
  ],
  xaxis: {
    type: "category",
    categories: label,
    labels: {
      style: {
        colors: colorPalette.gray[500],
      },
    },
    axisBorder: {
      show: true,
      color: getColor(mode, colorPalette.gray[300], colorPalette.gray[600]),
      // height: 1,
      // width: "100%",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
    },
  },
});

const lineChartOptions = <T>(mode: 'dark' | 'light' | 'auto', brandColor: string, label: Array<T>) : ApexOptions => ({
  ...commonOptions(mode, brandColor),
  stroke: {
    width: [3],
    curve: "smooth",
    colors: [colorPalette[brandColor as BrandColor][600]],
  },
  markers: {
    size: 5,
    colors: [colorPalette[brandColor as BrandColor][600]],
    strokeColors: "#fff",
    strokeWidth: 2,
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: "category",
    categories: label,
    labels: {
      style: {
        colors: colorPalette.gray[500],
      },
    },
    axisBorder: {
      show: true,
      color: getColor(mode, colorPalette.gray[300], colorPalette.gray[600]),
      // height: 1,
      // width: "100%",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      color: getColor(mode, colorPalette.gray[300], colorPalette.gray[600]),
      height: 6,
      offsetX: 0,
      offsetY: 0,
    },
  },
});
  
  export {barChartOptions, barLineChartOptions, lineChartOptions, barAreaChartOptions, colorPalette}