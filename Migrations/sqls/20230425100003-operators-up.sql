/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS operators (
  opeartor_regID SERIAL PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  user_id INTEGER REFERENCES users(user_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);