
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



