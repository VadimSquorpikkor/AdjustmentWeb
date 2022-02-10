


function getLocations() {
    locations = getAllLocationsFromFile();
    if (document.getElementById('location_spinner')!==null) updateLocationSpinner();
}

function getEmployees() {
    employees = getAllEmployeesFromFile();
    if (document.getElementById('employee_spinner')!==null) updateEmployeeSpinner();
}

function getStates() {
    states = getAllStatesFromFile();
    if (document.getElementById('states_spinner')!==null) updateStatesSpinner();
}

function getDevices() {
    console.log('*********getDevices')
    devices = getAllDevicesFromFile();
    if (document.getElementById('names_spinner')!==null) updateDeviceSpinner();
}

function getDeviceSets() {
    deviceSets = getAllDevSetsFromFile();
    if (document.getElementById('devset_spinner')!==null) updateDevSetSpinner();
}

function getUnits() {

}

function getEvents() {

}
