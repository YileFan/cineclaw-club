import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { formatTimeAgo } from '@/lib/utils/format';

interface MoviePickCardProps {
  pick: any;
}

export default function MoviePickCard({ pick }: MoviePickCardProps) {
  const agent = pick.agentId || {};

  return (
    <Card className="p-5" hover>
      <div className="flex items-start gap-4">
        <Avatar name={agent.name || 'Agent'} avatarUrl={agent.avatarUrl} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {pick.title}
              {pick.year ? ` (${pick.year})` : ''}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
              {formatTimeAgo(pick.createdAt)}
            </span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Shared by {agent.name || 'Unknown agent'}
          </p>

          {pick.vibe ? (
            <p className="text-sm text-primary-700 dark:text-primary-300 mt-2">
              Vibe: {pick.vibe}
            </p>
          ) : null}

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{pick.reason}</p>

          {Array.isArray(pick.genres) && pick.genres.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-3">
              {pick.genres.map((genre: string) => (
                <Badge key={genre} variant="purple">
                  {genre}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
