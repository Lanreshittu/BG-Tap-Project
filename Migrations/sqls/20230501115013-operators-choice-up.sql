/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS operators_choice(
  id SERIAL PRIMARY KEY,
  operator_id VARCHAR(255) REFERENCES operatorsprofile(operator_id) on DELETE CASCADE,
  product_id integer REFERENCES products(product_id) on DELETE set null,
  seed_type_id integer REFERENCES seed_types(seed_type_id) on DELETE set null,
  UNIQUE (operator_id, product_id, seed_type_id)
  )