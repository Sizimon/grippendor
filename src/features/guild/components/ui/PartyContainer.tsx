import { Party, PartyMember } from '../../types';
import React from 'react';
import { DraggableMember } from './DraggableMember';

// Party Container Component
export const PartyContainer: React.FC<{
    party: Party;
    onDrop: (partyId: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragStart: (member: PartyMember, partyId: number, memberIndex: number) => void;
    onRoleChange: (partyId: number, memberIndex: number, newRole: string) => void;
}> = ({ party, onDrop, onDragOver, onDragStart, onRoleChange }) => {
    return (
        <div
            onDrop={() => onDrop(party.id)}
            onDragOver={onDragOver}
            className="bg-black/20 rounded-lg p-6 border-2 border-white/10 hover:border-white/20 transition-all duration-200 min-h-[200px]"
        >
            <h3 className="font-semibold mb-4 text-center text-lg">
                🎯 Party {party.id}
                <span className="text-sm opacity-60 ml-2">({party.members.length} members)</span>
            </h3>
            <div className="space-y-3">
                {party.members.length > 0 ? (
                    party.members.map((member, index) => (
                        <DraggableMember
                            key={`${member.userId}-${index}`}
                            member={member}
                            partyId={party.id}
                            memberIndex={index}
                            onDragStart={onDragStart}
                            onRoleChange={onRoleChange}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 opacity-50 border-2 border-dashed border-white/20 rounded-lg">
                        <div className="text-2xl mb-2">👥</div>
                        <p className="text-sm">Drop members here</p>
                    </div>
                )}
            </div>
        </div>
    );
};