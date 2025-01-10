-- data

USE bicycleShop;

INSERT INTO serviceType (name) VALUES
("Repairs"),
("Maintenance"),
("Cleaning");

INSERT INTO staff (name, date_joined, title) VALUES 
("John Doe", "2020-05-25", "Mechanic"),
("Jane Dame", "2020-06-12", "Mechanic"),
("Yosemite Sam", "2012-06-22", "Senior Mechanic");

INSERT INTO brand (name) VALUES 
("Bianchi"),
("Cannondale"),
("Cervélo"),
("Fuji Bikes"),
("Giant"),
("Merida Bikes"),
("Trek"),
("BMC"),
("Colnago"),
("Kona"),
("KTM"),
("Marin Bikes"),
("Mongoose"),
("Orient Bikes"),
("Aist Bicycles"),
("Baltik vairas"),
("Basso Bikes"),
("Boardman Bikes"),
("BOTTECCHIA"),
("Bridgestone"),
("Cinelli"),
("Author"),
("Bike Attack"),
("Diamondback"),
("Shimano");

INSERT INTO itemType (name) VALUES 
("Fork"),
("Headset"),
("Stem"),
("Handlebars"),
("Brake Levers"),
("Brakes"),
("Wheel Set"),
("Hub"),
("Spoke"),
("Rim"),
("Tire"),
("Tire Tube"),
("Valve"),
("Chain"),
("Gear Set"),
("Rear Derailleur"),
("Cassette"),
("Front Derailleur"),
("Chainrings"),
("Crank Arm"),
("Pedal"),
("Seat"),
("Seat Post"),
("Frame"),
("Full Set Bicycle");

INSERT INTO user (name, birthdate) VALUES
("Comot", "1991-10-21"),
("Gasing", "1989-04-06");

INSERT INTO service (name, cost, service_type_id_fk, staff_id_fk) VALUES
("[John] Servicing Only", 100, 2, 1),
("[John] Deep Cleaning Only", 80, 3, 1),
("[Jane] Servicing and repairs", 150, 2, 2),
("[Jane] Deep Cleaning Only", 80, 3, 2),
("[Jane] Quick Clean Only", 40, 3, 2),
("[YS] Overhaul Repair", 300, 1, 3),
("[YS] Inspection and Repair", 350, 1, 3);

INSERT INTO item(name, cost, brand_id_fk, item_type_id_fk) VALUES 
("Cannondale Lefty Ocho 120 Carbon", 2174, 2, 1),
("Cannondale Lefty Ocho Alloy", 1405, 2, 1),
("Shimano 105 BR R7000 Ultegra R8000", 58.15, 25, 6),
("Shimano MT200 Hydraulic Disc Brake Set", 58.64, 25, 6),
("TREK FULL STACHE 29 MOUNTAIN BIKE FRAME 2021", 1508, 7, 24);

INSERT INTO product (name, item_id_fk, service_id_fk) values 
("Fork Replacement - Cannondale", 2, 3),
("Bike Inspection - Any", null, 7);