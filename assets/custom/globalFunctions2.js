// Format date to dd/mm/yyyy
export function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}
// ======================================================================================
export function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty string
    return str.charAt(0).toUpperCase() + str.slice(1);
}
