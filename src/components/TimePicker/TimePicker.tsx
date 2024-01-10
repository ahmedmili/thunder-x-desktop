
import {
    DateTimePicker,
    LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import 'dayjs/locale/en';
import { useEffect, useState } from 'react';
import './timePicker.scss';



interface TimepickerProps {
    className?: string,
    setSelectedDate: (date: Date) => void
}
const TimePickerComponent: React.FC<TimepickerProps> = ({ className, setSelectedDate }) => {

    const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

    const handleTimeChange = (time: Date | null) => {
        if (time) {
            setCurrentDateTime(time);
        }
    };

    useEffect(() => {
        setSelectedDate(currentDateTime)
    }, [currentDateTime])
    return (
        <div className={`time-picker-container ${className} `} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']}>
                    <DateTimePicker
                        className='time-picker-input'
                        label="Basic time picker"
                        format="YYYY-MM-DD HH:mm:ss"
                        ampmInClock={true}
                        ampm={false}
                        onChange={handleTimeChange}
                    />
                </DemoContainer>
            </LocalizationProvider>
        </div>
    )
}

export default TimePickerComponent