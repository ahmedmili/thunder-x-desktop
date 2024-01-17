import {
    DateTimePicker,
    LocalizationProvider,
    PickersCalendarHeaderProps
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en';
import { useEffect, useRef, useState } from 'react';
import './timePicker.scss';


import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Schedule } from '../../services/types';
import { getHoursAndMinutes } from '../../utils/utils';

interface TimepickerProps {
    openTime?: string;
    closeTime?: string;
    className?: string;
    schedules?: Schedule[];
    setSelectedDate: (date: Date) => void;
}

const TimePickerComponent: React.FC<TimepickerProps> = ({ className, setSelectedDate, schedules, openTime = "08:30", closeTime = "18:00" }) => {
    const [view, setView] = useState<any>('day');
    const { t } = useTranslation();
    const [currentDateTime, setCurrentDateTime] = useState<any>(dayjs()); // Initialize with Dayjs object
    const [minTime, setMinTime] = useState<Dayjs | null>(null); // Initialize with Dayjs object
    const [maxTime, setMaxTime] = useState<Dayjs | null>(null); // Initialize with Dayjs object

    const calculateMinMaxTime = () => {
        let minDateTime = dayjs();
        let maxDateTime = dayjs();
        if (schedules) {
            schedules.forEach(day => {
                const { hours: openH, minutes: openM } = getHoursAndMinutes(day.from);
                const { hours: closeH, minutes: closeM } = getHoursAndMinutes(day.to);
                const selectedDate = currentDateTime?.format('D')
                const dayMinDateTime = dayjs().set('date', parseInt(selectedDate!)).set('hour', openH).set('minute', openM);
                const dayMaxDateTime = dayjs().set('date', parseInt(selectedDate!)).set('hour', closeH).set('minute', closeM).set('second', 59);

                minDateTime = dayMinDateTime;

                if (!maxDateTime || dayMaxDateTime.isAfter(maxDateTime)) {
                    maxDateTime = dayMaxDateTime;
                }
            });
            setMinTime(minDateTime);
            setMaxTime(maxDateTime);
        } else {
            // No schedules provided, use default open and close times
            const { hours: openH, minutes: openM } = getHoursAndMinutes(openTime);
            const { hours: closeH, minutes: closeM } = getHoursAndMinutes(closeTime);

            minDateTime = dayjs().set('hour', openH).set('minute', openM);
            maxDateTime = dayjs().set('hour', closeH).set('minute', closeM).set('second', 59);

            setMinTime(minDateTime);
            setMaxTime(maxDateTime);
        }
    };

    useEffect(() => {
        calculateMinMaxTime();
    }, [schedules, currentDateTime]);


    const isForcedStatusEnabled = (dateString: any) => {
        if (schedules) {

            var currentDayObject = schedules.find((day: any) => day.day === currentDateTime?.format('ddd'));
            const now = dayjs();
            const { hours: openH, minutes: openM } = getHoursAndMinutes(currentDayObject!.from);
            const { hours: closeH, minutes: closeM } = getHoursAndMinutes(currentDayObject!.to);
            const date = dayjs(dateString);
            const valideHours = ((Number(date.format('H')) > Number(openH)) && (Number(date.format('M')) > Number(openM))) && ((Number(date.format('H')) < Number(closeH)) && (Number(date.format('M')) < Number(closeM)))
            const moreThanNow = (now.format('D') === date.format('D')) ? (Number(date.format('H')) > Number(now.format('H')) && (Number(date.format('M')) > Number(now.format('M')))) : true
            return (valideHours)
        } else {
            return (true)
        }
    }

    const handleTimeChange = (time: Date | null) => {
        let openArray = openTime.split(":")
        let closeArray = closeTime.split(":")
        const JobTime = {
            openH: openArray[0],
            openM: openArray[1],
            closeH: closeArray[0],
            closeM: closeArray[1]
        }
        if (time) {
            const selectedTime = dayjs(time);
            if (schedules === null) {
                if ((selectedTime.hour() >= parseInt(JobTime.openH) && (selectedTime.minute() >= parseInt(JobTime.openM))) && (selectedTime.hour() <= parseInt(JobTime.closeH) && (selectedTime.minute() <= parseInt(JobTime.closeM)))) {
                    setCurrentDateTime(selectedTime)
                } else {
                    console.warn('Selected time is outside the allowed range.');
                    setCurrentDateTime(dayjs()); // Set to default time
                }
            } else {
                const validate = isForcedStatusEnabled(time)
                if (validate) {
                    setCurrentDateTime(selectedTime)
                } else {
                    console.warn('Selected time is outside the allowed range.');
                    setCurrentDateTime(dayjs()); // Set to default time

                }
            }
        }
    };
    useEffect(() => {
        setSelectedDate(currentDateTime ? currentDateTime.toDate() : new Date(new Date().getTime() + 30 * 60000)); // Convert Dayjs to Date before passing to the callback
    }, [currentDateTime]);    
    function setFormat(_day: string, date: any) {        
        return t('calendar.days.'+_day);
    }
    const CustomCalendarHeader = (props: PickersCalendarHeaderProps<Dayjs>) => {
        const { currentMonth } = props;
        return <div className='calendar-header'> <button className='btn-prev' onClick={goPrevMonth}></button>
            <button className='btn-month' onClick={handleButtonClick}>{t('calendar.months.' + currentMonth.format("MMMM")) + ' ' +currentMonth.format("YYYY")} </button>
            <button className='btn-next'onClick={goNextMonth}></button>
        </div>;
    };    
    const handleButtonClick = () => {
        if(view=='day')
            setView('year');
        else
            setView('day');
    };
    const handleClose = () => {
        setView('day');
    }
    const goNextMonth = () => {
        const nextMonth = currentDateTime.add(1, 'month');
        const beginningOfMonth = nextMonth.startOf('month');
        setCurrentDateTime(beginningOfMonth);        
    }
    const goPrevMonth = () => {
        const prevMonth = currentDateTime.subtract(1, 'month');
        const beginningOfMonth = prevMonth.startOf('month');
        setCurrentDateTime(beginningOfMonth);
    }
    return (
        <div className={`time-picker-container ${className}`}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        className='time-picker-input'
                        label=""
                        openTo={view}
                        format="YYYY-MM-DD HH:mm:ss"
                        ampmInClock={true}
                        ampm={false}             
                        value={currentDateTime!}
                        minTime={minTime}
                        maxTime={maxTime}
                        disablePast={true}
                        onChange={handleTimeChange}                    
                        onClose={handleClose}
                        onYearChange={handleClose}
                        dayOfWeekFormatter={(_day: string, date: any) => setFormat(_day, date)}             
                        slots={{
                            calendarHeader: CustomCalendarHeader
                        }} 
                        localeText={{
                            okButtonLabel: ''+t('calendar.btnLabel')+''
                        }}
                    />
            </LocalizationProvider>
        </div>
    );
}

export default TimePickerComponent;
