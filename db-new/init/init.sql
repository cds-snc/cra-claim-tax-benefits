CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  code VARCHAR(9),
  sin VARCHAR(9),
  date_of_birth VARCHAR(10),
  first_name VARCHAR(30),
  locked BOOLEAN NOT NULL
);

INSERT INTO users (code, sin, date_of_birth, first_name, locked)
  VALUES ('A5G98S4K1', '540739869', '1977-09-09', 'Gabrielle', false), ('A5G98S4K2', '536520422', '1987-05-05', 'Tom', false);