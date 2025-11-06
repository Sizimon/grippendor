import { PartyMember } from '../../types';
import React from 'react';
import { RoleDropdown } from './RoleSelector';

// Draggable Member Component
export const DraggableMember: React.FC<{
    member: PartyMember;
    partyId: number;
    memberIndex: number;
    onDragStart: (member: PartyMember, partyId: number, memberIndex: number) => void;
    onRoleChange: (partyId: number, memberIndex: number, newRole: string) => void;
}> = ({ member, partyId, memberIndex, onDragStart, onRoleChange }) => {
    return (
        <div
            draggable
            onDragStart={() => onDragStart(member, partyId, memberIndex)}
            className="flex justify-between items-center bg-black/30 rounded p-3 border border-white/10 cursor-grab active:cursor-grabbing hover:bg-black/40 transition-all duration-200 hover:scale-105"
        >
            <div className="flex-1">
                <span className="text-sm font-medium">{member.name}</span>
                <div className="text-xs opacity-60 mt-1">
                    Available: {member.availableRoles.join(', ')}
                </div>
            </div>
            <RoleDropdown
                currentRole={member.role}
                availableRoles={member.availableRoles}
                onChange={(newRole) => onRoleChange(partyId, memberIndex, newRole)}
            />
        </div>
    );
};