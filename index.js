var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var assert = require('assert');
var path = require('path');
var alert = require('alert');
var multer = require('multer');

const { response } = require("express");
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://localhost:27017/CollegeDalalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"))

app.post("/SignUp", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.pass;
    var re = req.body.re_pass;

    db.collection('buyers').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (foundObject != null) {
                alert("Email already exist");
                return res.redirect('/indexFolder/SignUp-SignIN/SignUp.html');
            }
            else {
                if (password === re) {
                    var data = {
                        "name": name,
                        "email": email,
                        "password": password
                    }


                    db.collection('buyers').insertOne(data, (err, collection) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Record Inserted Successfully");
                    });

                    return res.redirect('/indexFolder/ProfileUpdateBuyer/oneTimeUpdation.html')
                }
                else {
                    alert("Password dosn't match");
                    return res.redirect('/indexFolder/SignUp-SignIN/SignUp.html');
                }
            }
        }
    })
})

app.post("/ContactUs", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;

    var data = {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message
    }
    db.collection('contactUs').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });
    alert("Message Sent Successfully");
    return res.redirect('/indexFolder/index.html');

})

app.post("/SignUpSeller", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.pass;
    var re = req.body.re_pass;
    db.collection('sellers').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (foundObject != null) {
                alert("Email already exist");
                return res.redirect('/indexFolder/SignUp-SignIN/SignUpSeller.html');
            }
            else {
                if (password === re) {
                    var data = {
                        "name": name,
                        "email": email,
                       "password": password
                    }


                    db.collection('sellers').insertOne(data, (err, collection) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Record Inserted Successfully");
                    });

                    return res.redirect('/indexFolder/SellerDash/SellerDash.html')
                }
                else {
                    alert("Password dosn't match");
                    return res.redirect('/indexFolder/SignUp-SignIN/SignUpSeller.html');
                }
            }
        }
    })


})
var Storage = multer.diskStorage({
    destination: "./public/upload/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: Storage
}).single('myfile');

app.post("/oneTimeedit", upload, (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var college = req.body.college;
    var course = req.body.course;
    var year = req.body.year;
    var img = req.file.filename;

    var data = {
        "name": name,
        "email": email,
        "college": college,
        "course": course,
        "year": year,
        "img": img
    }


    db.collection('buyerProfile').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('/indexFolder/BuyerDash/dashboard.html');
})

var Storage = multer.diskStorage({
    destination: "./public/upload/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: Storage
}).single('myfile');

app.post("/addItem", upload, (req, res) => {
    var Sellername = req.body.name;
    var Email = req.body.email;
    var Course = req.body.course;
    var Year = req.body.year;
    var College = req.body.college;
    var ItemName = req.body.iname;
    var Quality = req.body.qual;
    var Cost = req.body.cost;
    var Description = req.body.description;
    var img = req.file.filename;

    var data = {
        "Sellername": Sellername,
        "Email": Email,
        "ItemName": ItemName,
        "Quality": Quality,
        "Cost": Cost,
        "DesDescription": Description,
        "College": College,
        "Year": Year,
        "Course": Course,
        "img": img,
    }


    db.collection('addItem').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('/indexFolder/SellerDash/SellerDash.html');
})


app.post("/SignIn", (req, res) => {
    var resultArr = [];
    var email = req.body.your_email;
    var password = req.body.your_pass;
    var cursor = db.collection('buyers').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        resultArr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        // console.log(resultArr);
        for (let i = 0; i < resultArr.length; i++) {
            if (resultArr[i].email === email && resultArr[i].password === password) {
                return res.redirect("/indexFolder/BuyerDash/dashboard.html");
            }
            else {
                continue;
            }
        }
        alert("Wrong Credentials");
        return res.redirect("/indexFolder/SignUp-SignIN/SignIn.html");
    });
});
app.post("/SignInSeller", (req, res) => {
    var resultArr = [];
    var email = req.body.your_email;
    var password = req.body.your_pass;
    var cursor = db.collection('sellers').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        resultArr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        // console.log(resultArr);
        for (let i = 0; i < resultArr.length; i++) {
            if (resultArr[i].email === email && resultArr[i].password === password) {
                return res.redirect("/indexFolder/SellerDash/SellerDash.html");
            }
            else {
                continue;
            }
        }
        alert("Wrong Credentials");
        return res.redirect("/indexFolder/SignUp-SignIN/SignInSeller.html");
    });
});

