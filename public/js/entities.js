class Location {

    /**
     *
     * @param id идентификатор локации
     * @param name_id идентификатор имени
     * @param name_ru имя для отображения (на русском)
     */
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

class Employee {

    /**
     *
     * @param id идентификатор сотрудника
     * @param name_id идентификатор имени
     * @param name_ru имя для отображения (на русском)
     * @param email
     * @param location
     */
    constructor(id, name_id, name_ru, email, location) {
        this._id = id;
        this._name_id = name_id;
        this._name_ru = name_ru;
        this._email = email;
        this._location = location;
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

    get getEmail() {
        return this._email;
    }

    get getLocation() {
        return this._location;
    }

    /**!Для JOIN обязательно нужно, чтобы в классе был такой метод!*/
    setNameRu(value) {
        this._name_ru = value;
    }
}

class State {

    /**
     *
     * @param id
     * @param name_id
     * @param name_ru
     * @param type
     * @param location
     */
    constructor(id, name_id, name_ru, type, location) {
        this._id = id;
        this._name_id = name_id;
        this._name_ru = name_ru;
        this._type = type;
        this._location = location;
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

    get getType() {
        return this._type;
    }

    get getLocation() {
        return this._location;
    }

    /**!Для JOIN обязательно нужно, чтобы в классе был такой метод!*/
    setNameRu(value) {
        this._name_ru = value;
    }
}

class Device {

    /**
     *
     * @param id идентификатор
     * @param name_id идентификатор имени
     * @param name_ru имя для отображения (на русском)
     */
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


/** Класс для устройства, или блока детектирования */
class DUnit {
    constructor(id, description, device_id, employee_id, inner_serial, location_id, serial, state_id, type_id, date, close_date) {
        this.id = id;
        this.description = description;
        this.device_id = device_id;
        this.employee_id = employee_id;
        this.inner_serial = inner_serial;
        this.location_id = (typeof location_id === 'undefined') ? null : location_id;//this.location_id = location_id;
        this.serial = serial;
        this.state_id = (typeof state_id === 'undefined') ? null : state_id;
        this.type_id = type_id;
        this.date = date;
        this.close_date = close_date;
    }

    toString() {
        return this.id + ', ' +
            this.description + ', ' +
            this.device_id + ', ' +
            this.employee_id + ', ' +
            this.inner_serial + ', ' +
            this.location_id + ', ' +
            this.serial + ', ' +
            this.state_id + ', ' +
            this.type_id + ', ' +
            this.date + ', ' +
            this.close_date;
    }
}

/** Firestore data converter. Нужен для загрузки из БД объекта класса DUnit */
let dUnitConverter = {
    toFirestore: function (dunit) {
        return {
            id: dunit.id,
            description: dunit.description,
            device_id: dunit.device_id,
            employee_id: dunit.employee_id,
            inner_serial: dunit.inner_serial,
            location_id: dunit.location_id,
            serial: dunit.serial,
            state_id: dunit.state_id,
            type_id: dunit.type_id,
            date: dunit.date,
            close_date: dunit.close_date
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DUnit(data.id, data.description, data.device_id, data.employee_id, data.inner_serial, data.location_id, data.serial, data.state_id, data.type_id, data.date, data.close_date);
    }
};

let dUnitConverterAll = {
    toFirestore: function (dunit) {
        return {
            id: dunit.id,
            description: dunit.description,
            device_id: dunit.device_id,
            employee_id: dunit.employee_id,
            inner_serial: dunit.inner_serial,
            location_id: dunit.location_id,
            serial: dunit.serial,
            state_id: dunit.state_id,
            type_id: dunit.type_id,
            date: dunit.date,
            close_date: dunit.close_date
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DUnit(data.id, data.description, data.device_id, data.employee_id, data.inner_serial, data.location_id, data.serial, data.state_id, data.type_id, data.date, data.close_date);
    }
};

/**Класс статусов. Содержит сам статус и его дату*/
class DEvent {
    constructor(date, description, location_id, state_id, unit_id) {
        this.date = date;
        this.description = description;
        this.location_id = location_id;
        this.state_id = state_id;
        this.unit_id = unit_id;
    }

    toString() {
        return this.date + ', ' +
            this.description + ', ' +
            this.location_id + ', ' +
            this.state_id + ', ' +
            this.unit_id;
    }
}

/** Firestore data converter. Нужен для загрузки из БД объекта класса dState */
let dEventConverter = {
    toFirestore: function (dEvent) {
        return {
            date: dEvent.date,
            description: dEvent.description,
            location_id: dEvent.location_id,
            state_id: dEvent.state_id,
            unit_id: dEvent.unit_id
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DEvent(data.date, data.description, data.location_id, data.state_id, data.unit_id);
    }
}
