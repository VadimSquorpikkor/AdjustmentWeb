function insertSpinnerByArray(name, arr) {
    if (document.getElementById(name) != null) {
        let code = '';
        for (let i = 0; i < arr.length; i++) {
            code += '<option value=' + (i + 1) + '>' + arr[i] + '</option>' //через цикл добавляется строка спиннера (option) вида: <option value="1">БДКГ-02</option>
        }
        document.getElementById(name).innerHTML = '   <select>' + code + '</select>'; //добавляем открывающий и закрывающий тэг и выводим всё в элемент по id
    }
}

function insertDevNames(/*arr_name, */arr_id) {
    // deviceNameList = arr_name;
    deviceIdList = arr_id;

    let arr2 = [];
    for (let i = 0; i < arr_id.length; i++) {
        arr2.push(arr_id[i]);
    }

    arr2.unshift(REPAIR_UNIT);//для selected_type_for_generator в начало списка добавляю 'Ремонт'
    insertSpinnerByArray('selected_type_for_generator', arr2);
}

let deviceIdList = [];
let deviceNameList = [];

function listen(database, table, func) {
    database.collection(table)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                console.log(change.doc.data());
                getPairedCollectionFromDB(table, function (arr_id/*, arr_name*/) {
                    func(/*arr_name, */arr_id); //Эта функция
                });
            });
        });
}

function getPairedCollectionFromDB(table, func) {
    let arr_id = [];
    // let arr_name = [];
    DBASE.collection(table)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr_id.push(doc.data().id);
            // arr_name.push(doc.data().name_ru);
        });
        func(arr_id/*, arr_name*/);
    });
}

/**Лисенер для списка имен устройств*/
listen(DBASE, TABLE_DEVICES, insertDevNames);