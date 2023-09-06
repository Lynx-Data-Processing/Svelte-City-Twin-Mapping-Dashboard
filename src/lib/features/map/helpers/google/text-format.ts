

export const formatText = (text: string) => {

    // Remove underscores
    text = text.replace(/_/g, ' ');

    // Capitalize first letter of each word
    text = text.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    return text;
};

