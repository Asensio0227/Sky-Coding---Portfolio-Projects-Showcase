import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';

interface Conversation {
  _id: string;
  visitorId: string;
  source: string;
  status: 'active' | 'resolved' | 'abandoned';
  messageCount: number;
  createdAt: string;
  lastMessageAt: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  formatDate: (date: string) => string;
}

export default function ConversationList({
  conversations,
  formatDate,
}: ConversationListProps) {
  return (
    <div className='spacing'>
      {conversations.map((conversation) => (
        <Link
          key={conversation._id}
          href={`/dashboard/conversations/${conversation._id}`}
        >
          <Card className='hover:shadow-md transition-shadow cursor-pointer'>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-start space-x-4 flex-1'>
                  <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                    <User className='h-5 w-5 text-blue-600' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-3 mb-2'>
                      <p className='text-sm font-semibold text-gray-900'>
                        Visitor: {conversation.visitorId || 'Anonymous'}
                      </p>
                      <Badge
                        variant={
                          conversation.status === 'active'
                            ? 'default'
                            : 'secondary'
                        }
                        className='text-xs'
                      >
                        {conversation.status}
                      </Badge>
                    </div>
                    <div className='flex items-center gap-4 text-sm text-gray-600'>
                      <span className='flex items-center'>
                        <MessageSquare className='h-4 w-4 mr-1' />
                        {conversation.messageCount || 0} messages
                      </span>
                      <span className='capitalize'>{conversation.source}</span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <p className='text-sm font-medium text-gray-900'>
                      {formatDate(conversation.lastMessageAt)}
                    </p>
                    <p className='text-xs text-gray-500'>Last activity</p>
                  </div>
                  <ChevronRight className='h-5 w-5 text-gray-400' />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
