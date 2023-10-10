import { addMessangerSuccess } from '../Redux/slices/messanger';
import { useAppDispatch } from '../Redux/store';
import { Message } from '../services/types';

const useAddMessage = (message: Message) => {
    const dispatch = useAppDispatch();

    const setMessages = async () => {
        try {
            dispatch(addMessangerSuccess(message))

        } catch (error) {
            console.error(error);
        }
    };

    return setMessages;
};

export default useAddMessage;