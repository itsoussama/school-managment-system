import { colorPalette } from "./colors";


  const chartOptions = (mode: 'dark' | 'light') =>{ return {
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
      colors: colorPalette.blue[600],
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
      curve: "smooth",
    },
    // ? Enable data on chart
    dataLabels: {
      enabled: false,
      enabledOnSeries: [1],
    },
    grid: {
      show: true,
      borderColor: mode === "dark" ? colorPalette.gray[700] : colorPalette.gray[200],
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
        colors: mode === "dark" ? colorPalette.gray[500] : colorPalette.gray[600],
        useSeriesColors: false,
      },
      markers: {
        size: [8, 6],
        shape: ["line", "circle"],
        strokeWidth: [2, 0],
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
          colors: mode === "dark" ? colorPalette.gray[500] : colorPalette.gray[500],
        },
      },
      // ? Change border style xaxis
      axisBorder: {
        show: true,
        color: mode === "dark" ? colorPalette.gray[600] : colorPalette.gray[300],
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
          color: mode === "dark" ? colorPalette.gray[500] : colorPalette.gray[400],
          width: 0,
          dashArray: 0,
        },
      },
    },
  }};
  
  export {chartOptions, colorPalette}