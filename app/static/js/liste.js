let chartInstance;

// Um zwischen Chart und Aktuellen Zielen zu wechseln
$(document).ready(function () {
  const tableButton = $("#table-button");
  const chartButton = $("#chart-button");
  const tableView = $("#table-view");
  const chartView = $("#chart-view");
  const reloadChartBtn = $("#reload-btn");

  chartView.hide();

  tableButton.on("click", function () {
    tableView.show();
    chartView.hide();
  });

  chartButton.on("click", function () {
    tableView.hide();
    chartView.show();
  });

  reloadChartBtn.on("click", function () { 
    populateAbteilungSelect();
    const selectedAbteilungen = $("#abteilung-select").val();
    const startDate = $("#start-date").val();
    const endDate = $("#end-date").val();
    updateChart(selectedAbteilungen, startDate, endDate);
});
$("#start-date, #end-date").on("change", function () {
    const selectedAbteilungen = $("#abteilung-select").val();
    const startDate = $("#start-date").val();
    const endDate = $("#end-date").val();
    updateChart(selectedAbteilungen, startDate, endDate);
});

  populateAbteilungSelect();
  updateChart();

});
// GET data for chartJS


function updateChart(selectedAbteilungen = [], startDate = null, endDate = null) {
    $.ajax({
        url: "/api/ziele_historie",
        method: "GET",
        data: {
            abteilungen: selectedAbteilungen,
            start_date: startDate,
            end_date: endDate,
        },
        success: function (data) {
            const groupedData = data.reduce((acc, item) => {
                if (!acc[item.abteilung]) {
                    acc[item.abteilung] = { labels: [], data: [] };
                }
                acc[item.abteilung].labels.push(item.datum);
                acc[item.abteilung].data.push(item.bewertung);
                return acc;
            }, {});

            const filteredData = selectedAbteilungen.length > 0
                ? Object.keys(groupedData).filter(abteilung => selectedAbteilungen.includes(abteilung))
                : Object.keys(groupedData);

            const datasets = filteredData.map((abteilung) => ({
                label: abteilung,
                data: groupedData[abteilung].data,
                backgroundColor: getAbteilungColor(abteilung),
                borderColor: getAbteilungColor(abteilung),
                borderWidth: 1,
                fill: false,
            }));

            const ctx = $("#myChart")[0].getContext("2d");

            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: groupedData[filteredData[0]].labels,
                    datasets: datasets,
                },
                options: {
                    scales: {
                        x: {
                            min: startDate,
                            max: endDate,
                            ticks: {
                                autoSkip: false,
                            },
                            reverse: false,
                        },
                        y: {
                            min: 1,
                            max: 10,
                        },
                    },
                },
            });
        },
    });
}
  
  function populateAbteilungSelect() {
    $.ajax({
      url: "/api/ziele_historie",
      method: "GET",
      success: function (data) {
        const abteilungen = [...new Set(data.map(item => item.abteilung))];
        const select = $("#abteilung-select");
        select.empty();
        abteilungen.forEach(abteilung => {
          select.append(new Option(abteilung, abteilung));
        });
      },
    });
  }

//   populateAbteilungSelect();

// sets chart color at random
const colorMapping = {
    'Allgemein': 'rgba(0, 128, 0, 1)',
    'Geschäftsführung': 'rgba(255, 0, 0, 1)', 
    'Einkauf': 'rgba(144, 238, 144, 1)', 
    'Personal': 'rgba(0, 0, 255, 1)',  
    'Verkauf': 'rgba(255, 255, 0, 1)', 
    'Marketing': 'rgba(255, 0, 255, 1)',
    'ITP': 'rgba(173, 216, 230, 1)', 
    'Produktion': 'rgba(128, 0, 128, 1)'
};

function getAbteilungColor(abteilung) {
    return colorMapping[abteilung] || 'rgba(0, 0, 0, 1)';
}

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

//   $("#abteilung-select").change(updateChart);
//   updateChart();


//POST method to update ZIEL and add to history
function updateZiel(zielId, field, value, changedBy, comment) {
  const data = {
    [field]: value,
    author: changedBy,  
    kommentar: comment,
  };

  $.ajax({
    url: `/edit-ziel/${zielId}`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function (response) {
      alert(response.message);
    },
    error: function (xhr) {
      alert(`Fehler: ${xhr.responseJSON.message}`);
    },
  });
}

