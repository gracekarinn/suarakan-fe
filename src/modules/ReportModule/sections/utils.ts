export function sanitizeString(input: string): string {
    if (!input) return "";
    return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function validatePhone(phone: string): boolean {
    if (!phone) return true; 
    const cleanedPhone = phone.trim().replace(/\s/g, '');
    const phoneRegex = /^\d{8,13}$/;
    return phoneRegex.test(cleanedPhone);
}

export function validateEmail(email: string): boolean {
    if (!email) return true; 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
}

export function validateUrl(url: string): boolean {
    if (!url) return false; 
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url.trim());
}

export function validateDate(dateStr: string): boolean {
    if (!dateStr) return true; 
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

export function validateDescription(description: string, minLength: number = 10): boolean {
    if (!description) return false; 
    return description.trim().length >= minLength;
}

export function validateNIK(nik: string): boolean {
    if (!nik) return true; 
    const nikRegex = /^\d{16}$/;
    return nikRegex.test(nik.trim());
}

export function sanitizeName(name: string): string {
    if (!name) return "";
    return name.replace(/[^a-zA-Z0-9\s-]/g, '');
}

export function formatDateForBackend(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; 
}

export function formatDateTimeForBackend(dateTimeStr: string): string {
    return new Date(dateTimeStr).toISOString();
}