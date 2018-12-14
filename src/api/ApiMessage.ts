import { Message } from "../bot/Message";
import { User } from "../bot/User";

export interface ApiMessage {
    id: number | string;
    from: User;
    message: Message;
    chat_instance: string;
    data: string;
    query: string;
    result_id: string;
}
