export interface User {
    guid: string;
    fio: string;
    birth_date: Date;
    email: string;
    phone: string;
    password_hash: string;
    salt_password: string;
    refresh_token: string;
    access_token: string;
}
