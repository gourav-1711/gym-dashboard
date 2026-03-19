import { ref, set, get } from "firebase/database";
import { db } from "./firebase";
import { Member, Payment, Activity } from "../types";

const members: Member[] = [
  {
    id: "m1",
    name: "Alex Rivera",
    email: "alex.rivera@email.com",
    phone: "+1 (555) 001-0001",
    plan: "Pro",
    status: "active",
    joinDate: "2023-06-01",
    expiryDate: "2026-03-20",
    address: "123 Main St, New York, NY",
  },
  {
    id: "m2",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@email.com",
    phone: "+1 (555) 001-0002",
    plan: "Basic",
    status: "expiring",
    joinDate: "2023-08-15",
    expiryDate: "2026-03-22",
    address: "456 Oak Ave, Brooklyn, NY",
  },
  {
    id: "m3",
    name: "Marcus Chen",
    email: "marcus.chen@email.com",
    phone: "+1 (555) 001-0003",
    plan: "Pro",
    status: "inactive",
    joinDate: "2023-01-10",
    expiryDate: "2026-02-28",
    address: "789 Pine Rd, Queens, NY",
  },
  {
    id: "m4",
    name: "Elena Rodriguez",
    email: "elena.rodriguez@email.com",
    phone: "+1 (555) 001-0004",
    plan: "Elite",
    status: "active",
    joinDate: "2022-11-20",
    expiryDate: "2026-11-20",
    address: "321 Elm St, Manhattan, NY",
  },
  {
    id: "m5",
    name: "David Smith",
    email: "david.smith@email.com",
    phone: "+1 (555) 001-0005",
    plan: "Basic",
    status: "active",
    joinDate: "2024-01-05",
    expiryDate: "2026-07-05",
    address: "654 Maple Dr, Bronx, NY",
  },
  {
    id: "m6",
    name: "Chloe Watson",
    email: "chloe.watson@email.com",
    phone: "+1 (555) 001-0006",
    plan: "Pro",
    status: "active",
    joinDate: "2023-09-12",
    expiryDate: "2026-09-12",
    address: "987 Cedar Ln, Staten Island, NY",
  },
  {
    id: "m7",
    name: "Robert Johnson",
    email: "robert.j@email.com",
    phone: "+1 (555) 001-0007",
    plan: "Basic",
    status: "inactive",
    joinDate: "2023-02-28",
    expiryDate: "2026-01-31",
    address: "147 Birch Blvd, Jersey City, NJ",
  },
  {
    id: "m8",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+1 (555) 001-0008",
    plan: "Elite",
    status: "active",
    joinDate: "2024-02-14",
    expiryDate: "2027-02-14",
    address: "258 Walnut St, Hoboken, NJ",
  },
  {
    id: "m9",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 001-0009",
    plan: "Pro",
    status: "expiring",
    joinDate: "2023-03-18",
    expiryDate: "2026-03-19",
    address: "369 Spruce Ave, Newark, NJ",
  },
  {
    id: "m10",
    name: "Mia Thompson",
    email: "mia.thompson@email.com",
    phone: "+1 (555) 001-0010",
    plan: "Basic",
    status: "active",
    joinDate: "2024-03-01",
    expiryDate: "2026-09-01",
    address: "741 Ash St, Yonkers, NY",
  },
];

const payments: Payment[] = [
  { id: "p1", memberId: "m1", memberName: "Alex Rivera", amount: 89, plan: "Pro Plan", date: "2026-03-01", method: "Visa ****4242", status: "paid" },
  { id: "p2", memberId: "m4", memberName: "Elena Rodriguez", amount: 149, plan: "Elite Plan", date: "2026-03-02", method: "Master ****9012", status: "paid" },
  { id: "p3", memberId: "m9", memberName: "James Wilson", amount: 499, plan: "Annual Plan", date: "2026-03-05", method: "Visa ****1234", status: "paid" },
  { id: "p4", memberId: "m5", memberName: "David Smith", amount: 49, plan: "Basic Plan", date: "2026-03-08", method: "PayPal", status: "paid" },
  { id: "p5", memberId: "m8", memberName: "Priya Patel", amount: 149, plan: "Elite Plan", date: "2026-03-10", method: "Visa ****5678", status: "paid" },
  { id: "p6", memberId: "m6", memberName: "Chloe Watson", amount: 89, plan: "Pro Plan", date: "2026-03-12", method: "Master ****3456", status: "paid" },
  { id: "p7", memberId: "m10", memberName: "Mia Thompson", amount: 49, plan: "Basic Plan", date: "2026-03-14", method: "Visa ****7890", status: "paid" },
  { id: "p8", memberId: "m2", memberName: "Sarah Jenkins", amount: 49, plan: "Basic Plan", date: "2026-03-16", method: "Debit ****2345", status: "paid" },
];

const activities: Activity[] = [
  { id: "a1", type: "payment", title: "New Payment", description: "James Wilson • Annual Plan", amount: 499, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "a2", type: "new_member", title: "New Member", description: "Mia Thompson • Walk-in", timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "a3", type: "renewal", title: "Membership Renewed", description: "Chloe Watson • Pro Plan", amount: 89, timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString() },
  { id: "a4", type: "payment", title: "New Payment", description: "Priya Patel • Elite Plan", amount: 149, timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  { id: "a5", type: "expiry", title: "Membership Expiring", description: "Sarah Jenkins • 5 days left", timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
];

export async function seedFirebaseData() {
  try {
    const membersRef = ref(db, "members");
    const snapshot = await get(membersRef);
    if (snapshot.exists()) return;

    const membersData: Record<string, Member> = {};
    members.forEach((m) => { membersData[m.id] = m; });
    await set(ref(db, "members"), membersData);

    const paymentsData: Record<string, Payment> = {};
    payments.forEach((p) => { paymentsData[p.id] = p; });
    await set(ref(db, "payments"), paymentsData);

    const activitiesData: Record<string, Activity> = {};
    activities.forEach((a) => { activitiesData[a.id] = a; });
    await set(ref(db, "activities"), activitiesData);

    const stats = {
      totalMembers: 1284,
      activeMembers: 1041,
      monthlyRevenue: 42850,
      revenueGrowth: 12.5,
      activeToday: 156,
      newSignups: 142,
      churnRate: 1.2,
      mrr: 31200,
      lastMonthRevenue: 38258,
    };
    await set(ref(db, "stats"), stats);

    console.log("Firebase seeded successfully!");
  } catch (err) {
    console.error("Seed error:", err);
  }
}
