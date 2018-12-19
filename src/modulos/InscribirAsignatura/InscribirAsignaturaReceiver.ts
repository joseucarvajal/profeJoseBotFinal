import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import {
  EstadoGlobal,
  ListadoAsignaturas,
  Asignatura,
  Estudiante,
  AsignaturasDeEstudiante,
  Horario,
  Constants
} from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { ApiMessage } from "../../api/ApiMessage";
import { Chat } from "../../bot/Chat";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";

export namespace InscribirAsignatura {
  export namespace Comandos {
    export const InscripcionAsignaturas = `InscripcionAsignaturas`;

    export const EsperandoInscripcionAsignaturasRpta =
      "EsperandoInscripcionAsignaturasRpta";
    export enum OpcionesInscripcionAsignaturasOptsEnum {
      ConfirmarSI = "✔️ Si",
      InscribirOtraAsignatura = "↪️ Solicitar inscripción"
    }
  }

  let nombreContexto = "InscribirAsignaturaReceiver";

  export class InscribirAsignaturaReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    enviarOpcionesInscripcionAsignaturasOpts: Array<
      Array<InlineKeyboardButton>
    > = [
      [
        {
          text: Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI,
          callback_data:
            Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI
        },
        {
          text:
            Comandos.OpcionesInscripcionAsignaturasOptsEnum
              .InscribirOtraAsignatura,
          switch_inline_query_current_chat: ""
        }
      ]
    ];

