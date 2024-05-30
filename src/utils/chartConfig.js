import chartsConfig from "./config.js";
export const chartConfig = {
    type: "line",
    height: 200,
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