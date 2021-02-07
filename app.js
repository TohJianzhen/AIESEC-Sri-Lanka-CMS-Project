
const express       = require("express");
const session       = require("express-session");
const bodyParser    = require("body-parser");
const path          = require("path");
const ejsMate       = require("ejs-mate");
const mysql         = require("mysql");
const app           = express();
const dotenv        = require("dotenv");
const jwt           = require("jsonwebtoken");
const bcrypt        = require("bcryptjs");
var cors            = require("cors");

app.use(cors())

const {authUser, authRole}      = require("./authUser");

dotenv.config({path: './.env'});

const connection = mysql.createConnection({
    host        :   process.env.DATABASE_HOST,
    user        :   process.env.DATABASE_USER,
    password    :   process.env.DATABASE_PASS,
    database    :   process.env.DATABASE
});

connection.connect((err)=>{
    if(!!err) console.log(err);
    else console.log("Database Connected");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
        secret              : 'secret',
        resave              : true,
        saveUninitialized   : true
    }))

//Extract Data from the login form
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res)=>
{
    res.render('pages/signin');
});


app.post('/auth', (req, res)=>{
    const { Email, Password } = req.body;
    if(Email && Password)
    {
        connection.query('SELECT * FROM login WHERE Email = ? AND Password = ?', [Email, Password], async (error, results, fields)=>
        {
            if(results.length > 0)
            {
                req.session.loggedin    = true;
                req.session.Email       = Email;
                res.redirect('/home');

            }
            else
            {
                res.render('pages/signin');
            }
            res.end();

            
        });
    }
    else
    {
        res.send('Please enter Email & Password!');
        res.end();
    }
    
});


app.get('/home', (req, res)=>{
    if (req.session.loggedin) 
    {
        res.render('pages/home');
    } 
    else 
    {
        res.render('pages/signin');
    }
    res.end();
    
});

app.get('/customerManagement', (req, res)=>{
    if (req.session.loggedin)
    {
        let sql = "SELECT * FROM customermanagement";
        let query = connection.query(sql, (err, rows)=>{
            if(err) throw err;
            res.render('pages/customerManagement', {
                customermanagement  : rows
            });    
        });
    }
});

app.get('/crud/add', (req, res)=>{
    res.render('crud/add');
});

app.post('/customerSave', (req, res)=>{
    let data = {ID          : req.body.ID, 
                EmployeeID  : req.body.EmployeeID, 
                FirstName   : req.body.FirstName, 
                LastName    : req.body.LastName,
                email       : req.body.email,
                status      : req.body.status};
    let sql = "INSERT INTO customermanagement SET ?";
    let query = connection.query(sql, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/customerManagement');
    });
});

app.get('/crud/edit/:custID', (req, res)=>{
    const custID = parseInt(req.params.custID);
    let sql = `SELECT * FROM customermanagement where ID=${custID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.render('crud/edit', {customermanagement: result[0]
        });
    });
});

app.post('/customerUpdate', (req, res)=>{
    const custID = req.body.ID;
    let sql = "UPDATE customermanagement SET ID='"+req.body.ID+"', EmployeeID ='"+req.body.EmployeeID+"', FirstName='"+req.body.FirstName+"', LastName='"+req.body.LastName+"', email='"+req.body.email+"', status='"+req.body.status+"' WHERE ID="+custID;
    let query = connection.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect('/customerManagement');
    });
});

app.get('/crud/delete/:custID', (req, res)=>{
    const custID = parseInt(req.params.custID);
    let sql = `DELETE FROM customermanagement where ID=${custID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.redirect('/customerManagement');
    });
});

/****************************************************************************************************************************/ 
app.get('/brandManagement', (req, res)=>{
    let sql = "SELECT * FROM brandmanagement";
    let query = connection.query(sql, (err, rows)=>{
        if(err) throw err;
        res.render('pages/brandManagement', {
            brandmanagement  : rows
        });    
    });
});

app.get('/crud/addBrand', (req, res)=>{
    res.render('crud/addBrand');
});

