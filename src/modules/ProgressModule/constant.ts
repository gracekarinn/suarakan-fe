import { ReportUpdate } from './interface';

export const MOCK_UPDATES: ReportUpdate[] = [
  {
    updateId: 1,
    reportId: 'LAPOR-001',
    status: 'Received',
    updatedAt: '2025-04-14T08:00:00.000Z',
    remarks: 'Laporan baru saja diterima',
    proof: 'https://example.com/proof1.png',
  },
  {
    updateId: 2,
    reportId: 'LAPOR-002',
    status: 'Processing',
    updatedAt: '2025-04-14T09:00:00.000Z',
    remarks: 'Sedang dalam proses verifikasi oleh admin',
    proof: 'https://example.com/proof2.png',
  },
  {
    updateId: 3,
    reportId: 'LAPOR-003',
    status: 'Completed',
    updatedAt: '2025-04-14T10:00:00.000Z',
    remarks: 'Laporan telah selesai diproses',
    proof: 'https://example.com/proof3.png',
  },
  {
    updateId: 4,
    reportId: 'LAPOR-004',
    status: 'Rejected',
    updatedAt: '2025-04-14T11:00:00.000Z',
    remarks: 'Data laporan tidak valid, laporan ditolak',
    proof: '',
  },
];
