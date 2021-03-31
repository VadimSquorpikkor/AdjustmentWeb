/**
 * Лисенер для изменений юнитов БД. При изменении/добавлении юнитов в БД данные на странице автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_SERIALS)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            // const payload = {
            //     id: change.doc.id,
            //     data: change.doc.data(),
            // };
            getAllUnits()
        });
    });

/**
 * Лисенер для изменений юнитов БД. При изменении/добавлении юнитов в БД данные на странице автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_REPAIRS)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getAllRepairUnits()
        });
    });

/**
 * Лисенер для изменений списка статусов в БД. При изменении/добавлении статусов в БД данные в спиннере автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_PROFILES)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getAllStates(PROFILE_ADJUSTMENT, PROF_TYPE_SERIAL, 'serial_states_spinner');
            getAllStates(PROFILE_ADJUSTMENT, PROF_TYPE_REPAIR, 'repair_states_spinner');

        });
    });

/**
 * Лисенер для изменений списка имен устройств в БД. При изменении/добавлении статусов в БД данные в спиннере автоматически обновляются
 *  БЕЗ ПЕРЕЗАГРУЗКИ страницы
 */
DBASE.collection(TABLE_NAMES)
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data());
            getAllNames();
        });
    });