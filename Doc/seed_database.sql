-- =============================================
-- SEED DATABASE - Catalogo Vernici
-- =============================================
-- Pulisce e ripopola il database con dati di test
-- Password hashate con bcrypt (cost 10)
-- =============================================

-- Pulisci tutte le tabelle nell'ordine corretto (rispettando le FK)
DELETE FROM preferiti;
DELETE FROM prezzi;
DELETE FROM colori;
DELETE FROM prodotti_ambienti_materiali;
DELETE FROM prodotti;
DELETE FROM utenti;
DELETE FROM marche;
DELETE FROM dimensioni;
DELETE FROM materiali;
DELETE FROM ambienti;
DELETE FROM ruoli;

-- Reset delle sequenze (nome corretto per IDENTITY columns)
ALTER TABLE ruoli ALTER COLUMN id RESTART WITH 1;
ALTER TABLE ambienti ALTER COLUMN id RESTART WITH 1;
ALTER TABLE materiali ALTER COLUMN id RESTART WITH 1;
ALTER TABLE dimensioni ALTER COLUMN id RESTART WITH 1;
ALTER TABLE marche ALTER COLUMN id RESTART WITH 1;
ALTER TABLE utenti ALTER COLUMN id RESTART WITH 1;
ALTER TABLE prodotti ALTER COLUMN id RESTART WITH 1;
ALTER TABLE colori ALTER COLUMN id RESTART WITH 1;
ALTER TABLE prezzi ALTER COLUMN id RESTART WITH 1;
ALTER TABLE prodotti_ambienti_materiali ALTER COLUMN id RESTART WITH 1;
ALTER TABLE preferiti ALTER COLUMN id RESTART WITH 1;

-- =============================================
-- DATI BASE
-- =============================================

-- Ruoli: 1=admin, 2=user, 3=marca
INSERT INTO ruoli (nome) VALUES ('admin'), ('user'), ('marca');

-- Ambienti
INSERT INTO ambienti (nome) VALUES ('Interno'), ('Esterno');

-- Materiali
INSERT INTO materiali (nome) VALUES
('Legno'), ('Metallo'), ('Cemento'), ('Gesso'), ('Cartongesso'), ('Muratura');

-- Dimensioni (litri)
INSERT INTO dimensioni (litri) VALUES (0.5), (1.0), (2.0), (5.0), (10.0);

-- =============================================
-- MARCHE (con account - password: Marca123!)
-- Hash bcrypt per "Marca123!": $2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa
-- =============================================

