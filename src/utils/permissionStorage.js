const PERMISSION_REQUESTS_KEY = "permissionRequests";
const UPLOADED_SOLUTIONS_KEY = "uploadedSolutions";

const normalizeStatus = (value) => String(value || "").toUpperCase();
const normalizeList = (value) =>
  Array.isArray(value) ? value.filter(Boolean) : [];

const dispatchRepositoryUpdated = () => {
  try {
    window.dispatchEvent(new Event("repositoryUpdated"));
  } catch (e) {
    // ignore
  }
};

const dispatchPermissionRequestsUpdated = () => {
  try {
    window.dispatchEvent(new Event("permissionRequestsUpdated"));
  } catch (e) {
    // ignore
  }
};

const mergeAttachments = (existing = [], next = []) => {
  const byId = new Map();

  [...existing, ...next].forEach((attachment) => {
    const key = String(attachment?.attachmentId || attachment?.id || attachment?.fileName || attachment?.name || "");
    if (!key) {
      return;
    }
    byId.set(key, { ...(byId.get(key) || {}), ...attachment });
  });

  return [...byId.values()];
};

const normalizeAttachment = (file, index, fallbackTitle = "attachment") => {
  const attachmentId = file?.attachmentId ?? file?.id ?? file?.attachment_id ?? null;
  const name = file?.name || file?.fileName || file?.filename || `${fallbackTitle}-${index + 1}`;
  const fileSize = file?.size || file?.fileSize || file?.file_size || "0 KB";
  const fileUrl =
    file?.fileUrl ||
    file?.downloadUrl ||
    file?.githubUrl ||
    file?.githubFileUrl ||
    file?.rawUrl ||
    file?.htmlUrl ||
    file?.download_url ||
    file?.contentUrl ||
    file?.url ||
    file?.previewUrl ||
    file?.dataUrl ||
    file?.fileDataUrl ||
    "";

  return {
    id: attachmentId ?? file?.id ?? `${name}-${index}-${Date.now()}`,
    attachmentId: attachmentId ?? null,
    localFileId: file?.localFileId || null,
    name,
    size: fileSize,
    fileSize,
    fileName: file?.fileName || file?.filename || name,
    contentType: file?.contentType || file?.mimeType || "application/octet-stream",
    uploadedAt: file?.uploadedAt || file?.uploaded_on || file?.createdAt || null,
    fileUrl,
    previewUrl: file?.previewUrl || fileUrl,
    downloadUrl: file?.downloadUrl || fileUrl,
    githubUrl: file?.githubUrl || file?.githubFileUrl || file?.rawUrl || file?.htmlUrl || file?.download_url || file?.contentUrl || file?.url || "",
    githubPath: file?.githubPath || file?.path || file?.filePath || "",
    githubRepository: file?.githubRepository || file?.repository || file?.repo || "",
  };
};

const normalizeRequestItem = (item) => {
  const keys = normalizeList(item?.keys || item?.keywords || item?.tags).map(String);
  const attachments = normalizeList(item?.attachments).map((file, index) =>
    normalizeAttachment(file, index, item?.title || item?.requestTitle || "attachment")
  );

  return {
    ...item,
    keys,
    attachments,
    description: item?.description || item?.summary || "",
    status: normalizeStatus(item?.status),
  };
};

