const fs = require("fs");

class ManagerProductos {
    constructor(pathToFile) {
        this.pathToFile = pathToFile;
    }
    async create(producto) {
        try {
            let id = 1;
            if (fs.existsSync(this.pathToFile)) {
                let data = await fs.promises.readFile(this.pathToFile, "utf-8");
                let productos = JSON.parse(data);
                productos.length > 0 ? (id = productos[productos.length - 1].id + 1) : id;
                producto.id = id;
                producto.timestamp = Date.now();
                productos.push(producto);
                await fs.promises.writeFile(this.pathToFile, JSON.stringify(productos, null, 2));
                return { status: "success", mensaje: "Producto Agregado", producto };
            } else {
                producto.id = 1;
                producto.timestamp = Date.now();
                await fs.promises.writeFile(this.pathToFile, JSON.stringify([producto], null, 2));
                return { status: "success", mensaje: "Producto Agregado", producto };
            }
        } catch (error) {
            return { status: "error", mensaje: `Ocurrio un error: ${error}`};
        }
    }
    async modifyById(id, obj) {
        if (fs.existsSync(this.pathToFile)) {
            let data = await fs.promises.readFile(this.pathToFile, "utf-8");
            let productos = JSON.parse(data);
            let productoId = productos.findIndex((prod) => prod.id === id);
            if (productoId !== -1) {
                productos[productoId] = {
                    ...productos[productoId],
                    id: id,
                    nombre: obj.nombre,
                    descripcion: obj.descripcion,
                    codigo: obj.codigo,
                    foto: obj.foto,
                    precio: obj.precio,
                    stock: obj.stock,
                };
                await fs.promises.writeFile(this.pathToFile, JSON.stringify(productos, null, 2));
                return { status: "success", mensaje: `El producto con el id (${id}) fue modificado`, productos };
            }
            return { status: "error", mensaje: `No existe producto con el id (${id})` };
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }
    async getById(id) {
        if (fs.existsSync(this.pathToFile)) {
            let data = await fs.promises.readFile(this.pathToFile, "utf-8");
            let productos = JSON.parse(data);
            let productoId = productos.find((prod) => prod.id === id);
            if (productoId) return { status: "success", mensaje: productoId };
            return { status: "error", mensaje: `No existe producto con el id (${id})` };
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }
    async getAll() {
        if (fs.existsSync(this.pathToFile)) {
            let data = await fs.promises.readFile(this.pathToFile, "utf-8");
            let productos = await JSON.parse(data);
            return { status: "success", productos: productos };
        } else {
            return { status: "error", mensaje: "No existe la base de datos" };
        }
    }
    async deleteById(id) {
        if (!id) return { status: "error", mensaje: "Indique el Id por favor" };
        if (fs.existsSync(this.pathToFile)) {
            let data = await fs.promises.readFile(this.pathToFile, "utf-8");
            let productos = JSON.parse(data);
            let validation = productos.some((prod) => prod.id === id);
            if (validation) {
                let newProductosArray = productos.filter((prod) => prod.id !== id);
                await fs.promises.writeFile(this.pathToFile, JSON.stringify(newProductosArray, null, 2));
                if (newProductosArray.length === 0) {
                    return { status: "success", mensaje: "Producto Eliminado, no hay mas productos" };
                }
                return { status: "success", mensaje: "Producto Eliminado" };
            } else {
                return { status: "error", mensaje: `No existe producto con el id (${id})` };
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
            return { status: "error", mensaje: "Ocurrio un error" };
        }
    }
}

module.exports = ManagerProductos;