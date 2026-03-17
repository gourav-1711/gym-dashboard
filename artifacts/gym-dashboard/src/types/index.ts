export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: "Basic" | "Pro" | "Elite";
  status: "active" | "expiring" | "inactive";
  joinDate: string;
  expiryDate: string;
  avatar?: string;
  address?: string;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  plan: string;
  date: string;
  method: string;
  status: "paid" | "pending" | "failed";
}

export interface Activity {
  id: string;
  type: "payment" | "new_member" | "renewal" | "expiry";
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  activeToday: number;
  newSignups: number;
  churnRate: number;
  mrr: number;
}
