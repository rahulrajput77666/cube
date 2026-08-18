const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.0.19:8080/cube";

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

export const mapKnowledgeApiResponseToRepositoryItem = (response, fallback = {}) => {
  const knowledge = response?.knowledge || response || {};
  const attachments = Array.isArray(response?.attachments)
    ? response.attachments
    : Array.isArray(knowledge?.attachments)
      ? knowledge.attachments
      : [];

  const normalizedAttachments = attachments.map((attachment, index) => ({
    id:
      attachment?.attachmentId ||
      attachment?.id ||
      attachment?.attachment_id ||
      `${knowledge?.title || fallback.title || "attachment"}-${index + 1}`,
    attachmentId:
      attachment?.attachmentId ||
      attachment?.id ||
      attachment?.attachment_id ||
      null,
    name: attachment?.fileName || attachment?.name || `attachment-${index + 1}`,
    fileName: attachment?.fileName || attachment?.name || `attachment-${index + 1}`,
    size: attachment?.fileSize || attachment?.size || "0 KB",
    fileSize: attachment?.fileSize || attachment?.size || "0 KB",
    contentType: attachment?.contentType || attachment?.mimeType || "application/octet-stream",
    uploadedAt: attachment?.uploadedAt || attachment?.uploaded_at || null,
    fileUrl: attachment?.fileUrl || attachment?.downloadUrl || "",
    downloadUrl: attachment?.downloadUrl || attachment?.fileUrl || "",
    previewUrl: attachment?.previewUrl || attachment?.fileUrl || "",
  }));

  return {
    id: knowledge?.knowledgeId || knowledge?.id || fallback.id || `repo-${Date.now()}`,
    title: knowledge?.title || fallback.title || "Untitled knowledge",
    description: knowledge?.description || fallback.description || "",
    uploadedBy:
      knowledge?.createdBy ||
      fallback.uploadedBy ||
      localStorage.getItem("username") ||
      "System",
    date:
      knowledge?.createdAt ||
      fallback.date ||
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    downloads: Number(knowledge?.downloadCount || fallback.downloads || 0),
    attachments: normalizedAttachments,
    chip1: (knowledge?.keywords || fallback.chip1 || [])[0] || "knowledge",
    chip2: (knowledge?.keywords || fallback.chip2 || [])[1] || "repository",
    chip3: (knowledge?.keywords || fallback.chip3 || [])[2] || "approved",
    chip4: (knowledge?.keywords || fallback.chip4 || [])[3] || "document",
    source: fallback.source || "backend",
    status: String(knowledge?.status || fallback.status || "APPROVED").toUpperCase(),
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

export const downloadAttachment = async (attachmentId, fileName = "attachment") => {
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