app.post('/brandSave', (req, res)=>{
    let data = {BrandID    : req.body.BrandID, 
                BrandName  : req.body.BrandName, 
                ProductID  : req.body.ProductID, 
                Name       : req.body.Name,
                Price      : req.body.Price};
    let sql = "INSERT INTO brandmanagement SET ?";
    let query = connection.query(sql, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/brandManagement');
    });
});

app.get('/crud/editBrand/:BrandID', (req, res)=>{
    const BrandID = parseInt(req.params.BrandID);
    let sql = `SELECT * FROM brandmanagement where BrandID=${BrandID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.render('crud/editBrand', {brandmanagement: result[0]
        });
    });
});

app.post('/brandUpdate', (req, res)=>{
    const BrandID = req.body.BrandID;
    let sql = "UPDATE brandmanagement SET BrandID='"+req.body.BrandID+"', BrandName ='"+req.body.BrandName+"', ProductID='"+req.body.ProductID+"', Name='"+req.body.Name+"', Price='"+req.body.Price+"' WHERE BrandID="+BrandID;
    let query = connection.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect('/brandManagement');
    });
});

app.get('/crud/deleteBrand/:ID', (req, res)=>{
    const ID = parseInt(req.params.ID);
    let sql = `DELETE FROM brandmanagement where BrandID=${ID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.redirect('/brandManagement');
    });
});

/****************************************************************************************************************************/ 
app.get('/adminInventory', authRole(0), (req, res)=>{
    let sql = "SELECT * FROM admininventory";
    let query = connection.query(sql, (err, rows)=>{
        if(err) throw err;
        res.render('pages/admininventory', {
            admininventory  : rows
        });    
    });
});

app.get('/crud/addInventoryA', authRole(0), (req, res)=>{
    res.render('crud/addInventoryA');
});

app.post('/inventoryASave', (req, res)=>{
    let data = {ID    : req.body.ID, 
                Name  : req.body.Name,};
    let sql = "INSERT INTO admininventory SET ?";
    let query = connection.query(sql, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/adminInventory');
    });
});

app.get('/crud/editInventoryA/:ID', authRole(0), (req, res)=>{
    const ID = parseInt(req.params.ID);
    let sql = `SELECT * FROM admininventory where ID=${ID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.render('crud/editInventoryA', {admininventory: result[0]
        });
    });
});

app.post('/inventoryAUpdate', (req, res)=>{
    const inventoryAID = parseInt(req.body.ID);
    let sql = "UPDATE admininventory SET ID='"+req.body.ID+"', Name='"+req.body.Name+"' WHERE ID="+inventoryAID;
    let query = connection.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect('/adminInventory');
    });
});

app.get('/crud/deleteInventoryA/:ID', authRole(0), (req, res)=>{
    const ID = parseInt(req.params.ID);
    let sql = `DELETE FROM admininventory where ID=${ID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.redirect('/adminInventory');
    });
});

/****************************************************************************************************************************/ 
app.get('/managerInventory', (req, res)=>{
    let sql = "SELECT * FROM managerinventory";
    let query = connection.query(sql, (err, rows)=>{
        if(err) throw err;
        res.render('pages/managerinventory', {
            managerinventory  : rows
        });    
    });
});

app.get('/crud/addInventoryM', authRole(1), (req, res)=>{
    res.render('crud/addInventoryM');
});

app.post('/inventoryMSave', (req, res)=>{
    let data = {ID              : req.body.ID, 
                InventoryID     : req.body.InventoryID,
                ProductID       : req.body.ProductID,
                PurchasePrice   : req.body.PurchasePrice,
                SellingPrice    : req.body.SellingPrice,
                Quantity        : req.body.Quantity};
    let sql = "INSERT INTO managerinventory SET ?";
    let query = connection.query(sql, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/managerInventory');
    });
});

