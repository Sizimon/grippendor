export interface PartyMember {
    name: string;
    role: string;
    availableRoles: string[];
    userId: string;
}

export interface Party {
    id: number;
    members: PartyMember[];
}

export interface UnusedMember {
    name: string;
    roles: string[];
    userId: string;
}
