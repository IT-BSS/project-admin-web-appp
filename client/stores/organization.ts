import { defineStore } from "pinia";


export interface Organization
{
    id: number;
    name: string;
    adress: string;
    INN: number;
    email: string;
    phone: number;
}

export const useOrganizationStore = defineStore("organizations", {
    state: () => ({
        organizations: [
            {
                id: 1,
                name: "ООО 'Залупа'",
                adress: "Залупинск 52",
                INN: 1488,
                email: 'mamytraxal@gmail.ru',
                phone: 1233211234
            },
            {
                id: 2,
                name: "ООО 'биба и боба'",
                adress: "бибонский боб 60",
                INN: 228,
                email: 'xdxdxd@gmail.ru',
                phone: 1233211234
            },
            {
                id: 3,
                name: "ООО 'Я не придумал'",
                adress: "придумал 101",
                INN: 123123,
                email: 'mamytNeraxal@gmail.ru',
                phone: 1233211234
            },
            {
                id: 4,
                name: "ООО 'Сберанк'",
                adress: "московский 52",
                INN: 1488,
                email: 'ozzy@gmail.ru',
                phone: 1233211234
            },
            {
                id: 5,
                name: "ООО 'Тинькофф'",
                adress: "питерский 52",
                INN: 1488,
                email: 'john@gmail.ru',
                phone: 1233211234
            },
            {
                id: 6,
                name: "ООО 'ВТБ'",
                adress: "калужский 52",
                INN: 1488,
                email: 'katy@gmail.ru',
                phone: 1233211234
            },
        ] as Organization[],
        selectedOrganizationId: 1
    }),

    getters: {

        getById: (state) => {
            return (id: number) => state.organizations.find((org) => org.id === id)
        },

        total: (state) => state.organizations.length,

        selectedOrganization: (state): Organization | undefined => {
            return state.organizations.find((u) => u.id === state.selectedOrganizationId);
        },
    },

    actions: {
        addOrganization(org: Organization) {
            this.organizations.push(org)
        },

        removeOrganization(id: number) {
            this.organizations = this.organizations.filter((org) => org.id !== id)
        },

        updateOrganization(updated: Organization) {
            const index = this.organizations.findIndex((org) => org.id === updated.id)
            if (index !== -1) {
                this.organizations[index] = updated
            }
        },

        clearAll() {
            this.organizations = []
        },
    },
})