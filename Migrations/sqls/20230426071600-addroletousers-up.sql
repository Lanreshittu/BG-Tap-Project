/* Replace with your SQL commands */
CREATE TYPE user_role AS ENUM ('member', 'admin' );

ALTER TABLE IF EXISTS users ADD COLUMN role user_role NOT NULL DEFAULT 'member';

