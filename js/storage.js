/**
 * OSON PRAVA — Storage Management Module
 * Safe LocalStorage abstraction with defensive error handling and data syncing
 */

window.OSON_STORAGE = (function() {
  'use strict';

  const STORAGE_PREFIX = 'OSON_PRAVA_';
  const KEYS = {
    USER: STORAGE_PREFIX + 'USER',
    SESSION: STORAGE_PREFIX + 'SESSION',
    TEST_HISTORY: STORAGE_PREFIX + 'TEST_HISTORY',
    LESSON_PROGRESS: STORAGE_PREFIX + 'LESSON_PROGRESS',
    FAVORITES: STORAGE_PREFIX + 'FAVORITES',
    SAVED_QUESTIONS: STORAGE_PREFIX + 'SAVED_QUESTIONS',
    DAILY_PRACTICE: STORAGE_PREFIX + 'DAILY_PRACTICE',
    NOTIFICATIONS: STORAGE_PREFIX + 'NOTIFICATIONS',
    ACHIEVEMENTS: STORAGE_PREFIX + 'ACHIEVEMENTS',
    SETTINGS: STORAGE_PREFIX + 'SETTINGS',
    LOGGED_OUT: STORAGE_PREFIX + 'LOGGED_OUT',
    TEST_SESSION: STORAGE_PREFIX + 'TEST_SESSION',
    CERTIFICATE: STORAGE_PREFIX + 'CERTIFICATE',
    USERS: STORAGE_PREFIX + 'USERS'
  };

  const USER_SCOPED_KEYS = new Set([
    KEYS.TEST_HISTORY,
    KEYS.LESSON_PROGRESS,
    KEYS.FAVORITES,
    KEYS.SAVED_QUESTIONS,
    KEYS.DAILY_PRACTICE,
    KEYS.ACHIEVEMENTS,
    KEYS.CERTIFICATE
  ]);

  function getActiveUserId() {
    try {
      const rawSession = localStorage.getItem(KEYS.SESSION);
      if (rawSession) {
        const session = JSON.parse(rawSession);
        if (session && session.userId) return session.userId;
      }
      const rawUser = localStorage.getItem(KEYS.USER);
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user && user.id) return user.id;
      }
    } catch (e) {}
    return null;
  }

  function resolveKey(key) {
    if (USER_SCOPED_KEYS.has(key)) {
      const uid = getActiveUserId();
      if (uid) {
        return `${key}_${uid}`;
      }
    }
    return key;
  }

  // Safe wrapper for JSON reading
  function get(key, defaultValue = null) {
    try {
      // If guest user accesses user-scoped progress, enforce empty default
      if (USER_SCOPED_KEYS.has(key) && !getActiveUserId()) {
        if (key === KEYS.CERTIFICATE) return null;
        if (key === KEYS.LESSON_PROGRESS) return {};
        if (key === KEYS.TEST_HISTORY || key === KEYS.FAVORITES || key === KEYS.SAVED_QUESTIONS || key === KEYS.ACHIEVEMENTS) return [];
        if (key === KEYS.DAILY_PRACTICE) {
          return { date: getTodayString(), target: 10, solvedCount: 0, completed: false };
        }
      }

      const resolved = resolveKey(key);
      const item = localStorage.getItem(resolved);
      if (item === null || item === undefined) {
        // Fallback check on base key for seamless data migration if user just logged in
        if (resolved !== key) {
          const legacyItem = localStorage.getItem(key);
          if (legacyItem !== null && legacyItem !== undefined) {
            localStorage.setItem(resolved, legacyItem);
            return JSON.parse(legacyItem);
          }
        }
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (e) {
      console.warn('LocalStorage get error for key:', key, e);
      return defaultValue;
    }
  }

  // Safe wrapper for JSON writing
  function set(key, value) {
    try {
      const resolved = resolveKey(key);
      localStorage.setItem(resolved, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('LocalStorage set error for key:', key, e);
      return false;
    }
  }

  // Remove key
  function remove(key) {
    try {
      const resolved = resolveKey(key);
      localStorage.removeItem(resolved);
      if (resolved !== key) localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('LocalStorage remove error for key:', key, e);
      return false;
    }
  }

  // Today string YYYY-MM-DD
  function getTodayString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  // Initialize clean defaults for new visitors — NO seeded/demo progress data.
  // Real progress is only created when the user actually completes actions.
  function initDefaults() {
    // 0. Schema Migration: Purge legacy seeded/mock data from earlier versions
    const schemaVer = get('oson_storage_schema', null);
    if (schemaVer !== 'v2.4_isolated') {
      const history = get(KEYS.TEST_HISTORY, []);
      const hasMockHistory = Array.isArray(history) && history.some(h => h.id === 'test_1' || h.id === 'test_2' || (h.percentage && !get(KEYS.SESSION)));
      const lessonProg = get(KEYS.LESSON_PROGRESS, {});
      const hasMockLessons = lessonProg && ((lessonProg['les-1'] && lessonProg['les-1'].completed) || (lessonProg['les-3'] && lessonProg['les-3'].percent === 65));
      
      if (hasMockHistory || hasMockLessons || !get(KEYS.SESSION)) {
        set(KEYS.TEST_HISTORY, []);
        set(KEYS.LESSON_PROGRESS, {});
        set(KEYS.ACHIEVEMENTS, []);
        set(KEYS.FAVORITES, []);
        set(KEYS.SAVED_QUESTIONS, []);
        if (!get(KEYS.SESSION)) {
          remove(KEYS.USER);
        }
      }
      set('oson_storage_schema', 'v2.4_isolated');
    }

    // 1. Authentication Check: A new visitor MUST start as GUEST.
    // Do NOT auto-seed user. Clean up legacy unauthenticated seed if no session token exists.
    const activeSession = get(KEYS.SESSION, null);
    if (!activeSession && get(KEYS.USER)) {
      remove(KEYS.USER);
    }

    // 2. Test History — empty by default, populated only by real test completions
    if (!get(KEYS.TEST_HISTORY)) {
      set(KEYS.TEST_HISTORY, []);
    }

    // 3. Lesson Progress — empty by default, populated when user reads/completes lessons
    if (!get(KEYS.LESSON_PROGRESS)) {
      set(KEYS.LESSON_PROGRESS, {});
    }

    // 4. Favorites — empty by default
    if (!get(KEYS.FAVORITES)) {
      set(KEYS.FAVORITES, []);
    }

    // 4b. Saved Questions — empty by default
    if (!get(KEYS.SAVED_QUESTIONS)) {
      set(KEYS.SAVED_QUESTIONS, []);
    }

    // 5. Daily Practice — fresh start each day, 0 solved
    const daily = get(KEYS.DAILY_PRACTICE);
    const today = getTodayString();
    if (!daily || daily.date !== today) {
      set(KEYS.DAILY_PRACTICE, {
        date: today,
        target: 10,
        solvedCount: 0,
        completed: false
      });
    }

    // 6. Notifications
    if (!get(KEYS.NOTIFICATIONS)) {
      set(KEYS.NOTIFICATIONS, (window.OSON_DATA && window.OSON_DATA.initialNotifications) ? window.OSON_DATA.initialNotifications : []);
    }

    // 7. Achievements — empty by default, earned through real actions
    if (!get(KEYS.ACHIEVEMENTS)) {
      set(KEYS.ACHIEVEMENTS, []);
    }

    // 8. Settings
    if (!get(KEYS.SETTINGS)) {
      // Check system preference for dark mode
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      set(KEYS.SETTINGS, {
        darkMode: prefersDark,
        sound: true,
        reminders: true,
        language: 'uz'
      });
    }
  }

  // Add test result to history
  function saveTestResult(resultData) {
    const history = get(KEYS.TEST_HISTORY, []);
    const newRecord = {
      id: 'test_' + Date.now(),
      date: new Date().toLocaleString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      ...resultData
    };
    history.unshift(newRecord);
    set(KEYS.TEST_HISTORY, history);

    // Update achievements dynamically
    checkAchievements(history);
    return newRecord;
  }

  // Dynamic achievement evaluation
  function checkAchievements(history) {
    const currentAch = get(KEYS.ACHIEVEMENTS, []);
    const unlocked = new Set(currentAch);

    // Boshlovchi
    if (history.length >= 1) unlocked.add('boshlovchi');
    // 10 ta test
    if (history.length >= 10) unlocked.add('test_10');
    // 100 ta savol answered
    const totalAnswered = history.reduce((sum, h) => sum + (h.total || 20), 0);
    if (totalAnswered >= 100) unlocked.add('questions_100');
    // Perfect Score
    if (history.some(h => h.score === h.total)) unlocked.add('perfect_score');
    // Imtihon ustasi (passed 3 exam modes)
    const passedExams = history.filter(h => h.mode === 'exam' && h.passed).length;
    if (passedExams >= 3) unlocked.add('exam_master');

    set(KEYS.ACHIEVEMENTS, Array.from(unlocked));
  }

  // Toggle favorite helper
  function toggleFavorite(itemId) {
    const favs = get(KEYS.FAVORITES, []);
    const index = favs.indexOf(itemId);
    let isFav = false;
    if (index > -1) {
      favs.splice(index, 1);
      isFav = false;
    } else {
      favs.push(itemId);
      isFav = true;
    }
    set(KEYS.FAVORITES, favs);
    return isFav;
  }

  function isFavorite(itemId) {
    const favs = get(KEYS.FAVORITES, []);
    return favs.includes(itemId);
  }

  // Saved Questions methods
  function getSavedQuestions() {
    return get(KEYS.SAVED_QUESTIONS, []);
  }

  function isQuestionSaved(qid) {
    const saved = getSavedQuestions();
    return saved.includes(Number(qid));
  }

  function toggleSavedQuestion(qid) {
    const idNum = Number(qid);
    let saved = getSavedQuestions();
    const idx = saved.indexOf(idNum);
    let isSaved = false;
    if (idx > -1) {
      saved.splice(idx, 1);
      isSaved = false;
    } else {
      saved.push(idNum);
      isSaved = true;
    }
    set(KEYS.SAVED_QUESTIONS, saved);
    return isSaved;
  }

  // Reset all student progress
  function resetAllProgress() {
    set(KEYS.TEST_HISTORY, []);
    set(KEYS.LESSON_PROGRESS, {});
    set(KEYS.SAVED_QUESTIONS, []);
    set(KEYS.DAILY_PRACTICE, {
      date: getTodayString(),
      target: 10,
      solvedCount: 0,
      completed: false
    });
    set(KEYS.ACHIEVEMENTS, []);
    remove(KEYS.CERTIFICATE);
    return true;
  }

  // Certificate storage helpers
  function getCertificate() {
    return get(KEYS.CERTIFICATE, null);
  }

  function saveCertificate(certData) {
    if (!getActiveUserId()) return null;
    set(KEYS.CERTIFICATE, certData);
    return certData;
  }

  function removeCertificate() {
    return remove(KEYS.CERTIFICATE);
  }

  // Clear completely
  function clearAllData() {
    localStorage.clear();
    initDefaults();
    return true;
  }

  // Run on load
  initDefaults();

  return {
    KEYS,
    get,
    set,
    remove,
    saveTestResult,
    toggleFavorite,
    isFavorite,
    getSavedQuestions,
    isQuestionSaved,
    toggleSavedQuestion,
    resetAllProgress,
    clearAllData,
    getTodayString,
    getCertificate,
    saveCertificate,
    removeCertificate
  };
})();