//Edit Ziel function
// $(document).ready(function () {
//   let currentRow;

//   $(".edit-btn").on("click", function () {
//     currentRow = $(this).closest("tr");
//     makeRowEditable(currentRow);
//     $("#save-btn").show();
//   });

//   $("#save-btn").on("click", function () {
//     saveChanges(currentRow);
//   });

//   function makeRowEditable(row) {
//     row.find(".editable").each(function () {
//       const cell = $(this);
//       const value = cell.text();
//       const input = $("<input>", {
//         type: "text",
//         value: value,
//       });
//       cell.html(input);
//     });
//   }

//   function saveChanges(row) {
//     const zielId = row.next(".ziel-id").find("td").text();
//     const data = {};

//     row.find(".editable").each(function () {
//       const cell = $(this);
//       const input = cell.find("input");
//       const field = cell.data("field");
//       data[field] = input.val();
//     });

//     // hier eigentlich eingeloggter user oder selbst user reinschreiben
//     data["author"] = row.find("td:nth-child(7)").text();

//     $.ajax({
//       url: `/edit-ziel/${zielId}`,
//       method: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(data),
//       success: function (response) {
//         row.find(".editable").each(function () {
//           const cell = $(this);
//           const field = cell.data("field");
//           cell.text(data[field]);
//         });
//         $("#save-btn").hide();
//       },
//       error: function (xhr) {
//         alert(
//           `Fehler: ${
//             xhr.responseJSON.message
//               ? xhr.responseJSON.message
//               : "Unbekannter Fehler"
//           }`
//         );
//       },
//     });
//   }

  // Delete functionality
//   $(".delete-btn").on("click", function () {
//     const row = $(this).closest("tr");
//     const zielId = row.next(".ziel-id").find("td").text();

//     if (confirm("Möchten Sie dieses Ziel wirklich löschen?")) {
//       $.ajax({
//         url: `/delete-ziel/${zielId}`,
//         method: "DELETE",
//         success: function (response) {
//           row.remove();
//         },
//         error: function (xhr) {
//           alert(
//             `Fehler: ${
//               xhr.responseJSON.message
//                 ? xhr.responseJSON.message
//                 : "Unbekannter Fehler"
//             }`
//           );
//         },
//       });
//     }
//   });
// });

// Abteilungsfilter
$(document).ready(function () {
  // keeping the colors after sorting
  function updateRowColors() {
    $("table tbody tr:visible").each(function (index) {
      $(this).removeClass("first-td-child second-td-child");
      if (index % 2 === 0) {
        $(this).addClass("first-td-child");
      } else {
        $(this).addClass("second-td-child");
      }
    });
  }

  $("#abteilung").change(function () {
    var selectedAbteilung = $(this).val();
    $("table tbody tr").each(function () {
      var abteilungZiel = $(this).find("#abteilungZiel").text();
      if (selectedAbteilung === "alle" || abteilungZiel === selectedAbteilung) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
    updateRowColors();
  });

  // Text search functionality
  $('#textsearch').on('input', function() {
    const searchText = $(this).val().toLowerCase();
    filterTable(searchText);
});

function filterTable(searchText) {
    $('tbody tr').each(function() {
        const row = $(this);
        const zielIdRow = row.next('.ziel-id');
        const zielId = zielIdRow.find('td').text();
        let match = false;

        row.find('td').each(function() {
            const cellText = $(this).text().toLowerCase();
            if (cellText.includes(searchText)) {
                match = true;
                return false; // Break the loop
            }
        });

        if (match) {
            row.show();
            zielIdRow.show();
        } else {
            row.hide();
            zielIdRow.hide();
        }
    });
}   

function updateRatingColors() {
    const colors = [
        "#ff0000", // 1 - Rot
        "#ff4000", // 2
        "#ff8000", // 3
        "#ffbf00", // 4
        "#ffff00", // 5 - Gelb
        "#bfff00", // 6
        "#80ff00", // 7
        "#40ff00", // 8
        "#00ff00", // 9
        "#00ff40"  // 10 - Grün
    ];

    $('td[data-field="bewertung"]').each(function () {
        const bewertung = parseInt($(this).text(), 10);
        if (bewertung >= 1 && bewertung <= 10) {
            $(this).css('background-color', colors[bewertung - 1]);
        }
    });
}

updateRatingColors();

$('#save-btn').on('click', function() {
    updateRatingColors();
});
});
