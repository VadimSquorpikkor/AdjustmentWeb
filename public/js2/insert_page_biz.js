function valueOf(id) {
    return document.getElementById(id).value
}

function updateDevSetSpinner() {
    devsetSpinnerAdapter.setDataObj(deviceSets);
}

function copySpinnerTo(field) {
    let name = devsetSpinnerAdapter.getSelectedId();
    let oldValue = document.getElementById(field).value;
    if (oldValue==="") document.getElementById(field).value = name;
    else document.getElementById(field).value = oldValue+"&"+name;
}

const devsetSpinner = document.getElementById('devset_spinner');
let devsetSpinnerAdapter = new SpinnerAdapter(devsetSpinner);

//----------------------------------------------------------------------------------------------------------------------

/**Загрузка новых устройств. Заполняет все поля в таблице устройств*/
function loadNewDevice(id, devset_id, ru, en) {
    if (!canInsertData) return;
    DBASE.collection(TABLE_DEVICES).doc(valueOf(id)).set({
        devset_id: valueOf(devset_id),
        img_path: "https://adjustmentdb.web.app/pics/" + valueOf(id) + ".png",
        name_en: valueOf(en),
        name_ru: valueOf(ru)
    }, { merge: true });
    alert("Устройство "+ru+" добавлено в БД");
}

/**Удаляет устройство из БД, также удаляет все события данного устройства*/
function deleteUnit(id) {
    if (!canInsertData) return;
    let unit_id = valueOf(id);
    if (unit_id !== "") {
        DBASE.collection(TABLE_UNITS).doc(unit_id).delete();
        DBASE.collection(TABLE_EVENTS).where('unit_id', "==", unit_id).get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                doc.ref.delete();
            });
        })
    }
    alert("Устройство "+id+" удалено из БД");
}

function clearInput(id1, id2, id3, id4) {
    document.getElementById(id1).value = "";
    document.getElementById(id2).value = "";
    document.getElementById(id3).value = "";
    document.getElementById(id4).value = "";
}