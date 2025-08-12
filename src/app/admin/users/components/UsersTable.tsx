import {
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import type { User } from '@/types/user';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onBanToggle: (userId: string) => Promise<void>;
  onRoleChange: (userId: string, newRole: string) => Promise<void>;
}

export default function UsersTable({ users, loading, onBanToggle, onRoleChange }: UsersTableProps) {
  const t = useTranslations('admin');

  const columns = [
    { name: 'User ID', uid: 'id' },
    { name: t('shared.name'), uid: 'name' },
    { name: t('shared.email'), uid: 'email' },
    { name: t('common.status'), uid: 'status' },
    { name: t('common.actions'), uid: 'actions' },
  ];

  return (
    <Table aria-label='Users Table' isStriped className='rounded-xl shadow'>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent={t('common.no-data-found')} items={users} isLoading={loading}>
        {(user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <RadioGroup defaultValue={user.banned ? '2' : '1'}>
                <div className='flex items-center gap-2'>
                  <Radio
                    value='1'
                    checked={!!user.banned}
                    onChange={async () => await onBanToggle(user.id)}
                  >
                    {t('users.status.active')}
                  </Radio>
                  <Radio
                    value='2'
                    checked={!user.banned}
                    onChange={async () => await onBanToggle(user.id)}
                  >
                    {t('users.status.inactive')}
                  </Radio>
                </div>
              </RadioGroup>
            </TableCell>
            <TableCell>
              <Select
                selectedKeys={new Set([user.role])}
                value={user.role}
                onChange={(e) => onRoleChange(user.id, e.target.value)}
                className='min-w-[120px]'
                aria-label='Change user role'
              >
                <SelectItem key='user'>{t('users.roles.user')}</SelectItem>
                <SelectItem key='admin'>{t('users.roles.admin')}</SelectItem>
                <SelectItem key='chef'>{t('users.roles.chef')}</SelectItem>
              </Select>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
