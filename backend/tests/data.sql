INSERT INTO public.role (name, description)
VALUES ('admin', 'Site Administrator');

INSERT INTO public.user (username, password_hash, joined, bio, role_id)
VALUES
    ('test', 
    'scrypt:32768:8:1$xeqbjdslhq0SFaix$946fbbda7adf5985c0524dc47b21bcd102aa99123404243fb75c69df175dcb3aa9493cf0469462ed0bf6348049438644c5ca58c4d05a47732e53f6317d830dbe',
    '2025-01-15T11:45:00',
    'This is a bio',
    1
    ),
    ('user2', 
    'scrypt:32768:8:1$xeqbjdslhq0SFaix$946fbbda7adf5985c0524dc47b21bcd102aa99123404243fb75c69df175dcb3aa9493cf0469462ed0bf6348049438644c5ca58c4d05a47732e53f6317d830dbe',
    '2025-01-15T11:55:00',
    'This is another bio',
    NULL
    )
;
