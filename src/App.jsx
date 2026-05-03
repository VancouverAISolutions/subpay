import { useState, useMemo } from "react";

// âââ Seed Data ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const SUBS = [
  { id: 1, name: "Maria G.",   phone: "604-555-0181", email: "maria@email.com", rate: 0.45 },
  { id: 2, name: "Carlos R.",  phone: "604-555-0192", email: "carlos@email.com", rate: 0.40 },
  { id: 3, name: "Priya S.",   phone: "604-555-0203", email: "priya@email.com",  rate: 0.42 },
  { id: 4, name: "Devon T.",   phone: "604-555-0214", email: "devon@email.com",  rate: 0.38 },
];

const CLIENTS = [
  { id: 1, name: "Westside Office Park",  billing: "retainer", monthlyFlat: 1200 },
  { id: 2, name: "Green Valley Homes",    billing: "per-job",  monthlyFlat: null },
  { id: 3, name: "Harbour View Towers",   billing: "retainer", monthlyFlat: 2400 },
  { id: 4, name: "Cedar Creek Dental",    billing: "per-job",  monthlyFlat: null },
  { id: 5, name: "Pine Ridge Strata",     billing: "per-job",  monthlyFlat: null },
];

const INITIAL_JOBS = [
  { id: 1, clientId: 1, subId: 1, date: "2026-05-01", jobValue: 300,  status: "completed", notes: "Deep clean + windows" },
  { id: 2, clientId: 2, subId: 2, date: "2026-05-02", jobValue: 180,  status: "completed", notes: "Weekly standard" },
  { id: 3, clientId: 3, subId: 1, date: "2026-05-03", jobValue: 600,  status: "completed", notes: "Common areas + gym" },
  { id: 4, clientId: 4, subId: 3, date: "2026-05-05", jobValue: 220,  status: "scheduled", notes: "Post-reno clean" },
  { id: 5, clientId: 5, subId: 4, date: "2026-05-06", jobValue: 150,  status: "scheduled", notes: "Bi-weekly visit" },
  { id: 6, clientId: 2, subId: 2, date: "2026-05-07", jobValue: 180,  status: "scheduled", notes: "Weekly standard" },
  { id: 7, clientId: 1, subId: 3, date: "2026-05-08", jobValue: 300,  status: "scheduled", notes: "Monthly deep" },
  { id: 8, clientId: 4, subId: 1, date: "2026-05-10", jobValue: 140,  status: "scheduled", notes: "Regular clean" },
];

const MONTH_LABEL = "May 2026";

const statusColors = {
  completed: "bg-green-100 text-green-700",
  scheduled: "bg-blue-100 text-blue-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
};

function fmt(n) {
  return "$" + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// âââ Components âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function Badge({ status }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function NavTab({ label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
      {badge != null && (
        <span className="ml-1.5 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">{badge}</span>
      )}
    </button>
  );
}

