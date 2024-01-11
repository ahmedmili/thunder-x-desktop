import {
    DateTimePicker,
    LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import 'dayjs/locale/en';
import { useEffect, useState } from 'react';
import './timePicker.scss';

import dayjs, { Dayjs } from 'dayjs';

interface TimepickerProps {
    openTime?: string,
    closeTime?: string,
    className?: string,
    setSelectedDate: (date: Date) => void
}

const TimePickerComponent: React.FC<TimepickerProps> = ({ className, setSelectedDate, openTime = "08:30", closeTime = "18:00" }) => {
    const [currentDateTime, setCurrentDateTime] = useState<Dayjs | null>(dayjs()); // Initialize with Dayjs object



    const handleTimeChange = (time: Date | null) => {
        let openArray = openTime.split(":")
        let closeArray = closeTime.split(":")
        const JobTime = {
            openH: openArray[0],
            openM: openArray[1],
            closeH: closeArray[0],
            closeM: closeArray[1]
        }
        const minTime = dayjs().set('hour', parseInt(JobTime.openH)).set('minute', parseInt(JobTime.openM)).set('second', 0);
        const maxTime = dayjs().set('hour', parseInt(JobTime.closeH)).set('minute', parseInt(JobTime.closeM)).set('second', 0);
        if (time) {
            const selectedTime = dayjs(time);

            if ((selectedTime.hour() >= parseInt(JobTime.openH) && selectedTime.minute() >= parseInt(JobTime.openM)) &&  selectedTime.isBefore(maxTime)) {
            } else {
                console.warn('Selected time is outside the allowed range.');
                setCurrentDateTime(null); // Set to null to cancel the selection

                // setCurrentDateTime(dayjs().set('hour', 12).set('minute', 59).set('second', 0)); // Set to default time
            }
        }
    };

    useEffect(() => {
        setSelectedDate(currentDateTime ? currentDateTime.toDate() : new Date(new Date().getTime() + 30 * 60000)); // Convert Dayjs to Date before passing to the callback
    }, [currentDateTime]);

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
                        value={currentDateTime}

                    />
                </DemoContainer>
            </LocalizationProvider>
        </div>
    );
}

export default TimePickerComponent;
