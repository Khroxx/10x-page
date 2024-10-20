//Tabellensortieren
$(document).ready(function() {
    let sortOrder = {
        0: 'asc',
        3: 'asc',
        5: 'asc'
    };

    function sortTable(columnIndex, dataType) {
        const rows = $('table tbody tr').get();
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

        sortOrder[columnIndex] = sortOrder[columnIndex] === 'asc' ? 'desc' : 'asc';
        updateRowColors();
    }

    //um die abwechselnden Farben beizubehalten
    function updateRowColors() {
        $('table tbody tr').each(function(index) {
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