const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const {ApolloServer, gql} = require('apollo-server-express');
const { merge } = require('lodash');

const Usuario = require('./models/usuario');
const Perfil = require('./models/perfil');
const Producto = require('./models/producto');
const Categoria = require('./models/categoria');
const Menu = require('./models/menu');
const Carro = require('./models/carro');
const Pago = require('./models/pago')
const Orden = require('./models/orden');
const Lista_Ordenes = require('./models/lista_ordenes');
const Lista_Usuarios = require('./models/lista_usuarios')

mongoose.connect('mongodb+srv://benja2018:benja2020@cluster1.hfeg7i8.mongodb.net/bdwebmovil3', {useNewUrlParser: true, useUnifiedTopology: true});

const typeDefs = gql`
type Usuario{
   id: ID!
   nombre: String!
   direccion: String!
   email: String!
   pass: String!
   telefono: String!
   sexo: String
   idPerfil: Perfil
   fechaCreacion: String!
}

type Perfil{
    id: ID!
    nombre: String!
    idUsuarios: [Usuario]
}

type Producto{
    id: ID!
    nombre: String!
    precio: Int!
    idCategoria: Categoria
    nombreCategoria: Categoria
}

type Categoria{
    id: ID!
    nombre: String!
    idProductos: [Producto]
}

type Menu{
    id: ID!
    idProducto: Producto!
    nombreProducto: Producto!
    precio: Producto!
    descripcion: String
}

type Carro{
    id: ID!
    idProductos: [Menu]
    total: Int
    usuario: Usuario!
}

type Pago{
    id: ID!
    fecha: String!
    total: Carro!
    idUsuario: Carro!
    tipoPago: String!
    estado: Int!
}

type Orden{
    id: ID!
    estadoPago: Pago
    estadoOrden: String!
    tipoEntrega: String!
    fecha: String!
    idProductos: [Carro]!
    total: Carro!
    idUsuario: Carro!
    nombreUsuario: Usuario!
    emailUsuario: Usuario!
    direccionUsuario: Usuario!
}

type Lista_Ordenes{
    id: ID!
    estadoOrden: Orden!
    fechaOrden: Orden!
    idOrden: Orden!
}

type Lista_Usuarios{
    id: ID!
    idUsuario: Usuario!
    emailUsuario: Usuario!
    fechaCreacion: Usuario!
    perfilUsuario: Perfil!
}

type Alert{
    message: String
}

input PerfilInput{
    nombre: String
    usuarioString: String
}

input CategoriaInput{
    nombre: String
    productoString: String
}

input MenuInput{
    descripcion: String
    productoString: String
}

input UsuarioInput{
    nombre: String
    direccion: String
    email: String
    pass: String
    telefono: String
    sexo: String
    perfilString: String
}

input ProductoInput{
    nombre: String
    precio: Int
    categoriaString: String
}

input UpdateInput{
    productoString: String
}

input CarroInput{
    usuarioString: String
}
input CarroInputProductos{
    menuString: String
}

input PagoInput{
    carroString: String!
    tipoPago: String!
    estado: Int!
}

input OrdenInput{
    carroString: String!
    estadoOrden: String!
    tipoEntrega: String!
    pagoString: String
}

input Lista_OrdenesInput{
    ordenString: String!
}

input Lista_UsuariosInput{
    usuarioString: String!
}

input InputEstadoPago{
    estado: Int
}

input InputEstadoOrden{
    estadoOrden: String
}


type Query{
    getUsuarios: [Usuario]
    getUsuariosFull: [Usuario]
    getUsuario(id: ID!): Usuario
    getPerfiles: [Perfil]
    getPerfil(id: ID!): Perfil
    getProductos: [Producto]
    getProducto(id: ID!): Producto
    getCategorias: [Categoria]
    getCategoria(id: ID!): Categoria
    getMenus: [Menu]
    getMenu(id: ID!): Menu
    getCarros: [Carro]
    getCarro(id: ID!): Carro
    getPagos: [Pago]
    getPago(id: ID!): Pago
    getOrdenes: [Orden]
    getOrden(id: ID!): Orden
    getLista_Ordenes: [Lista_Ordenes]
    getLista_Orden(id:ID!): Lista_Ordenes
    getLista_Usuarios: [Lista_Usuarios]
    getLista_Usuario(id: ID!): Lista_Usuarios
}

type Mutation{
    addUsuario(input: UsuarioInput): Usuario
    addPerfil(input: PerfilInput): Perfil
    addProducto(input: ProductoInput): Producto
    addCategoria(input: CategoriaInput): Categoria
    addMenu(input: MenuInput): Menu
    addCarro(input: CarroInput): Carro
    addPago(input: PagoInput): Pago
    addOrden(input: OrdenInput): Orden
    addLista_Ordenes(input: Lista_OrdenesInput): Lista_Ordenes
    addLista_Usuarios(input: Lista_UsuariosInput): Lista_Usuarios
    updateCarroProductos(id: ID!, input: CarroInputProductos): Carro
    updateUsuario(id: ID!, input: UsuarioInput): Usuario
    updatePerfil(id: ID!, input: PerfilInput): Perfil
    updateProducto(id: ID!, input: ProductoInput): Producto
    updateCategoria(id: ID!, input: CategoriaInput): Categoria
    updateMenu(id: ID!, input: MenuInput): Menu
    updateEstadoPago(id: ID!, input: InputEstadoPago): Pago
    updateEstadoOrden(id: ID!, input: InputEstadoOrden): Orden
    updatePago(id: ID!, input: PagoInput): Pago
    updateOrden(id: ID!, input: OrdenInput): Orden
    updateLista_Ordenes(id: ID!, input: Lista_OrdenesInput): Lista_Ordenes
    updateLista_Usuarios(id: ID!, input: Lista_UsuariosInput): Lista_Usuarios
    deleteUsuario(id: ID!): Alert
    deletePerfil(id: ID!): Alert
    deleteProducto(id: ID!): Alert
    deleteCategoria(id: ID!): Alert
    deleteMenu(id: ID!): Alert
    deleteCarro(id: ID!): Alert
    deletePago(id: ID!): Alert
    deleteOrden(id: ID!): Alert
    deleteLista_Ordenes(id: ID!): Alert
    deleteLista_Usuarios(id: ID!): Alert
}
`

