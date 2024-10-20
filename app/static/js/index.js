// Table sorting and color cycling
$(document).ready(function() {
    let sortOrder = {
        0: 'asc',
        3: 'asc',
        5: 'asc'
    };

    function sortTable(columnIndex, dataType) {
        const rows = $('table tbody tr').not('.ziel-id').get();
        const order = sortOrder[columnIndex] === 'asc' ? 1 : -1;

        rows.sort(function(a, b) {
            const A = $(a).children('td').eq(columnIndex).text().toUpperCase();
            const B = $(b).children('td').eq(columnIndex).text().toUpperCase();

            if (dataType === 'number') {
                return (parseFloat(A) - parseFloat(B)) * order;
            } else if (dataType === 'date') {
                return (new Date(A) - new Date(B)) * order;
            } else {
                return A.localeCompare(B) * order;
            }
        });

        $.each(rows, function(index, row) {
            $('table').children('tbody').append(row);
        });

        // Toggle sort order
        sortOrder[columnIndex] = sortOrder[columnIndex] === 'asc' ? 'desc' : 'asc';
        updateRowColors();
    }

    // keeping the colors after sorting
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

    $('th').eq(0).on('click', function() {
        sortTable(0, 'string'); // Abteilung
    });

    $('th').eq(3).on('click', function() {
        sortTable(3, 'number'); // Bewertung
    });

    $('th').eq(5).on('click', function() {
        sortTable(5, 'date'); // zuletzt geändert
    });

    updateRowColors(); 
});

$(document).ready(function() {
    let currentRow;

    // Edit functionality
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
                alert(`Fehler: ${xhr.responseJSON.message ? xhr.responseJSON.message : 'Unbekannter Fehler'}`);
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

    // search functionality 
    $('input[type="search"]').on('input', function() {
        const searchAbteilung = $('#searchAbteilung').val().toLowerCase();
        const searchAussage = $('#searchAussage').val().toLowerCase();
        const searchKriterium = $('#searchKriterium').val().toLowerCase();
        const searchKommentar = $('#searchKommentar').val().toLowerCase();
        const searchAuthor = $('#searchAuthor').val().toLowerCase();
        const searchEinschätzung = $('#searchEinschätzung').val().toLowerCase();

        $('table tbody tr').not('.ziel-id').each(function() {
            const row = $(this);
            const abteilung = row.find('td').eq(0).text().toLowerCase();
            const aussage = row.find('td').eq(1).text().toLowerCase();
            const kriterium = row.find('td').eq(2).text().toLowerCase();
            const kommentar = row.find('td').eq(4).text().toLowerCase();
            const author = row.find('td').eq(6).text().toLowerCase();
            const einschätzung = row.find('td').eq(7).text().toLowerCase();

            const matchesAbteilung = abteilung.includes(searchAbteilung);
            const matchesAussage = aussage.includes(searchAussage);
            const matchesKriterium = kriterium.includes(searchKriterium);
            const matchesKommentar = kommentar.includes(searchKommentar);
            const matchesAuthor = author.includes(searchAuthor);
            const matchesEinschätzung = einschätzung.includes(searchEinschätzung);

            if ((searchAbteilung === '' || matchesAbteilung) &&
                (searchAussage === '' || matchesAussage) &&
                (searchKriterium === '' || matchesKriterium) &&
                (searchKommentar === '' || matchesKommentar) &&
                (searchAuthor === '' || matchesAuthor) &&
                (searchEinschätzung === '' || matchesEinschätzung)) {
                row.show();
            } else {
                row.hide();
            }
        });
    });
});