
const devicesForGenerator = document.getElementById('selected_type_for_generator');

let devicesForGeneratorAdapter = new SpinnerAdapter(devicesForGenerator);

listen_new(DBASE, TABLE_DEVICES, loadDevices);