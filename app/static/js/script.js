// Um zwischen Chart und AKtuellen Zielen zu wechseln
document.addEventListener('DOMContentLoaded', function () {
    const tableView = document.getElementById('table-view');
    const chartView = document.getElementById('chart-view');
    let tableButton = document.getElementById('table-button');
    let chartButton = document.getElementById('chart-button');

    tableButton.addEventListener('click', function () {
        tableView.style.display = 'block';
        chartView.style.display = 'none';
    });

    chartButton.addEventListener('click', function () {
        tableView.style.display = 'none';
        chartView.style.display = 'block';
    });
});

//Tabellensortieren
document.addEventListener('DOMContentLoaded', function () {
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr));
    })));
});