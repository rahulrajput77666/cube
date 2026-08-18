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

const normalizeKeywordList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const extractAttachmentList = (source) => {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source.filter(
      (item) =>
        item &&
        (item?.attachmentId ||
          item?.fileId ||
          item?.id ||
          item?.name ||
          item?.fileName ||
          item?.file_name ||
          item?.contentType ||
          item?.mimeType ||
          item?.fileSize ||
          item?.file_size)
    );
  }

  if (typeof source !== "object") return [];

  const candidateKeys = ["attachments", "files", "documents", "content", "items", "records", "data"];
  for (const key of candidateKeys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return extractAttachmentList(value);
    }
  }

  if (
    source?.attachmentId ||
    source?.fileId ||
    source?.id ||
    source?.name ||
    source?.fileName ||
    source?.file_name ||
    source?.contentType ||
    source?.mimeType ||
    source?.fileSize ||
    source?.file_size
  ) {
    return [source];
  }

  return [];
};

const normalizeKnowledgePayload = (payload = {}) => {
  const keywords = normalizeKeywordList(payload.keywords || payload.keys || payload.tags);

  if (!keywords.length) {
    throw new Error("Please add at least one key before submitting the solution.");
  }

  return {
    title: String(payload.title || "").trim(),
    description: String(payload.description || "").trim(),
    keywords,
  };
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

export const mapKnowledgeApiResponseToRepositoryItem = (response, fallback = {}) => {
  const knowledge = response?.knowledge || response || {};
  const attachmentList = extractAttachmentList(
    response?.attachments ||
      response?.files ||
      response?.documents ||
      response?.data ||
      knowledge?.attachments ||
      knowledge?.files ||
      knowledge?.documents ||
      response
  );

  const keywordList = normalizeKeywordList(
    knowledge?.keywords ||
      knowledge?.keys ||
      knowledge?.tags ||
      response?.keywords ||
      response?.keys ||
      response?.tags ||
      fallback?.keywords ||
      fallback?.keys ||
      fallback?.tags
  );

  const normalizedAttachments = attachmentList.map((attachment, index) => ({
    id:
      attachment?.attachmentId ||
      attachment?.fileId ||
      attachment?.id ||
      attachment?.attachment_id ||
      `${knowledge?.title || fallback.title || "attachment"}-${index + 1}`,
    attachmentId:
      attachment?.attachmentId ||
      attachment?.fileId ||
      attachment?.id ||
      attachment?.attachment_id ||
      null,
    name:
      attachment?.fileName ||
      attachment?.file_name ||
      attachment?.name ||
      `attachment-${index + 1}`,
    fileName:
      attachment?.fileName ||
      attachment?.file_name ||
      attachment?.name ||
      `attachment-${index + 1}`,
    size: attachment?.fileSize || attachment?.file_size || attachment?.size || "0 KB",
    fileSize: attachment?.fileSize || attachment?.file_size || attachment?.size || "0 KB",
    contentType: attachment?.contentType || attachment?.mimeType || attachment?.fileType || "application/octet-stream",
    uploadedAt: attachment?.uploadedAt || attachment?.uploaded_at || attachment?.createdAt || null,
    fileUrl: attachment?.fileUrl || attachment?.downloadUrl || attachment?.path || "",
    downloadUrl: attachment?.downloadUrl || attachment?.fileUrl || attachment?.path || "",
    previewUrl: attachment?.previewUrl || attachment?.fileUrl || attachment?.path || "",
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
    keywords: keywordList,
    keys: keywordList,
    tags: keywordList,
    chip1: keywordList[0] || "",
    chip2: keywordList[1] || "",
    chip3: keywordList[2] || "",
    chip4: keywordList[3] || "",
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
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
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
    if (response.status === 403) {
      return [];
    }

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
  if (!knowledgeId) {
    return [];
  }

  const fileList = Array.isArray(files) ? files.filter(Boolean) : [];
  if (fileList.length === 0) {
    return [];
  }

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