import { Users } from "lucide-react";

interface Participant {
  id: string;
  user_id: string;
  display_name: string | null;
  joined_at: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  currentUserId?: string;
}

const ParticipantsList = ({ participants, currentUserId }: ParticipantsListProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-lg border border-border">
      <Users className="w-4 h-4 text-primary shrink-0" />
      <div className="flex items-center gap-2 flex-wrap">
        {participants.map((p) => {
          const isMe = p.user_id === currentUserId;
          const name = p.display_name || "User";
          const initial = name.charAt(0).toUpperCase();
          return (
            <div
              key={p.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border text-xs font-body"
              title={`${name}${isMe ? " (You)" : ""} — joined ${new Date(p.joined_at).toLocaleTimeString()}`}
            >
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0">
                {initial}
              </span>
              <span className="text-foreground font-medium truncate max-w-[80px]">
                {isMe ? "You" : name}
              </span>
            </div>
          );
        })}
      </div>
      <span className="ml-auto text-xs text-muted-foreground font-body whitespace-nowrap">
        {participants.length} online
      </span>
    </div>
  );
};

export default ParticipantsList;
