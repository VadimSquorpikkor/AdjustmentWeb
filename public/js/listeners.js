/**
 * Лисенер для изменений юнитов БД. При изменении/добавлении юнитов в БД данные на странице автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_UNITS)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            // const payload = {
            //     id: change.doc.id,
            //     data: change.doc.data(),
            // };
            getAllSerialUnits();
            getAllRepairUnits();
        });
    });

/**
 * Лисенер для изменений юнитов БД. При изменении/добавлении юнитов в БД данные на странице автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
/*DBASE.collection(TABLE_REPAIRS)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getAllRepairUnits()
        });
    });*/

/**
 * Лисенер для изменений списка статусов в БД. При изменении/добавлении статусов в БД данные в спиннере автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_STATES)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getAllStates(TYPE_SERIAL, 'serial_states_spinner');
            getAllStates(TYPE_REPAIR, 'repair_states_spinner');
        });
    });

/**
 * Лисенер для изменений списка имен устройств в БД. При изменении/добавлении статусов в БД данные в спиннере автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_DEVICES)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getAllDeviceNames();
        });
    });

/**
 * Лисенер для изменений списка локаций в БД. При изменении/добавлении локаций в БД данные автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_LOCATIONS)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getLocations();
        });
    });

/**
 * Лисенер для изменений списка сотрудников в БД. При изменении/добавлении сотрудников в БД данные автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_EMPLOYEES)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getEmployees();
        });
    });