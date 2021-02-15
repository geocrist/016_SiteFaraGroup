const bcrypt = require('bcrypt');
const crypto = require('crypto');

// async function generatePassword(password){
//     var salt = crypto.randomBytes(32).toString('hex');
//     var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

//     return{
//         salt: salt,
//         hash: genHash
//     };
// }

function generatePassword(password){
    var generatedSalt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, generatedSalt);
}

function validPassword(password, hash, salt){
    // var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    // return hash === hashVerify;
    var hashedPassword = bcrypt.hashSync(password, salt);
    return hash === hashedPassword;
}

function clientAdminRedirect(req, res) {
    //console.log('aaaaaaaaaa');    ///////////////
    if(req.isAuthenticated()) {
        if(req.user.user_type === 'Admin') {
            res.redirect('/admin/users/users');
        } else {
            res.redirect('/client');
        }
    } else {
        console.log(req.user.email);
        res.render('unauthorized', {email: req.user.email});
    }
}

function isAuth(req, res, next) {
    //console.log('isAuth');  ///////////////////
    //console.log(req.user);  ////////////
    
    if(req.isAuthenticated()) {
        next();
    } else {
        //console.log(req.user.email);
        res.status(401).send('<h1>Nu sunteti autorizat</h1> <a href="/">Inapoi la logare</a>');
    }

    // req.isAuthenticated()
    // .then(() => {
    //     next();
    // })
    // .catch(err => {
    //     res.status(401).send('<h1>Nu sunteti autorizat</h1> <a href="/">Inapoi la logare</a>');
    // });
}

module.exports = { generatePassword, validPassword, clientAdminRedirect, isAuth };
