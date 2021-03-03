
function load() {
    const db = firebase.firestore();
    db.collection("units").doc("3509_98765").set({
        innerSerial: "98765",
        name: "3509",
        serial: "55555",
        state: "На сборке"
    });
}

function insertSpinner() {
    document.getElementById('spinner').innerHTML = ''+
        '   <select id="ra_spinner" onchange="nothing()">'+
        '                    <option value="1">БДКГ-02</option>'+
        '                    <option value="2">БДПА-01</option>'+
        '                    <option value="3">БДМГ-2327</option>'+
        '                </select>'
}

function nothing() {

}

function addDataRowToPage(arr) {
    let data = '<tr>'+
        '<th>Имя</th>' +
        '<th>Внутренний номер</th>' +
        '<th>Серийный</th>' +
        '<th>Статус</th>' +
        '</tr>';
    let unit;
    for (let i = 0; i < arr.length; i++) {
        unit = arr[i];
        // data += unit.name + ' ' + unit.innerSerial + ' ' + unit.serial + ' ' + unit.state + '<br>';
        data += '<tr>'+
                '<td>'+ unit.name +'</td>' +
                '<td>'+ unit.innerSerial +'</td>' +
                '<td>'+ unit.serial +'</td>' +
                '<td>'+ unit.state +'</td>' +
                '</tr>';
    }
    // document.getElementById('output_a').innerHTML = '' + data;
    document.getElementById('row_table').innerHTML = '' + data;
}


