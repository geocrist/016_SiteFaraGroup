






//ARHIVA SESIUNI
// let sessionHistoryData = [
//     {
//         name: 'Vot pe Constitutie',
//         date: '23-04-2012',
//         vote_type: 'Impotriva'
//     },
//     {
//         name: 'Vot pe Legea Invatamantului 238/2002',
//         date: '3-12-2015',
//         vote_type: 'Returnare catre initiator'
//     },
//     {
//         name: 'Vot pe OUG 34/2003',
//         date: '17-01-2002',
//         vote_type: 'Aviz favorabil'
//     }
// ];

/*
function Get_Session_History_From_Server()
{
    let sessionHistoryData = [];
    axios({
        method: 'GET',
        url: 'http://localhost:3000/admin/api/v1.0/vote_history?page=1&limit=2'
    })
    .then(response => {
        console.log(response.data);
        //res.send('ok');
        //location.reload();
        sessionHistoryData = response.data;
        Session_History_Table(sessionHistoryData);
    })
    .catch();
}

window.onload = () => {
    Get_Session_History_From_Server(); 
}*/



// function Session_History_Table(sessionHistoryData) {
//     let dataHtml = '';
//     const myTable = document.getElementById('session-history-table');
//     const tableBody = document.getElementById('session-history-table-body');
//     const tableContainer = document.getElementById('session-history-table-container');

//     if(sessionHistoryData.length == 0)
//     {
//         //console.log(sessionHistoryData.length);
//         //console.log('ZERO date');
//         dataHtml += '<h2>Arhiva de sesiuni este goala</h2>';
//         tableContainer.innerHTML = dataHtml;

//         //document.getElementById('session-history-table-container').style.visibility = 'hidden';
//         myTable.style.visibility = 'hidden';
//         document.getElementById('pagination-container').style.visibility = 'hidden';
        
//     } else {
//         //console.log('Am date');

//     // var myTable = document.createElement('table');
//     // myTable.innerHTML = dataHtml;
//     // tableContainer.appendChild(myTable);


//         for(let sessionItem of sessionHistoryData) {
//             //let myDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(sessionItem.date);
//             dataHtml += `<tr><td>${sessionItem.vote_name}</td><td>${sessionItem.date}</td><td>${sessionItem.vote_type}</td><td>DA | NU | ABTINERE</td><td>Sterge</td></tr>`;
//             //console.log(dataHtml);
//         }
//         tableBody.innerHTML = dataHtml;
//     }
// }



//ADD USER
// document.getElementById('add-user-form').addEventListener("submit", (e) => {
//     e.preventDefault();
//     //console.log(document.getElementById('add-user-email').value);
//     axios({
//         method: 'POST',
//         url: 'http://localhost:3000/admin/api/v1.0/users',
//         data: { surname: document.getElementById('add-user-surname').value, name: document.getElementById('add-user-name').value, email: document.getElementById('add-user-email').value}
//     })
//     .then(response => {
//         console.log(response.data);
//     })
//     .catch();
// });
