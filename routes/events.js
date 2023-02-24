//Rutas de usuarios / auth
//host+ /api/events
//localhost:4000/api/events/

const { Router } = require("express");

const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();
const { check } = require("express-validator");

const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/events");
const { fieldValidator } = require("../middlewares/fieldValidators");
const { isDate } = require("../helpers/isDate");

//todas tienen que pasar por la validacion del jwt
//cualquier peticion que pase por esto va a tener que tener token
router.use(validarJWT);
//lo de arriba es para evitar usar esto
// router.get("/", validarJWT, getEventos);
// router.post("/", validarJWT, crearEvento);
// router.put("/:id", validarJWT, actualizarEvento);
// router.delete("/:id", validarJWT, eliminarEvento);

//obtener eventos
router.get("/", getEventos);

//Crear un nuevo event
router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    fieldValidator,
  ],
  crearEvento
);

//Actualizar evento
router.put(
  "/:id",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    fieldValidator,
  ],
  actualizarEvento
);

//Borrar evento
router.delete("/:id", eliminarEvento);

module.exports = router;
