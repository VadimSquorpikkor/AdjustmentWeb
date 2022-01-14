const DBASE = firebase.firestore();
const TABLE_DEVSETS = "device_set";
const DEVSET_ID = "id";
const TABLE_NAMES = "names";

errorField = document.getElementById("error_text");
console.log('errorField = '+errorField);

/**Массив комплектов*/
let devsets = [];


class Devset {
    constructor(id, name_id, name_ru) {
        this._id = id;
        this._name_id = name_id;
        this._name_ru = name_ru;
    }

    get getId() {
        return this._id;
    }
    get getNameId() {
        return this._name_id;
    }
    get getNameRu() {
        return this._name_ru;
    }
    /**!Для JOIN обязательно нужно, чтобы в классе был такой метод!*/
    setNameRu(value) {
        this._name_ru = value;
    }
}


function joinNamesRu(name_id, obj, func) {
    console.log(name_id);
    let docRef = DBASE.collection(TABLE_NAMES).doc(name_id);
    docRef.get().then((doc) => {
        if (doc.exists) {
            // console.log(doc.data().ru);
            obj.setNameRu(doc.data().ru);
            func();
        }
    });
}

//----------------------------------------------------------------------------------------------------------------------
function updateDevSetSpinner() {
    // console.log(devsets.length);
    devsetSpinnerAdapter.setDataObj(devsets);
}

function copySpinnerTo(field) {
    let name = devsetSpinnerAdapter.getSelectedNameId();
    let oldValue = document.getElementById(field).value;
    if (oldValue==="") document.getElementById(field).value = name;
    else document.getElementById(field).value = oldValue+"&"+name;
}

function loadDevsets() {
    let dev_arr = [];
    DBASE.collection(TABLE_DEVSETS)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let devset = new Devset(id,id,id);
            //joinNamesRu(id, devset, updateDevSetSpinner);
            dev_arr.push(devset);
        });
        devsets = dev_arr;
        updateDevSetSpinner();
    });
}

const devsetSpinner = document.getElementById('devset_spinner');

let devsetSpinnerAdapter = new SpinnerAdapter(devsetSpinner);

loadDevsets();
//listen_new(DBASE, TABLE_DEVSETS, loadDevsets);


/*--------------------------------------------------------------------------------------------------------------------*/

let db = firebase.firestore();
/**Загрузка в таблицу имен*/
function uploadNames(id, name_ru, name_en, name_it, name_de, name_fr) {
    if (!canInsertData) return;
    db.collection('names').doc(valueOf(id)).set({
        ru: valueOf(name_ru),
        en: valueOf(name_en),
        it: valueOf(name_it),
        de: valueOf(name_de),
        fr: valueOf(name_fr)
    }, { merge: true });

    if (valueOf(name_ru)!=="")db.collection('names').doc(valueOf(id)).set({ ru: valueOf(name_ru)}, { merge: true });
    if (valueOf(name_en)!=="")db.collection('names').doc(valueOf(id)).set({ en: valueOf(name_en)}, { merge: true });
    if (valueOf(name_it)!=="")db.collection('names').doc(valueOf(id)).set({ it: valueOf(name_it)}, { merge: true });
    if (valueOf(name_de)!=="")db.collection('names').doc(valueOf(id)).set({ de: valueOf(name_de)}, { merge: true });
    if (valueOf(name_fr)!=="")db.collection('names').doc(valueOf(id)).set({ fr: valueOf(name_fr)}, { merge: true });
}

/**Загрузка новых устройств. Заполняет все поля в таблице устройств и дополнительно прописывает в таблицу имен русский и английский вариант написания*/
function loadNewDevice(id, devset_id, ru, en) {
    if (!canInsertData) return;
    uploadNames(id, ru, en, "", "", "");

    db.collection('devices').doc(valueOf(id)).set({
        devset_id: valueOf(devset_id),
        id: valueOf(id),
        img_path: "https://adjustmentdb.web.app/pics/" + valueOf(id) + ".png",
        name_id: valueOf(id)
    }, { merge: true });

    db.collection('names').doc(valueOf(id)).set({
        ru: valueOf(ru),
        en: valueOf(id)
    }, { merge: true });
}

/**Удаляет устройство из БД, также удаляет все события данного устройства*/
function deleteUnit(id) {
    if (!canInsertData) return;
    // console.log(id);
    let unit_id = valueOf(id);
    if (unit_id !== "") {
        db.collection('units').doc(unit_id).delete();
        db.collection('events').where('unit_id', "==", unit_id).get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                doc.ref.delete();
            });
        })
    }
}

function clearInput(id1, id2, id3, id4, id5, id6) {
    document.getElementById(id1).value = "";
    document.getElementById(id2).value = "";
    document.getElementById(id3).value = "";
    document.getElementById(id4).value = "";
    document.getElementById(id5).value = "";
    document.getElementById(id6).value = "";
}