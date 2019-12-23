-- this is a very simplified version of what we have in init-database.sql. I've also been more restrictive on some of the character limits
CREATE TABLE IF NOT EXISTS public.access_codes (
  code VARCHAR(9),
  sin VARCHAR(9),
  dob VARCHAR(10),
  login_count NUMERIC NOT NULL,
  first_name VARCHAR(30),
  locked BOOLEAN NOT NULL
) WITH ( OIDS = FALSE );

INSERT INTO public.access_codes (code, sin, dob, login_count, first_name, locked)
  VALUES ('A5G98S4K1', '540739869', '1977-09-09', 0, 'Gabrielle', false), ('A5G98S4K2', '536520422', '1987-05-05', 0, 'Tom', false);