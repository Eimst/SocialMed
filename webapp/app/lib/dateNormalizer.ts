import {formatDate, isToday} from "date-fns";

export const normalizeDateString = (dateString: string): string => {
    return dateString.endsWith('Z') ? dateString : `${dateString}Z`;
};

export const getDynamicTime = (date: string): string => {
    const messageDate = new Date(normalizeDateString(date));
    const now = new Date();

    const isWithinLast7Days = (date: Date): boolean => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return date >= sevenDaysAgo && date <= now;
    };

    if (isToday(messageDate)) {
        return formatDate(messageDate, 'HH:mm');
    } else if (isWithinLast7Days(messageDate)) {
        return formatDate(messageDate, 'EEEE HH:mm');
    } else {
        return formatDate(messageDate, 'dd/MM/yyyy HH:mm');
    }
};
