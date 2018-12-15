import { Message } from "../../bot/Message";
import { BotReceiver } from "../bot/BotReceiver";
import * as Data from "../../data";
import { EstadoGlobal, Estudiante } from "../../core";
import { MainReceiverContract } from "../indexContracts";
import { MenuPrincipal } from "../menuPrincipal/MenuPrincipalReceiver";
import { ApiMessage } from "../../api/ApiMessage";

export namespace EditarInformacionBasica {
  export namespace Comandos {
    export const IngresaTuCodigo = `Ingresa tu código`;
    export const VerificaTuCodigo = `Verifica tu código`;
    export const IngresaTuNombreCompleto = `Ingresa tu nombre completo`;
    export const IngresaTuEmail = `Ingresa tu email`;
  }

  let nombreContexto = "EditarInformacionBasicaReceiver";

  export class EditarInformacionBasicaReceiver extends BotReceiver {
    nombreContexto = nombreContexto;

    constructor(estadoGlobal: EstadoGlobal, indexMain: MainReceiverContract) {
      super(estadoGlobal, indexMain, nombreContexto);

      this.responderEditarInformacionBasica = this.responderEditarInformacionBasica.bind(
        this
      );
    }

    public responderEditarInformacionBasica(msg: Message & ApiMessage) {
      this.solicitarCodigo(msg);
    }

    private solicitarCodigo(msg: Message & ApiMessage) {
      this.enviarMensajeHTML(
        msg,
        Comandos.IngresaTuCodigo,
        "Ingresa tu código"
      );
    }

    protected onRecibirMensaje(msg: Message & ApiMessage) {
      if (this.estaComandoEnContexto(Comandos.IngresaTuCodigo)) {
        this.actualizarCodigo(msg);
      } else if (this.estaComandoEnContexto(Comandos.VerificaTuCodigo)) {
        this.verificarCodigo(msg);
      } else if (this.estaComandoEnContexto(Comandos.IngresaTuNombreCompleto)) {
        this.actualizarNombre(msg);
      } else if (this.estaComandoEnContexto(Comandos.IngresaTuEmail)) {
        this.actualizarEmail(msg);
      }
    }

    private actualizarCodigo(msg: Message & ApiMessage) {
      let estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
      estudiante.codigo = msg.text;
      Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, estudiante).then(
        () => {
          this.solicitarVerificarCodigo(msg);
        },
        () => {
          console.error("EditarInformacionBasicaReceiver/actualizarCodigo");
        }
      );
    }

    private solicitarVerificarCodigo(msg: Message & ApiMessage) {
      this.enviarMensajeHTML(
        msg,
        Comandos.VerificaTuCodigo,
        Comandos.VerificaTuCodigo
      );
    }

    private verificarCodigo(msg: Message & ApiMessage) {
      if (this.estadoGlobal.infoUsuarioMensaje.estudiante.codigo != msg.text) {
        this.botSender
          .responderMensajeErrorHTML(msg, `Tu código no coincide`)
          .then(() => {
            this.solicitarCodigo(msg);
          });

        return;
      }

      this.solicitarNombreCompleto(msg);
    }

    private solicitarNombreCompleto(msg: Message & ApiMessage) {
      this.enviarMensajeHTML(
        msg,
        Comandos.IngresaTuNombreCompleto,
        Comandos.IngresaTuNombreCompleto
      );
    }

    private actualizarNombre(msg: Message & ApiMessage) {
      let estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
      estudiante.nombre = msg.text;
      Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, estudiante).then(
        () => {
          this.solicitarEmail(msg);
        },
        () => {
          console.error("EditarInformacionBasicaReceiver/actualizarCodigo");
        }
      );
    }

    private solicitarEmail(msg: Message & ApiMessage) {
      this.enviarMensajeHTML(
        msg,
        Comandos.IngresaTuEmail,
        `✉️ ${Comandos.IngresaTuEmail}`
      );
    }

    private actualizarEmail(msg: Message & ApiMessage) {
      let estudiante = this.estadoGlobal.infoUsuarioMensaje.estudiante;
      estudiante.email = msg.text;
      Data.Estudiantes.actualizarChat(msg, this.estadoGlobal, estudiante).then(
        () => {
          this.enviarMensajeDatosActualizadosConExito(msg).then(() => {
            this.irAMenuPrincipal(msg);
          });
        },
        () => {
          console.error("EditarInformacionBasicaReceiver/actualizarCodigo");
        }
      );
    }

    private enviarMensajeDatosActualizadosConExito(msg: Message & ApiMessage): Promise<any> {
      return this.botSender.responderMensajeHTML(
        msg,
        `✅ Has actualizado tus datos con éxito`
      );
    }

    private irAMenuPrincipal(msg: Message & ApiMessage) {
      this.enviarMensajeAReceiver(
        this.indexMain.menuPrincipalReceiver,
        this.indexMain.menuPrincipalReceiver.responderMenuPrincipalEstudiante,
        msg,
        MenuPrincipal.Comandos.MenuPrincipalEstudiante
      );
    }
  }
}