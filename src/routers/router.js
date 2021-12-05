const express= require("express");
const router = new express.Router();
const Student = require("./models/user");

/* Routing*/
router.get("/", (req, res) => {
    res.render("index", {
        course: [
            "MONGO.DB",
            "REACT.JS",
            "EXPRESS.JS",
            "NODE.JS"
        ]
    });
});
router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/user", (req, res) => {
    res.render("user", {
        notLogged: true,
        message: "Please Login To get Your Data"
    });
});

router.get("/secret",authorization, (req, res) => {
    res.render("secret");
})


//For Registration
router.post("/register", async (req, res) => {
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
            const registrationToken = await result.generateToken();
            console.log(registrationToken);

            // Cookie generation
            res.cookie("registrationCookie", registrationToken, {
                expires: new Date(Date.now() + 90000),
                httpOnly: true
            });



            const response = await result.save();
            res.render("index", {
                isAdded: true,
                course: [
                    "MongoDB",
                    "RectJS",
                    "NodeJS",
                    "ExpressJS"
                  ],
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
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const response = await Student.findOne({ email: email });
        const ismatching = await bcrypt.compare(password, response.password)

        // Creating token for login
        const loginToken = await response.generateToken();
        console.log(loginToken);


        // Cookie generation
        res.cookie("loginCookie", loginToken, {
            expires: new Date(Date.now() + 90000),
            httpOnly: true
        });


        if (ismatching) {
            res.render("user", {

                isTrue: true,
                name: (response.firstname + " " + response.lastname).toUpperCase(),
                email: response.email,
                phone: response.phone,
                age: response.age
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


module.exports=router;