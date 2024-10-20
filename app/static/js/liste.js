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

// GET data for chartJS
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

// if ziel has no history, alerts user and does not open history
$(document).ready(function() {
    $('.history-link').on('click', function(event) {
        if ($(this).data('has-history') === 'false') {
            event.preventDefault();
            alert('Dieses Ziel hat keine Historie.');
        }
    });
});


//POST method to update ZIEL and add to history
function updateZiel(zielId, field, value, changedBy, comment) {
    const data = {
        [field]: value,
        author: changedBy,
        kommentar: comment
    };

    $.ajax({
        url: `/edit-ziel/${zielId}`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            alert(response.message);
        },
        error: function(xhr) {
            alert(`Fehler: ${xhr.responseJSON.message}`);
        }
    });
}


//Edit Ziel function
$(document).ready(function() {
    let currentRow;

    $('.edit-btn').on('click', function() {
        currentRow = $(this).closest('tr');
        makeRowEditable(currentRow);
        $('#save-btn').show();
    });

    $('#save-btn').on('click', function() {
        saveChanges(currentRow);
    });

    function makeRowEditable(row) {
        row.find('.editable').each(function() {
            const cell = $(this);
            const value = cell.text();
            const input = $('<input>', {
                type: 'text',
                value: value
            });
            cell.html(input);
        });
    }

    function saveChanges(row) {
        const zielId = row.next('.ziel-id').find('td').text();
        const data = {};

        row.find('.editable').each(function() {
            const cell = $(this);
            const input = cell.find('input');
            const field = cell.data('field');
            data[field] = input.val();
        });

        data['author'] = row.find('td:nth-child(7)').text(); 

        // if (data['bewertung']) {
        //     data['bewertung'] = parseInt(data['bewertung'], 10)
        // }

        $.ajax({
            url: `/edit-ziel/${zielId}`,
            method: 'POST', 
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                // alert(response.message);
                // location.reload(); // Reload the page to see the changes
                row.find('.editable').each(function() {
                    const cell = $(this);
                    const field = cell.data('field');
                    cell.text(data[field]);
                });
                $('#save-btn').hide();
            },
            error: function(xhr) {
                alert(`Fehler: ${xhr.responseJSON.message ? xhr.responseJSON.message : 'Unbekannter Fehler'}`);
            }
        });
    }
});