app.post('/updatePassStu', function (req, res) {
    var email = req.body.email;
    var currentP = req.body.psw;
    var updatedP = req.body.neWpsw;
    var updatedPc = req.body.pswrepeat;


    db.collection('buyers').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (foundObject.password === currentP) {
                if (updatedP === updatedPc) {
                    var data = {
                        $set: { "password": updatedP }
                    }
                    db.collection('buyers').updateOne(foundObject, data, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log("one record updated");
                            alert("Password Updated");
                            return res.redirect('/indexFolder/ProfileUpdateBuyer/accountSettings.html');
                        }
                    });
                    // foundObject.password = updatedP;
                }
                else {
                    alert("New Password dosn't match");
                    return res.redirect('/indexFolder/ProfileUpdateBuyer/accountSettings.html');
                }
            }
            else {
                alert("Password dosn't match to the old password");
                return res.redirect('/indexFolder/ProfileUpdateBuyer/accountSettings.html');

            }
        }
    });

});

app.post('/updatePassOrg', function (req, res) {
    var email = req.body.email;
    var currentP = req.body.psw;
    var updatedP = req.body.neWpsw;
    var updatedPc = req.body.pswrepeat;


    db.collection('sellers').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (foundObject.password === currentP) {
                if (updatedP === updatedPc) {
                    var data = {
                        $set: { "password": updatedP }
                    }
                    db.collection('sellers').updateOne(foundObject, data, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log("one record updated");
                            alert("Password Updated");
                            return res.redirect('/indexFolder/ProfileSeller/accountSettings.html');
                        }
                    });
                    // foundObject.password = updatedP;
                }
                else {
                    alert("New Password dosn't match");
                    return res.redirect('/indexFolder/ProfileSeller/accountSettings.html');
                }
            }
            else {
                alert("Password dosn't match to the old password");
                return res.redirect('/indexFolder/ProfileSeller/accountSettings.html');

            }
        }
    });

});

app.post('/personalUpdateStu', upload, function (req, res) {
    var college = req.body.college;
    var email = req.body.email;
    var course = req.body.course;
    var year = req.body.year;
    console.log(req.file);
    if (req.file != undefined) {
        var img = req.file.filename;
    }

    db.collection('buyerProfile').findOne({ email: email }, function (err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            if (req.file != undefined) {
                var data = {
                    $set: { "college": college, "course": course, "year": year, "img": img }
                }
            }
            else {
                var data = {
                    $set: { "college": college, "course": course, "year": year, "img": img }
                }
            }

            db.collection('buyerProfile').updateOne(foundObject, data, function (err, result) {
                if (err) {
                    throw err;
                }
                else {
                    console.log("one record updated");
                    alert("Records Updated Successfully");
                    return res.redirect('/indexFolder/ProfileUpdateBuyer/index.html');
                }
            });
            // foundObject.password = updatedP;
        }

    });

});

app.get("/api", (req, res) => {
    var arr = [];
    var cursor = db.collection('buyers').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        arr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        res.json({ test: arr });
    });

});
app.get("/Orgapi", (req, res) => {
    var arr = [];
    var cursor = db.collection('sellers').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        arr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        res.json({ test: arr });
    });

});
app.get("/edit", (req, res) => {
    var arr = [];
    var cursor = db.collection('buyerProfile').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        arr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        res.json({ test: arr });
    });

});
app.get("/jobsData", (req, res) => {
    var arr = [];
    var cursor = db.collection('addItem').find();
    cursor.forEach(function (doc) {
        assert.notEqual(null, doc);
        arr.push(doc);
    }, function (err, doc) {
        assert.equal(null, err);
        res.json({ test: arr });
    });

});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('/indexFolder/index.html');
}).listen(3000);


console.log("Listening on PORT 3000");