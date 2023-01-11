const express = require("express");
const productsRouter = express.Router();
const ManagerProductos = require("../controllers/managerProductos.js");
const managerProductos = new ManagerProductos("src/data/productos.json");
const { validationUrl, auth, validationBody } = require("../controllers/middleware");

productsRouter.get("/", async (req, res) => {
    let list = await managerProductos.getAll();
    list.status === "error" ? res.status(400).send(list) : res.send(list);
});

productsRouter.get("/:id", validationUrl, async (req, res) => {
    let item = await managerProductos.getById(parseInt(req.params.id));
    item.status === "error" ? res.status(400).send(item) : res.send(item);
});

productsRouter.post("/", auth, validationBody, async (req, res) => {
    res.send(await managerProductos.create(req.body));
});

productsRouter.put("/:id", auth, validationUrl, validationBody, async (req, res) => {
    let item = await managerProductos.modifyById(parseInt(req.params.id), req.body);
    item.status === "error" ? res.status(400).send(item) : res.send(item);
});

productsRouter.delete("/:id", auth, validationUrl, async (req, res) => {
    let item = await managerProductos.deleteById(parseInt(req.params.id));
    item.status === "error" ? res.status(400).send(item) : res.send(item);
});

module.exports = productsRouter;