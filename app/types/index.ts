export interface Store {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    businessNumber?: string;
  }

export interface Schedule {
  employeeName: string;
  startTime: string;
  endTime: string;
  workingDays: string[];
}
  