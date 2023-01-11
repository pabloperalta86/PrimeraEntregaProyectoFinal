const express = require("express");
const cartRouter = express.Router();
const ManagerCarrito = require("../controllers/managerCarritos.js");
const managerCarrito = new ManagerCarrito("src/data/carritos.json");
const ManagerProductos = require("../controllers/managerProductos.js");
const managerProductos = new ManagerProductos("src/data/productos.json");
const { validationUrl } = require("../controllers/middleware.js");

cartRouter.get("/", async (req, res) => {
    let list = await managerCarrito.getAll();
    list.status === "error" ? res.status(400).send(list) : res.send(list);
});

cartRouter.get("/:id", validationUrl, async (req, res) => {
    let item = await managerCarrito.getById(parseInt(req.params.id));
    item.status === "error" ? res.status(400).send(item) : res.send(item);
});

cartRouter.get("/:id/productos", validationUrl, async (req, res) => {
    let item = await managerCarrito.getById(parseInt(req.params.id));
    item.status === "error" ? res.status(400).send(item) : res.send(item);
});

cartRouter.post("/", async (req, res) => {
    res.send(await managerCarrito.create());
});

cartRouter.post("/:id/productos/:id_prod", validationUrl, async (req, res) => {
    let carrito = await managerCarrito.getById(parseInt(req.params.id));
    if (carrito.status === "error") {
        return res.status(400).send(carrito);
    }
    let producto = await managerProductos.getById(parseInt(req.params.id_prod));
    if (producto.status === "error") {
        return res.status(400).send(producto);
    } else {
        let agregar = await managerCarrito.addProduct(parseInt(req.params.id), producto.mensaje);
        res.send(agregar);
    }
});

cartRouter.delete("/:id/productos/:id_prod", validationUrl, async (req, res) => {
    let carrito = await managerCarrito.getById(parseInt(req.params.id));
    if (carrito.status === "error") {
        return res.status(400).send(carrito);
    }
    let producto = await managerCarrito.deleteProduct(parseInt(req.params.id), parseInt(req.params.id_prod));
    producto.status === "error" ? res.status(400).send(producto) : res.send(producto);
});

cartRouter.delete("/:id", validationUrl, async (req, res) => {
    let item = await managerCarrito.deleteById(parseInt(req.params.id));
    item.status === "error" ? res.status(400).send(item) : res.send(item);
});

module.exports = cartRouter;