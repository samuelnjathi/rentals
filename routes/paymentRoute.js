import express from "express";
import db from "../config/db.js";
import ShortUniqueId from "short-unique-id";
import getTenants from "../middleware/getTenants.js";

const router = express.Router();
const uid = new ShortUniqueId({length: 8}); 

router.get("/",async (req, res) => {
    if (req.isAuthenticated()) {
        const tenants = await getTenants();
        const result = await db.query("SELECT t.first_name, t.last_name, h.house_number, p.paid_amount, TO_CHAR(p.payment_date, 'DD-MM-YYYY') AS payment_date, p.payment_method, p.payment_id, p.payment_item, p.id FROM payments AS p JOIN tenants AS t ON t.id = p.tenant_id JOIN houses AS h ON t.house_id = h.house_number")
        const payments = result.rows;
        const sumResult = await db.query("SELECT SUM(p.paid_amount) AS total FROM payments AS p WHERE DATE_TRUNC('month', p.payment_date) = DATE_TRUNC('month', CURRENT_DATE)");
       
        const totalPaymentsForCurrentMonth = sumResult.rows[0].total || 0;
        res.render("payments.ejs", { tenants, payments, totalPaymentsForCurrentMonth });
    } else {
        res.redirect("/login");
    }
});

router.post("/",async (req, res) => {
    const {tenant, item, amount, date, method, id} = req.body;
    let newPayId = "";
    
    if (id == 0) {
        newPayId = uid.rnd();
    } else {
        newPayId = id
    }

    try {
        await db.query("INSERT INTO payments (paid_amount, payment_date, payment_method, payment_id, tenant_id, payment_item) VALUES ($1, $2, $3, $4, $5, $6)",
             [amount, date, method, newPayId, tenant, item]
        );
        res.redirect("/payments");
    } catch (error) {
        console.error(error);
        res.send(500).send({message: "Error Entering New Payment"});
    }
});

router.get("/delete/:id",async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await db.query("DELETE FROM payments WHERE id = $1", [id]);  
        res.redirect("/payments");      
    } catch (error) {
        console.error(error);
        res.send(500).send({message: "Error Deleting Payment"});
    }
}); 


export default router;