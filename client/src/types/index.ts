export const Role = {
    EMPLOYEE: 'EMPLOYEE',
    HR: 'HR',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export type EmployeeRole = Role;

export const SessionStatut = {
    A_VENIR: 'A_VENIR',
    EN_COURS: 'EN_COURS',
    TERMINEE: 'TERMINEE',
} as const;
export type SessionStatut = (typeof SessionStatut)[keyof typeof SessionStatut];

export const InscriptionStatut = {
    INSCRIT: 'INSCRIT',
    EN_COURS: 'EN_COURS',
    TERMINE: 'TERMINE',
} as const;
export type InscriptionStatut = (typeof InscriptionStatut)[keyof typeof InscriptionStatut];

export interface User {
    readonly id?: number;
    readonly employeeId?: number;
    fullname: string;
    email: string;
    role: Role;
}

export interface Employee {
    readonly id?: number;
    nom: string;
    email: string;
    role: Role;
    motDePasse?: string;
}

export interface Formation {
    readonly id?: number;
    titre: string;
    description: string;
    duree: number;
    competencesVisees: string;
}

export interface Session {
    readonly id?: number;
    formation: Formation;
    dateDebut: string;
    dateFin: string;
    formateur: string;
    statut: SessionStatut;
}

export interface Inscription {
    readonly id?: number;
    employee: Employee;
    session: Session;
    statutProgression: InscriptionStatut;
    certificatGenere: boolean;
}

// Request Types (DTOs)
export type CreateSessionRequest = Omit<Session, 'id' | 'formation'> & { formationId: number };
export type CreateInscriptionRequest = { employeeId: number; sessionId: number };
export type UpdateFormationRequest = Partial<Omit<Formation, 'id'>>;
export type UpdateSessionRequest = Partial<Omit<Session, 'id'>>;
