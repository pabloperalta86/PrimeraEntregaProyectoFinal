
const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();
const productsRouter = require("./routes/routes.productos");
const cartRouter = require("./routes/routes.carrito");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", productsRouter);
app.use("/api/carritos", cartRouter);
app.use((req, res) => {
    res
        .status(404)
        .send({ error: -2, descripcion: `ruta ${req.baseUrl} ${req.url} metodo ${req.method} no implementada` });
});

app.listen(PORT, () => {
    console.log(`>>>>> 🚀 Server Up! Port: http://localhost:${PORT} <<<<<`);
});