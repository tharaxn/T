const chartConfig = [
    {
      htmlId: "temp_humid_graph",
      chartType: "line",
      jsName: "temp_humid_graph",
      datasets: [
        {
          data: [],
          label: "Temperature",
          borderColor: "#3cba9f",
          fill: false,
        },
        {
          data: [],
          label: "Humidity",
          borderColor: "#FFeeaa",
          fill: false,
        },
      ],
      chartTitle: "Temperature & Humidity",
    },
  ];
  

  chartConfig.forEach((config) => {

    window[config.jsName] = new Chart(document.getElementById(config.htmlId), {
      type: "line",
      data: {
        labels: [],
        datasets: config.datasets,
      },
      options: {
        //
        tension: 0.5,
      },
    });
  });

  const addData = (chart, label, newData) => {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(newData);
    });
    chart.update();
  };