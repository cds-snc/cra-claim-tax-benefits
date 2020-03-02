-- this is a very simplified version of what we have in init-database.sql. I've also been more restrictive on some of the character limits
CREATE TABLE public.access_codes (
  code VARCHAR(97),
  sin VARCHAR(97),
  date_of_birth VARCHAR(97),
  login_count NUMERIC NOT NULL,
  first_name VARCHAR(30),
  locked BOOLEAN NOT NULL
) WITH ( OIDS = FALSE );

INSERT INTO public.access_codes (code, sin, date_of_birth, login_count, first_name, locked)
  VALUES 
    ('d75535de98ecea315854491c8d036f8f$ada904924ee513b2d85d4ef775bbd1d835979dd8341047714da8d000ccec8adc', '3c983be4174c2711a44953311ee69792$cd18d36c21efd729f3ee8aab191912fb9467dbaba0552652cc6c451ac8a5031a', '5d3ac41f0d7b0387a651f2ed2b1d883a$fc2a8d33353897b1c6d723904911b91c6edb09283f7784e93ded0ef9dc659ba2', 0, 'Gabrielle', false), 
    ('d75535de98ecea315854491c8d036f8f$04e748d8cf800dfbb0f1dd9e7cf57ec3204eaa291b271b3f0b0cb2ab4c6ad972', 'e14c9970c92a01b8b7c64164c2514c77$87c29bf7528aa0febbe3d83662f2d21720f0b0f074f8b9d7e0fcdbaf2647c9b8', '21d3a8f03b9b135386839b597d18765a$438cab5c650846e0ff38ae91f09a1ae94bc461423caff37efb5f95a2545d3954', 0, 'Tom', false),
    ('d75535de98ecea315854491c8d036f8f$196adabc7f4859ca0ffce264007e1f7aed461800679a36ecf98d55dcd14b3d2f', '8070a8f3e7709e4474a83080aa0efdcc$602f1873603c8e3bbc92a62aa50511007318917dae3203735368751964b0c8d2', 'd4d730c0deb7ed4e3efb4dd0a1b26f18$175600781100fa2af2389b8bc9c75c0e16abd836ce1d5a089961468fb056a151', 0, 'Alex', false);