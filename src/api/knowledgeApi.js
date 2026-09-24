const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || window.location.origin || "").replace(/\/$/, "");

const getLocalFileUrl = async (localFileId) => {
  if (!localFileId) return "";

  const module = await import("../utils/localFileStorage");
  return module.getLocalFileUrl(localFileId);
};

const buildHeaders = (extraHeaders = {}) => {
  const rawAuth = localStorage.getItem("auth");
  const authData = rawAuth ? JSON.parse(rawAuth) : {};
  const tokenSource =
    localStorage.getItem("token") ||
    authData?.token ||
    authData?.jwt ||
    authData?.accessToken ||
    authData?.authToken ||
    "";
  const token = String(tokenSource).startsWith("Bearer ")
    ? tokenSource.replace(/^Bearer\s+/i, "")
    : tokenSource;

  const headers = {
    Accept: "application/json",
    ...extraHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers["X-Auth-Token"] = token;
  }

  return headers;
};

const parseJsonResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

const normalizeKnowledgePayload = (payload = {}) => ({
  title: String(payload.title || "").trim(),
  description: String(payload.description || "").trim(),
  keywords: Array.isArray(payload.keywords)
    ? payload.keywords.map((item) => String(item).trim()).filter(Boolean)
    : Array.isArray(payload.keys)
      ? payload.keys.map((item) => String(item).trim()).filter(Boolean)
      : [],
});

export const resolveAttachmentUrl = (attachment = {}) => {
  const directUrl =
    attachment.fileUrl ||
    attachment.downloadUrl ||
    attachment.previewUrl ||
    attachment.githubUrl ||
    attachment.githubFileUrl ||
    attachment.rawUrl ||
    attachment.htmlUrl ||
    attachment.download_url ||
    attachment.contentUrl ||
    attachment.url ||
    attachment.github?.download_url ||
    attachment.github?.html_url ||
    attachment.data?.download_url ||
    attachment.data?.html_url ||
    "";

  if (directUrl) return directUrl;

  const repository = attachment.githubRepository || attachment.repository || attachment.repo;
  const path =
    attachment.githubPath ||
    attachment.path ||
    attachment.filePath ||
    attachment.githubFilePath ||
    attachment.externalId ||
    attachment.storagePath;
  if (!repository || !path) return "";

  const repositoryPath = String(repository)
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/\.git\/?$/, "")
    .replace(/^\/+|\/+$/g, "");
  const normalizedPath = String(path).replace(/^\/+/, "");
  return repositoryPath.includes("/")
    ? `https://raw.githubusercontent.com/${repositoryPath}/main/${normalizedPath}`
    : "";
};

export const getKnowledgeIdFromResponse = (response) => {
  const candidate = response?.knowledge || response;
  return (
    candidate?.knowledgeId ||
    candidate?.id ||
    candidate?.knowledge_id ||
    response?.data?.knowledgeId ||
    response?.data?.id ||
    null
  );
};

