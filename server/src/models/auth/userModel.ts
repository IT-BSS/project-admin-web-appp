export interface User {
    guid: string;
    fio: string;
    birth_date: string;
    email: string;
    phone: string;
    password_hash: string;
    refresh_token?: string;
    access_token?: string;
    salt_password: string;
}
