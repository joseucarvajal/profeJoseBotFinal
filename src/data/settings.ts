import { dataBase } from '../initDatabase';
import { Settings as SettingsModel } from '../core/models';

export namespace Settings {

    export const getSettings = (): Promise<SettingsModel> => {
        return dataBase.ref('settings').once('value')
            .then((snapshot: any) => {
                return snapshot.val();
            })
            .catch((error: any) => {
                console.log("Chats/settings" + error);
            });
    }
}