const charts = {
    temp_humid_graph: {
      chartMaxLength: 10,
      htmlId: "temp_humid_graph",
    },
  };
  
  const ifChartFull = (chart, name) => {
    const datasets = chart.data.datasets;
    const labels = chart.data.labels;
    datasets.map((item) => {
      if (item.data.length >= charts[name]["chartMaxLength"]) {
        item.data.shift();
        chart.update();
      }
      if (labels.length >= charts[name]["chartMaxLength"]) {
        labels.shift();
        chart.update();
      }
    });
  };
  
  const dateFormatter = () => {
    const now = new Date();
    return [`${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`];
  };
  
  const timeFormatter = () => {
    const now = new Date();
    return [`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`];
  };
  
  const labelOnGraphFormatter = () => {
    return `${timeFormatter()}`;
  };
  
  const OverviewUpdate = (data) => {
    temp_humid_graph.data.datasets[0].data.push(data.temp);
    temp_humid_graph.data.datasets[1].data.push(data.humid);
    temp_humid_graph.data.labels.push(labelOnGraphFormatter(new Date()));
    ifChartFull(temp_humid_graph, "temp_humid_graph");
    temp_humid_graph.update();
  };
  
  const temp_humid_StaticUpdate = (data) => {
      const target_temp = document.getElementById('temp')
      const target_humid = document.getElementById('humid')
      if (!target_temp || !target_humid) return
  
      target_temp.innerHTML = data.temp.toFixed(2)
      target_humid.innerHTML = data.humid.toFixed(2)
  
  }
  
  const ChartUpdates = (data) => {
    temp_humid_StaticUpdate(data)
    OverviewUpdate(data);
  };