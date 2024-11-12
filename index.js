import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import db from "./config/db.js";
import paymentRoute from "./routes/paymentRoute.js"
import homeRouter from "./routes/homeRoute.js";
import houseRouter from "./routes/houseRoute.js";
import tenantRoute from "./routes/tenantRoute.js";
import invoiceRoute from "./routes/invoiceRoute.js";
import env from "dotenv";


const app = express();
const PORT = 3000;
const saltRounds = 10;
env.config();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}));

app.use(passport.initialize());
app.use(passport.session());
//define middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//database connect
db.connect();

//index
app.use("/", homeRouter);

// houses
app.use("/houses", houseRouter);

//payments
app.use("/payments", paymentRoute);

// tenants
app.use("/tenants", tenantRoute);

//invoices
app.use("/invoices", invoiceRoute);

//login
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) {
            console.log(err);
        } 
        res.redirect("/");
    })
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
}));

//register
app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register",async (req, res) => {
    const firstName = req.body["fname"];
    const lastName = req.body["lname"];
    const email = req.body["username"];
    const password = req.body["password"];
    const confirmPassword = req.body["confirmPassword"];
    
    if (password === confirmPassword) {
        try {
            const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
            if (checkResult.rows.length > 0) {
                res.status(400).send({message: "Email already exists"});
            } else {
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (err) {
                        console.error("Error Hashing password", err)
                    } else {
                        // console.log("Hashed Password:", hash)
                        const result = await db.query(
                            "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
                        [firstName, lastName, email, hash]);
                        const user = result.rows[0];
                        req.login(user, (err) => {
                            console.log(err);
                            res.redirect("/");
                        })
                    }
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "Error retrieving user details"});
        }
    } else {
        console.log("Passwords do not match", error);
    }
});

//password
app.get("/password", (req, res) => {
    res.render("password.ejs");
});

app.post("/password", (req, res) => {
    const email = req.body["email"];
    console.log(email);
});

passport.use("local", new Strategy(async function verify(username, password, cb) {
    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [username]);

        if (checkResult.rows.length > 0) {
            const user = checkResult.rows[0];
            const storedHashedPassword = user.password;
            bcrypt.compare(password, storedHashedPassword, (err, result) => {
                if (err) {
                    return cb(err);
                } else {
                    if (result) {
                        return cb(null, user);
                    } else {
                        return cb(null, false)
                    }
                }
            });
        } else {
            return cb("User NOT found");
        }  
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error retrieving User details"});
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});