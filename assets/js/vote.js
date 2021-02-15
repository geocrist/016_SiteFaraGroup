const socket                = io();
const loadVoteNamesFile     = document.getElementById('load-file-vote-names');
const voteNamesTextArea     = document.getElementById('vote-names-text-area');
const voteName              = document.getElementById('vote-name');
const voteType              = document.getElementById('vote-type');
const buttonStartStop       = document.getElementById('vote-start-button');



const voteSession = {
    active: false,
    name: voteName.value,
    type: voteType.options[voteType.selectedIndex].text,
    clients: []
};  

let sessionStatusOn = false;



buttonStartStop.addEventListener('click', buttonStartStopCallBack);
function buttonStartStopCallBack() {
    var newSession = {
        active: false,
        name: '',
        type: ''
    };    
    
    if(sessionStatusOn === false) {
        sessionStatusOn = true;
  
        newSession.active = sessionStatusOn;
        newSession.name = voteName.value;
        newSession.type = voteType.options[voteType.selectedIndex].text;
        
        buttonStartStop.innerText = 'STOP'; 
        console.log('PORNESC o noua sesiune');
        console.log(`LOCAL >>> ${JSON.stringify(newSession)}`);            
    } else {
        sessionStatusOn = false;
    
        newSession.active = sessionStatusOn;
        newSession.name = voteName.value;
        newSession.type = voteType.options[voteType.selectedIndex].text;

        buttonStartStop.innerText = 'START';
        console.log('salvez datele si INCHID SESIUNEA');
        console.log(`LOCAL >>> ${JSON.stringify(newSession)}`);
    }
    socket.emit('adminMessage', newSession);
}

socket.on('serverMessage', voteSession => {
    //console.log('SERVER >>>');
    console.log(`SERVER >>> ${JSON.stringify(voteSession)}`);

    sessionStatusOn = voteSession.active;
    if(sessionStatusOn == true) {
        buttonStartStop.innerText = 'STOP';
    } else {
        buttonStartStop.innerText = 'START';
    }
    // var txt = document.createTextNode('dfgfg');
    // voteNamesTextArea.appendChild(txt);
    let totalVotes = 0;
    let votesYES = 0;
    let votesNO = 0;
    let votesABSTAIN = 0;
    let presentNOVOTE = 0;


     
        // if(voteSession.users){
        // voteSession.users.forEach(user => {
        //     txt += `${user.surname.toUpperCase()} user.name -> user.vote`;
        // });


        const rowsData = document.getElementsByClassName('votant-table-row');
        // for(var i=0; i<rowsData.length; i++) {
        //     rowsData[i].getElementsByClassName('votant-vote')[0].value = 'sdfsdf';                     
        // }

        if(voteSession.clients.length !== 0)
        {
            voteSession.clients.forEach(client => {
                //console.log(client._id);
                for(var j=0; j<rowsData.length; j++) {
                   if(rowsData[j].getElementsByClassName('votant-id')[0].value === client._id) {
                        rowsData[j].getElementsByClassName('votant-vote')[0].value = client.vote;
                   }
                }
            });
        }
        //console.log(voteSession);

 
});

socket.on('connect', () => {
    //alert('s-a conectat');
    socket.emit('adminClientInit', '');
});
