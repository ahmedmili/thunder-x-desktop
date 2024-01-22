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
    const [currentDateTime, setCurrentDateTime] = useState<any>(null); // Initialize with Dayjs object
    const [minTime, setMinTime] = useState<Dayjs | null>(null); // Initialize with Dayjs object
    const [maxTime, setMaxTime] = useState<Dayjs | null>(null); // Initialize with Dayjs object
    const [disabledDays, setDisabledDays] = useState<any>(null); // Initialize with Dayjs object
    const [canGoPrevMonth, setcanGoPrevMonth] = useState<boolean>(false); // Initialize with Dayjs object
    const calculateMinMaxTime = () => {
        // let minDateTime = dayjs();
        // let maxDateTime = dayjs();
        // if (schedules) {
        //     schedules.forEach(day => {
        //         console.log("dayyyyy", day);
        //         const { hours: openH, minutes: openM } = getHoursAndMinutes(day.from);
        //         const { hours: closeH, minutes: closeM } = getHoursAndMinutes(day.to);
        //         const selectedDate = currentDateTime?.format('D')
        //         const dayMinDateTime = dayjs().set('date', parseInt(selectedDate!)).set('hour', openH).set('minute', openM);
        //         const dayMaxDateTime = dayjs().set('date', parseInt(selectedDate!)).set('hour', closeH).set('minute', closeM).set('second', 59);

        //         minDateTime = dayMinDateTime;

        //         if (!maxDateTime || dayMaxDateTime.isAfter(maxDateTime)) {
        //             maxDateTime = dayMaxDateTime;
        //         }
        //     });
        //     setMinTime(minDateTime);
        //     setMaxTime(maxDateTime);
        // } else {
        //     // No schedules provided, use default open and close times
        //     const { hours: openH, minutes: openM } = getHoursAndMinutes(openTime);
        //     const { hours: closeH, minutes: closeM } = getHoursAndMinutes(closeTime);

        //     minDateTime = dayjs().set('hour', openH).set('minute', openM);
        //     maxDateTime = dayjs().set('hour', closeH).set('minute', closeM).set('second', 59);

        //     setMinTime(minDateTime);
        //     setMaxTime(maxDateTime);
        // }
    };
    useEffect(() => {
        getDisabledDays()
    }, [schedules]);
    function getDisabledDays() {
        let disabledDays : any = []
        schedules?.map((day: any) => {
            if (day.status == 'CLOSE') {          
                switch (day.day) {
                case "Mon":
                    disabledDays.push(1)
                    break;

                case "Tue":
                    disabledDays.push(2)
                    break;

                case "Wed":
                    disabledDays.push(3)
                    break;

                case "Thu":
                    disabledDays.push(4)
                    break;

                case "Fri":
                    disabledDays.push(5)
                    break;

                case "Sat":
                    disabledDays.push(6)
                    break;

                case "Sun":
                    disabledDays.push(0)
                    break;              
                }                
            }
        })
        setDisabledDays(disabledDays);   
    }
    useEffect(() => {
        const currentDate = new Date();
        filterDateDefaultSelectedDate(currentDate);        
    }, [disabledDays])
    function filterDateDefaultSelectedDate(currentDate:any){
        const currentDateIndex = currentDate.getDay();
        if (!disabledDays?.includes(currentDateIndex)) {
            formatInitialDate(dayjs(currentDate),currentDateIndex)
        }
        else {
            const dayIndex = findClosestOpenDay(currentDateIndex);
            if (dayIndex != null) {
                const dayDifference = dayIndex - currentDate.getDay();
                const timeDifference = dayDifference < 0 ? (dayDifference + 7) * 24 * 60 * 60 * 1000 : dayDifference * 24 * 60 * 60 * 1000;
                const newDate = new Date(currentDate.getTime() + timeDifference)
                formatInitialDate(dayjs(newDate),dayIndex)
            }             
        }
    }
    function findClosestOpenDay(dayIndex:any) {
        let count = 0;
        let day = dayIndex;
        let SelectedDate = null;
        while (count < 6 && SelectedDate == null) {
            if (day < 6) {
                day++;                              
            }
            else {
                day = 0;
            }
            if (!disabledDays?.includes(day)) {
                SelectedDate = day
            } 
            count++;
        }
        return SelectedDate;
    }
    useEffect(() => {
        setSelectedDate(currentDateTime ? currentDateTime.toDate() : new Date(new Date().getTime() + 30 * 60000)); // Convert Dayjs to Date before passing to the callback
        if (currentDateTime) {
            const prevMonth = currentDateTime.subtract(1, 'month');
            let beginningOfMonth = dayjs();
            if (!prevMonth.isSame(dayjs(), 'month')) {
                beginningOfMonth = prevMonth.startOf('month');
            }             
            const now = dayjs();        
            setcanGoPrevMonth(!(beginningOfMonth.isAfter(now) || beginningOfMonth.isSame(now))) ;            
            filterTimes();
        }
    }, [currentDateTime]);  
    function filterTimes() {
        const currentDayIndex = new Date(currentDateTime).getDay();
        let selectedDay :any = null;
        switch (currentDayIndex) {
        case 1:
            selectedDay = "Mon";
            break;
        case 2:
           selectedDay = "Tue";
            break;
        case 3:
            selectedDay = "Wed";
            break;
        case 4:
            selectedDay = "Thu";
            break;
        case 5:
            selectedDay = "Fri";
            break;
        case 6:
            selectedDay = "Fri";
            break;
        case 0:
            selectedDay = "Sun";
            break;            
        }
        const dateShedule = schedules?.find((day: any) => day.day == selectedDay) 
        const start : any = dateShedule?.from;
        const to : any = dateShedule?.to;
        const { hours: openH, minutes: openM } = getHoursAndMinutes(start);
        const { hours: closeH, minutes: closeM } = getHoursAndMinutes(to);
        const selectedDate = currentDateTime;
        const dayMinDateTime = selectedDate.set('hour', openH).set('minute', openM);
        const dayMaxDateTime = selectedDate.set('hour', closeH).set('minute', closeM).set('second', 59);
        setMinTime(dayMinDateTime);
        setMaxTime(dayMaxDateTime);
        if (currentDateTime.isAfter(dayMaxDateTime)) {
            setCurrentDateTime(dayMaxDateTime)
        }
        if (currentDateTime.isBefore(dayMinDateTime)) {
            setCurrentDateTime(dayMinDateTime)
        }
    }
    function setFormat(_day: string, date: any) {        
        return t('calendar.days.'+_day);
    }
    const CustomCalendarHeader = (props: PickersCalendarHeaderProps<Dayjs>) => {
        const { currentMonth } = props;
        return <div className='calendar-header'> <button className='btn-prev' disabled={canGoPrevMonth} onClick={goPrevMonth}></button>
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
    const updateValue = (event: any) => { 
        setCurrentDateTime(event)
    }
    const goNextMonth = () => {
        const nextMonth = currentDateTime.add(1, 'month');
        const beginningOfMonth = nextMonth.startOf('month');        
        const currentDate = new Date(beginningOfMonth);
        filterDateDefaultSelectedDate(currentDate);               
    }
    const goPrevMonth = () => {   
        const prevMonth = currentDateTime.subtract(1, 'month');
        let beginningOfMonth :any = dayjs();
        if (!prevMonth.isSame(dayjs(), 'month')) {
            beginningOfMonth = prevMonth.startOf('month');
        } 
        const currentDate = new Date(beginningOfMonth)       
        filterDateDefaultSelectedDate(currentDate);  
    }    
    const shouldDisableDate = (day :any) : boolean => {
        const date = new Date(day);        
        return disabledDays?.includes(date.getDay()) 
    };
    function formatInitialDate(date:any, index:any){
        let selectedDay :any = null;
        switch (index) {
        case 1:
            selectedDay = "Mon";
            break;
        case 2:
           selectedDay = "Tue";
            break;
        case 3:
            selectedDay = "Wed";
            break;
        case 4:
            selectedDay = "Thu";
            break;
        case 5:
            selectedDay = "Fri";
            break;
        case 6:
            selectedDay = "Fri";
            break;
        case 0:
            selectedDay = "Sun";
            break;            
        }
        const dateShedule = schedules?.find((day: any) => day.day == selectedDay) 
        const start: any = dateShedule?.from;
        const to : any = dateShedule?.to;
        
        const { hours: openH, minutes: openM } = getHoursAndMinutes(start);
        const { hours: closeH, minutes: closeM } = getHoursAndMinutes(to);
        const selectedDate = date
        const dayMinDateTime = selectedDate.set('hour', openH).set('minute', openM);
        const dayMaxDateTime = selectedDate.set('hour', closeH).set('minute', closeM).set('second', 59);
        const now = dayjs();
        const isToday = selectedDate.isSame(now, 'day');
        if (isToday) {
            if(dayMaxDateTime.isAfter(now)) {
                if (dayMinDateTime.isAfter(now) || dayMinDateTime.isSame(now)) {
                    setCurrentDateTime(dayMinDateTime)
                }
                else {
                    setCurrentDateTime(now)
                }
            }
            else {
                const tomorrow: any = now.add(1, 'day');
                const currentDate = new Date(tomorrow);
                const currentDateIndex = currentDate.getDay(); 
                const dayIndex = findClosestOpenDay(currentDateIndex);
                if (dayIndex != null) {
                    const dayDifference = dayIndex - currentDateIndex;
                    const timeDifference = dayDifference < 0 ? (dayDifference + 7) * 24 * 60 * 60 * 1000 : dayDifference * 24 * 60 * 60 * 1000;
                    const newDate = new Date(currentDate.getTime() + timeDifference)
                    formatInitialDate(dayjs(newDate),dayIndex)
                }  
            }
        
        }
        else {
            setCurrentDateTime(dayMinDateTime)
        }       
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
                        shouldDisableDate={shouldDisableDate}
                        onChange={updateValue}                    
                        onClose={handleClose}
                        timeSteps={{ minutes: 1 }}
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