// FIX: chip1-4 now read from fallback.keywords (an array) instead of
// fallback.chip1/chip2/etc (strings), which previously indexed individual
// characters out of a string instead of picking keywords from an array.
export const mapKnowledgeApiResponseToRepositoryItem = (response, fallback = {}) => {
  const knowledge = response?.knowledge || response || {};
  const attachments = Array.isArray(response?.attachments)
    ? response.attachments
    : Array.isArray(knowledge?.attachments)
      ? knowledge.attachments
      : [];

  const normalizedAttachments = attachments.map((attachment, index) => {
    // Temporary diagnostics: verify the backend's attachment ID field.
    console.log("Raw attachment from backend:", attachment);

    return {
      ...attachment,
      id:
      attachment?.attachmentId ||
      attachment?.attachment_id ||
      attachment?.id ||
      `${knowledge?.title || fallback.title || "attachment"}-${index + 1}`,
      attachmentId:
      attachment?.attachmentId ??
      attachment?.attachment_id ??
      null,
    name: attachment?.fileName || attachment?.name || `attachment-${index + 1}`,
    fileName: attachment?.fileName || attachment?.name || `attachment-${index + 1}`,
    size: attachment?.fileSize || attachment?.size || "0 KB",
    fileSize: attachment?.fileSize || attachment?.size || "0 KB",
    contentType: attachment?.contentType || attachment?.mimeType || "application/octet-stream",
    uploadedAt: attachment?.uploadedAt || attachment?.uploaded_at || null,
    fileUrl: resolveAttachmentUrl(attachment),
    downloadUrl: resolveAttachmentUrl(attachment),
    previewUrl: resolveAttachmentUrl(attachment),
    githubUrl: attachment?.githubUrl || attachment?.githubFileUrl || attachment?.rawUrl || attachment?.htmlUrl || attachment?.download_url || attachment?.contentUrl || attachment?.url || "",
    githubPath:
      attachment?.githubPath ||
      attachment?.path ||
      attachment?.filePath ||
      attachment?.githubFilePath ||
      attachment?.externalId ||
      attachment?.storagePath ||
      "",
      githubRepository: attachment?.githubRepository || attachment?.repository || attachment?.repo || "",
    };
  });

  const fallbackKeywords = Array.isArray(fallback.keywords)
    ? fallback.keywords
    : Array.isArray(fallback.keys)
      ? fallback.keys
      : [];

  const keywordSource = Array.isArray(knowledge?.keywords) && knowledge.keywords.length
    ? knowledge.keywords
    : fallbackKeywords;

  return {
    id: knowledge?.knowledgeId || knowledge?.id || fallback.id || `repo-${Date.now()}`,
    title: knowledge?.title || fallback.title || "Untitled knowledge",
    description: knowledge?.description || fallback.description || "",
    // FIX: fallback.uploadedBy (explicitly passed by the caller, e.g. the
    // logged-in username) now takes priority over the backend's createdBy.
    // Previously createdBy won, so if it didn't exactly match
    // localStorage username, the item became invisible in "My Uploads"
    // (which filters strictly by uploadedBy matching username).
    uploadedBy:
      fallback.uploadedBy ||
      knowledge?.createdBy ||
      localStorage.getItem("username") ||
      "System",
    date:
      fallback.date ||
      knowledge?.createdAt ||
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    downloads: Number(fallback.downloads ?? knowledge?.downloadCount ?? 0),
    attachments: normalizedAttachments,
    chip1: keywordSource[0] || "knowledge",
    chip2: keywordSource[1] || "repository",
    chip3: keywordSource[2] || "approved",
    chip4: keywordSource[3] || "document",
    keywords: keywordSource,
    keys: keywordSource,
    tags: keywordSource,
    source: fallback.source || "backend",
    status: String(fallback.status || knowledge?.status || "APPROVED").toUpperCase(),
  };
};

