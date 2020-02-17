CREATE ROLE ctb_user WITH
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD '--> ENTER PASSWORD HERE <--';
COMMENT ON ROLE tes IS 'Database user for the claim tax benefits front-end application.';

CREATE TABLE public.access_codes
(
    code character varying(97) COLLATE pg_catalog."default" NOT NULL,
    date_of_birth character varying(97) COLLATE pg_catalog."default" NOT NULL,
    login_count numeric NOT NULL,
    sin character varying(97) COLLATE pg_catalog."default" NOT NULL,
		first_name VARCHAR(30),
    locked boolean NOT NULL,
    CONSTRAINT pk_access_code PRIMARY KEY (code)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES ON TABLE public.access_codes TO ctb_user;

GRANT ALL ON TABLE public.access_codes TO ctb_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES ON TABLES TO ctb_user;