    listaAsignaturasEstudiante: Array<Asignatura> = new Array<Asignatura>();

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.enviarOpcionSeleccionarAsignaturas = this.enviarOpcionSeleccionarAsignaturas.bind(
        this
      );
    }

    //#region public
    public enviarOpcionSeleccionarAsignaturas(msg: Message & ApiMessage) {
      if (!this.validarQueEstudianteHayaIngresadoDatosBasicos(msg)) {
        return;
      }

      this.enviarOpcionesInscripcionAsignaturas(msg);
    }
    //#endregion

    //#region parent events
    protected onRecibirMensaje(msg: Message): void {}

    public onCallbackQuery(msg: Message & ApiMessage) {
      if (
        this.estaComandoEnContexto(Comandos.EsperandoInscripcionAsignaturasRpta)
      ) {
        this.onResponderInscripcionAsignatura(msg);
      }
    }

    public onRecibirInlineQuery(msg: Message & ApiMessage) {
      if (
        !this.estaComandoEnContexto(
          Comandos.OpcionesInscripcionAsignaturasOptsEnum
            .InscribirOtraAsignatura
        )
      ) {
        this.enviarAsignaturasQueNoTieneInscritasElEstudiante(msg);
      }
    }

    onChosenInlineResult(msg: ApiMessage & Message) {      
      if (
        !this.estaComandoEnContexto(
          Comandos.OpcionesInscripcionAsignaturasOptsEnum
            .InscribirOtraAsignatura
        )
      ) {
        this.enviarSolicitudInscribirAsignaturaADocente(msg);
      }
    }

    //#endregion

    private enviarSolicitudInscribirAsignaturaADocente(
      msg: Message & ApiMessage
    ) {
      this.indexMain.solicitudesDocenteReceiver
        .enviarSolicitudInscribirAsignatura(
          msg,
          this.estadoGlobal.infoUsuarioMensaje.estudiante,
          msg.from.id,
          msg.result_id
        )
        .then(() => {
          this.botSender
            .responderMensajeHTML(
              msg,
              `✉️ Se ha enviado la <b>solicitud</b> al profe Jose de manera satisfactoria. Recibirás un mensaje cuando el profe haya aprobado o rechazdo la solicitud`
            )
            .then(() => {
              this.irAMenuPrincipal(msg);
            });
        });
    }

    private onResponderInscripcionAsignatura(msg: Message & ApiMessage) {
      if (
        msg.data == Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI
      ) {
        this.guardarAsignaturasEstudiante(msg);
      }
    }

    private enviarAsignaturasQueNoTieneInscritasElEstudiante(
      msg: Message & ApiMessage
    ) {
      Data.Asignacion.getAsignaturasQueNoTieneEstudiante(
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
      ).then((listadoAsignaturas: Array<Asignatura>) => {
        let opcionesListaAsignaturas = new Array<any>();
        let asignatura: Asignatura;
        for (let i = 0; i < listadoAsignaturas.length; i++) {
          asignatura = listadoAsignaturas[i];

          let mensajeHorarios = "";
          let horario;
          let horarioCounter = 0;
          for (let codigoHorario in asignatura.horarios) {
            horario = asignatura.horarios[codigoHorario];
            if (horarioCounter > 0) {
              mensajeHorarios += " y ";
            }
            mensajeHorarios +=
              horario.dia + ", " + horario.horaInicio + " a " + horario.horaFin;
            horarioCounter++;
          }

          opcionesListaAsignaturas.push({
            id: asignatura.codigo,
            type: "article",
            title: `${asignatura.nombre}, grupo ${asignatura.grupo}`,
            description: `${mensajeHorarios}`,
            input_message_content: {
              message_text: `${asignatura.nombre}, grupo ${asignatura.grupo}`
            }
          });
        }

        this.botSender.responderInLineQuery(msg, opcionesListaAsignaturas);
      });
    }

    private guardarAsignaturasEstudiante(msg: Message & ApiMessage) {
      Data.Asignacion.getAsignaturasByEstudianteCodigo(
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
      ).then((asignaturasDeEstudiante: AsignaturasDeEstudiante) => {
        if (!asignaturasDeEstudiante.result) {
          this.botSender.responderMensajeErrorHTML(
            msg,
            asignaturasDeEstudiante.message
          );
          return;
        }

        this.estadoGlobal.infoUsuarioMensaje.estudiante.inscripcionAsignaturasConfirmado = true;
        Data.Estudiantes.actualizarChat(
          msg,
          this.estadoGlobal,
          this.estadoGlobal.infoUsuarioMensaje.estudiante
        ).then(() => {
          Data.Asignacion.registrarAsignaturasAEstudiante(
            msg,
            this.estadoGlobal,
            asignaturasDeEstudiante.listaAsignaturas
          ).then(() => {
            this.enviarMensajeHTML(
              msg,
              "",
              `✅ Se han registrado tus asignaturas con éxito`
            ).then(() => {
              this.irAMenuPrincipal(msg);
            });
          });
        });
      });
    }

    private enviarOpcionesInscripcionAsignaturas(msg: Message & ApiMessage) {
      if (
        this.estadoGlobal.infoUsuarioMensaje.estudiante
          .inscripcionAsignaturasConfirmado
      ) {
        this.responderOpcionesEstudianteConInscripcionConfirmada(msg);
        return;
      }

      Data.Asignacion.getAsignaturasByEstudianteCodigo(
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
      ).then((asignaturasDeEstudiante: AsignaturasDeEstudiante) => {
        if (asignaturasDeEstudiante.result == false) {
          this.responderErrorEstudianteSinAsignaturas(
            msg,
            asignaturasDeEstudiante.message
          );
          return;
        }

        this.listaAsignaturasEstudiante =
          asignaturasDeEstudiante.listaAsignaturas;

        if (this.listaAsignaturasEstudiante.length > 0) {
          this.responderAsignaturasPendientesPorInscribirEstudiante(
            msg,
            asignaturasDeEstudiante.estudiante
          );
        } else {
          this.responderOpcionesEstudianteQueNoApareceEnMatriculados(msg);
        }
      });
    }

    private responderErrorEstudianteSinAsignaturas(
      msg: Message & ApiMessage,
      message: string
    ) {
      this.botSender.responderMensajeErrorHTML(
        msg,
        `Ha ocurrido un error, por favor notifícale al profe Jose`
      );

      this.enviarMensajeErrorHTMLAProfesor(message);
    }

    private responderAsignaturasPendientesPorInscribirEstudiante(
      msg: Message & ApiMessage,
      estudiante: Estudiante
    ) {
      let mensaje = `
⚠️ Por favor verifica estos datos:

<b>Código:</b> ${estudiante.codigo}
<b>Nombre:</b> ${estudiante.nombre}
<b>Email:</b> ${estudiante.email}
      
<b>Asignaturas</b>: ${this.listaAsignaturasEstudiante.map(
        (asignatura: Asignatura) => {
          let infoAsignatura =
            "\n\n📒<b>" +
            asignatura.nombre +
            "</b>, " +
            " grupo " +
            asignatura.grupo;

          let horario;
          let i = 0;
          let conector;
          for (let codigoHorario in asignatura.horarios) {
            horario = asignatura.horarios[codigoHorario];
            conector = i > 0 ? " y " : "\n";
            infoAsignatura +=
              conector +
              "<i>" +
              horario.dia +
              "</i> " +
              horario.horaInicio +
              " a " +
              horario.horaFin +
              ", aula " +
              horario.aula;
            i++;
          }

          return infoAsignatura;
        }
      )}
      
Presiona <b>"${
        Comandos.OpcionesInscripcionAsignaturasOptsEnum.ConfirmarSI
      }"</b> para confirmar o haz click en <b>"${
        Comandos.OpcionesInscripcionAsignaturasOptsEnum.InscribirOtraAsignatura
      }</b>" para enviar una solicitud al profe Jose
      `;

      this.enviarMensajeInlineKeyBoard(
        msg,
        Comandos.EsperandoInscripcionAsignaturasRpta,
        mensaje,
        this.enviarOpcionesInscripcionAsignaturasOpts
      );
    }

    private responderOpcionesEstudianteQueNoApareceEnMatriculados(
      msg: Message & ApiMessage
    ) {
      let opcionesMenuInscripcion = [
        [
          {
            text:
              Comandos.OpcionesInscripcionAsignaturasOptsEnum
                .InscribirOtraAsignatura,
            switch_inline_query_current_chat: ""
          }
        ]
      ];
      let mensaje = `😦 No apareces en el listado de matrícula de las asignaturas del profe Jose. Si deseas puedes enviarle al profe una <b>solicitud</b> para inscribir una asignatura`;

      this.enviarOpcionesInscribirOtrasAsignaturas(
        msg,
        mensaje,
        opcionesMenuInscripcion
      );
    }

    private responderOpcionesEstudianteConInscripcionConfirmada(
      msg: Message & ApiMessage
    ) {
      let opcionesMenuInscripcion = [
        [
          {
            text:
              Comandos.OpcionesInscripcionAsignaturasOptsEnum
                .InscribirOtraAsignatura,
            switch_inline_query_current_chat: ""
          }
        ]
      ];

      Data.Asignacion.getAsignaturasInscritasPorEstudianteCachedInfoCompleta(
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
      ).then((listaAsignaturas: Array<Asignatura>) => {
        let mensajeListadoAsignaturas = "";
        let asignatura;
        for (let i = 0; i < listaAsignaturas.length; i++) {
          asignatura = listaAsignaturas[i];
          if (
            asignatura.estado == Constants.EstadoEstudianteAsignatura.Activa
          ) {
            mensajeListadoAsignaturas += `\n${i + 1}. <b>${
              asignatura.nombre
            }</b>, grupo <b>${asignatura.grupo}</b>`;
          }
        }

        let mensaje = `
💡  Ya has inscrito las siguientes asignaturas:
${mensajeListadoAsignaturas}

Si deseas puedes enviarle al profe Jose una <b>solicitud</b> para inscribir otra asignatura`;

        this.enviarOpcionesInscribirOtrasAsignaturas(
          msg,
          mensaje,
          opcionesMenuInscripcion
        );
      });
    }

    private enviarOpcionesInscribirOtrasAsignaturas(
      msg: Message & ApiMessage,
      message: string,
      opcionesMenuInscripcion: Array<Array<InlineKeyboardButton>>
    ) {
      this.enviarMensajeInlineKeyBoard(
        msg,
        Comandos.EsperandoInscripcionAsignaturasRpta,
        message,
        opcionesMenuInscripcion
      );
    }
  }
}
