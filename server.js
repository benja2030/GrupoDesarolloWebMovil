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
const Orden = require('./models/orden')

mongoose.connect('mongodb+srv://benja2018:benja2020@cluster1.hfeg7i8.mongodb.net/bdwebmovil3', {useNewUrlParser: true, useUnifiedTopology: true});

const typeDefs = gql`
type Usuario{
   id: ID!
   email: String!
   pass: String!
   perfil: Perfil
   carro: Carro
}

type Perfil{
    id: ID!
    nombre: String!
    usuarios: [Usuario]
}

type Producto{
    id: ID!
    nombre: String!
    categoria: Categoria
}

type Categoria{
    id: ID!
    nombre: String!
    productos: [Producto]
}

type Menu{
    id: ID!
    nombre: String
    precio: Int!
    descripcion: String!
    producto: Producto
}

type Carro{
    id: ID!
    productosMenu: [Menu]
    total: Int
    usuario: Usuario!
}

type Pago{
    id: ID!
    fecha: String!
    total: Carro!
    usuario: Carro!
    tipoPago: String!
    estado: Int
}

type Orden{
    id: ID!
    estadoPago: Pago
    tipoEntrega: String!
    fecha: String!
    productosMenu: [Carro]
    total: Carro!
    usuario: Carro!
}

type Alert{
    message: String
}

input PerfilInput{
    nombre: String!
}

input CategoriaInput{
    nombre: String!
}

input MenuInput{
    precio: Int!
    descripcion: String!
    productoString: String
}

input UsuarioInput{
    email: String!
    pass: String!
    perfilString: String
}

input ProductoInput{
    nombre: String!
    categoriaString: String
}

input UpdatePerfilInput{
    usuarioString: String
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
    carroString: String
    tipoPago: String
}

input OrdenInput{
    carroString: String
    tipoEntrega: String
}

type Query{
    getUsuarios: [Usuario]
    getUsuariosFull: [Usuario]
    getUsuario(id: ID!): Usuario
    getPerfiles: [Perfil]
    getProductos: [Producto]
    getCategorias: [Categoria]
    getMenu: [Menu]
    getCarro: [Carro]
    getPago: [Pago]
    getOrden: [Orden]
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
    updateCarroProductos(id: ID!, input: CarroInputProductos): Carro
    updateUsuario(id: ID!, input: UsuarioInput): Usuario
    updatePerfil(id: ID!, input: UpdatePerfilInput): Perfil
    updateProducto(id: ID!, input: ProductoInput): Producto
    updateCategoria(id: ID!, input: UpdateInput): Categoria
    updateMenu(id: ID!, input: UpdateInput): Menu
    deleteUsuario(id: ID!): Alert
    deletePerfil(id: ID!): Alert
    deleteProducto(id: ID!): Alert
    deleteCategoria(id: ID!): Alert
    deleteMenu(id: ID!): Alert
    deleteCarro(id: ID!): Alert
}
`

