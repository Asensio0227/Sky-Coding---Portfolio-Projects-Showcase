import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  trend?: string;
  valueColor?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  valueColor = 'text-gray-900',
}: StatsCardProps) {
  return (
    <Card className='spacing '>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-gray-600'>
          {title}
        </CardTitle>
        <Icon className='h-4 w-4 text-gray-500' />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
        <p className='text-xs text-gray-500 mt-1'>{description}</p>
        {trend && (
          <p className='text-xs text-green-600 mt-2 font-medium'>{trend}</p>
        )}
      </CardContent>
    </Card>
  );
}
