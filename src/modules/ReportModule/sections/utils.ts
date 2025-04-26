export function sanitizeString(input: string): string {
    return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function validatePhone(phone: string): boolean {
    const cleanedPhone = phone.trim().replace(/\s/g, '');
    const phoneRegex = /^\d{8,13}$/;
    return phoneRegex.test(cleanedPhone);
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

export function validateUrl(url: string): boolean {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return urlRegex.test(url.trim());
}

export function validateDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

export function validateDescription(description: string, minLength: number = 10): boolean {
    return description.trim().length >= minLength;
}

export function sanitizeName(name: string): string {
    return name.replace(/[^a-zA-Z0-9\s-]/g, '');
}