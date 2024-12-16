import { BrandColor, colorPalette, Colors, colors } from "./colors";

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


  const chartOptions = (mode: 'dark' | 'light' | 'auto', brandColor: string) =>{
     return {
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
    plotOptions: {
      bar: {
        borderRadius: 5,
        rangeBarOverlap: true,
        borderRadiusApplication: "end",
        columnWidth: "45%",
        // distributed: true,
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
    // ? Enable data on chart
    dataLabels: {
      enabled: false,
      enabledOnSeries: [1],
    },
    grid: {
      show: true,
      borderColor: mode === "auto" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? colorPalette.gray[700] : colorPalette.gray[200] : mode === "dark" ? colorPalette.gray[700] : colorPalette.gray[200],
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    // ? Change below indicators style
    legend: {
      show: true,
      labels: {
        colors: mode === "auto" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? colorPalette.gray[500] : colorPalette.gray[600] : mode === "dark" ? colorPalette.gray[500] : colorPalette.gray[600],
        useSeriesColors: false,
      },
      markers: {
        size: [8, 6],
        fillColors: [colorPalette[brandColor as BrandColor][600], colorPalette[borderComplementaryColor[brandColor as keyof typeof borderComplementaryColor] as BrandColor][500]],
        shape: ["square", "line"],
        strokeWidth: [0, 2],
        offsetX: -5,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 0,
      },
    },
    yaxis: [
      {
        labels: {
          // ? Change Label style left yaxis
          style: {
            colors: colorPalette.gray[500],
          },
        },
      },
      {
        opposite: true,
        labels: {
          // ? Change Label style right yaxis
          style: {
            colors: colorPalette.gray[500],
          },
        },
      },
    ],
    xaxis: {
      type: "category",
      labels: {
        // ? Change Label style xaxis
        style: {
          colors: mode === "auto" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? colorPalette.gray[500] : colorPalette.gray[500] : mode === "dark" ? colorPalette.gray[500] : colorPalette.gray[500],
        },
      },
      // ? Change border style xaxis
      axisBorder: {
        show: true,
        color: mode === "auto" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? colorPalette.gray[600] : colorPalette.gray[300] : mode === "dark" ? colorPalette.gray[600] : colorPalette.gray[300],
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: 0,
      },
      // ? Change border tick style xaxis
      axisTicks: {
        show: true,
      },
      // ? Change on hover data style xaxis
      crosshairs: {
        show: true,
        stroke: {
          color: mode === "auto" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? colorPalette.gray[500] : colorPalette.gray[400] :  mode === "dark" ? colorPalette.gray[500] : colorPalette.gray[400],
          width: 0,
          dashArray: 0,
        },
      },
    },
  }};
  
  export {chartOptions, colorPalette}