"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants;
(function (Constants) {
    var TipoMovimientoEnum;
    (function (TipoMovimientoEnum) {
        TipoMovimientoEnum["TransferenciaAOtrasEntidades"] = "Transferencia a otras entidades";
        TipoMovimientoEnum["TransferenciaDesdeOtrasEntidades"] = "Transferencia desde otras entidades";
        TipoMovimientoEnum["PagoServicios"] = "Pago servicios";
        TipoMovimientoEnum["PagoProducto"] = "Pago producto";
    })(TipoMovimientoEnum = Constants.TipoMovimientoEnum || (Constants.TipoMovimientoEnum = {}));
    var ProductosEnum;
    (function (ProductosEnum) {
        ProductosEnum["CuentaDeAhorros"] = "Cuenta de ahorros";
        ProductosEnum["TarjetaDeCredito"] = "Tarjeta de cr\u00E9dito";
        ProductosEnum["CuentaCorriente"] = "Cuenta corriente";
        ProductosEnum["TarjetaDebito"] = "Tarjeta d\u00E9bito";
    })(ProductosEnum = Constants.ProductosEnum || (Constants.ProductosEnum = {}));
    var IconosEnum;
    (function (IconosEnum) {
        IconosEnum["CuentaDeAhorros"] = "CuentaDeAhorros.png";
        IconosEnum["TarjetaDeCredito"] = "TarjetaDeCredito.png";
        IconosEnum["CuentaCorriente"] = "CuentaCorriente.png";
        IconosEnum["TarjetaDebito"] = "TarjetaDebito.png";
    })(IconosEnum = Constants.IconosEnum || (Constants.IconosEnum = {}));
    var ServiciosEnum;
    (function (ServiciosEnum) {
        ServiciosEnum["AguasManizales"] = "Aguas de Manizales";
        ServiciosEnum["GasNatural"] = "Gas Natural";
        ServiciosEnum["Une"] = "Une";
        ServiciosEnum["Tigo"] = "Tigo";
        ServiciosEnum["Movistar"] = "Movistar";
    })(ServiciosEnum = Constants.ServiciosEnum || (Constants.ServiciosEnum = {}));
    var Chat;
    (function (Chat) {
        var Contextos;
        (function (Contextos) {
            var PaginaInicial;
            (function (PaginaInicial) {
                PaginaInicial.index = 'PaginaInicial/index';
                PaginaInicial.menuPrincipal = 'PaginaInicial/menuPrincipal';
            })(PaginaInicial = Contextos.PaginaInicial || (Contextos.PaginaInicial = {}));
            var Consultas;
            (function (Consultas) {
                var Index;
                (function (Index) {
                    Index.index = 'Consultas/index';
                })(Index = Consultas.Index || (Consultas.Index = {}));
                var Saldos;
                (function (Saldos) {
                    Saldos.saldos = 'Consultas/saldos';
                })(Saldos = Consultas.Saldos || (Consultas.Saldos = {}));
                var Extracto;
                (function (Extracto) {
                    Extracto.operacionProducto = 'Consultas/Extracto/operacionProducto';
                    Extracto.seleccionMes = 'Consultas/Extracto/seleccionMes';
                    Extracto.reporte = 'Consultas/Extracto/reporte';
                })(Extracto = Consultas.Extracto || (Consultas.Extracto = {}));
            })(Consultas = Contextos.Consultas || (Contextos.Consultas = {}));
            var AdquirirProducto;
            (function (AdquirirProducto) {
                var Index;
                (function (Index) {
                    Index.index = 'AdquirirProducto/index';
                })(Index = AdquirirProducto.Index || (AdquirirProducto.Index = {}));
            })(AdquirirProducto = Contextos.AdquirirProducto || (Contextos.AdquirirProducto = {}));
            var Facturas;
            (function (Facturas) {
                var Index;
                (function (Index) {
                    Index.index = 'Facturas/index';
                })(Index = Facturas.Index || (Facturas.Index = {}));
                var PagarServicio;
                (function (PagarServicio) {
                    PagarServicio.pagarServicio = 'Facturas/PagarServicio/pagarServicio';
                    PagarServicio.seleccionarServicio = 'Facturas/PagarServicio/seleccionarServicio';
                    PagarServicio.seleccionarProducto = 'Facturas/PagarServicio/seleccionarProducto';
                })(PagarServicio = Facturas.PagarServicio || (Facturas.PagarServicio = {}));
                var InscribirCuentaServicios;
                (function (InscribirCuentaServicios) {
                    InscribirCuentaServicios.seleccionServicio = 'Facturas/InscribirCuentaServicios/seleccionServicio';
                })(InscribirCuentaServicios = Facturas.InscribirCuentaServicios || (Facturas.InscribirCuentaServicios = {}));
                var PagarServicioSeleccionado;
                (function (PagarServicioSeleccionado) {
                    PagarServicioSeleccionado.getNumeroFactura = 'Facturas/PagarServicioPagarServicioSeleccionado//getNumeroFactura';
                    PagarServicioSeleccionado.getValorPagar = 'Facturas/PagarServicioPagarServicioSeleccionado//getValorPagar';
                })(PagarServicioSeleccionado = Facturas.PagarServicioSeleccionado || (Facturas.PagarServicioSeleccionado = {}));
            })(Facturas = Contextos.Facturas || (Contextos.Facturas = {}));
            var Transferencias;
            (function (Transferencias) {
                var Index;
                (function (Index) {
                    Index.index = 'Transferencias/index';
                })(Index = Transferencias.Index || (Transferencias.Index = {}));
            })(Transferencias = Contextos.Transferencias || (Contextos.Transferencias = {}));
        })(Contextos = Chat.Contextos || (Chat.Contextos = {}));
        var Comandos;
        (function (Comandos) {
            var PaginaInicial;
            (function (PaginaInicial) {
                var Index;
                (function (Index) {
                    Index.getUsuario = 'getUsuario';
                    Index.getClave = 'getClave';
                })(Index = PaginaInicial.Index || (PaginaInicial.Index = {}));
                var MenuPrincipal;
                (function (MenuPrincipal) {
                    MenuPrincipal.consultas = '🔍 Consultas';
                    MenuPrincipal.adquirirProducto = '📂 Adquirir producto';
                    MenuPrincipal.facturas = '📄 Facturas';
                    MenuPrincipal.transferencias = '💳 Transferencias';
                    MenuPrincipal.configuracion = '⚙️ Configuración';
                })(MenuPrincipal = PaginaInicial.MenuPrincipal || (PaginaInicial.MenuPrincipal = {}));
            })(PaginaInicial = Comandos.PaginaInicial || (Comandos.PaginaInicial = {}));
            var Consultas;
            (function (Consultas) {
                var Index;
                (function (Index) {
                    Index.saldos = 'saldos';
                    Index.extracto = 'extracto';
                    Index.movimientos = 'movimientos';
                    Index.volver = 'volver';
                })(Index = Consultas.Index || (Consultas.Index = {}));
                var Saldos;
                (function (Saldos) {
                    Saldos.volver = 'volver';
                })(Saldos = Consultas.Saldos || (Consultas.Saldos = {}));
                var Extracto;
                (function (Extracto) {
                    Extracto.ene = 'ene';
                    Extracto.feb = 'feb';
                    Extracto.abr = 'abr';
                    Extracto.may = 'may';
                    Extracto.jun = 'jun';
                    Extracto.jul = 'jul';
                    Extracto.ago = 'ago';
                    Extracto.sep = 'sep';
                    Extracto.oct = 'oct';
                    Extracto.nov = 'nov';
                    Extracto.dic = 'dic';
                    Extracto.volver = 'volver';
                })(Extracto = Consultas.Extracto || (Consultas.Extracto = {}));
            })(Consultas = Comandos.Consultas || (Comandos.Consultas = {}));
            var AdquirirProducto;
            (function (AdquirirProducto) {
                var Index;
                (function (Index) {
                    Index.verProductosDisponibles = 'verProductosDisponibles';
                    Index.setSaldoInicial = 'setSaldoInicial';
                    Index.volver = 'volver';
                })(Index = AdquirirProducto.Index || (AdquirirProducto.Index = {}));
            })(AdquirirProducto = Comandos.AdquirirProducto || (Comandos.AdquirirProducto = {}));
            var Facturas;
            (function (Facturas) {
                var Index;
                (function (Index) {
                    Index.pagarServicios = 'pagarServicios';
                    Index.inscribirCuentaServicios = 'inscribirCuentaServicios';
                    Index.volver = 'volver';
                })(Index = Facturas.Index || (Facturas.Index = {}));
                var PagarServicios;
                (function (PagarServicios) {
                    PagarServicios.seleccionarServicio = 'seleccionarServicio';
                    PagarServicios.seleccionarProducto = 'seleccionarProducto';
                    PagarServicios.volver = 'volver';
                })(PagarServicios = Facturas.PagarServicios || (Facturas.PagarServicios = {}));
                var PagarServicioSeleccionado;
                (function (PagarServicioSeleccionado) {
                    PagarServicioSeleccionado.getNumeroFactura = 'getNumeroFactura';
                    PagarServicioSeleccionado.getValorPagar = 'getValorPagar';
                    PagarServicioSeleccionado.volver = 'volver';
                })(PagarServicioSeleccionado = Facturas.PagarServicioSeleccionado || (Facturas.PagarServicioSeleccionado = {}));
                var InscribirCuentaServicios;
                (function (InscribirCuentaServicios) {
                    InscribirCuentaServicios.volver = 'volver';
                })(InscribirCuentaServicios = Facturas.InscribirCuentaServicios || (Facturas.InscribirCuentaServicios = {}));
            })(Facturas = Comandos.Facturas || (Comandos.Facturas = {}));
            var Transferencias;
            (function (Transferencias) {
                var Index;
                (function (Index) {
                    Index.TransferirAUnAmigo = 'Transferencias/TransferirAUnAmigo';
                })(Index = Transferencias.Index || (Transferencias.Index = {}));
            })(Transferencias = Comandos.Transferencias || (Comandos.Transferencias = {}));
        })(Comandos = Chat.Comandos || (Chat.Comandos = {}));
    })(Chat = Constants.Chat || (Constants.Chat = {}));
    Constants.RUTA_SERVIDOR = '';
})(Constants = exports.Constants || (exports.Constants = {}));
exports.Contextos = Constants.Chat.Contextos;
exports.Comandos = Constants.Chat.Comandos;
