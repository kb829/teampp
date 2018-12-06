Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Vote name'
    },
    xAxis: {
        categories: ['Yes', 'No']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Voting status'
        }
    },
    legend: {
        reversed: false
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
      name: 'Result',
        data: [5, 3]
    }]
});
