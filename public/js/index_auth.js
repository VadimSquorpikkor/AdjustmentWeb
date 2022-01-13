//////latest version of firestore.rules already up to date, skipping upload

uiVisible(false);

function getPassword(input) {
    input.type = "text";
    let value = input.value;
    input.type = "password";
    return value;
}

function showError(error) {
    document.getElementById("error_text").style.display = 'block';
    document.getElementById("error_text").innerHTML = error;
}

document.getElementById("sign_in").onclick = function () {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;
    console.log('email = '+email+' | pass = '+pass);
    firebase.auth().signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            console.log("...signedIn");
            // Signed in
            let user = userCredential.user;
            // ...
        })
        .catch((error) => {
            console.log("...signedInError");
            console.log(error.code);
            console.log(error.message);
            showError(error.message);
            let errorCode = error.code;
            let errorMessage = error.message;
        });
}

/**SignOut по клику по кнопке*/
document.getElementById("sign_out").onclick = function () {
    document.getElementById("error_text").style.display = 'none';
    firebase.auth().signOut().then(function() {
        console.log('signed Out...');
    }, function(error) {
        console.error('Sign Out Error...', error);
    });
};

let accEmail;
/**Слушает состояние авторизации и выводит в консоль статус. Включает/отключает отображение элементов UI*/
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log(uid);
        ////console.log(user.email);
        //document.getElementById('input_form').style.display = 'block';
        document.getElementById('employee_name').innerHTML = "Пользователь "+user.email;
        uiVisible(true);
        // console.log('user.email - '+user.email);
        // accEmail = user.email;
    } else {
        // User is signed out
        console.log("...LogOut");
        //document.getElementById('input_form').style.display = 'none';
        uiVisible(false);
    }
});

function uiVisible(isSigned) {
    if (isSigned) {
        document.getElementById('input_form').style.display = 'block';
        document.getElementById('link_div').style.display = 'block';
        document.getElementById('sign_in').style.display = 'none';
        document.getElementById('email').style.display = 'none';
        document.getElementById('pass').style.display = 'none';
        document.getElementById('sign_out').style.display = 'inline-block';
        document.getElementById('employee_name').style.display = 'inline-block';
        // if (accEmail==='admin@admin.com'&&document.getElementById('admin_input_form')!==null) document.getElementById('admin_input_form').style.display = 'block';
        getSecureKey();
    } else {
        document.getElementById('input_form').style.display = 'none';
        document.getElementById('link_div').style.display = 'none';
        document.getElementById('sign_in').style.display = 'inline-block';
        document.getElementById('email').style.display = 'inline-block';
        document.getElementById('pass').style.display = 'inline-block';
        document.getElementById('sign_out').style.display = 'none';
        document.getElementById('employee_name').style.display = 'none';
        // if (document.getElementById('admin_input_form')!==null)document.getElementById('admin_input_form').style.display = 'none';
        eraseSecureKey();
    }

}