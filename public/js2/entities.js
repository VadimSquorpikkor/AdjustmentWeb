class Entity {
    /**
     * @param id идентификатор
     * @param name_ru имя на русском
     */
    constructor(id, name_ru) {
        this._id = id;
        this._name_ru = name_ru;
    }

    get getId() { return this._id;}
    get getNameRu() { return this._name_ru;}
}

class Location extends Entity{
    /**
     * @param id идентификатор локации
     * @param name_ru имя для отображения (на русском)
     */
    constructor(id, name_ru) {
        super(id, name_ru);
    }
}

class Employee extends Entity{
    /**
     * @param id идентификатор сотрудника
     * @param name_ru имя для отображения (на русском)
     * @param email
     * @param location
     */
    constructor(id, name_ru, email, location) {
        super(id, name_ru);
        this._email = email;
        this._location = location;
    }

    get getEmail() { return this._email; }
    get getLocation() { return this._location; }
}

class State extends Entity{
    /**
     * @param id
     * @param name_ru
     * @param type
     * @param location
     */
    constructor(id, name_ru, type, location) {
        super(id, name_ru);
        this._type = type;
        this._location = location;
    }

    get getType() { return this._type; }
    get getLocation() { return this._location; }
}

class Device extends Entity{
    /**
     * @param id идентификатор
     * @param name_ru имя для отображения (на русском)
     */
    constructor(id, name_ru, dev_set) {
        super(id, name_ru);
        this._dev_set = dev_set;
    }

    get dev_set() { return this._dev_set; }
}

class DeviceSet extends Entity{
    /**
     * @param id идентификатор
     * @param name_ru имя для отображения (на русском)
     */
    constructor(id, name_ru) {
        super(id, name_ru);
    }
}

/** Класс для устройства, или блока детектирования */
class Unit {
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
}

/**Класс статусов. Содержит сам статус и его дату*/
class Event {
    constructor(date, description, location_id, state_id, unit_id) {
        this.date = date;
        this.description = description;
        this.location_id = location_id;
        this.state_id = state_id;
        this.unit_id = unit_id;
    }
}
