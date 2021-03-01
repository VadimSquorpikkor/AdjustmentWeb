/*document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    //console.log(app);
    const db = firebase.firestore();

    // const myPost = db.collection('units')



    db.collection("cities").doc("LA").set({
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
});*/

function load() {
    const db = firebase.firestore();
    db.collection("cities").doc("LA").set({
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    });
}
// db.collection("users").add({
//     first: "Alan",
//     middle: "Mathison",
//     last: "Turing",
//     born: 1912
// });
