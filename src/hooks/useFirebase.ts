import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ref, onValue, set, push, remove, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { Member, Payment, Activity } from "@/types";
import { getMemberStatus } from "@/lib/utils";

function useRealtimeQuery<T>(key: string[], path: string) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () =>
      new Promise<T>((resolve, reject) => {
        const dbRef = ref(db, path);
        onValue(dbRef, (snapshot) => {
          resolve(snapshot.val() as T);
        }, reject, { onlyOnce: true });
      }),
    refetchInterval: 30000,
  });
}

export function useMembers() {
  const { data, isLoading, error } = useRealtimeQuery<Record<string, Member>>(["members"], "members");
  const members = data
    ? Object.values(data).map((m: Member) => ({ ...m, status: getMemberStatus(m.expiryDate) }))
    : [];
  return { members, isLoading, error };
}

export function useMember(id: string) {
  const { members, isLoading } = useMembers();
  const member = members.find((m) => m.id === id);
  return { member, isLoading };
}

export function usePayments() {
  const { data, isLoading } = useRealtimeQuery<Record<string, Payment>>(["payments"], "payments");
  const payments = data ? Object.values(data) : [];
  return { payments, isLoading };
}

export function useActivities() {
  const { data, isLoading } = useRealtimeQuery<Record<string, Activity>>(["activities"], "activities");
  const activities = data
    ? Object.values(data).sort((a: Activity, b: Activity) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    : [];
  return { activities, isLoading };
}

export function useStats() {
  return useRealtimeQuery<{
    totalMembers: number;
    activeMembers: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    activeToday: number;
    newSignups: number;
    churnRate: number;
    mrr: number;
    lastMonthRevenue: number;
  }>(["stats"], "stats");
}

export function useExpiringMembers() {
  const { members } = useMembers();
  return members.filter((m) => m.status === "expiring").slice(0, 6);
}

export function useAddMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (member: Omit<Member, "id">) => {
      const id = `m${Date.now()}`;
      await set(ref(db, `members/${id}`), { ...member, id });
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Member> }) => {
      const snap = await get(ref(db, `members/${id}`));
      const existing = snap.val() as Member;
      await set(ref(db, `members/${id}`), { ...existing, ...data });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await remove(ref(db, `members/${id}`));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useAddPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payment: Omit<Payment, "id">) => {
      const id = `p${Date.now()}`;
      await set(ref(db, `payments/${id}`), { ...payment, id });
      const activity: Activity = {
        id: `a${Date.now()}`,
        type: "payment",
        title: "New Payment",
        description: `${payment.memberName} • ${payment.plan}`,
        amount: payment.amount,
        timestamp: new Date().toISOString(),
      };
      await push(ref(db, "activities"), activity);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}