app.get('/crud/editInventoryM/:ID', authRole(1), (req, res)=>{
    const ID = parseInt(req.params.ID);
    let sql = `SELECT * FROM managerinventory where ID=${ID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.render('crud/editInventoryM', {managerinventory: result[0]
        });
    });
});

app.post('/inventoryMUpdate', (req, res)=>{
    const inventoryMID = parseInt(req.body.ID);
    let sql = "UPDATE managerinventory SET ID='"+req.body.ID+"', InventoryID='"+req.body.InventoryID+"', ProductID='"+req.body.ProductID+"', PurchasePrice='"+req.body.PurchasePrice+"', SellingPrice='"+req.body.SellingPrice+"', Quantity='"+req.body.Quantity+"' WHERE ID="+inventoryMID;
    let query = connection.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect('/managerInventory');
    });
});

app.get('/crud/deleteInventoryM/:ID', authRole(1), (req, res)=>{
    const ID = parseInt(req.params.ID);
    let sql = `DELETE FROM managerinventory where ID=${ID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.redirect('/managerInventory');
    });
});

app.get('/purchaseTracking', (req, res)=>{
        let sql = "SELECT * FROM purchase";
        let query = connection.query(sql, (err, rows)=>{
            if(err) throw err;
            res.render('pages/purchaseTracking', {
                purchase  : rows
            });    
        });
});

app.get('/crud/addPurchase', (req, res)=>{
    res.render('crud/addPurchase');
});

app.post('/purchaseSave', (req, res)=>{
    let data = {ID              : req.body.ID, 
                InventoryID     : req.body.InventoryID,
                ProductID       : req.body.ProductID,
                PurchaseID      : req.body.PurchaseID,
                PurchasePrice   : req.body.PurchasePrice,
                Quantity        : req.body.Quantity,
                Supplier        : req.body.Supplier,
                BillDiscount    : req.body.BillDiscount};
    let sql = "INSERT INTO purchase SET ?";
    let query = connection.query(sql, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/purchaseTracking');
    });
});

/****************************************************************************************************************************/ 

app.get('/salesTracking', (req, res)=>{
    if (req.session.loggedin)
    {
        let sql = "SELECT * FROM salestracking";
        let query = connection.query(sql, (err, rows)=>{
            if(err) throw err;
            res.render('pages/salesTracking', {
                salestracking  : rows
            });    
        });
    }
});

app.get('/crud/addSales', (req, res)=>{
    res.render('crud/addSales');
});

app.post('/SalesSave', (req, res)=>{
    let data = {ID          : req.body.ID, 
                InventoryID  : req.body.InventoryID, 
                EmployeeID  : req.body.EmployeeID, 
                ProductID   : req.body.ProductID, 
                Quantity    : req.body.Quantity,
                Reason       : req.body.Reason,
                status      : req.body.status};
    let sql = "INSERT INTO salestracking SET ?";
    let query = connection.query(sql, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/salesTracking');
    });
});

app.get('/crud/editSales/:saleID', (req, res)=>{
    const saleID = parseInt(req.params.saleID);
    let sql = `SELECT * FROM salestracking where ID=${saleID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.render('crud/editSales', {salestracking: result[0]
        });
    });
});

app.post('/SalesUpdate', (req, res)=>{
    const saleID = req.body.ID;
    let sql = "UPDATE salestracking SET ID='"+req.body.ID+"', InventoryID ='"+req.body.InventoryID+"', EmployeeID ='"+req.body.EmployeeID+"', ProductID='"+req.body.ProductID+"', Quantity='"+req.body.Quantity+"', Reason='"+req.body.Reason+"', status='"+req.body.status+"' WHERE ID="+saleID;
    let query = connection.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect('/salesTracking');
    });
});

app.get('/crud/deleteSale/:saleID', (req, res)=>{
    const saleID = parseInt(req.params.saleID);
    let sql = `DELETE FROM salestracking where ID=${saleID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.redirect('/salesTracking');
    });
});

/****************************************************************************************************************************/ 

app.get('/lostItem', (req, res)=>{
    if (req.session.loggedin)
    {
        let sql = "SELECT * FROM lostitems";
        let query = connection.query(sql, (err, rows)=>{
            if(err) throw err;
            res.render('pages/lostItem', {
                lostitems  : rows
            });    
        });
    }
});

