const BOOKMARKS_KEY = "bookmarks";

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : [];
  } catch (e) {
    return [];
  }
};

const getKeyForUser = (username) => `${BOOKMARKS_KEY}:${String(username || "__anonymous__")}`;

const dispatchUpdate = (username) => {
  try {
    window.dispatchEvent(new CustomEvent("bookmarksUpdated", { detail: { username } }));
  } catch (e) {
    // ignore
  }
};

export const loadBookmarks = (username) => {
  try {
    const key = getKeyForUser(username || localStorage.getItem("username"));
    const stored = window.localStorage.getItem(key);
    return safeParse(stored);
  } catch (error) {
    return [];
  }
};

export const saveBookmarks = (list, username) => {
  try {
    const key = getKeyForUser(username || localStorage.getItem("username"));
    window.localStorage.setItem(key, JSON.stringify(list || []));
    dispatchUpdate(username || localStorage.getItem("username"));
  } catch (error) {
    // ignore
  }
};

export const isBookmarked = (id, username) => {
  const list = loadBookmarks(username);
  return list.some((item) => String(item.id) === String(id));
};

export const addBookmark = (item, username) => {
  if (!item) return loadBookmarks(username);
  const list = loadBookmarks(username);
  const exists = list.findIndex((x) => String(x.id) === String(item.id)) >= 0;
  if (exists) return list;
  const next = [item, ...list];
  saveBookmarks(next, username);
  return next;
};

export const removeBookmark = (id, username) => {
  const list = loadBookmarks(username);
  const next = list.filter((item) => String(item.id) !== String(id));
  saveBookmarks(next, username);
  return next;
};

export const toggleBookmark = (item, username) => {
  if (!item) return loadBookmarks(username);
  if (isBookmarked(item.id, username)) {
    return removeBookmark(item.id, username);
  }

  return addBookmark(item, username);
};

export default {
  loadBookmarks,
  saveBookmarks,
  isBookmarked,
  addBookmark,
  removeBookmark,
  toggleBookmark,
};
