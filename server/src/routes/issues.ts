import { Router, Request, Response } from 'express';
import { db, calculateDistanceMeters } from '../db.js';
import { AIService } from '../services/aiService.js';
import { Report, IssueStatus, IssuePriority, TimelineEvent } from '../types.js';

const router = Router();

// GET all issues with filtering
router.get('/', (req: Request, res: Response) => {
  const {
    status,
    category,
    priority,
    departmentId,
    citizenId,
    assignedOfficerId,
    search,
    lat,
    lng,
    radiusKm,
    slaBreachOnly,
  } = req.query;

  let reports = db.getReports();

  // Dynamic SLA breach check
  const now = Date.now();
  reports = reports.map((r) => {
    const deadlineTime = new Date(r.slaDeadline).getTime();
    const isClosed = r.status === 'Resolved' || r.status === 'Verified' || r.status === 'Closed';
    const isSlaBreached = !isClosed && now > deadlineTime;
    return {
      ...r,
      isSlaBreached,
    };
  });

  if (slaBreachOnly === 'true') {
    reports = reports.filter((r) => r.isSlaBreached);
  }

  if (status && status !== 'all') {
    reports = reports.filter((r) => r.status.toLowerCase() === (status as string).toLowerCase());
  }

  if (category && category !== 'all') {
    reports = reports.filter((r) => r.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (priority && priority !== 'all') {
    reports = reports.filter((r) => r.priority.toLowerCase() === (priority as string).toLowerCase());
  }

  if (departmentId && departmentId !== 'all') {
    reports = reports.filter((r) => r.departmentId === departmentId);
  }

  if (citizenId) {
    reports = reports.filter((r) => r.citizenId === citizenId);
  }

  if (assignedOfficerId) {
    reports = reports.filter((r) => r.assignedOfficerId === assignedOfficerId);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    reports = reports.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.location.address.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }

  // Geospatial filtering: nearby within radiusKm
  if (lat && lng) {
    const centerLat = parseFloat(lat as string);
    const centerLng = parseFloat(lng as string);
    const maxMeters = (parseFloat(radiusKm as string) || 5) * 1000;

    reports = reports.filter((r) => {
      const dist = calculateDistanceMeters(
        centerLat,
        centerLng,
        r.location.latitude,
        r.location.longitude
      );
      (r as any).distanceMeters = Math.round(dist);
      return dist <= maxMeters;
    });

    reports.sort((a: any, b: any) => (a.distanceMeters || 0) - (b.distanceMeters || 0));
  }

  return res.json({ count: reports.length, reports });
});

// GET single issue by ID
router.get('/:id', (req: Request, res: Response) => {
  const report = db.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  // Check SLA dynamically
  const isClosed = report.status === 'Resolved' || report.status === 'Verified' || report.status === 'Closed';
  const isSlaBreached = !isClosed && Date.now() > new Date(report.slaDeadline).getTime();
  const enrichedReport = { ...report, isSlaBreached };

  const comments = db.getCommentsByReportId(report.id);
  return res.json({ report: enrichedReport, comments });
});

// POST create new issue
router.post('/', (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    priority,
    location,
    images = [],
    citizenId = 'user-citizen-1',
    citizenName = 'Vandhana Vijayakumar',
    citizenEmail = 'vandhana@citizen.org',
    citizenPhone,
    audioTranscript,
  } = req.body;

  if (!title || !description || !location || !location.latitude || !location.longitude) {
    return res.status(400).json({ error: 'Title, description, and valid location are required' });
  }

  // 1. Run AI Analysis
  const aiAnalysis = AIService.analyzeReport(
    title,
    description,
    location,
    category
  );

  const finalCategory = category || aiAnalysis.suggestedCategory;
  const finalPriority: IssuePriority = priority || aiAnalysis.suggestedPriority;

  // Auto-resolve Department based on Category & determine SLA
  const catObj = db.getCategories().find((c) => c.name === finalCategory);
  const deptId = catObj?.defaultDepartmentId || 'dept-pwd';
  const dept = db.findDepartmentById(deptId);
  const slaHours = catObj?.slaHours || 24;
  const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

  const reportId = `CP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const initialTimeline: TimelineEvent[] = [
    {
      id: `tl-${Date.now()}-1`,
      status: 'Reported',
      title: 'Issue Lodged',
      description: `${citizenName || 'Citizen'} submitted complaint with live geo-coordinates.`,
      actorName: citizenName || 'Citizen',
      actorRole: 'citizen',
      timestamp: new Date().toISOString(),
    },
    {
      id: `tl-${Date.now()}-2`,
      status: 'Under Review',
      title: 'AI Triage & Prioritization',
      description: `CivicPulse AI classified as "${finalCategory}" with ${Math.round(aiAnalysis.confidence * 100)}% confidence (${finalPriority} Priority). SLA timer initiated: ${slaHours}h.`,
      actorName: 'CivicPulse AI Engine',
      actorRole: 'system',
      timestamp: new Date().toISOString(),
    },
  ];

  const newReport: Report = {
    id: reportId,
    title,
    description,
    category: finalCategory,
    priority: finalPriority,
    status: 'Reported',
    location: {
      address: location.address || 'Reported Location',
      landmark: location.landmark || '',
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
      city: location.city || 'Bengaluru',
      pincode: location.pincode || '',
      zone: location.zone || 'Central Zone',
    },
    images: images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800'
    ],
    citizenId,
    citizenName,
    citizenEmail,
    citizenPhone: citizenPhone || '+91 98450 12345',
    departmentId: deptId,
    departmentName: dept?.name || 'Public Works & Roads Infrastructure',
    upvotes: 1,
    upvotedBy: [citizenId],
    impactMultiplier: 1.1,
    slaHours,
    slaDeadline,
    isSlaBreached: false,
    audioTranscript,
    aiAnalysis,
    timeline: initialTimeline,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.createReport(newReport);

  // Award +50 Civic Karma to Reporter
  const user = db.findUserById(citizenId);
  if (user && user.karma) {
    user.karma.points += 50;
    if (user.karma.points >= 500) user.karma.tier = 'Platinum City Champion';
    else if (user.karma.points >= 300) user.karma.tier = 'Gold Civic Hero';
    db.updateUser(user.id, { karma: user.karma });
  }

  // Send notification to citizen
  db.addNotification({
    id: `notif-${Date.now()}`,
    userId: newReport.citizenId,
    reportId: newReport.id,
    reportTitle: newReport.title,
    type: 'status_change',
    title: 'Report Registered (+50 Karma Points) 🌟',
    message: `Your issue #${newReport.id} is registered with ${newReport.departmentName}. SLA target: ${slaHours}h.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  // Audit Log
  db.addAuditLog({
    id: `log-${Date.now()}`,
    action: 'REPORT_CREATED',
    actorId: newReport.citizenId,
    actorName: newReport.citizenName,
    actorRole: 'citizen',
    targetId: newReport.id,
    details: `Created issue #${newReport.id} in ${newReport.category} with SLA ${slaHours}h`,
    timestamp: new Date().toISOString(),
  });

  return res.status(201).json({ report: newReport });
});

// PUT update status
router.put('/:id/status', (req: Request, res: Response) => {
  const { status, actorName = 'Officer', actorRole = 'officer', notes } = req.body;
  const report = db.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const newTimelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    status: status as IssueStatus,
    title: `Status updated to ${status}`,
    description: notes || `Changed by ${actorName} (${actorRole})`,
    actorName,
    actorRole,
    timestamp: new Date().toISOString(),
  };

  const updatedTimeline = [...report.timeline, newTimelineEvent];
  const updated = db.updateReport(report.id, {
    status: status as IssueStatus,
    timeline: updatedTimeline,
  });

  // Notify citizen
  db.addNotification({
    id: `notif-${Date.now()}`,
    userId: report.citizenId,
    reportId: report.id,
    reportTitle: report.title,
    type: 'status_change',
    title: `Issue Status: ${status}`,
    message: notes || `Your report status was updated to ${status} by ${actorName}.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  return res.json({ report: updated });
});

// PUT assign to Department & Officer
router.put('/:id/assign', (req: Request, res: Response) => {
  const {
    departmentId,
    assignedOfficerId,
    assignedOfficerName,
    assignedOfficerPhone,
    actorName = 'Admin',
  } = req.body;

  const report = db.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const dept = db.findDepartmentById(departmentId);
  const officer = assignedOfficerId ? db.findUserById(assignedOfficerId) : undefined;

  const officerName = assignedOfficerName || officer?.name || 'Assigned Officer';
  const officerPhone = assignedOfficerPhone || officer?.phone || '';

  const newTimelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    status: 'Assigned',
    title: `Assigned to ${officerName}`,
    description: `Dispatched to ${dept?.name || 'Department'} under supervision of ${officerName}.`,
    actorName,
    actorRole: 'admin',
    timestamp: new Date().toISOString(),
  };

  const updated = db.updateReport(report.id, {
    departmentId,
    departmentName: dept?.name || report.departmentName,
    assignedOfficerId,
    assignedOfficerName: officerName,
    assignedOfficerPhone: officerPhone,
    status: report.status === 'Reported' ? 'Assigned' : report.status,
    timeline: [...report.timeline, newTimelineEvent],
  });

  if (assignedOfficerId) {
    db.addNotification({
      id: `notif-${Date.now()}`,
      userId: assignedOfficerId,
      reportId: report.id,
      reportTitle: report.title,
      type: 'assigned',
      title: 'New Dispatch Order Assigned',
      message: `You have been assigned issue #${report.id}: ${report.title}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({ report: updated });
});

// POST submit resolution evidence by officer
router.post('/:id/resolve', (req: Request, res: Response) => {
  const {
    resolvedBy = 'Field Officer',
    resolutionNotes,
    evidenceImages = [],
    costEstimate = '₹ 5,000 (Municipal Maintenance Fund)',
  } = req.body;

  const report = db.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const deptCode = report.departmentId?.replace('dept-', '').toUpperCase() || 'CIVIC';
  const workOrderNumber = `WO-${deptCode}-2026-${Math.floor(100 + Math.random() * 900)}`;

  const finalImages = evidenceImages.length > 0 ? evidenceImages : [
    'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&q=80&w=800'
  ];

  const resolutionData = {
    resolvedAt: new Date().toISOString(),
    resolvedBy,
    resolutionNotes: resolutionNotes || 'Work completed on site, inspected and verified operational.',
    evidenceImages: finalImages,
    citizenVerified: false,
    workOrderNumber,
    costEstimate,
  };

  const newTimelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    status: 'Resolved',
    title: 'Work Completed on Site',
    description: `Officer ${resolvedBy} submitted resolution proof and generated work order #${workOrderNumber}. Awaiting citizen verification.`,
    actorName: resolvedBy,
    actorRole: 'officer',
    timestamp: new Date().toISOString(),
  };

  const updated = db.updateReport(report.id, {
    status: 'Resolved',
    resolution: resolutionData,
    timeline: [...report.timeline, newTimelineEvent],
  });

  db.addNotification({
    id: `notif-${Date.now()}`,
    userId: report.citizenId,
    reportId: report.id,
    reportTitle: report.title,
    type: 'resolved',
    title: 'Remediation Complete! Please Confirm 🎉',
    message: `${resolvedBy} marked #${report.id} as resolved. Please review photos and confirm satisfaction.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  return res.json({ report: updated });
});

// POST citizen confirms resolution
router.post('/:id/verify', (req: Request, res: Response) => {
  const {
    confirmed = true,
    rating = 5,
    feedback = 'Confirmed resolved. Thank you!',
    actorName = 'Vandhana Vijayakumar',
  } = req.body;

  const report = db.findReportById(req.params.id);
  if (!report || !report.resolution) {
    return res.status(400).json({ error: 'Report is not in a resolvable state' });
  }

  const isVerified = Boolean(confirmed);
  const nextStatus: IssueStatus = isVerified ? 'Verified' : 'In Progress';

  const resolutionData = {
    ...report.resolution,
    citizenVerified: isVerified,
    citizenRating: rating,
    citizenFeedback: feedback,
    verifiedAt: new Date().toISOString(),
  };

  const newTimelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    status: nextStatus,
    title: isVerified ? 'Citizen Confirmed Resolution ⭐' : 'Citizen Requested Re-Inspection ⚠️',
    description: isVerified
      ? `${actorName} verified the fix with a ${rating}-star rating: "${feedback}". (+30 Karma awarded)`
      : `${actorName} reported ongoing defect: "${feedback}". Reopened for inspection.`,
    actorName,
    actorRole: 'citizen',
    timestamp: new Date().toISOString(),
  };

  // Award +30 Karma for verification
  if (isVerified) {
    const user = db.findUserById(report.citizenId);
    if (user && user.karma) {
      user.karma.points += 30;
      db.updateUser(user.id, { karma: user.karma });
    }
  }

  const updated = db.updateReport(report.id, {
    status: nextStatus,
    resolution: resolutionData,
    timeline: [...report.timeline, newTimelineEvent],
  });

  return res.json({ report: updated });
});

// POST upvote / endorse issue ("Me Too" Community Multiplier)
router.post('/:id/upvote', (req: Request, res: Response) => {
  const { userId = 'user-citizen-1' } = req.body;
  const report = db.findReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  let upvotedBy = [...report.upvotedBy];
  let upvotes = report.upvotes;

  if (upvotedBy.includes(userId)) {
    upvotedBy = upvotedBy.filter((id) => id !== userId);
    upvotes = Math.max(0, upvotes - 1);
  } else {
    upvotedBy.push(userId);
    upvotes += 1;
  }

  // Calculate dynamic Community Impact Multiplier
  const impactMultiplier = Number((1.0 + Math.min(4.0, upvotes * 0.12)).toFixed(1));

  const updated = db.updateReport(report.id, {
    upvotes,
    upvotedBy,
    impactMultiplier,
  });

  return res.json({
    upvotes: updated?.upvotes,
    upvotedBy: updated?.upvotedBy,
    impactMultiplier: updated?.impactMultiplier,
  });
});

// GET & POST comments
router.get('/:id/comments', (req: Request, res: Response) => {
  const comments = db.getCommentsByReportId(req.params.id);
  return res.json({ comments });
});

router.post('/:id/comments', (req: Request, res: Response) => {
  const {
    userId = 'user-citizen-1',
    userName = 'Citizen',
    userRole = 'citizen',
    userAvatar,
    message,
  } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const comment = db.addComment({
    id: `comm-${Date.now()}`,
    reportId: req.params.id,
    userId,
    userName,
    userRole,
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    message: message.trim(),
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ comment });
});

export default router;
