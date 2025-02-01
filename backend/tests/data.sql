INSERT INTO public.role (name, description)
VALUES ('admin', 'Site Administrator'), ('user', 'Site User');

INSERT INTO public.user (username, password_hash, joined, bio)
VALUES
    ('admin', 
    'scrypt:32768:8:1$xeqbjdslhq0SFaix$946fbbda7adf5985c0524dc47b21bcd102aa99123404243fb75c69df175dcb3aa9493cf0469462ed0bf6348049438644c5ca58c4d05a47732e53f6317d830dbe',
    '2025-01-15T11:45:00',
    'This is a bio'
    ),
    ('user', 
    'scrypt:32768:8:1$xeqbjdslhq0SFaix$946fbbda7adf5985c0524dc47b21bcd102aa99123404243fb75c69df175dcb3aa9493cf0469462ed0bf6348049438644c5ca58c4d05a47732e53f6317d830dbe',
    '2025-01-15T11:55:00',
    'This is another bio'
    )
;

INSERT INTO public.user_role (user_id, role_id)
VALUES
    (1, 1), (1, 2), (2, 2);
