const VoteHistorydb = require('../model/model').VoteHistorydb;

exports.Get_Vote_History = (req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    
//console.log(req.query.page +'  '+req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    VoteHistorydb.find().skip(startIndex).limit(limit)
    .then(allVoteHistories => {
        //var result = {total: 45, ...data};
        //res.send(result);
        //SESSION_HISTORY_ITEMS_PER_PAGE
        const totalSessions = 3;
        const result = {};
        result.first = { page: 1, limit: limit };
        if(startIndex > 0) {
            result.previous = { page: page - 1, limit: limit };
        }

        result.voteHistories = allVoteHistories;
        
        if(startIndex < totalSessions) {
            result.next = { page: page + 1, limit: limit };
        }
        result.last = { page: Math.ceil(totalSessions / limit), limit: limit }; //trebuie modul
        
        res.json(result);
    })
    .catch(err => {
        res.status(500).send({error: err.message || 'Eroare interna la extragerea sesiunilor in DB'});
    });
}


exports.Get_Vote_History_One = (req, res) => {
        const _id = req.params._id;
        VoteHistorydb.findById(_id)
        .then(oneVoteHistory => {
            if(oneVoteHistory) {
                res.json(oneVoteHistory);
            } else {
                res.status(404).send({error: 'Sesiunea nu a fost gasita'});  
            }
        })
        .catch(err => {
            res.status(500).send({error: err.message || 'Eroare interna la extragerea sesiunii din DB'});
        }); 
    
}


exports.Add_Vote_History = (req, res) => {
       
    console.log(req.body);
    const createdVoteHistory = new VoteHistorydb ({
        name: req.body.name,
        type: req.body.type,
        date: req.body.date,
        condica: req.body.condica
    });

    createdVoteHistory.save()
    .then(newVoteHistory => {
        res.status(201).json({success: `Sesiunea ${newVoteHistory.name} a fost salvata cu succes`});
    })
    .catch(err => {
        res.status(400).send({error: err.message || 'Eroare interna la salvarea unei noi sesiuni in DB'});
    }); 
}

exports.Delete_Vote_History = (req, res) => {
    const _id = req.params._id;
    console.log(_id);
    VoteHistorydb.findByIdAndDelete(_id)
    .then(deletedVoteHistory => {
        if(deletedVoteHistory) {
            res.json({success: `Sesiunea ${deletedVoteHistory.name} a fost stearsa cu succes`});
        } else {
            res.status(400).send({error: 'Probabil ca sesiunea nu exista'});
        }
    })
    .catch(err => {
        res.status(500).send({error: err.message || 'Eroare interna la stergerea unei sesiuni din DB'});
    });
}