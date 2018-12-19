import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import {
  EstadoGlobal,
  ListaResultadoAsistenciasIndxByEstCodigo,
  ContadorAsistenciasEstudiante,
  ResultadoReporteAsistencia
} from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { ApiMessage } from "../../api/ApiMessage";
import { KeyboardButton } from "../../bot/KeyboardButton";
import { CalculoReporteAsistenciaAsignaturas } from "./CalculoReporteAsistenciaAsignaturas";

export namespace Docente {
  export namespace Comandos {
    export const MenuDocente = "MenuDocente";
    export enum MenuDocenteOpts {
      ReporteAsistencias = "📆 Reporte asistencia asignatura"
    }
  }

  let nombreContexto = "DocenteReceiver";
  export class DocenteReceiver extends BotReceiver {
    nombreContexto = nombreContexto;
    calculoReporteAsistenciaAsignaturas: CalculoReporteAsistenciaAsignaturas;

    menuDocenteOpts: Array<Array<KeyboardButton>> = [
      [
        {
          text: Comandos.MenuDocenteOpts.ReporteAsistencias
        }
      ]
    ];

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.calculoReporteAsistenciaAsignaturas = new CalculoReporteAsistenciaAsignaturas(
        this.estadoGlobal
      );

      this.responderMenu = this.responderMenu.bind(this);
    }

    //#region Public
    public responderMenu(msg: Message & ApiMessage) {
      this.botSender.responderKeyboardMarkup(
        msg,
        `Selecciona una opción`,
        this.menuDocenteOpts
      );
    }
    //#endregion

    //#region parent events
    protected onRecibirMensaje(msg: Message & ApiMessage) {
      if (msg.text == "/profesor") {
        this.irAMenuPrincipalAndSaveState(msg);
      } else if (
        this.seHaSeleccionadoOpcionDeMenu(
          msg,
          Comandos.MenuDocenteOpts.ReporteAsistencias
        )
      ) {
        this.enviarReporteAsistenciaAsignatura(msg);
      }
    }

    protected onCallbackQuery(msg: Message & ApiMessage) {}

    protected onLocation(msg: Message & ApiMessage) {}

    protected onRecibirInlineQuery(msg: Message & ApiMessage) {}
    //#endregion

    private enviarReporteAsistenciaAsignatura(msg: Message & ApiMessage) {
      this.botSender
        .responderMensajeHTML(
          msg,
          `🕗 Estoy generando tu reporte. Por favor espera un momento...`
        )
        .then(() => {
          this.calculoReporteAsistenciaAsignaturas
            .calcularReporteAsistenciaAsignaturas(msg, "dummy")
            .then((resultadoReporteAsistencia: ResultadoReporteAsistencia) => {
              let htmlReporte = `
          <table border="1" cellspacing="0" style="width: 100%; border:1px solid;position: relative;">
          <tr><th>Código</th><th>Nombre</th><th>Email</th><th>Asistencias</th><th>Fallas</th></tr>
        `;
              let htmlRegistroEstudiante = ``;
              let resultadoByEst: ContadorAsistenciasEstudiante;
              for (let codigoEstudiante in resultadoReporteAsistencia.listaResultadoAsistenciasIndxByEstCodigo) {
                resultadoByEst =
                  resultadoReporteAsistencia
                    .listaResultadoAsistenciasIndxByEstCodigo[codigoEstudiante];
                htmlRegistroEstudiante = `<tr><td>${
                  resultadoByEst.estudiante.codigo
                }</td><td>${resultadoByEst.estudiante.nombre}</td><td>${
                  resultadoByEst.estudiante.email
                }</td><td>${resultadoByEst.countAsistencias}</td><td>${
                  resultadoByEst.countFallas
                }</td></tr>`;
                htmlReporte += htmlRegistroEstudiante;
              }
              htmlReporte += `</table>`;

              let opcionesFormatoFecha = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              };

              this.botSender.enviarHTMLComoDocumentoPDF(
                msg,
`asistencia_${
resultadoReporteAsistencia.asignatura.nombre
}.pdf`,
htmlReporte,
`Reporte asistencia 
asignatura: "<b>${
resultadoReporteAsistencia.asignatura.nombre
}</b>" 
Fecha: <b>${new Date().toLocaleDateString('es-ES')}</b>`
              );
            });
        });
    }

    protected irAMenuPrincipalAndSaveState(msg: Message & ApiMessage) {
      if (msg.from.id != this.estadoGlobal.settings.idUsuarioChatDocente) {
        this.botSender.responderMensajeErrorHTML(
          msg,
          `Lo siento, sólo puedo darle acceso al profe <b>Jose</b>`
        );
        return;
      }

      this.enviarMensajeAReceiver(
        this,
        this.responderMenu,
        msg,
        Comandos.MenuDocente
      );
    }
  }
}
