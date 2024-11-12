import express from "express";
import db from "../config/db.js";
import getHouses from "../middleware/getHouses.js";

const router = express.Router();


router.get("/",async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const houses = await getHouses();
            res.render("houses.ejs", {
                houses: houses
            });
            // console.log(houses);
        } catch (error) {
            console.error(error)
        }
    } else {
        res.redirect("/login");
    }
});

router.post("/",async (req, res) => {
    const houseNumber = req.body["houseNumber"];
    const houseType = req.body["type"];
    const monthlyRate = req.body["rate"];
   
    try {
        await db.query("INSERT INTO houses (house_number, house_type, monthly_rate) VALUES ($1, $2, $3)", 
            [houseNumber, houseType, monthlyRate]);
        res.redirect("/houses");
    } catch (error) {
        console.error(error);
    }

});

export default router;