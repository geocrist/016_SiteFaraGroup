const express               = require('express');
const route                 = express.Router();
const controller            = require('../controller/users_controller');
const vote_hist_controller  = require('../controller/vote_hist_controller');
const services              = require('../services/services');
const passport              = require('passport');
const clientAdminRedirect   = require('../services/password_utils').clientAdminRedirect;
//var Userdb                  = require('../model/model').Userdb;
const isAuth                = require('../services/password_utils').isAuth;


// function myFunc(req, res, next) {
//     //console.log(req.session);
//     console.log(req.user);
//     next();
// }



//LOGIN
route.get('/', (req, res) => {
    res.render('login');
});

route.post('/', passport.authenticate('local', {successRedirect: '/success', failureRedirect: '/error'}));
//route.post('/', passport.authenticate('local'), clientAdminRedirect);

route.get('/error', (req, res) => {
    res.redirect('/');
});
route.get('/success', clientAdminRedirect);


route.get('/logout', (req, res) => {
    //console.log('Logout');  ////////////////////
    req.logout();
    res.redirect('/');
});




//rute ADMIN
route.get('/admin/users/users', isAuth, services.Display_Users);    //afiseaza tabelul cu useri
route.get('/admin/users/add_user', isAuth, services.Add_User);  //afiseaza formularul de adaugare
route.get('/admin/users/edit_user/:_id', isAuth, services.Edit_User);    //afiseaza formularul de editare
route.get('/admin/vote', isAuth, services.Admin_Vote);  //afiseaza consola de vot
route.get('/admin/vote_history/vote_history', isAuth, services.Home_Vote_History);  //afiseaza istoricul sesiunilor de vot


//rute CLIENT
route.get('/client', isAuth, (req, res) => {
    res.render('client/client', {connectedUser: req.user});
    //res.sendFile(__dirname + '/client.html');
});


//API
route.get('/admin/api/v1.0/users', controller.Get_Users);
route.post('/admin/api/v1.0/users', controller.Add_User);
route.patch('/admin/api/v1.0/users/:_id', controller.Update_User);
route.delete('/admin/api/v1.0/users/:_id', controller.Delete_User);

route.get('/admin/api/v1.0/vote_history/:_id', vote_hist_controller.Get_Vote_History_One);
route.get('/admin/api/v1.0/vote_history', vote_hist_controller.Get_Vote_History);
route.post('/admin/api/v1.0/vote_history', vote_hist_controller.Add_Vote_History);
route.delete('/admin/api/v1.0/vote_history/:_id', vote_hist_controller.Delete_Vote_History);


module.exports = route;