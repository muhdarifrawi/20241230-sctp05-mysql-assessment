-- DDL

CREATE DATABASE bicycleShop;

USE bicycleShop;

CREATE TABLE serviceType (
	service_type_id INT AUTO_INCREMENT PRIMARY KEY, 
	name varchar(45)
);
CREATE TABLE staff (
	staff_id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(45),
	date_joined DATE,
	title varchar(45)
);
CREATE TABLE brand (
	brand_id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(45)
);
CREATE TABLE itemType (
	item_type_id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(45)
);
CREATE TABLE user (
	user_id	INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(45),
	birthdate DATE
);

-- create shared tables
CREATE TABLE service (
	service_id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(45),
	cost float,
	service_type_id_fk INT,
	staff_id_fk INT,
	FOREIGN KEY (service_type_id_fk) REFERENCES serviceType (service_type_id) ON DELETE SET NULL,
	FOREIGN KEY (staff_id_fk) REFERENCES staff (staff_id) ON DELETE SET NULL
);

CREATE TABLE item (
	item_id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(45),
	cost float,
	brand_id_fk INT,
	item_type_id_fk INT,
	FOREIGN KEY (brand_id_fk) REFERENCES brand (brand_id) ON DELETE SET NULL,
	FOREIGN KEY (item_type_id_fk) REFERENCES itemType (item_type_id) ON DELETE SET NULL
);

CREATE TABLE product (
	product_id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(45),
	item_id_fk INT,
	service_id_fk INT,
	FOREIGN KEY (item_id_fk) REFERENCES item(item_id) ON DELETE CASCADE,
	FOREIGN KEY (service_id_fk) REFERENCES service(service_id) ON DELETE CASCADE
);

CREATE TABLE cartItems (
	cart_id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(45),
	product_id_fk INT,
	user_id_fk INT,
	FOREIGN KEY (product_id_fk) REFERENCES product(product_id) ON DELETE CASCADE,
	FOREIGN KEY (user_id_fk) REFERENCES user(user_id) ON DELETE CASCADE,
	quantity INT
);
