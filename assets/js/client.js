const socket                = io();
const clientDiv             = document.getElementById('client-container');
const clientSessionName     = document.getElementById('client-session-name');
const clientSessionType     = document.getElementById('client-session-type');
const statisticsYes         = document.getElementById('client-statistics-yes');
const statisticsNo          = document.getElementById('client-statistics-no');
const statisticsAbstain     = document.getElementById('client-statistics-abstain');
const statisticsNoVote      = document.getElementById('client-statistics-no-vote');
const statisticsContainer   = document.getElementById('client-statistics');
const clientId              = document.getElementById('client-id');
const buttonYes             = document.getElementById('client-vote-yes');
const buttonNo              = document.getElementById('client-vote-no');
const buttonAbstain         = document.getElementById('client-vote-abstain');
const buttonNoVote          = document.getElementById('client-vote-no-vote');
const voteButtonsContainer  = document.getElementById('client-vote-buttons');
const voteCountYes          = document.getElementById('cstat-vote-yes');
const voteCountNo           = document.getElementById('cstat-vote-no');
const voteCountAbstain      = document.getElementById('cstat-vote-abstain');
const voteCountNoVote       = document.getElementById('cstat-vote-no-vote');



function InitStatistics() {
    let voteYESpercent = 0;
    let voteNOpercent = 0;
    let voteABSTAINpercent = 0;
    let voteNOVOTEpercent = 0; 
    let voteYES = 0;
    let voteNO = 0;
    let voteABSTAIN = 0;
    let voteNOVOTE = 0; 
    let voteTotal = 0; 

    voteCountYes.innerText = voteYES.toString();
    voteCountNo.innerText = voteNO.toString();
    voteCountAbstain.innerText = voteABSTAIN.toString();
    voteCountNoVote.innerText = voteNOVOTE.toString();
    statisticsYes.style.width = (voteYESpercent + '%').toString();
    statisticsNo.style.width = (voteNOpercent + '%').toString();
    statisticsAbstain.style.width = (voteABSTAINpercent + '%').toString();
    statisticsNoVote.style.width = (voteNOVOTEpercent + '%').toString();
};

socket.on('connect', () => {   
    InitStatistics();
    socket.emit('adminClientInit', {_id: clientId.value});
});

//mesaj primit de la server
socket.on('serverMessage', voteSession => {
    //var txt = document.createTextNode(JSON.stringify(voteSession));
    //clientTextArea.appendChild(txt);
    
    if(voteSession.active === true)
    {
        let voteYESpercent = 0;
        let voteNOpercent = 0;
        let voteABSTAINpercent = 0;
        let voteNOVOTEpercent = 0; 
        let voteYES = 0;
        let voteNO = 0;
        let voteABSTAIN = 0;
        let voteNOVOTE = 0; 
        let voteTotal = 0; 

        buttonYes.innerText = 'Votez DA';
        buttonNo.innerText = 'Votez NU';
        buttonAbstain.innerText = 'Votez ABTINERE';
        buttonNoVote.innerText = 'Sunt prezent, dar NU VOTEZ';

        voteSession.clients.forEach(client => {
            if(client.vote === 'YES') {voteYES++;}
            if(client.vote === 'NO') {voteNO++;}
            if(client.vote === 'ABSTAIN') {voteABSTAIN++;}
            if(client.vote === 'NOVOTE') {voteNOVOTE++;}
            
            //console.log(client._id);
            if(client._id === clientId.value) {
                console.log('am gasit');
                if(client.vote === 'YES') {buttonYes.innerText = 'Votez DA - OK';}
                if(client.vote === 'NO') {buttonNo.innerText = 'Votez NU - OK';}
                if(client.vote === 'ABSTAIN') {buttonAbstain.innerText = 'Votez ABTINERE - OK';}
                if(client.vote === 'NOVOTE') {buttonNoVote.innerText = 'Sunt prezent, dar NU VOTEZ - OK';}
            }
        });
        voteTotal = voteYES + voteNO + voteABSTAIN + voteNOVOTE;
        voteYESpercent = voteYES / voteTotal * 100;
        voteNOpercent = voteNO / voteTotal * 100;
        voteABSTAINpercent = voteABSTAIN / voteTotal * 100;
        voteNOVOTEpercent = voteNOVOTE / voteTotal * 100;

        statisticsYes.style.width = (voteYESpercent + '%').toString();
        statisticsNo.style.width = (voteNOpercent + '%').toString();
        statisticsAbstain.style.width = (voteABSTAINpercent + '%').toString();
        statisticsNoVote.style.width = (voteNOVOTEpercent + '%').toString();

        voteCountYes.innerText = voteYES.toString();
        voteCountNo.innerText = voteNO.toString();
        voteCountAbstain.innerText = voteABSTAIN.toString();
        voteCountNoVote.innerText = voteNOVOTE.toString();

        clientSessionName.innerText = `Denumirea sesiunii: ${voteSession.name}`;
        clientSessionType.innerText = `Tipul votului: ${voteSession.type}`;

        clientSessionType.setAttribute("style", "display: block;");
        voteButtonsContainer.setAttribute("style", "display: grid;");
        statisticsContainer.setAttribute("style", "display: block;");
    } else {
        clientSessionName.innerText = `NU EXISTA SESIUNI DESCHISE`;
        clientSessionType.setAttribute("style", "display: none;");
        voteButtonsContainer.setAttribute("style", "display: none;");
        statisticsContainer.setAttribute("style", "display: none;");
    }
});


const voteYesButton = document.getElementById('client-vote-yes');
voteYesButton.addEventListener('click', butYesCallback);

const voteNoButton = document.getElementById('client-vote-no');
voteNoButton.addEventListener('click', butNoCallback);

const voteAbstainButton = document.getElementById('client-vote-abstain');
voteAbstainButton.addEventListener('click', butAbstainCallback);

const voteNoVoteButton = document.getElementById('client-vote-no-vote');
voteNoVoteButton.addEventListener('click', butNoVoteCallback);


function butYesCallback() {
    socket.emit('clientMessage', {_id: clientId.value, vote: 'YES'});
}
function butNoCallback() {
    socket.emit('clientMessage', {_id: clientId.value, vote: 'NO'});
}
function butAbstainCallback() {
    socket.emit('clientMessage', {_id: clientId.value, vote: 'ABSTAIN'});
}
function butNoVoteCallback() {
    socket.emit('clientMessage', {_id: clientId.value, vote: 'NOVOTE'});
}
