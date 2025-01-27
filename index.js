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
        "host": process.env.DB_HOST,
        "user": process.env.DB_USER,
        "database": process.env.DB_NAME,
        "password": process.env.DB_PASSWORD,
        "namedPlaceholders": true,
        waitForConnections: true,
        connectionLimit: 10000,
        queueLimit: 0,
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
            "products": products
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
            "services": services
        })
    });

    app.get("/services/add", async (req, res) => {
        let [serviceType] = await connection.execute(`SELECT * FROM serviceType;`);
        let [staff] = await connection.execute(`SELECT * FROM staff;`);
        res.render("services/add", {
            "serviceType": serviceType,
            "staff": staff
        })
    });

    app.post("/services/add", async (req, res) => {
        let {
            serviceNameInput,
            serviceCostInput,
            serviceTypeId,
            staffId
        } = req.body;

        let query = `INSERT INTO service (
                    name, cost, service_type_id_fk, staff_id_fk)
                    VALUES (?,?,?,?);`;
        let bindings = [
            serviceNameInput,
            serviceCostInput,
            serviceTypeId,
            staffId
        ];

        await connection.execute(query, bindings);
        res.redirect("/services");

    });

    app.get("/services/edit/:id", async (req, res) => {
        let id = req.params.id
        let[service] = await connection.execute(`SELECT * FROM service WHERE service_id = ?`, id)
        service = service[0];
        let [serviceType] = await connection.execute(`SELECT * FROM serviceType;`);
        let [staff] = await connection.execute(`SELECT * FROM staff;`);
        res.render("services/edit", {
            "serviceType": serviceType,
            "staff": staff,
            "service":service
        })
    });

    app.post("/services/edit/:id", async (req, res) => {
        let id = req.params.id;
        let {
            serviceNameInput,
            serviceCostInput,
            serviceTypeId,
            staffId
        } = req.body;

        let query = `UPDATE service SET 
                    name=?, cost=?, service_type_id_fk=?, staff_id_fk=?
                    WHERE service_id= ?;`;
        let bindings = [
            serviceNameInput,
            serviceCostInput,
            serviceTypeId,
            staffId,
            id
        ];

        await connection.execute(query, bindings);
        res.redirect("/services");
    });

    app.get("/services/delete/:id", async function(req,res){
        let id = req.params.id
        let[service] = await connection.execute(`SELECT * FROM service WHERE service_id = ?`, id)
        service = service[0];
        let [serviceType] = await connection.execute(`SELECT * FROM serviceType;`);
        let [staff] = await connection.execute(`SELECT * FROM staff;`);
        res.render("services/delete", {
            "serviceType": serviceType,
            "staff": staff,
            "service":service
        })
    })

    app.post("/services/delete/:id", async function(req, res){
        let id = req.params.id;
        await connection.execute(`DELETE FROM service WHERE service_id = ?`, id);
        res.redirect('/services');
    })

    app.post("/services", async function(req,res) {
        let searchInput = [req.body.searchInput];
        console.log(searchInput);
        let serviceTypeId = searchInput[0];
        console.log("SERVICE TYPE ID >>>", serviceTypeId);
        let [services] = [];
        if (searchInput[0] == 0){
            [services] = await connection.execute({
                sql: `SELECT * FROM service
                    INNER JOIN serviceType ON serviceType.service_type_id = service.service_type_id_fk
                    INNER JOIN staff ON staff.staff_id = service.staff_id_fk;`,
                nestTables: true
            });
        }
        else {
            [services] = await connection.execute({
                sql: `SELECT * FROM service
                    INNER JOIN serviceType ON serviceType.service_type_id = service.service_type_id_fk
                    INNER JOIN staff ON staff.staff_id = service.staff_id_fk
                    WHERE service_type_id_fk = ?;`, 
                nestTables: true
            }, [serviceTypeId]);
        }
        console.log(services)
        res.render("services/index", {
            "services": services
        })
    })

    app.get("/items", async (req, res) => {
        let [items] = await connection.execute({
            sql: `SELECT * FROM item
                INNER JOIN itemType ON itemType.item_type_id = item.item_type_id_fk
                INNER JOIN brand ON brand.brand_id = item.brand_id_fk;`,
            nestTables: true
        });
        res.render("items/index", {
            "items": items
        })
    });

    app.get("/items/add", async (req, res) => {
        let [itemType] = await connection.execute(`SELECT * FROM itemType;`);
        let [brand] = await connection.execute(`SELECT * FROM brand;`);
        res.render("items/add", {
            "itemType": itemType,
            "brand": brand
        })
    });

    app.post("/items/add", async (req, res) => {
        let {
            itemNameInput,
            itemCostInput,
            itemTypeId,
            brandId
        } = req.body;

        let query = `INSERT INTO item (
                    name, cost, item_type_id_fk, brand_id_fk)
                    VALUES (?,?,?,?);`;
        let bindings = [
            itemNameInput,
            itemCostInput,
            itemTypeId,
            brandId
        ];

        await connection.execute(query, bindings);
        res.redirect("/items");
    
    });

    app.get("/items/edit/:id", async (req, res) => {
        let id = req.params.id;
        let [item] = await connection.execute('SELECT * from item WHERE item_id = ?', id);
        item = item[0];
        let [itemType] = await connection.execute(`SELECT * FROM itemType;`);
        let [brand] = await connection.execute(`SELECT * FROM brand;`);
        console.log(item);
        res.render("items/edit", {
            "itemType": itemType,
            "brand": brand,
            "item":item
        })
    });

    app.post("/items/edit/:id", async (req, res) => {
        let id = req.params.id;
        let {
            itemNameInput,
            itemCostInput,
            itemTypeId,
            brandId
        } = req.body;

        let query = `UPDATE item SET 
                    name=?, cost=?, item_type_id_fk=?, brand_id_fk=?
                    WHERE item_id= ?;`;
        let bindings = [
            itemNameInput,
            itemCostInput,
            itemTypeId,
            brandId,
            id
        ];

        await connection.execute(query, bindings);
        res.redirect("/items");
    });

    app.get("/items/delete/:id", async function(req,res){
        let id = req.params.id;
        let [item] = await connection.execute('SELECT * from item WHERE item_id = ?', id);
        item = item[0];
        let [itemType] = await connection.execute(`SELECT * FROM itemType;`);
        let [brand] = await connection.execute(`SELECT * FROM brand;`);
        res.render('items/delete', {
            "itemType": itemType,
            "brand": brand,
            "item":item
        })

    })

    app.post("/items/delete/:id", async function(req, res){
        let id = req.params.id;
        await connection.execute(`DELETE FROM item WHERE item_id = ?`, id);
        res.redirect('/items');
    })

    app.get("/cart", async function(req, res){
        let[cart] = await connection.execute({
            sql:`SELECT * FROM cartItems
                INNER JOIN product ON product.product_id = cartItems.product_id_fk
                INNER JOIN user ON user.user_id = cartItems.user_id_fk;`,
            nestTables: true    
        });
        // cart = cart[0];
        // let [user] = await connection.execute(`SELECT * FROM user;`);
        console.log(cart);
        res.render("cart", {
            "cart":cart,
            // "user":user
        })
    })

    app.get("/cart/add/:id", async function(req, res){
        let id = req.params.id
        let[product] = await connection.execute(`SELECT * FROM product WHERE product_id = ?`, id);
        product = product[0];
        let [user] = await connection.execute(`SELECT * FROM user;`);
        // console.log("PRODUCTS", product);
        res.render("cart/add", {
            "product":product,
            "user":user
        })
    })

    app.post("/cart/add/:id", async function(req, res){
        let { 
            name,
            quantity,
            productId,
            userId
        } = req.body;

        if(productId == "" || !productId){
            productId = null;
        }

        if(userId == "" || !userId){
            userId = null;
        }

        console.log(name,
            quantity,
            productId,
            userId);
        let query = `INSERT INTO cartItems (
                    name, quantity, product_id_fk, user_id_fk)
                    VALUES (?,?,?,?);`;
        let bindings = [
            name,
            quantity,
            productId,
            userId
        ];

        await connection.execute(query, bindings);
        res.redirect('/products');
    })

    app.listen(3000, () => {
        console.log('Server is running')
    });
}

main();