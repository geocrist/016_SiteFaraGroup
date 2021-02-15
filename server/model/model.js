const mongoose = require('mongoose');

var schema_user = new mongoose.Schema({
    surname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }   
});

var schema_group = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: Array
    }     
});

var schema_vote_history = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    condica:
    [
        {
        client_surname: String,
        client_name: String,
        client_status: String
        } 
    ]
});

const Userdb = mongoose.model('userdb', schema_user);
const Groupdb = mongoose.model('groupdb', schema_group);
const VoteHistorydb = mongoose.model('votehistorydb', schema_vote_history);
module.exports = { Userdb, Groupdb, VoteHistorydb };

 // module.exports = mongoose.model('Userdb', schema_user);
// module.exports = mongoose.model('VoteHistorydb', schema_vote_history);