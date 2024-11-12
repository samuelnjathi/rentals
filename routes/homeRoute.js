import express from "express";
import sessions from "express-session";
import db from "../config/db.js";
import getHouses from "../middleware/getHouses.js";

const router = express.Router();

router.get("/",async (req, res) => {
   if(req.isAuthenticated())
        try {
            const houses = await getHouses();
            const result = await db.query("SELECT id FROM tenants");
            const tenants = result.rows.length;
            res.render("index.ejs", {
                houses: houses,
                tenants: tenants
            });
        } catch (error) {
            console.error(error);
        }
    else {
        res.redirect("/login");
    }
});

export default router;