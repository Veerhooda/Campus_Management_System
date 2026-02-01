
import { Ticket, TicketStatus, TicketPriority } from './types';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: '#GRV-1024',
    category: 'HVAC',
    subject: 'AC not cooling in Lab 3',
    description: 'Reports of high temperature affecting equipment in Lab 3. Likely coolant leak.',
    priority: TicketPriority.HIGH,
    status: TicketStatus.NEW,
    date: 'Oct 24, 2023'
  },
  {
    id: '#GRV-1023',
    category: 'Plumbing',
    subject: 'Leaking faucet in Dorm B',
    description: 'Faucet in Room 204 Dorm B is leaking continuously.',
    priority: TicketPriority.LOW,
    status: TicketStatus.IN_PROGRESS,
    assignee: { name: 'John D.', avatarUrl: 'https://picsum.photos/seed/john/100/100' },
    date: 'Oct 23, 2023'
  },
  {
    id: '#GRV-1022',
    category: 'Electrical',
    subject: 'Projector malfunction',
    description: 'Projector in Hall 101 flickering and won\'t display HDMI input.',
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.IN_PROGRESS,
    assignee: { name: 'Sarah M.', avatarUrl: 'https://picsum.photos/seed/sarah/100/100' },
    date: 'Oct 23, 2023'
  },
  {
    id: '#GRV-1021',
    category: 'Janitorial',
    subject: 'Spill in Hallway A',
    description: 'Coffee spill near the main entrance of Hallway A. Needs immediate cleanup.',
    priority: TicketPriority.HIGH,
    status: TicketStatus.RESOLVED,
    assignee: { name: 'Mike R.', avatarUrl: 'https://picsum.photos/seed/mike/100/100' },
    date: 'Oct 22, 2023'
  },
  {
    id: '#GRV-1020',
    category: 'IT Support',
    subject: 'Wi-Fi down in Library',
    description: 'Multiple reports of connectivity issues on the second floor of the Library.',
    priority: TicketPriority.CRITICAL,
    status: TicketStatus.NEW,
    date: 'Oct 22, 2023'
  }
];

export const CATEGORIES = ['HVAC', 'Plumbing', 'Electrical', 'Janitorial', 'IT Support', 'General'];
