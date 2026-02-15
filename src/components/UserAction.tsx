'use client';

import { Button } from '@/components/ui/button';
import { Ban, Trash2, UserCheck, UserX } from 'lucide-react';

export function UserActions({
  isActive,
  onSuspend,
  onActivate,
  onDelete,
  onBlock,
}: {
  isActive: boolean;
  onSuspend: () => void;
  onActivate: () => void;
  onDelete: () => void;
  onBlock: () => void;
}) {
  return (
    <div className='flex gap-2'>
      {isActive ? (
        <>
          <Button variant='outline' onClick={onSuspend} className='btn '>
            <UserX className='h-4 w-4 mr-2' />
            Suspend
          </Button>
          <Button variant='destructive' onClick={onBlock} className='btn '>
            <Ban className='h-4 w-4 mr-2' />
            Block
          </Button>
        </>
      ) : (
        <Button onClick={onActivate} className='btn '>
          <UserCheck className='h-4 w-4 mr-2' />
          Activate
        </Button>
      )}

      <Button variant='destructive' onClick={onDelete} className='btn '>
        <Trash2 className='h-4 w-4 mr-2' />
        Delete
      </Button>
    </div>
  );
}
