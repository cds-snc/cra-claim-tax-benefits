-- Creates a new database table for storing access codes
CREATE TABLE public.access_codes
(
    code character varying(16) NOT NULL,
    dob character varying(10) NOT NULL,
    login_count numeric NOT NULL,
    sin character varying(9) NOT NULL,
    locked boolean NOT NULL,
    CONSTRAINT pk_access_code PRIMARY KEY (code)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.access_codes
    OWNER to ctb;