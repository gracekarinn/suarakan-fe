export interface RegisterFormData {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    confirm_password: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}