const buildRepositoryItem = (item, source = "manager") => {
  const normalized = normalizeRequestItem(item);
  const keys = normalized.keys;
  const title = item?.title || item?.requestTitle || "Untitled Knowledge";
  const uploadedBy =
    item?.uploadedBy ||
    item?.employeeName ||
    item?.user ||
    item?.createdBy ||
    "System";
  const date =
    item?.date ||
    item?.uploadedOn ||
    item?.submittedOn ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return {
    id: item?.id ?? `repo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    description: normalized.description,
    uploadedBy,
    date,
    downloads: Number(item?.downloads || item?.downloadCount || 0),
    attachments: normalized.attachments,
    keywords: keys,
    keys,
    tags: keys,
    chip1: keys[0] || "",
    chip2: keys[1] || "",
    chip3: keys[2] || "",
    chip4: keys[3] || "",
    source,
    status: normalizeStatus(item?.status),
  };
};

export const loadPermissionRequests = () => {
  try {
    const stored = window.localStorage.getItem(PERMISSION_REQUESTS_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) ? parsed.map(normalizeRequestItem) : null;
  } catch (error) {
    return null;
  }
};

export const savePermissionRequests = (requests) => {
  try {
    const normalized = normalizeList(requests).map(normalizeRequestItem);
    window.localStorage.setItem(PERMISSION_REQUESTS_KEY, JSON.stringify(normalized));
    dispatchPermissionRequestsUpdated();
  } catch (error) {
    // ignore storage failures
  }
};

export const appendPermissionRequest = (request) => {
  const existing = loadPermissionRequests() || [];
  const next = [request, ...existing];
  savePermissionRequests(next);
  dispatchPermissionRequestsUpdated();
  return next;
};

export const updatePermissionRequest = (id, updater) => {
  const existing = loadPermissionRequests() || [];
  const next = existing.map((request) =>
    request.id === id ? { ...request, ...updater(request) } : request
  );
  savePermissionRequests(next);
  return next;
};

export const loadUploadedSolutions = () => {
  try {
    const stored = window.localStorage.getItem(UPLOADED_SOLUTIONS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

export const saveUploadedSolutions = (solutions) => {
  try {
    window.localStorage.setItem(UPLOADED_SOLUTIONS_KEY, JSON.stringify(solutions));
    dispatchRepositoryUpdated();
  } catch (error) {
    // ignore storage failures
  }
};

export const saveRepositoryItem = (item) => {
  const existing = loadUploadedSolutions() || [];
  const incoming = buildRepositoryItem(item, item?.source || "manager");
  const index = existing.findIndex((entry) => String(entry?.id) === String(incoming.id));

  const next =
    index >= 0
      ? existing.map((entry, idx) =>
          idx === index
            ? {
                ...incoming,
                attachments: incoming.attachments || [],
                keys: [...(incoming.keys || [])],
                keywords: [...(incoming.keywords || [])],
                tags: [...(incoming.tags || [])],
                chip1: incoming.chip1 || "",
                chip2: incoming.chip2 || "",
                chip3: incoming.chip3 || "",
                chip4: incoming.chip4 || "",
              }
            : entry
        )
      : [incoming, ...existing];

  saveUploadedSolutions(next);
  dispatchRepositoryUpdated();
  return next;
};

export const updateRepositoryItem = (item) => saveRepositoryItem(item);

export const deleteRepositoryItem = (id) => {
  const existing = loadUploadedSolutions() || [];
  const next = existing.filter((item) => String(item?.id) !== String(id));
  saveUploadedSolutions(next);
  dispatchRepositoryUpdated();
  return next;
};

export const deletePermissionRequest = (id) => {
  const existing = loadPermissionRequests() || [];
  const next = existing.filter((item) => String(item?.id) !== String(id));
  savePermissionRequests(next);
  dispatchPermissionRequestsUpdated();
  return next;
};

export const addApprovedEmployeeSubmission = (request) => {
  const existing = loadUploadedSolutions() || [];
  const approvedItem = buildRepositoryItem(
    { ...request, status: "APPROVED", source: "employee_approved" },
    "employee_approved"
  );

  const next = [approvedItem, ...existing.filter((item) => String(item?.id) !== String(approvedItem?.id))];
  saveUploadedSolutions(next);
  dispatchRepositoryUpdated();
  return next;
};

export const addRejectedEmployeeSubmission = (request) => {
  const existing = loadUploadedSolutions() || [];
  const rejectedItem = buildRepositoryItem(
    { ...request, status: "REJECTED", source: "employee_rejected" },
    "employee_rejected"
  );

  const next = [rejectedItem, ...existing.filter((item) => String(item?.id) !== String(rejectedItem?.id))];
  saveUploadedSolutions(next);
  dispatchRepositoryUpdated();
  return next;
};

export const loadRepositoryItems = () => {
  const managerUploads = (loadUploadedSolutions() || []).map((item) =>
    buildRepositoryItem(item, item?.source || "manager")
  );

  const permissionRequests = loadPermissionRequests() || [];
  const approvedUploads = permissionRequests
    .filter((item) => normalizeStatus(item?.status) === "APPROVED")
    .map((item) => buildRepositoryItem({ ...item, status: "APPROVED" }, "employee_approved"));

  const rejectedUploads = permissionRequests
    .filter((item) => normalizeStatus(item?.status) === "REJECTED")
    .map((item) => buildRepositoryItem({ ...item, status: "REJECTED" }, "employee_rejected"));

  const merged = [...managerUploads, ...approvedUploads, ...rejectedUploads];
  const deduped = merged.reduce((acc, item) => {
    const existing = acc.findIndex((entry) => String(entry.id) === String(item.id));
    if (existing >= 0) {
      acc[existing] = {
        ...acc[existing],
        ...item,
        attachments: mergeAttachments(acc[existing].attachments || [], item.attachments || []),
        keys: [...new Set([...(acc[existing].keys || []), ...(item.keys || [])])],
        keywords: [...new Set([...(acc[existing].keywords || []), ...(item.keywords || [])])],
        tags: [...new Set([...(acc[existing].tags || []), ...(item.tags || [])])],
      };
      return acc;
    }

    acc.push(item);
    return acc;
  }, []);

  return deduped;
};
