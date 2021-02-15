/*##### ADD NEW USER #####*/
const surnameField = document.getElementById('add-user-surname');
const nameField = document.getElementById('add-user-name');
const emailField = document.getElementById('add-user-email');


function alertBox(message, messageType) {
    const alertMessage = document.querySelector('.alert');
    const alertText = alertMessage.querySelector('.alert-text');
    if(messageType === 'error') {
        alertMessage.style.backgroundColor = "red";
    }
    if(messageType === 'success') {
        alertMessage.style.backgroundColor = "green";
    }
    alertText.innerText = message;
    alertMessage.style.display = "flex";
}

document.getElementById("add-user-submit").addEventListener('click', e => {
    e.preventDefault();
            
    if(surnameField.value==='' || nameField.value==='' || emailField.value==='') {
        alertBox('Nu ati completat toate campurile', 'error');
    } else {
        const newUser = {
            surname: surnameField.value,
            name: nameField.value,
            email: emailField.value,
            hash: 'hhh',
            salt: 'sss',
            user_type: 'Client',
            active: true
        };

        fetch('http://localhost:3000/admin/api/v1.0/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        })
        .then(res => {
            res.json()
            .then( data => {
                //console.log(data);
                if(data.error)
                    alertBox(data.error, 'error');
                else {
                    alertBox(data.success, 'success');
                    surnameField.value = '';
                    nameField.value = '';
                    emailField.value = '';
                }
            })
            .catch();       
        })
        .catch();
    }
});
