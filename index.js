const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");

require("dotenv").config();

let app = express();

app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

const helpers = require("handlebars-helpers");

helpers({
    "handlebars": hbs.handlebars
})

const { createConnection } = require('mysql2/promise');

let connection;

async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

    app.get("/", (req, res) => {
        res.render("homepage/index")
    })

    app.get("/products", async (req, res) => {
        let [products] = await connection.execute({
            sql: `SELECT * FROM product
                LEFT JOIN item ON item.item_id = product.item_id_fk
                LEFT JOIN service ON service.service_id = product.service_id_fk;`,
            nestTables: true
        });
        res.render("products/index", {
            "products":products
        })
    });

    app.get("/services", async (req, res) => {
        let [services] = await connection.execute({
            sql: `SELECT * FROM service
                INNER JOIN serviceType ON serviceType.service_type_id = service.service_type_id_fk
                INNER JOIN staff ON staff.staff_id = service.staff_id_fk;`,
            nestTables: true
        });
        res.render("services/index", {
            "services":services
        })
    });

    app.get("/services/add", async (req, res) => {
        let [serviceType] = await connection.execute(`SELECT * FROM serviceType;`);
        let [staff] = await connection.execute(`SELECT * FROM staff;`);
        res.render("services/add", {
            "serviceType":serviceType,
            "staff":staff
        })
    });

    app.get("/items", async (req, res) => {
        let [items] = await connection.execute({
            sql: `SELECT * FROM item
                INNER JOIN itemType ON itemType.item_type_id = item.item_type_id_fk
                INNER JOIN brand ON brand.brand_id = item.brand_id_fk;`,
            nestTables: true
        });
        res.render("items/index", {
            "items":items
        })
    });

    app.get("/items/add", async (req, res) => {
        let [itemType] = await connection.execute(`SELECT * FROM itemType;`);
        let [brand] = await connection.execute(`SELECT * FROM brand;`);
        res.render("items/add", {
            "itemType":itemType,
            "brand":brand
        })
    });

    app.listen(3000, () => {
        console.log('Server is running')
    });
}

main();