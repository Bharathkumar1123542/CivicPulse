import { Router, Request, Response } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/overview', (_req: Request, res: Response) => {
  const reports = db.getReports();
  const departments = db.getDepartments();

  const total = reports.length;
  const openCount = reports.filter(
    (r) => r.status === 'Reported' || r.status === 'Under Review'
  ).length;
  const inProgressCount = reports.filter(
    (r) => r.status === 'Assigned' || r.status === 'In Progress'
  ).length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;
  const verifiedCount = reports.filter(
    (r) => r.status === 'Verified' || r.status === 'Closed'
  ).length;

  const totalResolved = resolvedCount + verifiedCount;
  const resolutionRate = total > 0 ? Math.round((totalResolved / total) * 1000) / 10 : 0;

  // Average Resolution Time calculation (in hours)
  const resolvedReports = reports.filter((r) => r.resolution?.resolvedAt);
  let totalHours = 0;
  resolvedReports.forEach((r) => {
    const start = new Date(r.createdAt).getTime();
    const end = new Date(r.resolution!.resolvedAt!).getTime();
    const hours = Math.max(1, (end - start) / (1000 * 60 * 60));
    totalHours += hours;
  });
  const avgResolutionHours =
    resolvedReports.length > 0
      ? Math.round((totalHours / resolvedReports.length) * 10) / 10
      : 28.5;

  // Breakdown by Category
  const categoryMap: Record<string, { count: number; resolved: number }> = {};
  reports.forEach((r) => {
    if (!categoryMap[r.category]) {
      categoryMap[r.category] = { count: 0, resolved: 0 };
    }
    categoryMap[r.category].count += 1;
    if (r.status === 'Resolved' || r.status === 'Verified' || r.status === 'Closed') {
      categoryMap[r.category].resolved += 1;
    }
  });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, val]) => ({
    category,
    count: val.count,
    resolved: val.resolved,
    rate: Math.round((val.resolved / val.count) * 100),
  }));

  // Breakdown by Priority
  const priorityBreakdown = {
    Urgent: reports.filter((r) => r.priority === 'Urgent').length,
    High: reports.filter((r) => r.priority === 'High').length,
    Medium: reports.filter((r) => r.priority === 'Medium').length,
    Low: reports.filter((r) => r.priority === 'Low').length,
  };

  // Department Performance
  const departmentPerformance = departments.map((d) => ({
    id: d.id,
    name: d.name,
    code: d.code,
    officers: d.officersCount,
    active: d.activeIssuesCount,
    resolved: d.resolvedIssuesCount,
    efficiency:
      d.activeIssuesCount + d.resolvedIssuesCount > 0
        ? Math.round(
            (d.resolvedIssuesCount / (d.activeIssuesCount + d.resolvedIssuesCount)) *
              100
          )
        : 85,
  }));

  // Heatmap Data Points
  const heatmapPoints = reports.map((r) => {
    let weight = 0.5;
    if (r.priority === 'Urgent') weight = 1.0;
    else if (r.priority === 'High') weight = 0.8;
    else if (r.priority === 'Medium') weight = 0.6;
    else weight = 0.4;

    return {
      id: r.id,
      title: r.title,
      category: r.category,
      status: r.status,
      priority: r.priority,
      lat: r.location.latitude,
      lng: r.location.longitude,
      weight,
    };
  });

  // Recent 6 Months Trend (Simulated realistic trend)
  const trends = [
    { month: 'Oct 2025', reported: 84, resolved: 76 },
    { month: 'Nov 2025', reported: 112, resolved: 98 },
    { month: 'Dec 2025', reported: 145, resolved: 130 },
    { month: 'Jan 2026', reported: 168, resolved: 154 },
    { month: 'Feb 2026', reported: 195, resolved: 182 },
    { month: 'Mar 2026', reported: 210, resolved: 189 },
  ];

  return res.json({
    kpis: {
      total,
      openCount,
      inProgressCount,
      resolvedCount,
      verifiedCount,
      resolutionRate,
      avgResolutionHours,
    },
    categoryBreakdown,
    priorityBreakdown,
    departmentPerformance,
    heatmapPoints,
    trends,
    auditLogs: db.getAuditLogs().slice(0, 15),
  });
});

export default router;
