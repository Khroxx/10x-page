$(document).ready(function () {

// if ziel has no history, alerts user and does not open history
    $(".history-link").on("click", function (event) {
        if ($(this).data("has-history") === "false") {
          event.preventDefault();
          alert("Dieses Ziel hat keine Historie.");
        }
      });

// edit ziel functionality
let currentRow;

$(".edit-btn").on("click", function () {
  currentRow = $(this).closest("tr");
  makeRowEditable(currentRow);
  $("#save-btn").show();
});

$("#save-btn").on("click", function () {
  saveChanges(currentRow);
});

function makeRowEditable(row) {
  row.find(".editable").each(function () {
    const cell = $(this);
    const value = cell.text();
    const input = $("<input>", {
      type: "text",
      value: value,
    });
    cell.html(input);
  });
}

    // save functionality
    function saveChanges(row) {
        const zielId = row.next('.ziel-id').find('td').text();
        const data = {};

        row.find('.editable').each(function() {
            const cell = $(this);
            const input = cell.find('input');
            const field = cell.data('field');
            data[field] = input.val();
        });

        $.ajax({
            url: `/edit-ziel/${zielId}`,
            method: 'POST', 
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                row.find('.editable').each(function() {
                    const cell = $(this);
                    const field = cell.data('field');
                    cell.text(data[field]);
                });
                $('#save-btn').hide();
            },
            error: function(xhr) {
              const errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Unbekannter Fehler';
              alert(`Fehler: ${errorMessage}`);
          }   
        });
    }

        // Delete functionality
        $('.delete-btn').on('click', function() {
            const row = $(this).closest('tr');
            const zielId = row.next('.ziel-id').find('td').text();
    
            if (confirm('Möchten Sie dieses Ziel wirklich löschen?')) {
                $.ajax({
                    url: `/delete-ziel/${zielId}`,
                    method: 'DELETE',
                    success: function(response) {
                        row.remove();
                    },
                    error: function(xhr) {
                        alert(`Fehler: ${xhr.responseJSON.message ? xhr.responseJSON.message : 'Unbekannter Fehler'}`);
                    }
                });
                updateRowColors();
            }
        });

        function updateRowColors() {
          $('table tbody tr').not('.ziel-id').each(function(index) {
              $(this).removeClass('first-td-child second-td-child');
              if (index % 2 === 0) {
                  $(this).addClass('first-td-child');
              } else {
                  $(this).addClass('second-td-child');
              }
          });
      }

      
});