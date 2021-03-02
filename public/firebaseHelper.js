const DBASE = firebase.firestore();
const TABLE = "units";

class DUnit {
    constructor(name, innerSerial, serial, state) {
        this.name = name;
        this.innerSerial = innerSerial;
        this.serial = serial;
        this.state = state;
    }

    toString() {
        return this.name + ', ' + this.innerSerial + ', ' + this.serial + ', ' + this.state;
    }
}

// Firestore data converter
var dUnitConverter = {
    toFirestore: function (dunit) {
        return {
            name: dunit.name,
            innerSerial: dunit.innerSerial,
            serial: dunit.serial,
            state: dunit.state
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new DUnit(data.name, data.innerSerial, data.serial, data.state);
    }
};

function getAllData() {
    let data = "";
    let unit;
    DBASE.collection(TABLE).withConverter(dUnitConverter)
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Convert to City object
            unit = doc.data();
            // data = data + doc.data() + '<br>'; //просто стринг без объекта
            data += unit.name + ' ' + unit.innerSerial + ' ' + unit.serial + ' ' + unit.state + '<br>';
        });
        document.getElementById('output_a').innerHTML = '' + data;
    });
}

function load() {
    DBASE.collection(TABLE).doc("3509_98765").set({
        innerSerial: "98765",
        name: "3509",
        serial: "55555",
        state: "На сборке"
    });
}


