function addTable() {    
    var myTableDiv = document.getElementById("session-history-table-container");
     
    var table = document.createElement('TABLE');
    //table.classList.add("table");
    table.className = "table";
    /////////////////
    var tableHead = document.createElement('THEAD');
    tableHead.className = "thead-dark";
    table.appendChild(tableHead);
    var tr = document.createElement('TR');
    tr.innerHTML = '<th>Denumire sesiune</th><th>Data</th><th>Tip vot</th><th>Comenzi</th>';
    tableHead.appendChild(tr);

////////////////////////////////
    fetch('http://localhost:3000/admin/api/v1.0/vote_history?page=1&limit=50', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
        res.json()
        .then( data => {
            console.log(data);
            // if(data.error)
            //     alert(data.error, 'error');
            // else {
            //     alert(data.success, 'success');
            // }


    //data.voteHistories
//console.log(data.voteHistories.length);

        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);

        for (var i=0; i<data.voteHistories.length; i++){
                var tr = document.createElement('TR');
                tableBody.appendChild(tr);
                
                var td = document.createElement('TD');  //nume
                td.appendChild(document.createTextNode(data.voteHistories[i].name));
                tr.appendChild(td);

                var td = document.createElement('TD');  //data
                td.appendChild(document.createTextNode(data.voteHistories[i].date));
                tr.appendChild(td);

                var td = document.createElement('TD');  //tip vot
                td.appendChild(document.createTextNode(data.voteHistories[i].type));
                tr.appendChild(td);

                var td = document.createElement('TD');  //comenzi
                var divButContainer = document.createElement('DIV');
                divButContainer.classList.add("d-flex");
                divButContainer.classList.add("justify-between");
                    var divDelete = document.createElement('DIV');
                    divDelete.className = "table-but";
                    divDelete.innerHTML = "&times";
                    divDelete.style.backgroundColor = "red";
                    divButContainer.appendChild(divDelete);

                    var divShow = document.createElement('DIV');
                    divShow.className = "table-but";
                    divShow.innerHTML = "ARATA";
                    divShow.style.backgroundColor = "green";
                    divButContainer.appendChild(divShow);                    
                
                    td.appendChild(divButContainer);
                    tr.appendChild(td);

            }



        })
        .catch();       
    })
    .catch();

  


    // var tableBody = document.createElement('TBODY');
    // table.appendChild(tableBody);
        
    // for (i=0; i<3; i++){
    //     var tr = document.createElement('TR');
    //     tableBody.appendChild(tr);
        
    //     for (var j=0; j<4; j++){
    //         var td = document.createElement('TD');
    //         td.width='75';
    //         td.appendChild(document.createTextNode("Cell " + i + "," + j));
    //         tr.appendChild(td);
    //     }
    // }
    myTableDiv.appendChild(table);
        
    }






document.getElementById('apply-filters-but').addEventListener('click', () => {
    //alert("sdfsd");
    //addTable();
});


var deleteButtons = document.getElementsByClassName('delete-button');
for(var i=0; i<deleteButtons.length; i++)
{
    if(deleteButtons[i].tagName == 'BUTTON')
        deleteButtons[i].addEventListener('click', deleteButCallback);   
}

function deleteButCallback()
{
    //console.log('click');
    
    //alert(this.);

    if(confirm('Doriti sa stergeti sesiunea selectata din baza de date?'))
    {
        fetch(`/admin/api/v1.0/vote_history/${this.id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => {
            res.json()
            .then( data => {
                //console.log(data);
                if(data.error)
                    alert(data.error);
                else {
                    alert(data.success);
                }
            })
            .catch();       
        })
        .catch();
    }
    location.reload();
}



var showButtons = document.getElementsByClassName('show-button');
for(var i=0; i<showButtons.length; i++)
{
    if(showButtons[i].tagName == 'BUTTON')
        showButtons[i].addEventListener('click', showButCallback);   
}

function showButCallback()
{
    //console.log('click');
    

    fetch(`/admin/api/v1.0/vote_history/${this.id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
        res.json()
        .then( data => {
            console.log(data);
            if(data.error)
                alert(data.error);
            else {
                //alert(data.success);

                let txt = '<b>Rezumat</b><br>';
                for(let i=0; i<data.condica.length; i++) {
                    txt += `${data.condica[i].client_surname.toUpperCase()} ${data.condica[i].client_name} -> ${data.condica[i].client_status}`;
                    txt += '<br>';
                }



                var divDetails = document.getElementById('session_history_detail');
                divDetails.innerHTML = txt;



                const reportName = 'raport.txt';
                var voteYES = 0;
                var voteNO = 0;
                var voteABSTAIN = 0;
                var voteNOVOTE = 0;
                
                const date = data.date;
                //const computedDate = date.toLocaleDateString("en-US", { day: 'numeric' }) + "/"+ date.toLocaleDateString("en-US", { month: 'short' }) + "/" + date.toLocaleDateString("en-US", { year: 'numeric' });
                
                
                var reportContent = `DENUMIREA SESIUNII: ${data.name}\r\nDATA: ${data.date}\r\n\r\n`;
//alert(date);

                //condica
                var condica = 'CONDICA\r\n';
                data.condica.forEach( client => {
                    condica += `${client.client_surname.toUpperCase()} ${client.client_name} -> ${client.client_status}\r\n`;
                    if(client.client_status === 'YES') { voteYES++; }
                    if(client.client_status === 'NO') { voteNO++; }
                    if(client.client_status === 'ABSTAIN') { voteABSTAIN++; }
                    if(client.client_status === 'NOVOTE') { voteNOVOTE++; }
                });
                reportContent += condica;
                reportContent += '\r\n';

                reportContent += `VOTURI DA: ${voteYES}\n\r`;
                reportContent += `VOTURI NU: ${voteNO}\n\r`;
                reportContent += `VOTURI ABTINERE: ${voteABSTAIN}\n\r`;
                reportContent += `PREZENTI, DAR FARA VOT: ${voteNOVOTE}\n\r`;


             





                const file = new Blob(
                    [reportContent], 
                    { type: 'text/plain' }
                );
                const fileURL = URL.createObjectURL(file);
                //const linkElement = document.createElement("a");
                const linkElement = document.getElementById('report-link');
                linkElement.setAttribute('href', fileURL);
                linkElement.setAttribute('download', reportName)
                //document.body.appendChild(linkElement);



            }
        })
        .catch();       
    })
    .catch();


 
    //location.reload();
}







