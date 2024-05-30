import chartsConfig from "./config.js";
export const chartConfig = {

    type: "line",
    height: 350,
    width: 630,
    redrawOnParentResize: true,
    redrawOnWindowResize: true,
    breakpoint: undefined,
    series: [
        {
            name: "Sales",
            data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
        },
    ],
    options: {
        ...chartsConfig,
        colors: ["#012C6E"],
        stroke: {
            lineCap: "round",
            curve: "smooth",
        },
        markers: {
            size: 5,
        },
        xaxis: {
            ...chartsConfig.xaxis,
            categories: [
                "Dush",
                "Sesh",
                "Chor",
                "Pan",
                "Jum",
                "Shan",
                "Yak",
            ],
        },
    },
};