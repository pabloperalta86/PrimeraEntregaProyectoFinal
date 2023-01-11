const auth = (req, res, next) => {
    let admin = false; /* valor true, para restringir acceso a rutas de solo administrador */
    if (admin)
        return res
            .status(401)
            .send({ error: -2, descripcion: `ruta ${req.baseUrl} ${req.url} metodo ${req.method} no autorizada` });
    next();
};

const validationUrl = (req, res, next) => {
    if (isNaN(req.params.id) && isNaN(req.params.id_prod))
        return res
            .status(400)
            .send({ error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada` });
    next();
};

const validationBody = (req, res, next) => {
    let { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    if (!nombre || !descripcion || !codigo || !foto || !precio || !stock) {
        return res.status(400).send({ error: -2, descripcion: `Todos los campos son obligatorios` });
    }
    next();
};

module.exports = {
    auth,
    validationUrl,
    validationBody,
};