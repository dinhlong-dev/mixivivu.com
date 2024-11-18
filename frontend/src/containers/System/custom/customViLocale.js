import { enUS } from 'date-fns/locale';

const customViLocale = {
  ...enUS,
  code: 'vi',
  formatLong: {
    date: () => 'dd/MM/yyyy',
    time: () => 'HH:mm:ss',
    dateTime: () => 'dd/MM/yyyy HH:mm:ss',
  },
  localize: {
    ...enUS.localize,
    month: n => `Tháng ${String(n + 1).padStart(2, '0')}, `,
    day: (n) => { 
        if (n === 6) return 'CN'; // Hiển thị Chủ Nhật là 'CN' 
        return `T${n + 2}`; // Hiển thị các ngày khác là 'Tn' },
    } 
  },
};

export default customViLocale;