const resolvers = {
    Query: {
        async getUsuarios(obj){
            const usuarios = await Usuario.find();
            return usuarios;
        },
        /*async getUsuarios(obj){
            const usuarios = await Usuario.find().populate('Perfil');
            return usuarios;
        },*/
        async getUsuario(obj, { id }){
            const usuario = await Usuario.findById(id);
            console.log(usuario.perfil);
            return usuario;
        },
        async getPerfiles(obj){
            const perfiles = await Perfil.find();
            return perfiles
        },
        async getProductos(obj){
            const productos = await Producto.find();
            return productos;
        },
        async getCategorias(obj){
            const categorias = await Categoria.find();
            return categorias;
        },
        async getMenu(obj){
            const menus = await Menu.find();
            return menus;
        },
        async getCarro(obj){
            const carros = await Carro.find();
            return carros;
        }
    },
    Mutation: {
        async addUsuario(obj, { input }){
            let {email, pass, perfilString} = input;
            let perfilB = await Perfil.findById(perfilString);
            let usuario;
            if(perfilB === null){
                // Si el requerimiento dice agregar usuario independiente si encuentra el perfil
                usuario = new Usuario({email: email, pass: pass});
                await usuario.save();
            }else{
                usuario = new Usuario({email: email, pass: pass, perfil: perfilB._id});
                await usuario.save();
            }
            return usuario;
        },
        async updateUsuario(obj, {id, input}){
            const usuario = await Usuario.findByIdAndUpdate(id, input);
            return usuario;
        },
        async deleteUsuario(obj, {id}){
            await Usuario.deleteOne({ _id: id});
            return{
                message: "Usuario eliminado"
            }
        },
        async addPerfil(obj, { input }){
            const perfil = new Perfil(input);
            await perfil.save();
            return perfil;
        },
        async updatePerfil(obj, { id, input }){
            let {usuarioString} = input;
            let usuarioB = await Usuario.findById(usuarioString);
            let perfil
            if(usuarioB === null){
                return{
                    message: "No existe usuario"
                }
            }
            else{
                // Busca perfil
                perfil = await Perfil.findById(id);
                // Revisa si id ya existe
                if(perfil.usuarios.includes(usuarioB._id)){
                    console.log("Usuario ya agregado")
                }else{
                    perfil.usuarios.push(usuarioB._id)
                    await perfil.save()
                }

                /*let arreglo = perfil.usuarios.slice()
                arreglo.push({_id:usuarioB._id,email:usuarioB.email,pass:usuarioB.pass})
                perfil = await Perfil.findByIdAndUpdate(id, {usuarios:arreglo});*/
            }
            return perfil;
        },
        async deletePerfil(obj, {id}){
            await Perfil.deleteOne({ _id: id});
            return{
                message: "Perfil eliminado"
            }
        },
        async addProducto(obj, {input}){
            let {nombre, categoriaString} = input;
            let categoriaB = await Categoria.findById(categoriaString);
            let producto;
            if(categoriaB == null){
                producto = new producto({nombre: nombre});
                await producto.save();
            }
            else{
                producto = new Producto({nombre: nombre, categoria: categoriaB._id});
                await producto.save();
            }
            return producto;
        },
        async updateProducto(obj, {id, input}){
            const producto = await Producto.findByIdAndUpdate(id, input);
            return producto;
        },
        async deleteProducto(obj, {id}){
            await Producto.deleteOne({ _id: id});
            return{
                message: "Producto eliminado"
            }
        },
        async addCategoria(obj, {input}){
            const categoria = new Categoria(input);
            await categoria.save();
            return categoria;
        },
        async updateCategoria(obj, { id, input }){
            let {productoString} = input;
            let productoB = await Producto.findById(productoString);
            let categoria
            if(productoB === null){
                return{
                    message: "No existe producto"
                }
            }
            else{
                // Busca perfil
                categoria = await Categoria.findById(id);
                // Revisa si id ya existe
                if(categoria.productos.includes(productoB._id)){
                    console.log("Producto ya agregado")
                }else{
                    categoria.productos.push(productoB._id)
                    await categoria.save()
                }
            }
            return categoria;
        },
        async deleteCategoria(obj, {id}){
            await Categoria.deleteOne({ _id: id});
            return{
                message: "Categoria eliminada"
            }
        },
        async addMenu(obj, { input }){
            let {precio, descripcion, productoString} = input;
            let productoB = await Producto.findById(productoString);
            let menu;
            if(productoB === null){
                menu = new Menu({precio: precio, descripcion: descripcion});
                await menu.save();
            }else{
                console.log(productoB.nombre)
                menu = new Menu({nombre: productoB.nombre, precio: precio, descripcion: descripcion, producto: productoB._id});
                await menu.save();
                console.log(menu.nombre)
                console.log(menu.producto)
            }
            return menu;
        },
        async deleteMenu(obj, {id}){
            await Menu.deleteOne({ _id: id});
            return{
                message: "Menu eliminado"
            }
        },
        async addCarro(obj, { input }){
            let {usuarioString} = input;
            console.log(input)
            let usuarioB = await Usuario.findById(usuarioString);
            let carro;
            console.log(usuarioB._id);
            if(usuarioB === null){
                // Si el requerimiento dice agregar usuario independiente si encuentra el perfil
                return {
                    message: "No existe usuario"
                }
            }else{
                console.log("entra")
                carro = new Carro({usuario: usuarioB._id, total:0});
                await carro.save();
                console.log(carro.usuario)
            }
            return carro;
        },
        async updateCarroProductos(obj, { id, input }){
            let {menuString} = input;
            let menuB = await Menu.findById(menuString);
            let carro
            if(menuB === null){
                return{
                    message: "No existe producto"
                }
            }
            else{
                // Busca carro
                carro = await Carro.findById(id);
                // Agrega producto a arreglo
                console.log(carro.productosMenu)
                console.log(menuB._id)
                carro.productosMenu.push(menuB._id)
                // Suma precio producto a total
                carro.total += menuB.precio
                await carro.save()
            }
            return carro;
        },
        async deleteCarro(obj, {id}){
            await Carro.deleteOne({ _id: id});
            return{
                message: "Carro eliminado"
            }
        },
        async addPago(obj, {input}){
            let {carroString, tipoPago} = input;
            let carroB = await Carro.findById(carroString);
            let pago;
            if(carroB == null){
                return{
                    message: "No existe carro"
                }
            }
            else{
                const fecha = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                pago = new Pago({fecha: fecha, total: carroB.total, usuario: carroB.usuario, tipoPago:tipoPago});
                await pago.save();
            }
            return pago;
        },
        async addOrden(obj, {input}){
            let {carroString, tipoEntrega} = input;
            let carroB = await Carro.findById(carroString);
            let orden;
            if(carroB == null){
                return{
                    message: "No existe carro"
                }
            }
            else{
                /*
                var largoArreglo = carroB.productosMenu.length;
                for (var i = 0; i < largoArreglo; i++){
                    let productosB = await Menu.findById(carroB.productosMenu[i]);
                    console.log(productosB.nombre)
                }*/

                const fecha = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                orden = new Orden({tipoEntrega: tipoEntrega, fecha: fecha, productosMenu: carroB.productosMenu,
                                    total: carroB.total, usuario: carroB.usuario});
                await orden.save();
            }
            return orden;
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
