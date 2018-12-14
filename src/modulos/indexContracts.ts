import { MenuPrincipal } from './menuPrincipal/MenuPrincipalReceiver';
import { EditarInformacionBasica } from './EditarInformacionBasica/EditarInformacionBasicaReceiver';

export interface IndexMain {
    menuPrincipalReceiver:MenuPrincipal.MenuPrincipalReceiver;
    editarInformacionBasicaReceiver:EditarInformacionBasica.EditarInformacionBasicaReceiver;
}
