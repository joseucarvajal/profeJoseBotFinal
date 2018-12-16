import { MenuPrincipal } from './menuPrincipal/MenuPrincipalReceiver';
import { EditarInformacionBasica } from './EditarInformacionBasica/EditarInformacionBasicaReceiver';
import { InscribirAsignatura } from './InscribirAsignatura/InscribirAsignaturaReceiver';
import { RegistrarAsistencia } from './registrarAsistencia/RegistrarAsistenciaReceiver';

export interface MainReceiverContract {
    menuPrincipalReceiver:MenuPrincipal.MenuPrincipalReceiver;
    editarInformacionBasicaReceiver:EditarInformacionBasica.EditarInformacionBasicaReceiver;
    inscribirAsignaturaReceiver:InscribirAsignatura.InscribirAsignaturaReceiver;
    registrarAsistenciaReceiver: RegistrarAsistencia.RegistrarAsistenciaReceiver;
}

