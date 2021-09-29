const DBASE = firebase.firestore();
const TABLE_DEVSETS = "device_set";
const DEVSET_ID = "id";
const TABLE_NAMES = "names";

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

listen_new(DBASE, TABLE_DEVSETS, loadDevsets);

