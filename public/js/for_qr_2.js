
const devicesForGenerator = document.getElementById('selected_type_for_generator');

let devicesForGeneratorAdapter = new SpinnerAdapter(devicesForGenerator);

listen_new(DBASE, TABLE_DEVICES, loadDevices2);


let devices = [];

function updateDeviceSpinner2() {
    devicesForGeneratorAdapter.setDataObj(devices);
    devicesForGeneratorAdapter.addFirstLineObj(new Device(null, "Ремонт", "Ремонт"));
}

function loadDevices2() {
    let dev_arr = [];
    DBASE.collection(TABLE_DEVICES)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let id = doc.data().id;
            let name_id = doc.data().name_id;
            let name_ru = doc.data().name_id;
            let device = new Device(id, name_id, name_ru);

            joinNamesRu2(name_id, device, updateDeviceSpinner2);

            dev_arr.push(device);
        });
        devices = dev_arr;
        updateDeviceSpinner();
    });
}

function joinNamesRu2(name_id, obj, func) {
    let docRef = DBASE.collection(TABLE_NAMES).doc(name_id);
    docRef.get().then((doc) => {
        if (doc.exists) {
            obj.setNameRu(doc.data().ru);
            func();
        }
    })
}