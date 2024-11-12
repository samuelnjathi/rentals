import db from "../config/db.js";

async function getTenants() {
   const result = await db.query("SELECT id, first_name, last_name, phone_number,rent_deposit, electricity_deposit, TO_CHAR(move_in_date, 'DD-MM-YYYY') AS move_in_date, house_id  FROM tenants");
   const tenants = result.rows
   return tenants;
}

export default getTenants;