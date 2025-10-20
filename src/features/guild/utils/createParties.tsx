interface PartyMember {
    name: string;
    role: string;
    availableRoles: string[];
    userId: string;
}

interface Party {
    id?: number;
    name?: string;
    members: PartyMember[];
}

interface UnusedMember {
    name: string;
    roles: string[];
    userId: string;
}


export const createParties = (event: any, preset: any, participants: any[]) => {
    console.log('Creating parties with the following data:');
    console.log('Event:', event);
    console.log('Preset:', preset);
    console.log('Participants:', participants);

    let parties: Party[] = [];
    const partySize = preset.party_size;
    const { roles } = preset.data;
    const usedParticipants = new Set();

    // Group participants by their roles for easier lookup
    const participantsByRole: { [roleName: string]: any[] } = {};

    participants.forEach(participant => {
        participant.roles.forEach((role: string) => {
            if (!participantsByRole[role]) {
                participantsByRole[role] = [];
            }
            participantsByRole[role].push(participant);
        });
    });

    console.log('Participants grouped by role:', participantsByRole);

    // Calculate how many complete parties we can make
    let maxParties = Math.floor(participants.length / partySize);

    // Check role limitations
    for (const roleReq of roles) {
        const available = participantsByRole[roleReq.roleName]?.length || 0;
        const possibleFromRole = Math.floor(available / roleReq.count);
        maxParties = Math.min(maxParties, possibleFromRole);
    }

    // Create parties
    for (let i = 0; i < maxParties; i++) {
        const party: Party = {
            id: i + 1,
            members: []
        };

        for (const roleReq of roles) {
            const availableForRole = participantsByRole[roleReq.roleName]?.filter(
                p => !usedParticipants.has(p.user_id)
            ) || [];

            for (let j = 0; j < roleReq.count && j < availableForRole.length; j++) {
                const participant = availableForRole[j];
                party.members.push({
                    name: participant.name as string,
                    role: roleReq.roleName as string,
                    availableRoles: participant.roles as string[], // Include all available roles
                    userId: participant.user_id as string
                });
                usedParticipants.add(participant.user_id);
            }
        }

        // Fill remaining slots with any available participants
        const remainingSlots = partySize - party.members.length;
        const availableParticipants = participants.filter(
            p => !usedParticipants.has(p.user_id)
        );

        for (let j = 0; j < remainingSlots && j < availableParticipants.length; j++) {
            const participant = availableParticipants[j];
            party.members.push({
                name: participant.name as string,
                role: 'FLEX',
                availableRoles: participant.roles as string[], // Include all available roles
                userId: participant.user_id as string
            });
            usedParticipants.add(participant.user_id);
        }

        parties.push(party);
    }

    // Identify unused members
    const unusedMembers: UnusedMember[] = participants
        .filter(p => !usedParticipants.has(p.user_id))
        .map(p => ({ 
            name: p.name, 
            roles: p.roles,
            userId: p.user_id 
        }));

    console.log('Generated parties:', parties);
    console.log('Unused members:', unusedMembers);

    return {
        parties,
        unusedMembers
    };
};