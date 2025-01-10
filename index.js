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
            sql: `SELECT * FROM service;`,
            nestTables: true
        });
        res.render("services/index", {
            "services":services
        })
    });

    app.get("/items", async (req, res) => {
        let [items] = await connection.execute({
            sql: `SELECT * FROM item;`,
            nestTables: true
        });
        res.render("items/index", {
            "items":items
        })
    });

    app.listen(3000, () => {
        console.log('Server is running')
    });
}

main();