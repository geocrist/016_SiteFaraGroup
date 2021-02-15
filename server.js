const express           = require('express');
const app               = express();
const http              = require('http').createServer(app);
const io                = require('socket.io')(http);
const path              = require('path');
const dotenv            = require('dotenv');
const session           = require('express-session');
const mongoose          = require('mongoose');
const MongoStore        = require('connect-mongo')(session);
const passport          = require('passport');
const connectDB         = require('./server/database/connection');
//const dbConnection    = require('./server/database/connection');
var Userdb              = require('./server/model/model').Userdb;
const VoteHistorydb     = require('./server/model/model').VoteHistorydb;

dotenv.config({path: 'config.env'});
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
app.use('/img', express.static(path.resolve(__dirname, 'assets/img')));
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));


const sessionStore = new MongoStore({mongooseConnection: mongoose.connection, collection: 'session'});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 24 * 60 * 60 //1 zi
    }
}));


require('./server/services/passport');
app.use(passport.initialize());
app.use(passport.session());


app.use('/', require('./server/routes/router'));

// globalVoteSession = {
//     active: true,
//     name: '',
//     type: '',
//     clients: []
// };
var globalVoteSession = {
    active: false,
    name: '',
    type: '',
    clients: []
};

//conectare client
io.on('connection', socket => {
    console.log('New WS connection...');
    //io.emit('message_from_server', globalVoteSession);

    //io.emit();    //catre toata lumea
    //socket.emit('message', formatMessage(botName, 'welcome!')); //catre un singur client
    //socket.broadcast.emit('message', formatMessage(botName, 'S-a conectat un utilizator'));    //catre toti cu exceptia celui care se conecteaza

    socket.on('disconnect', () =>{
        //io.emit('message', formatMessage(botName, 'Un utilizator a parasit chat-ul'));
        //io.emit('message', 'Un utilizator a parasit chat-ul');
        console.log('Un utilizator s-a deconectat...');
    });

    socket.on('adminClientInit', (_id) =>{
        console.log('CINEVA cere initializarea');
        // if(_id) {   //primesc id-ul votantului

        // }
        socket.emit('serverMessage', globalVoteSession);
        console.log(globalVoteSession);
    });



    socket.on('adminMessage', messageFromAdmin => {
        console.log('MESSAGE FROM ADMIN:');////////////////
        console.log(messageFromAdmin);////////////////


        if(messageFromAdmin.active === false) {
            //console.log('LOCAL SESSION STATUS:');////////////////
            //console.log(globalVoteSession);////////////////
            //salvez sesiunea
            
            const condicaToSave = [];
            globalVoteSession.clients.forEach( client => {
                //console.log('>>>>>>>>');////////
                //console.log(client);//////////
                const condicaClient = {};
                condicaClient.client_surname = client.surname;
                condicaClient.client_name = client.name;
                condicaClient.client_status = client.vote;
                condicaToSave.push(condicaClient);
            });


            var sessionName;    //daca nu introduce Adminul nimic
            if(!globalVoteSession.name) {
                sessionName = 'Denumirea sesiunii'
            } else { sessionName = globalVoteSession.name};   

            const createdVoteHistory = new VoteHistorydb ({              
                name: sessionName,
                type: globalVoteSession.type,               
                condica: condicaToSave
            });
        
            createdVoteHistory.save()
            .then(newVoteHistory => {
                console.log({success: `Sesiunea ${newVoteHistory.name} a fost salvata cu succes`});
            })
            .catch(err => {
                console.log({error: err.message || 'Eroare interna la salvarea unei noi sesiuni in DB'});
            }); 


            globalVoteSession.active = false;
            globalVoteSession.clients = [];
            console.log('OPRESC SESIUNEA >>>');///////////
            console.log(globalVoteSession.active);///////////////

            io.emit('serverMessage', globalVoteSession);
        } else {           
            Userdb.find()
            .then(allUsers => {
                const usersFull = [];
                allUsers.forEach(user => {
                    user.vote = 'DISCONNECTED';
                    if(user.user_type !== 'Admin') {
                        usersFull.push(user);
                    }
                });
                const users = usersFull.map(user => { return {_id: user._id, surname: user.surname, name: user.name, vote: user.vote}; });                
   
                globalVoteSession = null;
                globalVoteSession = JSON.parse(JSON.stringify(messageFromAdmin));
                globalVoteSession.clients = JSON.parse(JSON.stringify(users));

                 //console.log('>>>USERS');
                 //console.log(users);
                //console.log('>>>GLOBAL-SES');
                //console.log(globalVoteSession);

                globalVoteSession.active = true;
                console.log('PORNESC SESIUNEA >>>');  ///////////////////      
                console.log(globalVoteSession.active); ///////////////////  

                io.emit('serverMessage', globalVoteSession);
            })
            .catch(err => {
                console.log(err.message);
            }); 


     
        }
    });

   socket.on('clientMessage', messageFromClient => {
        globalVoteSession.clients.forEach(client => {
            if(client._id === messageFromClient._id) {
                client.vote = messageFromClient.vote;
            }  
        });     

         io.emit('serverMessage', globalVoteSession);
         //console.log(messageFromClient._id + '->' + messageFromClient.vote);
         console.log(globalVoteSession);
    });






});



// app.listen(3000, (req, res) => {
//     console.log('Server started on port 3000');
// });
http.listen(3000, (req, res) => {
    console.log('Server started on port 3000');
});
