/*##### UPDATE EXISTING USER #####*/
const surnameField = document.getElementById('edit-user-surname');
const nameField = document.getElementById('edit-user-name');
const emailField = document.getElementById('edit-user-email');
const _id = document.getElementById('edit-user-id').value;

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

//document.getElementById('edit-user-form').addEventListener('click', e => {
    //document.getElementById('edit-user-form').addEventListener('load', e => {

document.getElementById('edit-user-submit').addEventListener('click', e => {
    e.preventDefault();    

    if(surnameField.value==='' || nameField.value==='' || emailField.value==='') {
        alertBox('Nu ati completat toate campurile', 'error');
    } else {
        const editedUser = {
            surname: surnameField.value,
            name: nameField.value,
            email: emailField.value
        };
            fetch(`${window.location.origin}/admin/api/v1.0/users/${_id}`, {
            //fetch(`http://localhost:3000/admin/api/v1.0/users/${_id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(editedUser)
            })
            .then(res => {
                res.json()
                .then( data => {
                    //console.log(data);
                    if(data.error)
                        alertBox(data.error, 'error');
                    else {
                        alertBox(data.success, 'success');
                    }
                })
                .catch();       
            })
            .catch();
    }

});