app.get('/crud/addLost', (req, res)=>{
    res.render('crud/addLost');
});

app.post('/lostSave', (req, res)=>{
    let data = {ID              : req.body.ID, 
                InventoryID     : req.body.InventoryID, 
                ProductID       : req.body.ProductID, 
                Quantity        : req.body.Quantity,
                PurchasePrice   : req.body.PurchasePrice};
    let sql = "INSERT INTO lostitems SET ?";
    let query = connection.query(sql, data, (err, results)=>{
        if(err) throw err;
        res.redirect('/lostItem');
    });
});

/****************************************************************************************************************************/ 
app.get('/reports', (req, res)=>{
    if (req.session.loggedin) 
    {
        res.render('pages/reports');
    } 
    else 
    {
        res.render('pages/signin');
    }
    res.end();
    
});

/****************************************************************************************************************************/ 

app.get('/adminUser', authRole(0), (req, res)=>{
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows)=>{
        if(err) throw err;
        res.render('pages/adminUser', {
            users  : rows
        });    
    });
});

app.get('/crud/addUser', authRole(0), (req, res)=>{
    res.render('crud/addUser');
});

app.post('/userSave', (req, res)=>{
    let data = {ID              : req.body.ID, 
                InventoryID     : req.body.InventoryID,
                FirstName       : req.body.FirstName,
                LastName        : req.body.LastName,
                Email           : req.body.Email,
                Password        : req.body.Password,
                Role            : req.body.Role,};
    
    let data2 = {Email           : req.body.Email,
                Password        : req.body.Password,
                Position            : req.body.Role};
    let sql2="INSERT INTO login SET ?";
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data, (err, results)=>{
        if(err) throw err;
    let query2 = connection.query(sql2, data2, (err2, results2)=>{
        if(err2) throw err2;
        res.redirect('/adminUser');
    });
    });
});

app.get('/crud/editUser/:ID', authRole(0), (req, res)=>{
    const ID = parseInt(req.params.ID);
    let sql = `SELECT * FROM users where ID=${ID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.render('crud/editUser', {users: result[0]
        });
    });
});

app.post('/userUpdate', (req, res)=>{
    const userID = parseInt(req.body.ID);
    let sql = "UPDATE users SET ID='"+req.body.ID+"', InventoryID='"+req.body.InventoryID+"', FirstName='"+req.body.FirstName+"', LastName='"+req.body.LastName+"', Email='"+req.body.Email+"', Role='"+req.body.Role+"' WHERE ID="+userID;
    let query = connection.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect('/adminUser');
    });
});

/****************************************************************************************************************************/ 
app.get('/managerUser', authRole(0), (req, res)=>{
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows)=>{
        if(err) throw err;
        res.render('pages/managerUser', {
            users  : rows
        });    
    });
});

app.get('/crud/editUser/:ID', authRole(0), (req, res)=>{
    const ID = parseInt(req.params.ID);
    let sql = `SELECT * FROM users where ID=${ID}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.render('crud/editUser', {users: result[0]
        });
    });
});

app.post('/userUpdate', (req, res)=>{
    const userID = parseInt(req.body.ID);
    let sql = "UPDATE users SET ID='"+req.body.ID+"', InventoryID='"+req.body.InventoryID+"', FirstName='"+req.body.FirstName+"', LastName='"+req.body.LastName+"', Email='"+req.body.Email+"', Role='"+req.body.Role+"' WHERE ID="+userID;
    let query = connection.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect('/managerUser');
    });
});
/****************************************************************************************************************************/ 
app.get('/paymentManagement', (req, res)=>{
    let sql = "SELECT * FROM paymentmanagement";
    let query = connection.query(sql, (err, rows)=>{
        if(err) throw err;
        res.render('pages/paymentManagement', {
            paymentmanagement  : rows
        });    
    });
});

/****************************************************************************************************************************/ 
app.listen(4000, ()=>
{
    console.log("Listening to port 4000");
});
