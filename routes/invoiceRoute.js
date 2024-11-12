import express from "express";
import db from "../config/db.js";
import ShortUniqueId from "short-unique-id";
import getTenants from "../middleware/getTenants.js";

const router = express.Router();
const uid = new ShortUniqueId({length: 8})

router.get("/",async (req, res) => {
    if (req.isAuthenticated()) {
        const tenants = await getTenants();
        try {
            const result = await db.query("SELECT t.first_name, t.last_name, h.house_number, i.amount, TO_CHAR(i.invoice_date, 'DD-MM-YYYY') AS invoice_date, i.invoices_id, i.invoice_item, i.id FROM invoices AS i JOIN tenants AS t ON t.id = i.tenant_id JOIN houses AS h ON t.house_id = h.house_number");
            const invoices = result.rows;
            res.render("invoices.ejs", { tenants, invoices });
        } catch (error) {
            console.error(error);
            res.send(500).send({message: "Error Retrieving Invoices"})
        }
    } else {
        res.redirect("/login");
    }   
});

router.post("/",async (req, res) => {
    const tenant = req.body["tenant"];
    const invoiceItem = req.body["item"];
    const invoiceAmount = req.body["amount"];
    const invoiceDate = req.body["date"];
    const invoiceId = req.body["id"]

    let newInvoiceId = "";

    if (invoiceId == 0) {
        newInvoiceId = uid.rnd();
    } else {
        newInvoiceId = invoiceId;
    }
    
    try {
        await db.query("INSERT INTO invoices (invoice_item, amount, invoice_date, invoices_id, tenant_id) VALUES ($1, $2, $3, $4, $5)",
            [invoiceItem, invoiceAmount, invoiceDate, newInvoiceId, tenant]
        );
        res.redirect("/invoices");
    } catch (error) {
        console.error(error);
    }
});

export default router;