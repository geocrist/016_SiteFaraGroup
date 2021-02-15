var Userdb = require('../model/model').Userdb;
var VoteHistorydb = require('../model/model').VoteHistorydb;
const bcrypt = require('bcrypt');

exports.Login_POST =  (req, res) => {
    var alert_messages = [];

    //verific daca userul este in baza de date
    //console.log(req.body);

   if(req.body.email === '' || req.body.password === '') {
        alert_messages.push( {error: 'Nu au fost completate ambele campuri'} );
        res.render('login', {alert_messages}); 
   } else {
        Userdb.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                alert_messages.push( {error: 'Utilizator inexistent'} );
                res.render('login', {alert_messages}); 
            } else {
                //console.log(user.user_type);
                if(user.password !== req.body.password) {
                    alert_messages.push( {error: 'Parola gresita'} );
                    res.render('login', {alert_messages}); 
                } else {
                    if(user.user_type == 'Admin')
                        res.redirect('/admin/vote/');
                    else
                        res.redirect('/client/');  
                }

            
            }
        })
        .catch(err => {
            res.status(500).send({message: err.message || 'eroare la citirea DB'});
        });
   }
    


    
    //res.redirect('/admin/users/users');

}




exports.Get_Users = (req, res) => {  
    if(req.query._id)
    {
        const _id = req.query._id;
        Userdb.findById(_id)
        .then(oneUser => {
            if(oneUser) {
                res.json(oneUser);
            } else {
                res.status(404).send({error: 'Utilizatorul nu a fost gasit'});  //?????????? 
            }
        })
        .catch(err => {
            res.status(500).send({error: err.message || 'Eroare interna la extragerea utilizatorilor din DB'});
        }); 
    } else {
        Userdb.find()
        .then(allUsers => {
            res.json(allUsers);
        })
        .catch(err => {
            res.status(500).send({error: err.message || 'Eroare interna la extragerea utilizatorilor din DB'});
        }); 
    }
  
}

exports.Add_User = (req, res) => {
    //console.log(req.body);
    const generatedSalt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('12345678', generatedSalt);

    const createdUser = new Userdb ({
        surname: req.body.surname,
        name: req.body.name,
        email: req.body.email,
        hash: hashedPassword,
        salt: generatedSalt,
        user_type: 'Client',
        active: true
    });

    Userdb.findOne({email: req.body.email})
    .then(findUser => {
        //res.json(findUser);
        if(findUser) {
            res.json({error: 'Un utilizator cu aceasta adresa de email este deja inregistrat'});
        } else {
            createdUser.save()
            .then(newUser => {
                res.status(201).json({success: `Utilizatorul ${newUser.surname.toUpperCase()} ${newUser.name} a fost adaugat cu succes`});
            })
            .catch(err => {
                res.status(400).send({error: err.message || 'Eroare interna la crearea unui nou utilizator in DB'});
            }); 
        }
    })
    .catch(err => {
        res.status(500).send({error: err.message || 'Eroare interna la extragerea utilizatorilor din DB'});
    }); 


  
}

exports.Update_User = (req, res) => {
    //console.log(req.body);

    Userdb.findOne({_id: req.params._id})  //cauta user cu id primit
    .then(findUser => {
        Userdb.find({email: req.body.email})    //cauta userii cu noul email pe care-l doresc
        .then(findUsersSameEmail => {
            if((findUsersSameEmail.length === 0) || ((findUsersSameEmail.length === 1) && (findUsersSameEmail[0]._id.toString() === req.params._id))) {   //nu am alt user cu emailul pe care vreau sa-l schimb sau am un user dar este cel vizat                   
                Userdb.findByIdAndUpdate(req.params._id, req.body, {new: true})
                    .then(updatedUser => {
                        //res.json(updatedUser);
                        res.status(200).json({success: `Utilizatorul ${updatedUser.surname.toUpperCase()} ${updatedUser.name} a fost modificat cu succes`});
                    })
                    .catch(err => {
                        res.status(500).send({error: err.message || 'Eroare interna la modificarea utilizatorului din DB'});
                    });             
            } else {
                res.json({error: 'Un utilizator cu aceasta adresa de email este deja inregistrat'});
            }           
        })
        .catch(err => {
            res.status(500).send({error: err.message || 'Eroare interna la modificarea utilizatorului din DB'});
        });
    })
    .catch(err => {
        res.status(500).send({error: err.message || 'Eroare interna la modificarea utilizatorului din DB'});
    });
}
    
exports.Delete_User = (req, res) => {
    const _id = req.params._id;
    Userdb.findByIdAndDelete(_id)
    .then(deletedUser => {
        if(deletedUser) {
            res.json({success: `Utilizatorul ${deletedUser.surname.toUpperCase()} ${deletedUser.name} a fost sters cu succes`});
        } else {
            res.status(400).send({error: 'Probabil ca utilizatorul nu exista'});
        }
    })
    .catch(err => {
        res.status(500).send({error: err.message || 'Eroare interna la stergerea unui utilizator din DB'});
    });
}