INSERT INTO marche (nome, logo_url, email, password_hash, partita_iva, telefono, sito_web, attivo) VALUES
('Sikkens', 'https://example.com/logos/sikkens.png', 'info@sikkens.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'IT01234567890', '+39 02 1234567', 'https://www.sikkens.it', true),
('San Marco', 'https://example.com/logos/sanmarco.png', 'info@sanmarco.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'IT02345678901', '+39 041 5678901', 'https://www.san-marco.it', true),
('Boero', 'https://example.com/logos/boero.png', 'info@boero.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'IT03456789012', '+39 010 2345678', 'https://www.boero.it', true),
('Maxmeyer', 'https://example.com/logos/maxmeyer.png', 'info@maxmeyer.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'IT04567890123', '+39 02 3456789', 'https://www.maxmeyer.it', true),
('Lechler', 'https://example.com/logos/lechler.png', 'info@lechler.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'IT05678901234', '+39 031 4567890', 'https://www.lechler.eu', true),
('Baldini Vernici', 'https://example.com/logos/baldini.png', 'info@baldinivernici.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'IT06789012345', '+39 055 5678901', 'https://www.baldinivernici.it', true);

-- =============================================
-- ADMIN (password: Admin123!)
-- Hash bcrypt per "Admin123!": $2b$10$wsDSlgEv23gg5UIceQIs/.g0X9blFoVP3GFGB2.crcHzdv3PtXCV2
-- =============================================

INSERT INTO utenti (ruolo_id, email, password_hash, nome, cognome, attivo) VALUES
(1, 'admin@catalogo.com', '$2b$10$wsDSlgEv23gg5UIceQIs/.g0X9blFoVP3GFGB2.crcHzdv3PtXCV2', 'Admin', 'Sistema', true);

-- =============================================
-- UTENTI NORMALI (password: User123!)
-- Hash bcrypt per "User123!": $2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G
-- =============================================

INSERT INTO utenti (ruolo_id, email, password_hash, nome, cognome, attivo) VALUES
(2, 'mario.rossi@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Mario', 'Rossi', true),
(2, 'luigi.verdi@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Luigi', 'Verdi', true),
(2, 'anna.bianchi@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Anna', 'Bianchi', true),
(2, 'paolo.neri@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Paolo', 'Neri', true),
(2, 'giulia.ferrari@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Giulia', 'Ferrari', true),
(2, 'marco.russo@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Marco', 'Russo', true),
(2, 'sara.colombo@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Sara', 'Colombo', true),
(2, 'luca.ricci@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Luca', 'Ricci', true),
(2, 'elena.marino@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Elena', 'Marino', true),
(2, 'andrea.greco@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Andrea', 'Greco', true),
(2, 'francesca.bruno@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Francesca', 'Bruno', true),
(2, 'giovanni.gallo@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Giovanni', 'Gallo', true),
(2, 'chiara.conti@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Chiara', 'Conti', true),
(2, 'davide.derossi@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Davide', 'De Rossi', true),
(2, 'valentina.giordano@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Valentina', 'Giordano', true),
(2, 'simone.rizzo@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Simone', 'Rizzo', true),
(2, 'laura.lombardi@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Laura', 'Lombardi', true),
(2, 'matteo.moretti@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Matteo', 'Moretti', true),
(2, 'silvia.barbieri@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Silvia', 'Barbieri', true),
(2, 'roberto.fontana@email.com', '$2b$10$sTkr331wLdrj./Yw0xCZWObHzaNpbVPnVz3FMsauV7RahdPHepu6G', 'Roberto', 'Fontana', true);

-- =============================================
-- UTENTI MARCA (password: Marca123!) - collegati alle marche
-- =============================================

INSERT INTO utenti (ruolo_id, email, password_hash, nome, cognome, attivo, marca_id) VALUES
(3, 'info@sikkens.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'Sikkens', 'Manager', true, 1),
(3, 'info@sanmarco.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'San Marco', 'Manager', true, 2),
(3, 'info@boero.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'Boero', 'Manager', true, 3),
(3, 'info@maxmeyer.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'Maxmeyer', 'Manager', true, 4),
(3, 'info@lechler.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'Lechler', 'Manager', true, 5),
(3, 'info@baldinivernici.com', '$2b$10$oHJeCuMKfr7NmxfkGTqxbez1nsv9av1VQJ0duzalk7Z0LNI7YlyZa', 'Baldini', 'Manager', true, 6);

-- =============================================
-- PRODOTTI - SIKKENS (marca_id = 1)
-- =============================================

INSERT INTO prodotti (marca_id, nome, descrizione, certificazioni, resistenza, base, numero_mani, temperatura_applicazione, copertura_per_litro, scheda_tecnica_url, approvato) VALUES
(1, 'Sikkens Rubbol BL Satura', 'Smalto acrilico satinato per interni ed esterni, elevata resistenza agli agenti atmosferici', 'Ecolabel, VOC ridotto', 'UV, Antimuffa, Antigraffio', 'Acqua', 2, '+5C / +30C', 12.00, 'https://www.sikkens.it/schede/rubbol-bl-satura.pdf', true),
(1, 'Sikkens Alphatex SF', 'Pittura murale lavabile per interni, ottima copertura e resistenza allo sfregamento', 'A+, Ecolabel', 'Lavabile, Antimuffa', 'Acqua', 2, '+8C / +28C', 10.00, 'https://www.sikkens.it/schede/alphatex-sf.pdf', true),
(1, 'Sikkens Cetol Filter 7', 'Impregnante decorativo per legno esterno con protezione UV', 'VOC ridotto', 'UV, Acqua, Funghi', 'Solvente', 2, '+5C / +25C', 14.00, 'https://www.sikkens.it/schede/cetol-filter-7.pdf', true),
(1, 'Sikkens Alphaloxan', 'Pittura silossanica per facciate esterne, traspirante e idrorepellente', 'A+', 'UV, Pioggia, Antimuffa', 'Acqua', 2, '+5C / +30C', 8.00, 'https://www.sikkens.it/schede/alphaloxan.pdf', true),
(1, 'Sikkens Rubbol Azura', 'Smalto alchidico brillante per legno e metallo', 'CE', 'Antimuffa, Antiruggine', 'Solvente', 2, '+10C / +25C', 13.00, 'https://www.sikkens.it/schede/rubbol-azura.pdf', true),
(1, 'Sikkens Alpha Projecttex', 'Pittura professionale per grandi superfici, elevata resa', 'Ecolabel', 'Lavabile, Antimacchia', 'Acqua', 1, '+8C / +30C', 11.00, 'https://www.sikkens.it/schede/alpha-projecttex.pdf', true);

-- =============================================
-- PRODOTTI - SAN MARCO (marca_id = 2)
-- =============================================

INSERT INTO prodotti (marca_id, nome, descrizione, certificazioni, resistenza, base, numero_mani, temperatura_applicazione, copertura_per_litro, scheda_tecnica_url, approvato) VALUES
(2, 'San Marco Superconfort', 'Idropittura lavabile antimuffa per interni, formulazione anticondensa', 'A+, ISO 11998', 'Antimuffa, Anticondensa', 'Acqua', 2, '+5C / +35C', 9.00, 'https://www.san-marco.it/schede/superconfort.pdf', true),
(2, 'San Marco Silexcolor Tonachino', 'Rivestimento silossanico a effetto tonachino per esterni', 'Ecolabel', 'UV, Pioggia, Grandine', 'Acqua', 2, '+5C / +30C', 4.00, 'https://www.san-marco.it/schede/silexcolor-tonachino.pdf', true),
(2, 'San Marco Marcopolo Luxury', 'Finitura decorativa effetto sabbiato perlescente', 'VOC Zero', 'Lavabile, Antigraffio', 'Acqua', 2, '+10C / +28C', 6.00, 'https://www.san-marco.it/schede/marcopolo-luxury.pdf', true),
(2, 'San Marco Unimarc Smalto', 'Smalto all acqua brillante per legno e metallo interni', 'A+', 'Antigraffio, Ingiallimento', 'Acqua', 2, '+8C / +30C', 12.00, 'https://www.san-marco.it/schede/unimarc-smalto.pdf', true),
(2, 'San Marco Acrisyl Pittura', 'Pittura acrilsilossanica per facciate esterne', 'Ecolabel, CE', 'UV, Pioggia, Smog', 'Acqua', 2, '+5C / +35C', 7.00, 'https://www.san-marco.it/schede/acrisyl-pittura.pdf', true),
(2, 'San Marco Decorplast', 'Stucco decorativo per pareti interne effetto spatola', 'A+', 'Lavabile, Resistente', 'Acqua', 2, '+10C / +28C', 3.00, 'https://www.san-marco.it/schede/decorplast.pdf', true);

-- =============================================
-- PRODOTTI - BOERO (marca_id = 3)
-- =============================================

INSERT INTO prodotti (marca_id, nome, descrizione, certificazioni, resistenza, base, numero_mani, temperatura_applicazione, copertura_per_litro, scheda_tecnica_url, approvato) VALUES
(3, 'Boero Casasana', 'Idropittura igienizzante antibatterica per interni', 'A+, Antibatterico certificato', 'Antimuffa, Antibatterico', 'Acqua', 2, '+5C / +30C', 10.00, 'https://www.boero.it/schede/casasana.pdf', true),
(3, 'Boero Altura Silox', 'Pittura silossanica per facciate in zone marine', 'Ecolabel', 'Salsedine, UV, Pioggia', 'Acqua', 2, '+5C / +35C', 8.00, 'https://www.boero.it/schede/altura-silox.pdf', true),
(3, 'Boero Litron Antiruggine', 'Primer antiruggine per metallo ferroso', 'CE', 'Ruggine, Ossidazione', 'Solvente', 1, '+8C / +28C', 14.00, 'https://www.boero.it/schede/litron-antiruggine.pdf', true),
(3, 'Boero YachtCoating', 'Smalto poliuretanico per nautica e metallo esterno', 'Nautico certificato', 'UV, Salsedine, Acqua', 'Solvente', 2, '+10C / +30C', 11.00, 'https://www.boero.it/schede/yachtcoating.pdf', true),
(3, 'Boero Cover Plus', 'Idropittura superlavabile per interni ad alta copertura', 'A+', 'Lavabile, Macchie', 'Acqua', 2, '+5C / +30C', 9.00, 'https://www.boero.it/schede/cover-plus.pdf', true),
(3, 'Boero Smeraldo', 'Smalto murale lavabile effetto satinato', 'VOC ridotto', 'Lavabile, Antigraffio', 'Acqua', 2, '+8C / +28C', 10.00, 'https://www.boero.it/schede/smeraldo.pdf', true);

-- =============================================
-- PRODOTTI - MAXMEYER (marca_id = 4)
-- =============================================

INSERT INTO prodotti (marca_id, nome, descrizione, certificazioni, resistenza, base, numero_mani, temperatura_applicazione, copertura_per_litro, scheda_tecnica_url, approvato) VALUES
(4, 'Maxmeyer Bianco Puro', 'Idropittura traspirante per interni, ottimo rapporto qualita prezzo', 'A+', 'Traspirante, Antimuffa', 'Acqua', 2, '+5C / +30C', 11.00, 'https://www.maxmeyer.it/schede/bianco-puro.pdf', true),
(4, 'Maxmeyer Isobit Primer', 'Primer isolante per macchie e aloni', 'CE', 'Isolante, Macchie', 'Acqua', 1, '+8C / +28C', 8.00, 'https://www.maxmeyer.it/schede/isobit-primer.pdf', true),
(4, 'Maxmeyer Smalto Acqua', 'Smalto all acqua satinato per legno e muri', 'A+, VOC ridotto', 'Lavabile, Ingiallimento', 'Acqua', 2, '+10C / +28C', 12.00, 'https://www.maxmeyer.it/schede/smalto-acqua.pdf', true),
(4, 'Maxmeyer Esterni Plus', 'Pittura per facciate esterne resistente allo sporco', 'Ecolabel', 'UV, Pioggia, Smog', 'Acqua', 2, '+5C / +35C', 7.00, 'https://www.maxmeyer.it/schede/esterni-plus.pdf', true),
(4, 'Maxmeyer Legno Vivo', 'Impregnante protettivo per legno esterno', 'VOC ridotto', 'UV, Acqua, Funghi', 'Acqua', 2, '+5C / +30C', 10.00, 'https://www.maxmeyer.it/schede/legno-vivo.pdf', true),
(4, 'Maxmeyer Decor Style', 'Pittura decorativa effetto vellutato', 'A+', 'Lavabile, Elegante', 'Acqua', 2, '+10C / +28C', 5.00, 'https://www.maxmeyer.it/schede/decor-style.pdf', true);

-- =============================================
-- PRODOTTI - LECHLER (marca_id = 5)
-- =============================================

INSERT INTO prodotti (marca_id, nome, descrizione, certificazioni, resistenza, base, numero_mani, temperatura_applicazione, copertura_per_litro, scheda_tecnica_url, approvato) VALUES
(5, 'Lechler Hydrofan', 'Smalto base acqua per carrozzeria e metallo', 'Automotive certificato', 'UV, Graffi, Carburante', 'Acqua', 3, '+15C / +30C', 9.00, 'https://www.lechler.eu/schede/hydrofan.pdf', true),
(5, 'Lechler Macrofan HS', 'Trasparente bicomponente ad alto solido', 'VOC conforme', 'UV, Graffi, Lucidita', 'Solvente', 2, '+18C / +28C', 10.00, 'https://www.lechler.eu/schede/macrofan-hs.pdf', true),
(5, 'Lechler Epofan Primer', 'Fondo epossidico anticorrosivo per metallo', 'Industriale', 'Ruggine, Chimici', 'Solvente', 1, '+10C / +30C', 8.00, 'https://www.lechler.eu/schede/epofan-primer.pdf', true),
(5, 'Lechler Chromo System', 'Sistema tintometrico professionale per automotive', 'Automotive, CE', 'UV, Graffi, Benzina', 'Solvente', 2, '+15C / +28C', 11.00, 'https://www.lechler.eu/schede/chromo-system.pdf', true),
(5, 'Lechler Isolack', 'Vernice isolante per industria', 'Industriale certificato', 'Elettrico, Termico', 'Solvente', 2, '+10C / +35C', 12.00, 'https://www.lechler.eu/schede/isolack.pdf', true),
(5, 'Lechler Powder Coat', 'Verniciatura a polvere per metallo', 'Industriale, CE', 'Graffi, Urti, UV', 'Polvere', 1, '+180C forno', 6.00, 'https://www.lechler.eu/schede/powder-coat.pdf', true);

-- =============================================
-- PRODOTTI - BALDINI VERNICI (marca_id = 6)
-- =============================================

INSERT INTO prodotti (marca_id, nome, descrizione, certificazioni, resistenza, base, numero_mani, temperatura_applicazione, copertura_per_litro, scheda_tecnica_url, approvato) VALUES
(6, 'Baldini Natura', 'Pittura naturale a base di calce per interni storici', 'Bio, Ecolabel', 'Traspirante, Antimuffa', 'Calce', 2, '+5C / +25C', 6.00, 'https://www.baldinivernici.it/schede/natura.pdf', true),
(6, 'Baldini Ferromicaceo', 'Smalto ferromicaceo per cancelli e ringhiere', 'CE', 'Ruggine, UV, Graffi', 'Solvente', 2, '+5C / +30C', 10.00, 'https://www.baldinivernici.it/schede/ferromicaceo.pdf', true),
(6, 'Baldini Termoisolante', 'Pittura termoriflettente per risparmio energetico', 'Efficienza energetica', 'Termico, UV', 'Acqua', 2, '+5C / +35C', 4.00, 'https://www.baldinivernici.it/schede/termoisolante.pdf', true),
(6, 'Baldini Pavimenti', 'Vernice per pavimenti industriali e garage', 'Industriale', 'Usura, Olio, Chimici', 'Solvente', 2, '+10C / +28C', 8.00, 'https://www.baldinivernici.it/schede/pavimenti.pdf', true),
(6, 'Baldini Restauro', 'Pittura per restauro edifici storici', 'Beni culturali', 'Traspirante, Storico', 'Calce', 2, '+8C / +25C', 5.00, 'https://www.baldinivernici.it/schede/restauro.pdf', true),
(6, 'Baldini Pool Paint', 'Vernice per piscine resistente al cloro', 'Piscine certificato', 'Cloro, UV, Acqua', 'Solvente', 3, '+15C / +30C', 7.00, 'https://www.baldinivernici.it/schede/pool-paint.pdf', true);

-- =============================================
-- PRODOTTI_AMBIENTI_MATERIALI
-- =============================================

-- Sikkens prodotti (1-6)
INSERT INTO prodotti_ambienti_materiali (prodotto_id, ambiente_id, materiale_id) VALUES
(1, 1, 1), (1, 1, 2), (1, 2, 1), (1, 2, 2),
(2, 1, 3), (2, 1, 4), (2, 1, 5), (2, 1, 6),
(3, 2, 1),
(4, 2, 3), (4, 2, 6),
(5, 1, 1), (5, 1, 2), (5, 2, 1), (5, 2, 2),
(6, 1, 3), (6, 1, 4), (6, 1, 5), (6, 1, 6);

-- San Marco prodotti (7-12)
INSERT INTO prodotti_ambienti_materiali (prodotto_id, ambiente_id, materiale_id) VALUES
(7, 1, 3), (7, 1, 4), (7, 1, 5), (7, 1, 6),
(8, 2, 3), (8, 2, 6),
(9, 1, 3), (9, 1, 4), (9, 1, 5),
(10, 1, 1), (10, 1, 2),
(11, 2, 3), (11, 2, 6),
(12, 1, 3), (12, 1, 4), (12, 1, 5);

-- Boero prodotti (13-18)
INSERT INTO prodotti_ambienti_materiali (prodotto_id, ambiente_id, materiale_id) VALUES
(13, 1, 3), (13, 1, 4), (13, 1, 5), (13, 1, 6),
(14, 2, 3), (14, 2, 6),
(15, 1, 2), (15, 2, 2),
(16, 2, 2),
(17, 1, 3), (17, 1, 4), (17, 1, 5), (17, 1, 6),
(18, 1, 3), (18, 1, 4), (18, 1, 5);

-- Maxmeyer prodotti (19-24)
INSERT INTO prodotti_ambienti_materiali (prodotto_id, ambiente_id, materiale_id) VALUES
(19, 1, 3), (19, 1, 4), (19, 1, 5), (19, 1, 6),
(20, 1, 3), (20, 1, 4), (20, 1, 5), (20, 1, 6),
(21, 1, 1), (21, 1, 3), (21, 1, 4), (21, 1, 5),
(22, 2, 3), (22, 2, 6),
(23, 2, 1),
(24, 1, 3), (24, 1, 4), (24, 1, 5);

-- Lechler prodotti (25-30)
INSERT INTO prodotti_ambienti_materiali (prodotto_id, ambiente_id, materiale_id) VALUES
(25, 1, 2), (25, 2, 2),
(26, 1, 2), (26, 2, 2),
(27, 1, 2), (27, 2, 2),
(28, 1, 2), (28, 2, 2),
(29, 1, 2),
(30, 1, 2), (30, 2, 2);

-- Baldini prodotti (31-36)
INSERT INTO prodotti_ambienti_materiali (prodotto_id, ambiente_id, materiale_id) VALUES
(31, 1, 3), (31, 1, 4), (31, 1, 6),
(32, 2, 2),
(33, 1, 3), (33, 1, 6), (33, 2, 3), (33, 2, 6),
(34, 1, 3), (34, 2, 3),
(35, 1, 3), (35, 1, 6), (35, 2, 3), (35, 2, 6),
(36, 2, 3);

-- =============================================
-- COLORI - 6 colori per ogni prodotto (tutti unici)
-- =============================================

-- Prodotto 1: Sikkens Rubbol BL Satura
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(1, 'Bianco Alpino', '#FAFAFA'),
(1, 'Grigio Perla', '#B8B8B8'),
(1, 'Verde Salvia', '#9CAF88'),
(1, 'Blu Notte', '#2C3E50'),
(1, 'Terracotta', '#C45D3E'),
(1, 'Sabbia Chiara', '#E8DCC8');

-- Prodotto 2: Sikkens Alphatex SF
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(2, 'Bianco Assoluto', '#FFFFFF'),
(2, 'Avorio Antico', '#F5E6D3'),
(2, 'Rosa Cipria', '#E8C4C4'),
(2, 'Azzurro Cielo', '#B5D4E8'),
(2, 'Giallo Vaniglia', '#F5E6C4'),
(2, 'Grigio Argento', '#C4C4C4');

-- Prodotto 3: Sikkens Cetol Filter 7
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(3, 'Noce Chiaro', '#A67B5B'),
(3, 'Mogano Scuro', '#4A2C2A'),
(3, 'Teak Naturale', '#B8860B'),
(3, 'Castagno', '#8B4513'),
(3, 'Rovere Antico', '#C4A77D'),
(3, 'Ebano', '#3D2914');

-- Prodotto 4: Sikkens Alphaloxan
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(4, 'Bianco Calce', '#F8F4E8'),
(4, 'Ocra Toscana', '#CC7722'),
(4, 'Giallo Limone', '#E8D44D'),
(4, 'Arancio Tramonto', '#E87830'),
(4, 'Rosso Mattone', '#A52A2A'),
(4, 'Marrone Terra', '#8B6914');

-- Prodotto 5: Sikkens Rubbol Azura
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(5, 'Bianco Lucido', '#F5F5F5'),
(5, 'Nero Intenso', '#1A1A1A'),
(5, 'Rosso Ferrari', '#FF2800'),
(5, 'Blu Cobalto', '#0047AB'),
(5, 'Verde Bosco', '#228B22'),
(5, 'Giallo Canarino', '#FFE135');

-- Prodotto 6: Sikkens Alpha Projecttex
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(6, 'Bianco Opaco', '#F0F0F0'),
(6, 'Grigio Chiaro', '#D3D3D3'),
(6, 'Beige Neutro', '#E5D3B3'),
(6, 'Verde Menta', '#98FB98'),
(6, 'Azzurro Ghiaccio', '#D6EAF8'),
(6, 'Lilla Delicato', '#E6E6FA');

-- Prodotto 7: San Marco Superconfort
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(7, 'Bianco Naturale', '#FFFEF0'),
(7, 'Celeste Pastello', '#AEC6CF'),
(7, 'Rosa Antico', '#C8A2C8'),
(7, 'Verde Acqua', '#76D7C4'),
(7, 'Pesca', '#FFCBA4'),
(7, 'Tortora', '#B9A394');

-- Prodotto 8: San Marco Silexcolor Tonachino
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(8, 'Bianco Mediterraneo', '#FDF5E6'),
(8, 'Ocra Chiaro', '#D4A056'),
(8, 'Terracotta Chiaro', '#E2725B'),
(8, 'Rosa Pompeiano', '#CC8899'),
(8, 'Grigio Pietra', '#9E9E9E'),
(8, 'Giallo Napoli', '#FADA5E');

-- Prodotto 9: San Marco Marcopolo Luxury
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(9, 'Oro Antico', '#CFB53B'),
(9, 'Argento Luna', '#C0C0C0'),
(9, 'Bronzo Imperiale', '#CD7F32'),
(9, 'Champagne', '#F7E7CE'),
(9, 'Rame Ossidato', '#B87333'),
(9, 'Perla Madreperla', '#FDEEF4');

-- Prodotto 10: San Marco Unimarc Smalto
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(10, 'Bianco Puro', '#FCFCFC'),
(10, 'Grigio Antracite', '#383838'),
(10, 'Verde Inglese', '#1B4D3E'),
(10, 'Blu Marina', '#000080'),
(10, 'Bordeaux', '#722F37'),
(10, 'Avorio', '#FFFFF0');

-- Prodotto 11: San Marco Acrisyl Pittura
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(11, 'Bianco Facciata', '#FAF9F6'),
(11, 'Giallo Ocra', '#CC7700'),
(11, 'Rosso Pompeiano', '#CB4154'),
(11, 'Arancio Etrusco', '#E65C00'),
(11, 'Verde Oliva', '#808000'),
(11, 'Marrone Umbro', '#6B4226');

-- Prodotto 12: San Marco Decorplast
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(12, 'Bianco Caldo', '#FFF8E7'),
(12, 'Sabbia Dorata', '#E6C696'),
(12, 'Grigio Tortora', '#A69080'),
(12, 'Blu Petrolio', '#006666'),
(12, 'Melanzana', '#5C4033'),
(12, 'Rosso Corallo', '#FF6F61');

-- Prodotto 13: Boero Casasana
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(13, 'Bianco Igienico', '#FEFEFE'),
(13, 'Azzurro Clinico', '#D4E6F1'),
(13, 'Verde Ospedale', '#C8E6C9'),
(13, 'Giallo Chiaro', '#FFF9C4'),
(13, 'Rosa Tenue', '#FCE4EC'),
(13, 'Grigio Platino', '#E8E8E8');

-- Prodotto 14: Boero Altura Silox
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(14, 'Bianco Marino', '#F5F5F5'),
(14, 'Azzurro Mare', '#4682B4'),
(14, 'Beige Spiaggia', '#E8D4A8'),
(14, 'Grigio Roccia', '#808080'),
(14, 'Blu Oceano', '#1E3A5F'),
(14, 'Corallo', '#FF7F50');

-- Prodotto 15: Boero Litron Antiruggine
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(15, 'Grigio Zinco', '#7D7D7D'),
(15, 'Rosso Antiruggine', '#A52019'),
(15, 'Arancio Minio', '#FF4500'),
(15, 'Marrone Ossido', '#5C4033'),
(15, 'Verde Oliva Scuro', '#556B2F'),
(15, 'Nero Catrame', '#0D0D0D');

-- Prodotto 16: Boero YachtCoating
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(16, 'Bianco Brillante', '#FAFCFC'),
(16, 'Blu Navy', '#001F3F'),
(16, 'Rosso Racing', '#E60000'),
(16, 'Giallo Sole', '#FFD700'),
(16, 'Verde Smeraldo', '#50C878'),
(16, 'Nero Lucido', '#0A0A0A');

-- Prodotto 17: Boero Cover Plus
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(17, 'Bianco Totale', '#FBFBFB'),
(17, 'Crema', '#FFFDD0'),
(17, 'Grigio Perla Chiaro', '#D5D5D5'),
(17, 'Lavanda', '#E6E6FA'),
(17, 'Menta Fresca', '#BDFCC9'),
(17, 'Panna', '#FFF4E0');

-- Prodotto 18: Boero Smeraldo
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(18, 'Bianco Satinato', '#F9F9F9'),
(18, 'Grigio Seta', '#BABABA'),
(18, 'Verde Salvia Chiaro', '#B2C4B2'),
(18, 'Azzurro Polvere', '#B0E0E6'),
(18, 'Rosa Pallido', '#FFE4E1'),
(18, 'Beige Seta', '#D9CDBF');

-- Prodotto 19: Maxmeyer Bianco Puro
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(19, 'Bianco Extra', '#FDFDFD'),
(19, 'Bianco Caldo Antico', '#FAF0E6'),
(19, 'Bianco Ghiaccio', '#F0FFFF'),
(19, 'Bianco Latte', '#FEFEFA'),
(19, 'Bianco Perla', '#F0EAD6'),
(19, 'Bianco Neve', '#FFFAFA');

-- Prodotto 20: Maxmeyer Isobit Primer
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(20, 'Bianco Isolante', '#F7F7F7'),
(20, 'Grigio Primer', '#A9A9A9'),
(20, 'Rosa Aggrappante', '#FADADD'),
(20, 'Trasparente Opalino', '#F5F5DC'),
(20, 'Bianco Pigmentato', '#EDEDED'),
(20, 'Avorio Primer', '#FAEBD7');

-- Prodotto 21: Maxmeyer Smalto Acqua
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(21, 'Bianco Lucente', '#F4F4F4'),
(21, 'Nero Opaco', '#1C1C1C'),
(21, 'Rosso Fuoco', '#DD2C00'),
(21, 'Blu Elettrico', '#0000CD'),
(21, 'Verde Prato', '#00A550'),
(21, 'Giallo Limone Intenso', '#FDE910');

-- Prodotto 22: Maxmeyer Esterni Plus
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(22, 'Bianco Esterno', '#F2F2F2'),
(22, 'Giallo Coloniale', '#E8B839'),
(22, 'Rosa Antico Facciata', '#D4A5A5'),
(22, 'Arancio Tenue', '#FFBE7D'),
(22, 'Verde Muschio', '#8A9A5B'),
(22, 'Marrone Cotto', '#964B00');

-- Prodotto 23: Maxmeyer Legno Vivo
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(23, 'Noce Medio', '#8B7355'),
(23, 'Ciliegio', '#DE3163'),
(23, 'Pino Naturale', '#C3A86C'),
(23, 'Wenge', '#4D3D2D'),
(23, 'Frassino', '#CEB888'),
(23, 'Douglas', '#B8733D');

-- Prodotto 24: Maxmeyer Decor Style
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(24, 'Bianco Velluto', '#F6F6F6'),
(24, 'Oro Rosa', '#E8C4B0'),
(24, 'Argento Vellutato', '#C9C9C9'),
(24, 'Verde Giada', '#00A86B'),
(24, 'Blu Zaffiro', '#0F52BA'),
(24, 'Viola Ametista', '#9966CC');

-- Prodotto 25: Lechler Hydrofan
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(25, 'Bianco Carrozzeria', '#F3F3F3'),
(25, 'Nero Metallizzato', '#1E1E1E'),
(25, 'Rosso Mela', '#FF0038'),
(25, 'Blu Metallico', '#4169E1'),
(25, 'Grigio Titanio', '#6E6E6E'),
(25, 'Argento Puro', '#E6E6E6');

-- Prodotto 26: Lechler Macrofan HS
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(26, 'Trasparente Lucido', '#FEFEFC'),
(26, 'Trasparente Opaco', '#F8F8F8'),
(26, 'Trasparente Satinato', '#F5F5F5'),
(26, 'Trasparente Anti-UV', '#FAFAE6'),
(26, 'Trasparente Graffiato', '#ECECEC'),
(26, 'Trasparente Premium', '#FBFBFB');

-- Prodotto 27: Lechler Epofan Primer
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(27, 'Grigio Epossidico', '#6B6B6B'),
(27, 'Verde Industriale', '#2E5930'),
(27, 'Rosso Ossido', '#7B241C'),
(27, 'Nero Epox', '#151515'),
(27, 'Grigio Chiaro Inox', '#C0C0C0'),
(27, 'Beige Industriale', '#C8B896');

-- Prodotto 28: Lechler Chromo System
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(28, 'Bianco Perla', '#EAE6CA'),
(28, 'Nero Perlato', '#232323'),
(28, 'Blu Atlantico', '#304878'),
(28, 'Rosso Granata', '#7B001C'),
(28, 'Verde Bottiglia', '#006B3C'),
(28, 'Grigio Meteora', '#585858');

-- Prodotto 29: Lechler Isolack
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(29, 'Trasparente Isolante', '#F9F9F9'),
(29, 'Rosso Isolante', '#C41E3A'),
(29, 'Nero Elettrico', '#0E0E0E'),
(29, 'Giallo Sicurezza', '#FFE500'),
(29, 'Verde Elettrico', '#009246'),
(29, 'Blu Elettronico', '#0056A7');

-- Prodotto 30: Lechler Powder Coat
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(30, 'Bianco RAL 9010', '#F5F5F0'),
(30, 'Nero RAL 9005', '#0A0A0A'),
(30, 'Grigio RAL 7035', '#D7D7D7'),
(30, 'Rosso RAL 3020', '#CC0000'),
(30, 'Blu RAL 5015', '#007CB0'),
(30, 'Verde RAL 6005', '#1E5945');

-- Prodotto 31: Baldini Natura
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(31, 'Bianco Calce Viva', '#FEF9F3'),
(31, 'Ocra Naturale', '#C9A66B'),
(31, 'Terra Siena', '#A0522D'),
(31, 'Verde Terra', '#4A5D23'),
(31, 'Blu Indaco Naturale', '#4B0082'),
(31, 'Rosso Terra', '#8B0000');

-- Prodotto 32: Baldini Ferromicaceo
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(32, 'Grafite Scuro', '#2D2D2D'),
(32, 'Ruggine Antica', '#8B4513'),
(32, 'Bronzo Antico', '#6B4423'),
(32, 'Argento Antico', '#7F7F7F'),
(32, 'Rame Antico', '#7C5238'),
(32, 'Nero Ferro', '#121212');

-- Prodotto 33: Baldini Termoisolante
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(33, 'Bianco Termico', '#FFFFFE'),
(33, 'Alluminio Riflettente', '#A8A9AD'),
(33, 'Beige Termo', '#D2B48C'),
(33, 'Grigio Termico', '#8E8E8E'),
(33, 'Verde Termico', '#8FBC8F'),
(33, 'Celeste Termico', '#89CFF0');

-- Prodotto 34: Baldini Pavimenti
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(34, 'Grigio Cemento', '#8C8C8C'),
(34, 'Rosso Mattone Industriale', '#913831'),
(34, 'Verde Garage', '#4A5942'),
(34, 'Beige Magazzino', '#C2B280'),
(34, 'Grigio Scuro Industriale', '#4F4F4F'),
(34, 'Nero Parcheggio', '#1B1B1B');

-- Prodotto 35: Baldini Restauro
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(35, 'Bianco Antico', '#F5F2E8'),
(35, 'Giallo Senape Antico', '#CDAA3D'),
(35, 'Rosso Pompei', '#A52A2A'),
(35, 'Verde Veronese', '#3A5F0B'),
(35, 'Blu Lapislazzulo', '#26619C'),
(35, 'Terra Umbra', '#6C5534');

-- Prodotto 36: Baldini Pool Paint
INSERT INTO colori (prodotto_id, nome, codice_hex) VALUES
(36, 'Azzurro Piscina', '#00CED1'),
(36, 'Blu Piscina Olimpica', '#1E90FF'),
(36, 'Verde Acquamarina', '#00BFAF'),
(36, 'Bianco Piscina', '#F8FFFF'),
(36, 'Blu Notte Piscina', '#1B4F72'),
(36, 'Turchese', '#30D5C8');

-- =============================================
-- PREZZI - Per ogni colore (216 colori x 5 dimensioni)
-- =============================================

DO $$
DECLARE
    colore_rec RECORD;
    dim_rec RECORD;
    prezzo_base DECIMAL(8,2);
    prezzo_finale DECIMAL(8,2);
BEGIN
    FOR colore_rec IN SELECT id, prodotto_id FROM colori LOOP
        prezzo_base := 15 + (RANDOM() * 20);

        FOR dim_rec IN SELECT id, litri FROM dimensioni ORDER BY litri LOOP
            CASE dim_rec.litri::text
                WHEN '0.5' THEN prezzo_finale := prezzo_base * 0.6;
                WHEN '1.0' THEN prezzo_finale := prezzo_base * 1.0;
                WHEN '2.0' THEN prezzo_finale := prezzo_base * 1.8;
                WHEN '5.0' THEN prezzo_finale := prezzo_base * 4.0;
                WHEN '10.0' THEN prezzo_finale := prezzo_base * 7.0;
            END CASE;

            INSERT INTO prezzi (colore_id, dimensione_id, prezzo)
            VALUES (colore_rec.id, dim_rec.id, ROUND(prezzo_finale, 2));
        END LOOP;
    END LOOP;
END $$;

-- =============================================
-- PREFERITI - Ogni utente ha da 3 a 8 preferiti
-- =============================================

INSERT INTO preferiti (utente_id, prodotto_id) VALUES
(2, 1), (2, 7), (2, 13), (2, 19), (2, 25),
(3, 2), (3, 8), (3, 14), (3, 20),
(4, 3), (4, 9), (4, 15), (4, 21), (4, 27), (4, 33),
(5, 4), (5, 10), (5, 16),
(6, 5), (6, 11), (6, 17), (6, 23), (6, 29),
(7, 6), (7, 12), (7, 18), (7, 24), (7, 30), (7, 36),
(8, 1), (8, 2), (8, 3), (8, 4),
(9, 7), (9, 8), (9, 9), (9, 10), (9, 11),
(10, 13), (10, 14), (10, 15), (10, 16), (10, 17), (10, 18),
(11, 19), (11, 20), (11, 21),
(12, 25), (12, 26), (12, 27), (12, 28),
(13, 31), (13, 32), (13, 33), (13, 34), (13, 35), (13, 36),
(14, 1), (14, 7), (14, 13),
(15, 2), (15, 8), (15, 14), (15, 20), (15, 26),
(16, 3), (16, 9), (16, 15), (16, 21), (16, 27), (16, 33),
(17, 4), (17, 10), (17, 16), (17, 22),
(18, 5), (18, 11), (18, 17), (18, 23), (18, 29), (18, 35),
(19, 6), (19, 12), (19, 18),
(20, 19), (20, 25), (20, 31), (20, 36),
(21, 1), (21, 5), (21, 10), (21, 15), (21, 20), (21, 25), (21, 30);

-- =============================================
-- STATISTICHE FINALI
-- =============================================

SELECT 'Database popolato con successo!' as messaggio;
SELECT 'Marche: ' || COUNT(*) FROM marche;
SELECT 'Prodotti: ' || COUNT(*) FROM prodotti;
SELECT 'Colori: ' || COUNT(*) FROM colori;
SELECT 'Prezzi: ' || COUNT(*) FROM prezzi;
SELECT 'Utenti: ' || COUNT(*) FROM utenti;
SELECT 'Preferiti: ' || COUNT(*) FROM preferiti;
