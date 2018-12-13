/**
 * @author Jose Ubaldo Carvajal <joseucarvajal@gmail.com>
 * @author Luis Felipe Mejia Castrillon <luisfe_617@outlook.com>
 * 
 * See {@link https://core.telegram.org/bots/api#user}
 */
export interface User {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
}