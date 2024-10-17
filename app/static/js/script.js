// Um zwischen Chart und AKtuellen Zielen zu wechseln
$(document).ready(function() {
    const tableButton = $('#table-button');
    const chartButton = $('#chart-button');
    const tableView = $('#table-view');
    const chartView = $('#chart-view');

    chartView.hide()

    tableButton.on('click', function() {
        tableView.show();
        chartView.hide();
    });

    chartButton.on('click', function() {
        tableView.hide();
        chartView.show();
    });
});

$(document).ready(function() {
    function updateChart() {
        const selectedAbteilungen = $('#abteilung-select').val();
        $.ajax({
            url: '/api/ziele',
            method: 'GET',
            data: {
                abteilungen: selectedAbteilungen
            },
            success: function(data) {
                const groupedData = data.reduce((acc, item) => {
                    if (!acc[item.abteilung]) {
                        acc[item.abteilung] = { labels: [], data: [] };
                    }
                    acc[item.abteilung].labels.push(item.datum);
                    acc[item.abteilung].data.push(item.bewertung);
                    return acc;
                }, {});

                const datasets = Object.keys(groupedData).map(abteilung => ({
                    label: abteilung,
                    data: groupedData[abteilung].data,
                    borderColor: getRandomColor(),
                    borderWidth: 1,
                    fill: false
                }));

                const ctx = $('#myChart')[0].getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: groupedData[Object.keys(groupedData)[0]].labels,
                        datasets: datasets
                    },
                    options: {
                        scales: {
                            x: {
                                reverse: true
                            },
                            y: {
                                min: 1,
                                max: 10
                            }
                        }
                    }
                });
            }
        });
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $('#abteilung-select').change(updateChart);
    updateChart();
});

//Tabellensortieren
