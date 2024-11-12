SELECT 
  t.first_name, t.last_name, 
  h.house_number, t.phone_number, 
  h.monthly_rate, p.payment_date
FROM 
  tenants t
  LEFT JOIN houses h ON t.house_id = h.id
  LEFT JOIN LATERAL (
    SELECT TO_CHAR(payment_date, 'DD-MM-YYYY') AS payment_date
    FROM payments
    WHERE tenant_id = t.id
    ORDER BY payment_date DESC
    LIMIT 1
  ) p ON TRUE
ORDER BY 
  t.first_name, t.last_name;

ALTER TABLE payments ADD tenant_id INTEGER REFERENCES tenants(house_id)

ALTER TABLE tenants ADD UNIQUE (house_id)

SELECT 
  t.first_name, t.last_name, 
  h.house_number, i.amount, 
  TO_CHAR(i.invoice_date, 'DD-MM-YYYY') AS invoice_date, 
  i.invoices_id, i.invoice_item, i.id 
FROM invoices AS i 
JOIN tenants AS t ON t.id = i.tenant_id 
JOIN houses AS h ON t.house_id = h.house_number