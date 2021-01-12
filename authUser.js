//Under Construction

const dotenv        = require("dotenv");
dotenv.config({path: './.env'});
const mysql         = require("mysql");
const connection = mysql.createConnection({
    host        :   process.env.DATABASE_HOST,
    user        :   process.env.DATABASE_USER,
    password    :   process.env.DATABASE_PASS,
    database    :   process.env.DATABASE
});


function authUser(req, res, next){
    const { Email, Password } = req.body;
    console.log(Email);
    connection.query('SELECT * FROM login WHERE Email = ? AND Password = ?', [Email, Password], async (error, results, fields)=>
    {
        if(results.length > 0)
        {
            res.redirect('/home');

        }
        else
        {
             res.status(403)
            return res.send('Please Sign In');
        }
    });
    next();
}

function authRole(role){
    return (req, res, next) =>{
        const Email = req.params.Email;
        let position = (`SELECT Position FROM login where Email=${Email}`);
        if(position !== role)
        {
            console.log(position);
            res.status(401)
            return res.send('Not Allowed')
        }
        next();
    }
}

module.exports = {authUser, authRole}
