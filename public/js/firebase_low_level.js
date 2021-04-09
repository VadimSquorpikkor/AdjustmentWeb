/**Низкоуровневые методы для работы с БД. Приложение не работает с этими методами напрямую, а использует промежуточный класс (firebaseHelper).
 * Методы ничего не знают про приложение, не знают как называется БД и из каких таблиц (коллекций) состоит. Само приложение не в курсе, как работать с БД,
 * общается через firebaseHelper. Полная инкапсуляция. Надо будет ещё как-то с лисенерами разобраться, пока выбиваются из картинки. */

/**Получить все объекты из коллекции*/
function getAll(database, table, converter, func) {
    let obj;
    let arr = [];
    database.collection(table).withConverter(converter)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });
        func(arr);
    });
}

/**Получить все объекты из коллекции, совпадающие по одному параметру*/
function getAllByOneParam(database, table, converter, param, value, func) {
    let obj;
    let arr = [];
    database.collection(table).withConverter(converter)
        .where(param, "==", value)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });
        func(arr);
    });
}

/**Получить все объекты из коллекции, совпадающие по одному параметру*/
function getAllByOneParamOrdered(database, table, converter, param, value, func, obj, orderBy) {
    let dState;
    let arr = [];
    database.collection(table)
        .withConverter(converter)
        .where(param, "==", value)
        .orderBy(orderBy)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            dState = doc.data();
            arr.push(dState);
        });
        console.log(arr.length);
        func(arr, obj);
    });
}

/**Получить все объекты из коллекции, совпадающие по двум параметрам*/
function getAllByTwoParam(database, table, converter, param_1, value_1, param_2, value_2, func) {
    let obj;
    let arr = [];
    database.collection(table).withConverter(converter)
        .where(param_1, "==", value_1)
        .where(param_2, "==", value_2)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });
        func(arr);
    });
}

/**Получить все объекты из коллекции, совпадающие по двум параметрам*/
function getAllByThreeParam(database, table, converter, param_1, value_1, param_2, value_2, param_3, value_3, func) {
    let obj;
    let arr = [];
    database.collection(table).withConverter(converter)
        .where(param_1, "==", value_1)
        .where(param_2, "==", value_2)
        .where(param_3, "==", value_3)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to object
            obj = doc.data();
            arr.push(obj);
        });
        func(arr);
    });
}

/**В отличии от getAll добавляет в массив не сам объект, а его параметр .name*/
function getAllObjectNames(database, table, func) {
    let arr = [];
    database.collection(table)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name);
        });
        func(arr);
    });
}

function getStatesInLocation(type, location, func) {
    let arr = [];
    DBASE.collection(TABLE_STATES)
        .where(STATE_LOCATION, "==", location)
        .where(STATE_TYPE, 'in', [TYPE_ANY, type])
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name);
        });
        func(arr);
    });
}

function getStates(type, func) {
    let arr = [];
    DBASE.collection(TABLE_STATES)
        .where(STATE_TYPE, 'in', [TYPE_ANY, type]) //или type или any_type
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            arr.push(doc.data().name);
        });
        func(arr);
    });
}


function valueOf(id) {
    return document.getElementById(id).value
}

const db = firebase.firestore();
/**Загрузка в БД из главной страницы (там всё закомментировано)*/

/*function loadStates(table, name, location, type, id) {
        db.collection('states').doc(valueOf(id)).set({
            name: valueOf(name),
            location_id: valueOf(location),
            type_id: valueOf(type),
            id: valueOf(id)
        });
}

function loadDevices(id, name, type) {
    db.collection('devices').doc(valueOf(id)).set({
        name: valueOf(name),
        type: valueOf(type),
        id: valueOf(id)
    });
}

function loadEmployees(id, name, email, location) {
    db.collection('employees').doc(valueOf(id)).set({
        id: valueOf(id),
        name: valueOf(name),
        email: valueOf(email),
        location_id: valueOf(location)
    });
}

function loadLocations(id, name) {
    db.collection('locations').doc(valueOf(id)).set({
        id: valueOf(id),
        name: valueOf(name)
    });
}*/
