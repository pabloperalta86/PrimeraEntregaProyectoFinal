const fs = require("fs");

class ManagerCarrito {
    constructor(pathToFile) {
        this.pathToFile = pathToFile;
    }
    async create() {
        try {
            let id = 1;
            let carrito = {};
            if (fs.existsSync(this.pathToFile)) {
                let data = await fs.promises.readFile(this.pathToFile, "utf-8");
                let carritos = JSON.parse(data);
                carritos.length > 0 ? (id = carritos[carritos.length - 1].id + 1) : id;
                carrito.id = id;
                carrito.timestamp = Date.now();
                carrito.productos = [];
                carritos.push(carrito);
                await fs.promises.writeFile(this.pathToFile, JSON.stringify(carritos, null, 2));
                return { status: "success", mensaje: "Carrito agregado", carrito };
            } else {
                carrito.id = 1;
                carrito.timestamp = Date.now();
                carrito.productos = [];
                await fs.promises.writeFile(this.pathToFile, JSON.stringify([carrito], null, 2));
                return { status: "success", mensaje: "Carrito agregado", carrito };
            }
        } catch (error) {
            return { status: "error", mensaje: "Ocurrio un error" };
        }
    }
    async addProduct(id, obj) {
        if (fs.existsSync(this.pathToFile)) {
            let data = await fs.promises.readFile(this.pathToFile, "utf-8");
            let carritos = JSON.parse(data);
            let carritoId = carritos.find((cart) => cart.id === id);
            carritoId.productos.push({ ...obj });
            await fs.promises.writeFile(this.pathToFile, JSON.stringify(carritos, null, 2));
            return { status: "success", mensaje: `Se agrego el producto id:(${obj.id}) al carrito con id:(${id})` };
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }
    async getById(id) {
        if (fs.existsSync(this.pathToFile)) {
            let data = await fs.promises.readFile(this.pathToFile, "utf-8");
            let carritos = JSON.parse(data);
            let cartId = carritos.find((cart) => cart.id === id);
            if (cartId) return { status: "success", mensaje: `Se encontro el carrito con el id:(${id})`, carrito: cartId };
            return { status: "error", mensaje: `No existe carrito con el id:(${id})` };
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }
    async getAll() {
        if (fs.existsSync(this.pathToFile)) {
            let data = await fs.promises.readFile(this.pathToFile, "utf-8");
            let carritos = await JSON.parse(data);
            return { status: "success", carritos: carritos };
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }
    async deleteProduct(idCart, idProd) {
        if (fs.existsSync(this.pathToFile)) {
            let data = await fs.promises.readFile(this.pathToFile, "utf-8");
            let carritos = JSON.parse(data);
            let carritoId = carritos.findIndex((cart) => cart.id === idCart);
            let producto = carritos[carritoId].productos.some((prod) => prod.id === idProd);
            if (!producto) {
                return { status: "error", mensaje: `No existe el producto con id:(${idProd}) en el carrito` };
            }
            let newObject = carritos[carritoId].productos.filter((prod) => prod.id !== idProd);
            if (carritoId !== -1) {
                carritos[carritoId].productos = newObject;
            }
            let carritoActualizado = carritos[carritoId];
            await fs.promises.writeFile(this.pathToFile, JSON.stringify(carritos, null, 2));
            return { status: "success", mensaje: `El producto con id:(${idProd}) fue eliminado`, carritoActualizado };
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }
    async deleteById(id) {
        if (fs.existsSync(this.pathToFile)) {
            let data = await fs.promises.readFile(this.pathToFile, "utf-8");
            let carritos = JSON.parse(data);
            let validacion = carritos.some((cart) => cart.id === id);
            if (validacion) {
                let newCarritosArray = carritos.filter((cart) => cart.id !== id);
                await fs.promises.writeFile(this.pathToFile, JSON.stringify(newCarritosArray, null, 2));
                if (newCarritosArray.length === 0) {
                    return { status: "success", mensaje: "Carrito eliminado, no hay mas carritos" };
                }
                return { status: "success", mensaje: `Carrito con id:(${id}) fue eliminado` };
            } else {
                return { status: "error", mensaje: `No existe carrito con el id:(${id})` };
            }
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }
    async deleteAll() {
        if (fs.existsSync(this.pathToFile)) {
            await fs.promises.unlink(this.pathToFile);
            return { status: "success", mensaje: "Todos los productos fueron eliminados" };
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }
}

module.exports = ManagerCarrito;