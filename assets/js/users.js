var deleteButtons = document.getElementsByClassName('delete-button');


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

for(var i=0; i<deleteButtons.length; i++)
{
    if(deleteButtons[i].tagName == 'BUTTON')
        deleteButtons[i].addEventListener('click', deleteButCallback);
    
}


function deleteButCallback()
{
    //console.log('click');
    
    //alert(this.);
    //alert(window.location.href);
    //alert(window.location.origin);

    if(confirm('Doriti sa stergeti utilizatorul selectat din baza de date?'))
    {
        //const host = `${process.env.HOST}:${process.env.PORT}`;
        //fetch(`http://localhost:3000/admin/api/v1.0/users/${this.id}`, {
        fetch(`${window.location.origin}/admin/api/v1.0/users/${this.id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => {
            res.json()
            .then( data => {
                //console.log(data);
                if(data.error)
                    alert(data.error, 'error');
                else {
                    alert(data.success, 'success');
                }
            })
            .catch(err => {
                console.log(err);
            });       
        })
        .catch(err => {
            console.log(err);
        });
    }
    location.reload();
}