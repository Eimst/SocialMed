
export const normalizeDateString = (dateString: string): string => {
    return dateString.endsWith('Z') ? dateString : `${dateString}Z`;
};