export const submitKnowledge = async (payload) => {
  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/knowledge`;
  const cleanPayload = normalizeKnowledgePayload(payload);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(cleanPayload),
    });

    const data = await parseJsonResponse(response);

    if (!response.ok) {
      const message =
        (typeof data === "object" && data !== null && (data.message || data.error)) ||
        `Knowledge submit failed with status ${response.status}.`;
      const err = new Error(message);
      err.status = response.status;
      err.responseData = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error(
        `Backend connection failed. Please confirm the server is reachable at ${endpoint} and that the VPN/network is available.`
      );
    }
    throw error;
  }
};

export const createKnowledge = submitKnowledge;

export const getKnowledge = async () => {
  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/knowledge`;
  const response = await fetch(endpoint, {
    headers: buildHeaders(),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message =
      (typeof data === "object" && data !== null && (data.message || data.error)) ||
      `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return Array.isArray(data) ? data : data?.content || data?.items || data?.data || [];
};

export const getKnowledgeById = async (id) => {
  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/knowledge/${id}`;
  const response = await fetch(endpoint, {
    headers: buildHeaders(),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message =
      (typeof data === "object" && data !== null && (data.message || data.error)) ||
      `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return data;
};

export const uploadKnowledgeFiles = async (knowledgeId, files) => {
  if (!knowledgeId) return [];

  const fileList = Array.isArray(files) ? files.filter(Boolean) : [];
  if (fileList.length === 0) return [];

  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/knowledge/${knowledgeId}/attachments/batch`;
  const formData = new FormData();
  fileList.forEach((file) => {
    formData.append("files", file.file || file);
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: buildHeaders(),
    body: formData,
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message =
      (typeof data === "object" && data !== null && (data.message || data.error)) ||
      `Attachment upload failed with status ${response.status}.`;
    throw new Error(message);
  }

  return Array.isArray(data) ? data : data?.attachments || data?.files || [];
};

export const uploadAttachments = uploadKnowledgeFiles;

export const getAttachmentPreviewUrl = async (attachment) => {
  const localFileUrl = await getLocalFileUrl(attachment?.localFileId);
  if (localFileUrl) return localFileUrl;

  const directUrl =
    attachment?.previewUrl ||
    attachment?.fileUrl ||
    attachment?.downloadUrl ||
    attachment?.dataUrl ||
    attachment?.fileDataUrl ||
    "";

  if (directUrl) {
    return directUrl;
  }

  const attachmentId = attachment?.attachmentId ?? attachment?.attachment_id;
  const endpoint = attachmentId
    ? `${API_BASE_URL}/api/v1/attachments/${attachmentId}/download`
    : "";

  if (!endpoint) {
    throw new Error("Attachment preview URL is unavailable.");
  }

  const response = await fetch(endpoint, {
    headers: buildHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Attachment preview failed with status ${response.status}.`);
  }

  const sourceBlob = await response.blob();
  const fileName = String(attachment?.fileName || attachment?.name || "").toLowerCase();
  const responseType = response.headers.get("content-type") || "";
  const extensionTypes = {
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".csv": "text/csv",
    ".json": "application/json",
    ".xml": "application/xml",
    ".html": "text/html",
    ".htm": "text/html",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  const extension = Object.keys(extensionTypes).find((type) => fileName.endsWith(type));
  const previewType = extensionTypes[extension] || responseType || "application/octet-stream";
  const previewBlob = new Blob([sourceBlob], { type: previewType });

  return window.URL.createObjectURL(previewBlob);
};

export const downloadAttachment = async (attachmentOrId, fileName = "attachment") => {
  const attachment =
    attachmentOrId && typeof attachmentOrId === "object" ? attachmentOrId : null;
  const localFileUrl = await getLocalFileUrl(attachment?.localFileId);
  const directUrl =
    localFileUrl ||
    attachment?.downloadUrl ||
    attachment?.fileUrl ||
    attachment?.previewUrl ||
    attachment?.dataUrl ||
    attachment?.fileDataUrl ||
    "";

  if (directUrl) {
    const link = document.createElement("a");
    link.href = directUrl;
    link.download = fileName || attachment?.fileName || attachment?.name || "attachment";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const attachmentId = attachment?.attachmentId ?? attachment?.attachment_id ?? attachmentOrId;
  if (!attachmentId) {
    throw new Error("Attachment ID is required for authenticated download.");
  }

  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/attachments/${attachmentId}/download`;
  const response = await fetch(endpoint, {
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const errorData = await parseJsonResponse(response).catch(() => null);
    const message =
      (typeof errorData === "object" && errorData !== null && (errorData.message || errorData.error)) ||
      `Attachment download failed with status ${response.status}.`;
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return blob;
};

export const approveKnowledge = async (knowledgeId, payload = {}) => {
  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/knowledge/${knowledgeId}/approve`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message =
      (typeof data === "object" && data !== null && (data.message || data.error)) ||
      `Approve request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return data;
};
export const deleteKnowledge = async (knowledgeId) => {
  if (!knowledgeId) {
    throw new Error("Knowledge ID is required to delete.");
  }

  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/knowledge/${knowledgeId}`;
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: buildHeaders(),
  });

  // Some backends return 204 No Content on successful delete — guard before parsing.
  const contentLength = response.headers.get("content-length");
  const data =
    response.status === 204 || contentLength === "0"
      ? null
      : await parseJsonResponse(response).catch(() => null);

  if (!response.ok) {
    const message =
      (typeof data === "object" && data !== null && (data.message || data.error)) ||
      (response.status === 403
        ? "You don't have permission to delete this item."
        : `Delete failed with status ${response.status}.`);
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  return data;
};
export const rejectKnowledge = async (knowledgeId, payload = {}) => {
  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/knowledge/${knowledgeId}/reject`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message =
      (typeof data === "object" && data !== null && (data.message || data.error)) ||
      `Reject request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return data;
};