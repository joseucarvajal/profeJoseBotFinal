import { MenuPrincipal } from './menuPrincipal/MenuPrincipalReceiver';
import { EditarInformacionBasica } from './EditarInformacionBasica/EditarInformacionBasicaReceiver';
import { InscribirAsignatura } from './InscribirAsignatura/InscribirAsignaturaReceiver';

export interface IndexMain {
    menuPrincipalReceiver:MenuPrincipal.MenuPrincipalReceiver;
    editarInformacionBasicaReceiver:EditarInformacionBasica.EditarInformacionBasicaReceiver;
    inscribirAsignaturaReceiver:InscribirAsignatura.InscribirAsignaturaReceiver;
}

