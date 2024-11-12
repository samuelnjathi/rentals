import express from "express";
import passport from "passport";
import db from "../config/db.js";
import getHouses from "../middleware/getHouses.js";
// import getTenants from "../middleware/getTenants.js";

const router = express.Router();


router.get("/",async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const result = await db.query("SELECT t.id, t.first_name, t.last_name, h.house_number, t.phone_number, h.monthly_rate, p.payment_date FROM tenants t LEFT JOIN houses h ON t.house_id = h.id LEFT JOIN LATERAL (SELECT TO_CHAR(payment_date, 'DD-MM-YYYY') AS payment_date FROM payments WHERE tenant_id = t.id ORDER BY payment_date DESC LIMIT 1) p ON TRUE ORDER BY t.first_name, t.last_name");
            const tenantsTable = result.rows;
            const houses = await getHouses();
            res.render("tenants.ejs", {
                houses, tenantsTable
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "Error retrieving data"})
        }
    } else {
        res.redirect("/login");
    }  
});   

router.get("/view/:id",async (req, res) => {
    const id = parseInt(req.params.id);
    const prevPage = req.headers.referer; 
    try {
        const result = await db.query("SELECT id, first_name, last_name, phone_number,rent_deposit, electricity_deposit, TO_CHAR(move_in_date, 'DD-MM-YYYY') AS move_in_date, house_id  FROM tenants WHERE id = $1", [id]);
        const tenant = result.rows[0];
        res.render("tenantdetails.ejs", { tenant, prevPage });
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error retrieving Tenant's details"})
    }
});

router.get("/edit/:id",async (req, res) => {
    const id = parseInt(req.params.id);
    const prevPage = req.headers.referer;
    const houses = await getHouses();
    try {
        const result = await db.query("SELECT id, first_name, last_name, phone_number,rent_deposit, electricity_deposit, TO_CHAR(move_in_date, 'DD-MM-YYYY') AS move_in_date, house_id  FROM tenants WHERE id = $1", [id]);
        const tenant = result.rows[0];
        res.render("edittenant.ejs", {prevPage, houses, tenant});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error retrieving Tenant's details"})
    }
});

router.post("/edit/:id",async (req, res) => {
    const id = parseInt(req.params.id);
    const {fname, lname, phone, rent, electricity} = req.body;
    try {
        await db.query("UPDATE tenants SET first_name = $1, last_name = $2, phone_number = $3, rent_deposit = $4, electricity_deposit = $5 WHERE id = $6",
            [fname, lname, phone, rent, electricity, id]);
        res.redirect("/tenants");
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error Updating Tenant details"})
    }
});

router.post("/",async (req, res) => {
    const firstName = req.body["fname"];
    const lastName = req.body["lname"];
    const phoneNo = req.body["phone"];
    const rentDeposit = req.body["rent"];
    const electricityDeposit = req.body["electricity"];
    const date = req.body["date"];
    const houseNumber = req.body["houseNumber"];
    // console.log(houseNumber);

    try {
        await db.query(
            "INSERT INTO tenants (first_name, last_name, phone_number, rent_deposit, electricity_deposit, move_in_date, house_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [firstName, lastName, phoneNo, rentDeposit, electricityDeposit, date, houseNumber]);
            res.redirect("/tenants");
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error posting new tenant"}); 
    }
    
});

router.get("/delete/:id",async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await db.query("DELETE FROM tenants WHERE id = $1", [id]);
        res.redirect("/tenants");
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error deleting tenant"});
    }
});

export default router;