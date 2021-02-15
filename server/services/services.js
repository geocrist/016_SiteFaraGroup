const axios             = require('axios');
var Userdb              = require('../model/model').Userdb;
const VoteHistorydb     = require('../model/model').VoteHistorydb;
const controller        = require('../controller/users_controller');

exports.Display_Users = (req, res) => {
    //console.log('users home');
    axios.get('http://localhost:3000/admin/api/v1.0/users')
    .then(response => {
        res.render('admin/users/users', {users: response.data, connectedUser: req.user});
    })
    .catch();   
}


exports.Add_User = (req, res) => {
    res.render('admin/users/add_user'); 
}

exports.Edit_User = (req, res) => {
    //console.log('users home');
    //const _id = req.params._id;
    //console.log(req.params._id);
    Userdb.findById(req.params._id)
    .then(oneUser => {
        if(oneUser) {
            res.render('admin/users/edit_user', {user: oneUser}); 
        } else {
            res.status(404).send({error: 'Utilizatorul nu a fost gasit'});
        }
    })
    .catch(err => {
        res.status(500).send({error: err.message || 'Eroare interna la extragerea utilizatorilor din DB'});
    });

      
}



/*##### ARHIVA SESIUNI VOT #####*/
exports.Home_Vote_History = (req, res) => {
 
    VoteHistorydb.find()
    .then(allVoteHistories => {  
        res.render('admin/vote_history/vote_history', {connectedUser: req.user, sessions: allVoteHistories});
    })
    .catch(err => {
        res.status(500).send({error: err.message || 'Eroare interna la extragerea sesiunilor in DB'});
    });


    
 }



/*##### CONTROL VOT #####*/
exports.Admin_Vote = (req, res) => {

    Userdb.find()
    .then(allUsers => {
        res.render('admin/vote/vote', {users: allUsers, connectedUser: req.user});
    })
    .catch(err => {
        res.status(500).send({error: err.message || 'Eroare interna la extragerea utilizatorilor din DB'});
    });    
 }

