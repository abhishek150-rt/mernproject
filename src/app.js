require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const bcrypt = require("bcrypt")
const Swal = require("sweetalert2");
require("./db/database");
const Student = require("./models/user");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Serve static files */
app.use(express.static(path.join(__dirname, "../public")));

/* serve views */
const hbs = require("hbs");
app.set("views", path.join(__dirname, "../templates/views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "../templates/partials"));

/* Routing*/
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});


//For Registration
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmpassword;
        if (password === confirmPassword) {
            const result = new Student({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: confirmPassword,
            });

            // Middlewear for generating json we token
            const newToken = await result.generateToken();
            console.log(newToken);

            // Cookie generation
            res.cookie(process.env.REGISTRATION_COOKIE, newToken, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });



            const response = await result.save();
            res.render("index", {
                isAdded: true,
            });
        }
        else {
            res.render("register", {
                isFalse: true,
                message: "Please fill correct details."
            });
        }
    }
    catch (err) {
        res.status(404).send(err);
    }
});

//For Login
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const response = await Student.findOne({ email: email });
        const ismatching = await bcrypt.compare(password, response.password)

        // Creating token for login
        const token = await response.generateToken();
        console.log(token);


        // Cookie generation
        res.cookie(process.env.LOGIN_COOKIE, token, {
            expires: new Date(Date.now() + 90000),
            httpOnly: true
        });


        if (ismatching) {
            res.render("index", {
                isTrue: true,
                name: ("Hello, " + response.firstname + " " + response.lastname).toUpperCase()
            });

        }
        else {
            res.render("login", {
                isFalse: true,
                message: "Incorrect username or password."
            });
        }

    }
    catch (err) {
        res.status(400).render("login", {
            isFalse: true,
            message: "Incorrect username or password."
        });
    }
})

app.listen(port, () => {
    console.log(`Your App is running http://localhost:${port}`);
})