// Format date and time
export const formatDateTime = (isoString: string | undefined) => {
    if (!isoString) return 'Date unavailable';

    const date = new Date(isoString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    }).format(date);
};