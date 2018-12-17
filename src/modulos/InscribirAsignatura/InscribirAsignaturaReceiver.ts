import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";

import * as Data from "../../data";
import {
  EstadoGlobal,
  ListadoAsignaturas,
  Asignatura,
  Estudiante,
  AsignaturasDeEstudiante,
  Horario
} from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { InlineKeyboardButton } from "../../bot/InlineKeyboardButton";
import { ApiMessage } from "../../api/ApiMessage";
import { Chat } from "../../bot/Chat";

export namespace InscribirAsignatura {
  export namespace Comandos {
    export enum SeleccionarAsignaturaOptsEnum {
      SeleccionarAsignatura = "✔️Seleccionar asignatura"
    }

    export const InscripcionAsignaturas = `InscripcionAsignaturas`;
    export const EsperandoInscripcionAsignaturasRpta =
      "EsperandoInscripcionAsignaturasRpta";
    export enum OpcionesInscripcionAsignaturasOptsEnum {
      ConfirmarSI = "✔️ Si",
      InscribirOtraAsignatura = "📋 Seleccionar otra asignatura"
    }
  }

  let nombreContexto = "InscribirAsignaturaReceiver";

  export class InscribirAsignaturaReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    seleccionarAsignaturaInlineOpts: Array<Array<InlineKeyboardButton>> = [
      [
        {
          text: Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura,
          switch_inline_query_current_chat: ""
        }
      ]
    ];

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

    public enviarOpcionSeleccionarAsignaturas(msg: Message & ApiMessage) {
      this.enviarOpcionesInscripcionAsignaturas(msg);
    }

