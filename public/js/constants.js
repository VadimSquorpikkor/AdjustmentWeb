/**Имя базы данных*/
const DBASE = firebase.firestore();
const TABLE_NAMES = "names";


const ALL_DEVICES = "Все устройства";
const ALL_STATES = "Все статусы";
const ALL_LOCATIONS = "Все локации";
const ALL_EMPLOYEES = "Все сотрудники";
const REPAIR_UNIT = "Ремонт";
const FOUND_NOTHING = "Ничего не найдено";

//Новые const для новой БД:
const TABLE_UNITS = "units";
const UNIT_DESCRIPTION = "description";
const UNIT_DEVICE = "device_id";
const UNIT_EMPLOYEE = "employee_id";
const UNIT_ID = "id";
const UNIT_INNER_SERIAL = "inner_serial";
const UNIT_LOCATION = "location_id";
const UNIT_SERIAL = "serial";
const UNIT_STATE = "state_id";
const UNIT_TYPE = "type_id";

const TABLE_STATES = "states"; //в прошлом profile
const STATE_LOCATION = "location_id";
const STATE_NAME = "name";
const STATE_TYPE = "type_id";

const TABLE_EVENTS = "events"; //в прошлом states
const EVENT_DATE = "date";
const EVENT_DESCRIPTION = "description";
const EVENT_LOCATION = "location_id";
const EVENT_STATE = "state_id";
const EVENT_UNIT = "unit_id";

const TABLE_EMPLOYEES = "employees"; //в прошлом users
const EMPLOYEE_EMAIL = "email"; //email нельзя использовать в качестве id, так как у пользователя может поменяться email, и тогда при необходимости выбрать устройства пользователя нужно будет искать и по старому email и по новому
const EMPLOYEE_ID = "id";
const EMPLOYEE_LOCATION = "location_id";
const EMPLOYEE_NAME = "name";

const TABLE_LOCATIONS = "locations";
const LOCATION_ID = "id";
const LOCATION_NAME = "name";

const TABLE_DEVICES = "devices";
const DEVICE_ID = "id";
const DEVICE_NAME = "name";
const DEVICE_TYPE = "type";

const TYPE_ANY = "any_type";
const TYPE_REPAIR = "repair_type";
const TYPE_SERIAL = "serial_type";

const SERIAL_TYPE = "serial_type";
const REPAIR_TYPE = "repair_type";

const ANY_VALUE = "any_value";
const STATE_PREF = "state_";
const DESCENDING = "desc";
