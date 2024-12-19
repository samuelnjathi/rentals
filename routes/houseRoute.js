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

router.post("/edit/:id",async (req, res) => {
    const id = parseInt(req.params.id);
    const {houseNumber, houseType, monthlyRate} = req.body;

    try {
        await db.query("UPDATE houses SET house_number = $1, house_type = $2, monthly_rate = $3 WHERE id = $4",
            [houseNumber, houseType, monthlyRate, id]
        );
        res.redirect("/houses");
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error updating house"});
    }
});

router.get("/delete/:id",async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await db.query("DELETE FROM houses WHERE id = $1", [id]);
        res.redirect("/houses");
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error deleting house"});
    }
});

export default router;