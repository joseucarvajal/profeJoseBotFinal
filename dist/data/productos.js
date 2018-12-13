"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initDatabase_1 = require("../initDatabase");
var common_1 = require("./common");
var Productos;
(function (Productos) {
    Productos.getSaldoDeProductosByCliente = function (chatId) {
        return Productos.getAllProductosBanco().then(function (productosBanco) {
            return Productos.getProductosDeCliente(chatId).then(function (productosDeCliente) {
                var productos = new Array();
                if (!productosDeCliente || productosDeCliente.length === 0) {
                    return productos;
                }
                for (var i = 0; i < productosDeCliente.length; i++) {
                    if (!productosDeCliente[i]) {
                        continue;
                    }
                    var saldo = productosDeCliente[i].saldo == null ? '0' : productosDeCliente[i].saldo.toString();
                    var fechaHoy = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
                    productos.push({
                        id: productosDeCliente[i].id.toString(),
                        type: 'article',
                        title: productosBanco[productosDeCliente[i].idProducto].nombre,
                        input_message_content: {
                            message_text: "<b>Banco. KodeFest8.</b> \nConsulta Saldo. \n" + productosBanco[productosDeCliente[i].idProducto].nombre + " Saldo: $" + saldo + "\nFecha " + fechaHoy,
                            parse_mode: 'HTML'
                        },
                        description: "Saldo: $" + saldo,
                        thumb_url: productosBanco[productosDeCliente[i].idProducto].icono
                    });
                }
                return productos;
            });
        });
    };
    Productos.getProductosPorAdquirirByClienteArticles = function (chatId) {
        return Productos.getProductosPorAdquirirByCliente(chatId).then(function (productosPorAdquirir) {
            var articles = [];
            for (var i = 0; i < productosPorAdquirir.length; i++) {
                articles.push({
                    id: productosPorAdquirir[i].id.toString(),
                    type: 'article',
                    title: productosPorAdquirir[i].nombre,
                    input_message_content: {
                        message_text: "Ahora ingresa el saldo inicial para tu <b>" + productosPorAdquirir[i].nombre + "</b>",
                        parse_mode: 'HTML'
                    },
                    description: 'Clic aquí para adquirir este producto',
                    thumb_url: productosPorAdquirir[i].icono
                });
            }
            return articles;
        });
    };
    Productos.getProductosPorAdquirirByCliente = function (chatId) {
        return Productos.getAllProductosBanco().then(function (productosBanco) {
            return Productos.getProductosDeCliente(chatId).then(function (productosDeCliente) {
                if (!productosDeCliente || productosDeCliente.length === 0) {
                    return productosBanco;
                }
                var productosPorAdquirir = new Array();
                for (var i = 0; i < productosBanco.length; i++) {
                    if (productosDeCliente.findIndex(function (productoCliente) { return productoCliente.idProducto == productosBanco[i].id; }) === -1) {
                        productosPorAdquirir.push(productosBanco[i]);
                    }
                }
                return productosPorAdquirir;
            });
        });
    };
    Productos.getProductosDeCliente = function (chatId) {
        return initDatabase_1.dataBase.ref('clientes/' + chatId + '/productos').once('value')
            .then(function (snapshot) {
            return common_1.getListFromFirebaseObject(snapshot.val());
        })
            .catch(function (error) {
            console.log("Productos/getProductosDeCliente" + error);
        });
    };
    Productos.getAllProductosBanco = function () {
        return initDatabase_1.dataBase.ref('productos').once('value')
            .then(function (snapshot) {
            return common_1.getListFromFirebaseObject(snapshot.val());
        })
            .catch(function (error) {
            console.log("Productos/getAllProductosBanco" + error);
        });
    };
    Productos.getProductoBancoById = function (idProducto) {
        return initDatabase_1.dataBase.ref('productos/' + idProducto).once('value')
            .then(function (snapshot) {
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Productos/getProductoBancoById" + error);
        });
    };
    Productos.getProductoClienteById = function (chatId, idProducto) {
        return initDatabase_1.dataBase.ref('clientes/' + chatId + '/productos/' + idProducto).once('value')
            .then(function (snapshot) {
            if (!snapshot.val()) {
                return null;
            }
            return snapshot.val();
        })
            .catch(function (error) {
            console.log("Productos/getProductoBancoById" + error);
        });
    };
    Productos.getProductoClienteByProductoBancoId = function (chatId, productoBancoId) {
        return Productos.getProductosDeCliente(chatId).then(function (productosDeCliente) {
            for (var i = 0; i < productosDeCliente.length; i++) {
                if (productosDeCliente[i].idProducto == productoBancoId) {
                    return productosDeCliente[i];
                }
            }
            return { id: -1 };
        });
    };
    Productos.saveProductosCliente = function (chatId, producto) {
        return initDatabase_1.dataBase.ref('clientes/' + chatId + '/productos').push(producto);
    };
    Productos.updateSaldoProducto = function (chatId, idProducto, saldo) {
        initDatabase_1.dataBase.ref('clientes/' + chatId + '/productos/' + idProducto + '/saldo').set(saldo);
    };
})(Productos = exports.Productos || (exports.Productos = {}));
