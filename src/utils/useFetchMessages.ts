import { fetchMessages } from '../Redux/slices/messanger';
import { useAppDispatch } from '../Redux/store';

const useFetchMessages = () => {
    const dispatch = useAppDispatch();

    const getMessages = async () => {
        try {
            await dispatch(fetchMessages());
        } catch (error) {
            console.error(error);
        }
    };

    return getMessages;
};

export default useFetchMessages;