const resolvers = {
    Query: {
        // Busca a todos los usuarios
        async getUsuarios(obj){
            const usuarios = await Usuario.find();
            return usuarios;
        },
        // Busca a solo un usuario por su ID
        async getUsuario(obj, { id }){
            const usuario = await Usuario.findById(id);
            return usuario;
        },
        // Busca todos los perfiles
        async getPerfiles(obj){
            const perfiles = await Perfil.find();
            return perfiles
        },
        // Busca solo un perfil por ID
        async getPerfil(obj,{id}){
            const perfil = await Perfil.findById(id);
            return perfil
        },
        // Busca todos los productos
        async getProductos(obj){
            const productos = await Producto.find();
            console.log(productos)
            return productos;
        },
        // Busca solo un producto por su ID
        async getProducto(obj, { id }){
            const producto = await Producto.findById(id);
            return producto;
        },
        // Busca todas las categorias
        async getCategorias(obj){
            const categorias = await Categoria.find();
            return categorias;
        },
        // Busca solo una categoria por su ID
        async getCategoria(obj, { id }){
            const categoria = await Categoria.findById(id);
            return categoria;
        },
        // Busca todos los items del menu
        async getMenus(obj){
            const menus = await Menu.find();
            return menus;
        },
        // Busca solo un item por su ID
        async getMenu(obj, { id }){
            const menu = await Menu.findById(id);
            return menu;
        },
        // Busca todos los carros de compra
        async getCarros(obj){
            const carros = await Carro.find();
            return carros;
        },
        // Busca solo un carro de compra por su id
        async getCarro(obj, { id }){
            const carro = await Carro.findById(id);
            return carro;
        },
        // Busca todas las instancias de pago
        async getPagos(obj){
            const pagos = await Pago.find();
            return pagos;
        },
        // Busca solo una instancia por su ID
        async getPago(obj, { id }){
            const pago = await Pago.findById(id);
            return pago;
        },
        // Busca todas las ordenes de venta
        async getOrdenes(obj){
            const ordenes = await Orden.find();
            return ordenes;
        },
        // Busca solo una orden por su ID
        async getOrden(obj, { id }){
            const orden = await Orden.findById(id);
            return orden;
        },
        // Busca todos los items de la lista de ordenes
        async getLista_Ordenes(obj, {id}){
            const lista_ordenes = await Lista_Ordenes.findById(id);
            return lista_ordenes;
        },
        // Busca solo un item de la lista de ordenes
        async getLista_Orden(obj, {id}){
            const lista_orden = await Lista_Ordenes.findById(id);
            return lista_orden;
        },
        // Busca todos los items de la lista de usuarios
        async getLista_Usuarios(obj, {id}){
            const lista_usuarios = await Lista_Usuarios.findById(id);
            return lista_usuarios;
        },
        // Busca solo un item de la lista de usuarios por su ID
        async getLista_Usuario(obj, {id}){
            const lista_usuario = await Lista_usuarios.findById(id);
            return lista_usuario;
        }
    },
    Mutation: {
        // Crea un nuevo usuario
        async addUsuario(obj, { input }){
            // Guarda input en variables individuales
            let {nombre, direccion, email, pass, telefono, sexo, perfilString} = input;
            // Busca el perfil seleccionado para el usuario
            let perfilB = await Perfil.findById(perfilString);
            // Guarda la fecha/horario en que se crea el usuario
            let fecha = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            let usuario;
            if(perfilB === null){
                // Si el requerimiento dice agregar usuario independiente si encuentra el perfil
                usuario = new Usuario({nombre:nombre, direccion:direccion, email: email, pass: pass, 
                                    telefono:telefono, sexo:sexo, fechaCreacion:fecha});
                await usuario.save();
            }else{
                // Crea el usuario
                usuario = new Usuario({nombre:nombre, direccion:direccion, email: email,
                     pass: pass, telefono:telefono, sexo:sexo, idPerfil: perfilB._id, fechaCreacion:fecha});
                await usuario.save();
            }
            return usuario;
        },
        // Actualiza el usuario
        async updateUsuario(obj, {id, input}){
            // Guarda string con id del perfil
            let {perfilString} = input;
            // Busca perfil
            let perfilB = await Perfil.findById(perfilString);
            let usuario;
            if(perfilB === null){
                // Actualiza sin perfil
                usuario = await Usuario.findByIdAndUpdate(id, input);
            }else{
                // Actualiza con perfil
                usuario = await Usuario.findByIdAndUpdate(id, input, {idPerfil: perfilB._id});
            }
            
            return usuario;
        },
        // Borra el usuario con el id seleccionado
        async deleteUsuario(obj, {id}){
            await Usuario.deleteOne({ _id: id});
            return{
                message: "Usuario eliminado"
            }
        },
        // Crea un perfil nuevo
        async addPerfil(obj, { input }){
            const perfil = new Perfil(input);
            await perfil.save();
            return perfil;
        },
        async updatePerfil(obj, { id, input }){
            // Guarda el string del id del usuario y su nombre
            let {usuarioString, nombre} = input;
            // Busca el usuario por su ID
            let usuarioB = await Usuario.findById(usuarioString);
            let perfil
            if(usuarioB === null){
                // Actualiza solo el nombre
                perfil = Perfil.findByIdAndUpdate(id, {nombre: nombre})
            }
            else{
                // Busca perfil
                perfil = await Perfil.findById(id);
                // Revisa si id ya existe
                if(perfil.idUsuarios.includes(usuarioB._id)){
                    console.log("Usuario ya agregado")
                }else{
                    // Agrega id de usuario si ya no esta agregada
                    perfil.idUsuarios.push(usuarioB._id)
                    await perfil.save()
                }
                // Actualiza nombre si se ingreso alguno
                perfil = Perfil.findByIdAndUpdate(id, {nombre: nombre})
            }
            return perfil;
        },
        // Borra un perfil
        async deletePerfil(obj, {id}){
            await Perfil.deleteOne({ _id: id});
            return{
                message: "Perfil eliminado"
            }
        },
        // Crea un nuevo producto
        async addProducto(obj, {input}){
            // Guarda el input en variables
            let {nombre, precio, categoriaString} = input;
            // Busca la categoria seleccionada
            let categoriaB = await Categoria.findById(categoriaString);
            let producto;
            // Si no hay categoria
            if(categoriaB == null){
                // Agrega solo el nombre y precio
                producto = new producto({nombre: nombre, precio: precio});
                await producto.save();
            }
            else{
                // Agrega todo
                producto = new Producto({nombre: nombre, precio: precio, idCategoria: categoriaB._id, nombreCategoria: categoriaB.nombre});
                await producto.save();
            }
            return producto;
        },
        // Actualiza el producto
        async updateProducto(obj, {id, input}){
            // Guarda id de categoria en variable
            let {categoriaString} = input;
            // Busca categoria
            let categoriaB = await Categoria.findById(categoriaString)
            let producto;
            // Si no hay categoria, solo agrega el resto del input
            if(categoriaB === null){
                producto = await Producto.findByIdAndUpdate(id, input);
            }else{
                // Agrega todo
                producto = await Producto.findByIdAndUpdate(id, input, {idCategoria: categoriaB._id, nombreCategoria: categoriaB.nombre})
            }
            return producto;
        },
        // Borra un producto por ID
        async deleteProducto(obj, {id}){
            await Producto.deleteOne({ _id: id});
            return{
                message: "Producto eliminado"
            }
        },
        // Crea una categoria de productos nueva
        async addCategoria(obj, {input}){
            const categoria = new Categoria(input);
            await categoria.save();
            return categoria;
        },
        // Actualiza la categoria por ID
        async updateCategoria(obj, { id, input }){
            // Guarda input en variables
            let {nombre, productoString} = input;
            // Busca el producto que se desea agregar
            let productoB = await Producto.findById(productoString);
            let categoria;
            // Si no hay producto, solo actualiza el resto
            if(productoB === null){
                categoria = await Categoria.findByIdAndUpdate(id, input);
            }
            else{
                // Busca perfil
                categoria = await Categoria.findById(id);
                // Revisa si id ya existe
                if(categoria.idProductos.includes(productoB._id)){
                    console.log("Producto ya agregado")
                }else{
                    // Si ya no esta el producto en la categoria, lo agruega
                    categoria.idProductos.push(productoB._id)
                    await categoria.save()
                }
                // Actualiza el resto
                categoria = await Categoria.findByIdAndUpdate(id, input);
            }
            return categoria;
        },
        // Borra una categoria por ID
        async deleteCategoria(obj, {id}){
            await Categoria.deleteOne({ _id: id});
            return{
                message: "Categoria eliminada"
            }
        },
        // Agruega productos al menu
        async addMenu(obj, { input }){
            // Guarda la descripcion y el id del producto en string
            let {descripcion, productoString} = input;
            // Busca el producto por ID
            let productoB = await Producto.findById(productoString);
            let menu;
            // Si no hay producto, no se crea un item en el menu
            if(productoB === null){
                return{
                    message:"No existe producto"
                }
            }else{
                // Agrega el producto y una descripcion al menu
                menu = new Menu({idProducto: productoB._id, nombreProducto: productoB.nombre, precio:productoB.precio,
                                descripcion: descripcion});
                await menu.save();
            }
            return menu;
        },
        // Actualiza un item del menu por ID
        async updateMenu(obj, {id, input}){
            // Guarda la descripcion y el string del id del usuario
            let {descripcion, productoString} = input;
            // Busca el producto por ID
            let productoB = await Producto.findById(productoString);
            let menu;
            // Si no hay producto, actualiza el resto
            if(productoB === null){
                menu = await Menu.findByIdAndUpdate(id, input);
            }else{
                // Actualiza todo
                menu = await Menu.findByIdAndUpdate(id, {idProducto: productoB._id, nombreProducto: productoB.nombre, precio:productoB.precio,
                                descripcion: descripcion});
                await menu.save();
            }
            return menu;
        },
        // Borra un item del menu por ID
        async deleteMenu(obj, {id}){
            await Menu.deleteOne({ _id: id});
            return{
                message: "Menu eliminado"
            }
        },
        // Crea una nueva instancia de carro de compras
        async addCarro(obj, { input }){
            // Guarda el string del id del usuario
            let {usuarioString} = input;
            // Busca el usuario por ID
            let usuarioB = await Usuario.findById(usuarioString);
            let carro;
            // Si no hay usuario, no se crea la instancia.
            if(usuarioB === null){
                return {
                    message: "No existe usuario"
                }
            }else{
                // Se agrega el usuario al carro
                carro = new Carro({usuario: usuarioB._id, total:0});
                await carro.save();
            }
            return carro;
        },
        // Actualiza los productos del carro
        async updateCarroProductos(obj, { id, input }){
            // Guarda el string del id del producto del menu que se quiere agregar
            let {menuString} = input;
            // Busca el producto en el menu por id
            let menuB = await Menu.findById(menuString);
            let carro
            // Si no hay producto, no se hace nada
            if(menuB === null){
                return{
                    message: "No existe producto"
                }
            }
            else{
                // Busca carro
                carro = await Carro.findById(id);
                // Agrega producto a arreglo
                console.log(menuB.idProducto)
                carro.idProductos.push(menuB.idProducto);
                // Suma precio producto a total
                carro.total += menuB.precio;
                await carro.save();
            }
            return carro;
        },
        // Borra una instancia de carro por ID
        async deleteCarro(obj, {id}){
            await Carro.deleteOne({ _id: id});
            return{
                message: "Carro eliminado"
            }
        },
        // Crea una instancia de pago
        async addPago(obj, {input}){
            // Guarda el string del id del carro, el tipo de pago, y el estado del pago
            let {carroString, tipoPago, estado} = input;
            // Busca el carro de compras por id
            let carroB = await Carro.findById(carroString);
            let pago;
            // Si no hay carro, no se crea la instancia
            if(carroB === null){
                return{
                    message: "No existe carro"
                }
            }
            else{
                // Guarda la fecha en la que se realiza el pago
                const fecha = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                // Agrega todo
                pago = new Pago({fecha: fecha, total: carroB.total, idUsuario: carroB.usuario, tipoPago:tipoPago, estado: estado});
                await pago.save();
            }
            return pago;
        },
        // Actualiza solo el estado del pago
        async updateEstadoPago(obj, {id, input}){
            const pago = await Pago.findByIdAndUpdate(id, input);
            return pago;
        },
        // Actualiza la toda la instancia del pago
        async updatePago(obj, {id, input}){
            // Guarda el string del id del carro, el tipo de pago, y el estado del pago
            let {carroString, tipoPago, estado} = input;
            // Busca el carro de compras por ID
            let carroB = await Carro.findById(carroString);
            let pago;
            // Si no hay carro de compras, actualiza lo restante
            if(carroB === null){
                pago = await Pago.findByIdAndUpdate(id, input);
            }
            else{
                pago = await Pago.findByIdAndUpdate(id, {total: carroB.total, idUsuario: carroB.usuario,
                                                        tipoPago: tipoPago, estado: estado});
            }
            return pago;
        },
        // Borra una instancia de pago por ID
        async deletePago(obj, {id}){
            await Pago.deleteOne({ _id: id});
            return{
                message: "Pago eliminado"
            }
        },
        // Crea una orden de venta
        async addOrden(obj, {input}){
            // Guarda el string del id del carro, el estado de la orden, el tipo de entrega de la orden y el id del pago
            let {carroString, estadoOrden, tipoEntrega, pagoString} = input;
            // Busca el carro de compras por ID
            let carroB = await Carro.findById(carroString);
            // Busca el usuario desde el carro de compras por ID
            let usuarioB = await Usuario.findById(carroB.usuario);
            // Busca el pago por id
            let pagoB = await Pago.findById(pagoString);
            // Crea fecha de creacion de la orden
            let fecha = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            let orden;
            // Si no hay carro, no se crea una orden
            if(carroB === null){
                return{
                    message: "No existe carro"
                }
            }
            // Si no hay pago, se crea sin el estado del pago
            else if(pagoB === null){
                orden = new Orden({estadoOrden: estadoOrden, tipoEntrega: tipoEntrega, fecha: fecha, idProductos: carroB.idProductos,
                                total: carroB.total, idUsuario: carroB.usuario, nombreUsuario: usuarioB.nombre,
                                emailUsuario: usuarioB.email, direccionUsuario: usuarioB.direccion});
                await orden.save();
            }
            else{
                // Agrega todo
                orden = new Orden({estadoPago: pagoB.estadoPago, estadoOrden: estadoOrden, tipoEntrega: tipoEntrega, fecha: fecha, 
                    idProductos: carroB.idProductos, total: carroB.total, idUsuario: carroB.usuario, nombreUsuario: usuarioB.nombre,
                    emailUsuario: usuarioB.email, direccionUsuario: usuarioB.direccion});
                await orden.save();
            }
            return orden;
        },
        // Actualiza solo el estado de la orden
        async updateEstadoOrden(obj, {id, input}){
            const orden = await Orden.findByIdAndUpdate(id, input);
            return orden;
        },
        // Actualiza toda la orden.
        async updateOrden(obj, {id, input}){
            // Guarda el string del id del carro, el estado de la orden, el tipo de entrega de la orden y el id del pago
            let {carroString, estadoOrden, tipoEntrega, pagoString} = input;
            // Busca el carro de compras por ID
            let carroB = await Carro.findById(carroString);
            // Busca el usuario desde el carro por ID
            let usuarioB = await Usuario.findById(carroB.usuario);
            // Busca el pago por ID
            let pagoB = await Pago.findById(pagoString);
            let orden;
            // No actualiza nada si no existe el carro de compras.
            if(carroB === null){
                return{
                    message: "No existe carro"
                }
            }
            // Actualiza todo menos el estado de pago
            else if(pagoB === null){
                orden = await Orden.findByIdAndUpdate(id, {estadoOrden: estadoOrden, tipoEntrega: tipoEntrega, fecha: fecha, idProductos: carroB.idProductos,
                                total: carroB.total, idUsuario: carroB.usuario, nombreUsuario: usuarioB.nombre,
                                emailUsuario: usuarioB.email, direccionUsuario: usuarioB.direccion});
            }
            else{
                // Actualiza todo
                orden = await Orden.findByIdAndUpdate(id, {estadoPago: pagoB.estadoPago, estadoOrden: estadoOrden, tipoEntrega: tipoEntrega, fecha: fecha, 
                    idProductos: carroB.idProductos, total: carroB.total, idUsuario: carroB.usuario, nombreUsuario: usuarioB.nombre,
                    emailUsuario: usuarioB.email, direccionUsuario: usuarioB.direccion});
            }
            return orden;
        },
        // Borra una orden de venta por ID
        async deleteOrden(obj, {id}){
            await Orden.deleteOne({ _id: id});
            return{
                message: "Orden eliminada"
            }
        },
        // Crea una lista con todas las ordenes
        async addLista_Ordenes(obj, {input}){
            // Guarda el string del id de la orden
            let {ordenString} = input;
            // Busca la orden por ID
            let ordenB = await Orden.findById(ordenString);
            let ordenes;
            // Si no hay orden, no se agrega nada a la lista
            if(ordenB === null){
                return{
                    message: "No existe una orden"
                }
            }else{
                // Se agrega el estado, la fecha y el id de la orden a la lista.
                ordenes = new Lista_Ordenes({estadoOrden: ordenB.estadoOrden, fechaOrden: ordenB.fecha, idOrden: ordenB._id});
                await ordenes.save();
            }
            return ordenes;
        },
        // Actualiza un item de la lista de ordenes
        async updateLista_Ordenes(obj, {id, input}){
            // Guarda el string del ID de la orden
            let {ordenString} = input;
            // Busca la orden por ID
            let ordenB = await Orden.findById(ordenString);
            let ordenes;
            // Si no hay orden, no se actualiza nada
            if(ordenB === null){
                return{
                    message: "No existe una orden"
                }
            }else{
                // Actualiza el item seleccionado de la lista de ordenes
                ordenes = await Lista_Ordenes.findByIdAndUpdate(id, {estadoOrden: ordenB.estadoOrden, fechaOrden: ordenB.fecha, idOrden: ordenB._id});
            }
            return ordenes;
        },
        // Borra un item de la lista de ordenes por ID
        async deleteLista_Ordenes(obj, {id}){
            await Lista_Ordenes.deleteOne({ _id: id});
            return{
                message: "Orden eliminada"
            }
        },
        // Crea una lista con todos los usuarios
        async addLista_Usuarios(obj, {input}){
            // Guarda el string del id de un usuario
            let {usuarioString} = input;
            // Busca el usuario por ID
            let usuarioB = await Usuario.findById(usuarioString);
            // Busca el perfil del usuario por ID
            let perfilB = await Perfil.findById(usuarioB.idPerfil);
            let usuarios;
            // Si no hayt usuario, no se agrega nada a la lista
            if(usuarioB === null){
                return{
                    message: "No existe usuario"
                }
            }else{
                // Se agrega el id, el email, la fecha y el nombre del perfil del usuario a lista
                usuarios = new Lista_Usuarios({idUsuario: usuarioB._id, emailUsuario: usuarioB.email, 
                                            fechaCreacion: usuarioB.fechaCreacion, perfilUsuario: perfilB.nombre});
                await usuarios.save();
            }
            return usuarios;
        },
        // Actualiza un item de la lista de usuarios
        async updateLista_Usuarios(obj, {id, input}){
            // Guarda el string del id de un usuario
            let {usuarioString} = input;
            // Busca el usuario por su ID
            let usuarioB = await Usuario.findById(usuarioString);
            // Busca el perfil por su ID
            let perfilB = await Perfil.findById(usuarioB.idPerfil);
            let usuarios;
            // Si no hay usuario, no se actualiza nada
            if(usuarioB === null){
                return{
                    message: "No existe usuario"
                }
            }else{
                // Se actualiza todo el item de la lista
                usuarios = await Lista_Usuarios.findByIdAndUpdate(id, {idUsuario: usuarioB._id, emailUsuario: usuarioB.email, 
                                            fechaCreacion: usuarioB.fechaCreacion, perfilUsuario: perfilB.nombre});
            }
            return usuarios;
        },
        // Se borra un item de la lista de usuarios por ID
        async deleteLista_Usuarios(obj, {id}){
            await Lista_Usuarios.deleteOne({ _id: id});
            return{
                message: "Usuario eliminada"
            }
        }
    }
}


let apolloServer = null;

const corsOptions = {
    origin: "http://localhost:8090",
    credentials: false
};

async function startServer(){
    const apolloServer = new ApolloServer({typeDefs, resolvers, corsOptions});
    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors:false});
}

startServer();

const app = express();
app.use(cors());
app.listen(8090, function(){
    console.log("servidor iniciado")
})