    public enviarOpcionSeleccionarAsignaturasOld(msg: Message & ApiMessage) {
      this.actualizarContextoComando(
        msg,
        Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura
      ).then(() => {
        this.botSender.responderInlineKeyboard(
          msg,
          `Haz click en la opción <b>"${
            Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura
          }"</b> para seleccionar tus asignaturas`,
          this.seleccionarAsignaturaInlineOpts
        );
      });
    }

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
          Comandos.OpcionesInscripcionAsignaturasOptsEnum.InscribirOtraAsignatura
        )        
      ) {
        this.enviarAsignaturasQueNoTieneInscritasElEstudiante(msg);
      }
      else if (
        !this.estaComandoEnContexto(
          Comandos.SeleccionarAsignaturaOptsEnum.SeleccionarAsignatura
        )
      ) {
        return;
      }

    }
    //#endregion

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
      ).then((listadoAsignaturas:Array<Asignatura>) => {
        let opcionesListaAsignaturas = new Array<any>();
        let asignatura: Asignatura;
        for (let i=0; i<listadoAsignaturas.length; i++) {
          asignatura = listadoAsignaturas[i];

          let mensajeHorarios = "";
          let horario;
          let horarioCounter = 0;
          for(let codigoHorario in asignatura.horarios){            
            horario = asignatura.horarios[codigoHorario];
            if(horarioCounter > 0){
              mensajeHorarios += " y ";
            }
            mensajeHorarios += horario.dia + ", " + horario.horaFin + " a " + horario.horaFin;
            horarioCounter++;
          }


          opcionesListaAsignaturas.push({
            id: asignatura.codigo,
            type: "article",
            title: `${asignatura.nombre}, grupo ${asignatura.grupo}`,
            description:
`${mensajeHorarios}`,
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

        Data.Asignacion.registrarAsignaturasAEstudiante(
          msg,
          this.estadoGlobal,
          asignaturasDeEstudiante.listaAsignaturas
        ).then(() => {
          this.enviarMensajeHTML(
            msg,
            "",
            `Se han registrado tus asignaturas con éxito`
          );
        });
      });
    }

    private enviarOpcionesInscripcionAsignaturas(msg: Message & ApiMessage) {
      Data.Asignacion.getAsignaturasByEstudianteCodigo(
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
      ).then((asignaturasDeEstudiante: AsignaturasDeEstudiante) => {
        if (asignaturasDeEstudiante.result == false) {
          this.botSender.responderMensajeErrorHTML(
            msg,
            `Ha ocurrido un error, por favor notifícale al profe Jose`
          );

          this.enviarMensajeErrorHTMLAProfesor(asignaturasDeEstudiante.message);

          return;
        }

        let opcionesInscripcion = new Array<Array<InlineKeyboardButton>>();

        let estudiante = asignaturasDeEstudiante.estudiante;
        this.listaAsignaturasEstudiante =
          asignaturasDeEstudiante.listaAsignaturas;

        let mensaje: string;
        if (this.listaAsignaturasEstudiante.length > 0) {
          opcionesInscripcion = this.enviarOpcionesInscripcionAsignaturasOpts;
          mensaje = `
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
            Comandos.OpcionesInscripcionAsignaturasOptsEnum
              .InscribirOtraAsignatura
          }</b>" para enviar una solicitud al profe Jose
          `;
        } else {
          opcionesInscripcion = [
            [
              {
                text:
                  Comandos.OpcionesInscripcionAsignaturasOptsEnum
                    .InscribirOtraAsignatura,
                callback_data:
                  Comandos.OpcionesInscripcionAsignaturasOptsEnum
                    .InscribirOtraAsignatura
              }
            ]
          ];
          mensaje = `😦 No apareces en el listado de matrícula de ninguna asignatura del profe Jose, haz click en <b>"${
            Comandos.OpcionesInscripcionAsignaturasOptsEnum
              .InscribirOtraAsignatura
          }</b>" para enviar una solicitud al profe`;
        }

        this.enviarOpcionesInscripcionAsignaturasOpts;
        this.enviarMensajeInlineKeyBoard(
          msg,
          Comandos.EsperandoInscripcionAsignaturasRpta,
          mensaje,
          opcionesInscripcion
        );
      });
    }

    private guardarConfirmacionDatosEstudiante(msg: Message & ApiMessage) {
      let apiMessage: ApiMessage = msg;
      if (
        apiMessage.data ==
        Comandos.OpcionesInscripcionAsignaturasOptsEnum.InscribirOtraAsignatura
      ) {
        this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado = false;
        this.botSender.responderMensajeHTML(
          msg,
          `Se notificará al profesor sobre el caso`
        );
        let msgProfesor: Message & ApiMessage = {
          chat: {
            id: this.estadoGlobal.settings.idUsuarioChatDocente
          } as Chat
        } as Message & ApiMessage;
        this.botSender.responderMensajeErrorHTML(
          msgProfesor,
          `El estudiante ${
            this.estadoGlobal.infoUsuarioMensaje.estudiante.nombre
          } - código: ${
            this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo
          } ha reportado una inconsistencia`
        );
      } else {
        this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado = true;
      }

      Data.Estudiantes.actualizarChat(
        msg,
        this.estadoGlobal,
        this.estadoGlobal.infoUsuarioMensaje.estudiante
      ).then(() => {
        if (
          this.estadoGlobal.infoUsuarioMensaje.estudiante.registroConfirmado
        ) {
          //this.enviarAMenuEstudiante(msg);
        }
      });
    }

    private getAsignaturasByEstudiante(
      msg: Message & ApiMessage
    ): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo = msg.text;
        Data.Estudiantes.getEstudianteByCodigoAsignatura(
          msg,
          this.estadoGlobal,
          this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo,
          this.listaAsignaturasEstudiante[0].codigo
        ).then((estudiante: Estudiante) => {
          if (estudiante == null) {
            this.botSender.responderMensajeErrorHTML(
              msg,
              `Aún no estás en el listado de la asignatura <b>${
                this.listaAsignaturasEstudiante[0].nombre
              }</b>, grupo: <b>${
                this.listaAsignaturasEstudiante[0].grupo
              }</b>, código: <b>${
                this.listaAsignaturasEstudiante[0].codigo
              }</b> pídele al profe que te agregue`
            );

            let mensajeProfesor: Message & ApiMessage = {
              chat: {
                id: this.estadoGlobal.settings.idUsuarioChatDocente
              } as Chat
            } as Message & ApiMessage;

            this.botSender.responderMensajeErrorHTML(
              mensajeProfesor,
              `El estudiante <b>${msg.from.first_name}</b>, código: <b>${
                msg.text
              }</b>, existe en la asignatura, pero no se encuentra en la lista (asignatura_estudiante) de la asignatura <b>${
                this.listaAsignaturasEstudiante[0].nombre
              }, código: ${this.listaAsignaturasEstudiante[0].codigo}</b>`
            );
            reject();
            return;
          }

          this.estadoGlobal.infoUsuarioMensaje.estudiante = estudiante;
          Data.Estudiantes.actualizarChat(
            msg,
            this.estadoGlobal,
            this.estadoGlobal.infoUsuarioMensaje.estudiante
          ).then(() => {
            resolve();
          });
        });
      });
    }

    private enviarListadoAsignaturas(msg: Message & ApiMessage) {
      Data.Asignacion.getAsignaturasXPeriodoAndDocente(this.estadoGlobal).then(
        (listadoAsignaturasXDocente: ListadoAsignaturas) => {
          let listaAsignaturas = new Array<any>();
          let asignatura: Asignatura;
          for (let codigoAsignatura in listadoAsignaturasXDocente) {
            asignatura = listadoAsignaturasXDocente[codigoAsignatura];
            listaAsignaturas.push({
              id: asignatura.codigo,
              type: "article",
              title: asignatura.nombre,
              input_message_content: {
                message_text: `Has seleccionado ${asignatura.nombre}`
              }
            });
          }
          this.botSender.responderInLineQuery(msg, listaAsignaturas);
        }
      );
    }

    onChosenInlineResult(msg: ApiMessage & Message) {
      if (
        !this.estaComandoEnContexto(
          Comandos.OpcionesInscripcionAsignaturasOptsEnum.InscribirOtraAsignatura
        )
      ) {
        this.botSender.responderMensajeHTML(msg, `Vas a inscribir ${msg.result_id}`);
      }
    }

    private registrarAsignaturaAEstudiante(msg: ApiMessage & Message) {}
  }
}