// âââ Add Job Modal âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function AddJobModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    clientId: CLIENTS[0].id,
    subId: SUBS[0].id,
    date: new Date().toISOString().split("T")[0],
    jobValue: "",
    notes: "",
  });

  const sub = SUBS.find((s) => s.id === Number(form.subId));
  const subPay = form.jobValue ? (Number(form.jobValue) * sub.rate).toFixed(2) : "â";

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      clientId: Number(form.clientId),
      subId: Number(form.subId),
      date: form.date,
      jobValue: Number(form.jobValue),
      status: "scheduled",
      notes: form.notes,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">New Job</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">Ã</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              {CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcontractor</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.subId}
              onChange={(e) => setForm({ ...form, subId: e.target.value })}
            >
              {SUBS.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({Math.round(s.rate * 100)}% rate)</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Value ($)</label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="0.00"
                value={form.jobValue}
                onChange={(e) => setForm({ ...form, jobValue: e.target.value })}
                required
                min="1"
              />
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg px-4 py-3 flex justify-between items-center text-sm">
            <span className="text-gray-600">Auto-calculated sub pay</span>
            <span className="font-semibold text-blue-700">{subPay !== "â" ? `$${subPay}` : "â"}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Deep clean, post-reno..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium">
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// âââ Jobs Tab ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function JobsTab({ jobs, onAdd, onStatusChange }) {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = jobs.filter((j) => filter === "all" || j.status === filter);

  return (
    <div>
      {showModal && <AddJobModal onClose={() => setShowModal(false)} onAdd={onAdd} />}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["all", "scheduled", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-3 py-1 rounded-full border capitalize ${
                filter === f ? "bg-gray-800 text-white border-gray-800" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium"
        >
          + Add Job
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map((job) => {
          const client = CLIENTS.find((c) => c.id === job.clientId);
          const sub = SUBS.find((s) => s.id === job.subId);
          const subPay = job.jobValue * sub.rate;
          return (
            <div key={job.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-gray-900 text-sm truncate">{client.name}</span>
                  <Badge status={job.status} />
                </div>
                <div className="text-xs text-gray-500">
                  {job.date} Â· {sub.name} Â· {job.notes}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-gray-800">{fmt(job.jobValue)}</div>
                <div className="text-xs text-green-600">Sub: {fmt(subPay)}</div>
              </div>
              {job.status === "scheduled" && (
                <button
                  onClick={() => onStatusChange(job.id, "completed")}
                  className="text-xs border border-green-600 text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg ml-1"
                >
                  Mark done
                </button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No jobs yet</div>
        )}
      </div>
    </div>
  );
}

// âââ Payroll Tab âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function PayrollTab({ jobs }) {
  const completedJobs = jobs.filter((j) => j.status === "completed");

  const subSummaries = SUBS.map((sub) => {
    const subJobs = completedJobs.filter((j) => j.subId === sub.id);
    const totalSubPay = subJobs.reduce((sum, j) => sum + j.jobValue * sub.rate, 0);
    const totalJobValue = subJobs.reduce((sum, j) => sum + j.jobValue, 0);
    return { sub, jobs: subJobs, totalSubPay, totalJobValue };
  }).filter((s) => s.jobs.length > 0);

  const grandTotal = subSummaries.reduce((sum, s) => sum + s.totalSubPay, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{MONTH_LABEL} Payroll</h3>
          <p className="text-xs text-gray-500">Completed jobs only Â· 1099-ready</p>
        </div>
        <button className="text-sm border rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 flex items-center gap-1">
          â Export CSV
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {subSummaries.map(({ sub, jobs: subJobs, totalSubPay, totalJobValue }) => (
          <div key={sub.id} className="bg-white border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
              <div>
                <div className="font-medium text-gray-800 text-sm">{sub.name}</div>
                <div className="text-xs text-gray-500">{subJobs.length} jobs Â· {Math.round(sub.rate * 100)}% rate</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">{fmt(totalSubPay)}</div>
                <div className="text-xs text-gray-400">of {fmt(totalJobValue)} billed</div>
              </div>
            </div>
            <div className="divide-y">
              {subJobs.map((job) => {
                const client = CLIENTS.find((c) => c.id === job.clientId);
                return (
                  <div key={job.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <div>
                      <span className="text-gray-700">{client.name}</span>
                      <span className="text-gray-400 text-xs ml-2">{job.date}</span>
                    </div>
                    <div className="font-medium text-green-700">{fmt(job.jobValue * sub.rate)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="font-semibold text-blue-800">Total Subcontractor Payroll</span>
        <span className="text-xl font-bold text-blue-800">{fmt(grandTotal)}</span>
      </div>
    </div>
  );
}

// âââ Billing Tab âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function BillingTab({ jobs }) {
  const completedJobs = jobs.filter((j) => j.status === "completed");

  const clientSummaries = CLIENTS.map((client) => {
    const clientJobs = completedJobs.filter((j) => j.clientId === client.id);
    const perJobTotal = clientJobs.reduce((sum, j) => sum + j.jobValue, 0);
    const invoiceAmount = client.billing === "retainer" ? client.monthlyFlat : perJobTotal;
    return { client, jobs: clientJobs, perJobTotal, invoiceAmount };
  }).filter((s) => s.invoiceAmount > 0 || s.jobs.length > 0);

  const totalRevenue = clientSummaries.reduce((sum, s) => sum + (s.invoiceAmount || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{MONTH_LABEL} Client Billing</h3>
          <p className="text-xs text-gray-500">Flat retainer + per-job invoices</p>
        </div>
        <button className="text-sm border rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50">
          â Export Invoices
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {clientSummaries.map(({ client, jobs: clientJobs, perJobTotal, invoiceAmount }) => (
          <div key={client.id} className="bg-white border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 text-sm">{client.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    client.billing === "retainer"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {client.billing === "retainer" ? "Flat retainer" : "Per-job"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {clientJobs.length} jobs completed
                  {client.billing === "per-job" && perJobTotal > 0 && ` Â· ${fmt(perJobTotal)} earned`}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">{fmt(invoiceAmount)}</div>
                {client.billing === "retainer" && (
                  <div className="text-xs text-gray-400">monthly flat</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="font-semibold text-green-800">Total Revenue This Month</span>
        <span className="text-xl font-bold text-green-800">{fmt(totalRevenue)}</span>
      </div>
    </div>
  );
}

// âââ Subcontractors Tab ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function SubsTab({ jobs }) {
  const completedJobs = jobs.filter((j) => j.status === "completed");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Subcontractors</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium">
          + Add Sub
        </button>
      </div>
      <div className="grid gap-3">
        {SUBS.map((sub) => {
          const subJobs = completedJobs.filter((j) => j.subId === sub.id);
          const totalPay = subJobs.reduce((sum, j) => sum + j.jobValue * sub.rate, 0);
          return (
            <div key={sub.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex items-center justify-center shrink-0">
                {sub.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 text-sm">{sub.name}</div>
                <div className="text-xs text-gray-500">{sub.phone} Â· {Math.round(sub.rate * 100)}% per-job rate</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">{fmt(totalPay)}</div>
                <div className="text-xs text-gray-500">{subJobs.length} jobs this month</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// âââ Dashboard âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Dashboard({ jobs }) {
  const completed = jobs.filter((j) => j.status === "completed");
  const scheduled = jobs.filter((j) => j.status === "scheduled");
  const totalRevenue = CLIENTS.reduce((sum, c) => {
    if (c.billing === "retainer") return sum + c.monthlyFlat;
    const clientJobs = completed.filter((j) => j.clientId === c.id);
    return sum + clientJobs.reduce((s, j) => s + j.jobValue, 0);
  }, 0);
  const totalSubPay = completed.reduce((sum, j) => {
    const sub = SUBS.find((s) => s.id === j.subId);
    return sum + j.jobValue * sub.rate;
  }, 0);
  const margin = totalRevenue > 0 ? ((totalRevenue - totalSubPay) / totalRevenue * 100).toFixed(0) : 0;

  const statCards = [
    { label: "Revenue", value: fmt(totalRevenue), sub: MONTH_LABEL, color: "text-green-600" },
    { label: "Sub Payroll", value: fmt(totalSubPay), sub: "1099 total", color: "text-blue-600" },
    { label: "Margin", value: `${margin}%`, sub: "after sub pay", color: "text-purple-600" },
    { label: "Jobs Scheduled", value: scheduled.length, sub: "upcoming", color: "text-orange-600" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">{card.label}</div>
            <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-xs text-gray-400">{card.sub}</div>
          </div>
        ))}
      </div>

      <h4 className="text-sm font-semibold text-gray-700 mb-2">Upcoming Jobs</h4>
      <div className="space-y-2">
        {scheduled.slice(0, 4).map((job) => {
          const client = CLIENTS.find((c) => c.id === job.clientId);
          const sub = SUBS.find((s) => s.id === job.subId);
          return (
            <div key={job.id} className="bg-white border rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{client.name}</div>
                <div className="text-xs text-gray-500">{job.date} Â· {sub.name}</div>
              </div>
              <div className="text-sm font-semibold text-gray-700">{fmt(job.jobValue)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// âââ App Shell âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function SubPay() {
  const [tab, setTab] = useState("dashboard");
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  function handleAddJob(job) {
    setJobs((prev) => [...prev, job]);
  }

  function handleStatusChange(id, status) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  }

  const scheduledCount = jobs.filter((j) => j.status === "scheduled").length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">SP</span>
          </div>
          <span className="font-semibold text-gray-800">SubPay</span>
          <span className="text-xs text-gray-400 hidden sm:inline">Â· Cleaning Co.</span>
        </div>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{MONTH_LABEL}</div>
      </div>

      {/* Nav */}
      <div className="bg-white border-b px-2 flex overflow-x-auto">
        <NavTab label="Dashboard" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
        <NavTab label="Jobs" active={tab === "jobs"} onClick={() => setTab("jobs")} badge={scheduledCount} />
        <NavTab label="Payroll" active={tab === "payroll"} onClick={() => setTab("payroll")} />
        <NavTab label="Billing" active={tab === "billing"} onClick={() => setTab("billing")} />
        <NavTab label="Subs" active={tab === "subs"} onClick={() => setTab("subs")} />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-5">
        {tab === "dashboard" && <Dashboard jobs={jobs} />}
        {tab === "jobs"      && <JobsTab jobs={jobs} onAdd={handleAddJob} onStatusChange={handleStatusChange} />}
        {tab === "payroll"   && <PayrollTab jobs={jobs} />}
        {tab === "billing"   && <BillingTab jobs={jobs} />}
        {tab === "subs"      && <SubsTab jobs={jobs} />}
      </div>
    </div>
  );
}
