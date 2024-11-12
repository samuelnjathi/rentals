import db from "../config/db.js";

async function getHouses() {
    const result = await db.query("SELECT * FROM houses");
    let houses = [];
    houses = result.rows
    return houses;
}

export default getHouses;