import Habitacion from "../database/model/habitacion.js";
export const crearHabitacion = async(req,res)=>{
    try {
        console.log(req.body)
        const habitacionNueva = new Habitacion(req.body)
        await habitacionNueva.save()
        res.status(201).json({
            mensaje: "La habitacion fue creada correctamente",
          });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        mensaje: "Ocurrio un error, no se pudo crear la habitacion",
    });
    }
}
export const borrarHabitacion = async (req,res)=>{
    try {
        const habitacionBuscada = await Habitacion.findById(req.params.id);
        if (!habitacionBuscada) {
            return res.status(404).json({
                mensaje: "La habitacion no fue encontrado",
              });
        }
        await Habitacion.findByIdAndDelete(req.params.id);
        res.status(200).json({
        mensaje: "La habitacion fue borrada correctamente",
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        mensaje: "Ocurrio un error, no se pudo borrar la habitacion",
    });
    }
}
export const editarHabitacion = async (req,res)=>{
    try {
        const habitacionBuscada = await Habitacion.findById(req.params.id)
        if (!habitacionBuscada) {
            return res.status(404).json({
            mensaje: "La habitacion no fue encontrado",
            });
        }
        await Habitacion.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({
            mensaje: "La habitacion fue editado correctamente",
          });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        mensaje: "Ocurrio un error, no se pudo editar la habitacion",
        });
    }
}
export const listarHabitacion = async (req, res) => {
    try {
        // Obtener las fechas de la solicitud (GET params)
        const { fechaEntrada, fechaSalida } = req.query;

        // Validar que se hayan enviado las fechas
        if (!fechaEntrada || !fechaSalida) {
            return res.status(400).json({
                mensaje: "Por favor, proporciona las fechas de entrada y salida para buscar habitaciones.",
            });
        }

        // Convertir las fechas a objetos Date
        const fechaEntradaDate = new Date(fechaEntrada);
        const fechaSalidaDate = new Date(fechaSalida);

        // Validar que las fechas son válidas
        if (isNaN(fechaEntradaDate) || isNaN(fechaSalidaDate)) {
            return res.status(400).json({
                mensaje: "Las fechas proporcionadas son inválidas.",
            });
        }

        // Buscar habitaciones disponibles entre las fechas proporcionadas
        const arrayHabitaciones = await Habitacion.find({
            disponibilidad: true,
            $or: [
                { fechaSalida: { $gte: fechaEntradaDate } }, // Habitaciones que ya se han salido
                { fechaEntrada: { $gte: fechaSalidaDate } }  // Habitaciones que todavía no han entrado
            ]
        });

        // Si no hay habitaciones disponibles
        if (arrayHabitaciones.length === 0) {
            return res.status(404).json({ mensaje: 'No hay habitaciones disponibles en las fechas seleccionadas.' });
        }

        // Devuelve las habitaciones disponibles
        res.status(200).json({ habitaciones: arrayHabitaciones });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Ocurrió un error, no se pudieron buscar las habitaciones.",
        });
    }
};
export const obtenerHabitacion = async (req,res)=>{
    try {
        console.log(req.params.id)
        const habitacionBuscada = await Habitacion.findById(req.params.id)
        if (!habitacionBuscada) {
            return res.status(404).json({
                mensaje: "La habitacion no fue encontrado",
                });
        }
        res.status(200).json(habitacionBuscada)
    } catch (error) {
        console.error(error);
        res.status(500).json({
        mensaje: "Ocurrio un error, no se pudo obtener la habitacion",
    });
    }
}

export const listarHabitacionesAdmin = async (req,res) =>{
    try {
        const listadoHabitaciones =  await Habitacion.find()
        res.status(200).json(listadoHabitaciones)

    } catch (error) {
        console.error(error)
        res.status(500).json({
            mensaje: "Ocurrio un error, no se pudo obtener la lista de habitaciones",
        })
    }
}

export const listarHabitacionesDisponibles = async (req, res)=>{
    try {
        const habitacionesDisponibles = await  Habitacion.find({ disponibilidad: true })
      res.status(200).json(habitacionesDisponibles)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            mensaje: "Ocurrio un error, no se pudo obtener la lista de habitaciones disponibles"
        })
    }
}