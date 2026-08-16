/* ============================================================
   Smart Counseling Hour — db.js
   Local "database" layer backed by window.localStorage.
   Exposes a single global `window.api` object used by every page.
   ============================================================ */

(function () {
  "use strict";

  const KEYS = {
    USERS: "sch_users",
    QUERIES: "sch_queries",
    APPOINTMENTS: "sch_appointments",
    CURRENT_USER: "sch_current_user",
    SELECTED_QUERY: "sch_selected_query",
    ID_COUNTER: "sch_id_counter"
  };

  const STATUS = {
    PENDING: "Pending",
    ANSWERED: "Answered",
    COUNSELING: "Counseling Required"
  };

  const APPT_STATUS = {
    SCHEDULED: "Scheduled"
  };
// removed
  /* ---------------------------------------------------------
     Internal storage helpers
     --------------------------------------------------------- */
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.error("Smart Counseling Hour: failed to read " + key, err);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error("Smart Counseling Hour: failed to write " + key, err);
      return false;
    }
  }

  function nextId() {
    const current = readJSON(KEYS.ID_COUNTER, 1000);
    const next = current + 1;
    writeJSON(KEYS.ID_COUNTER, next);
    return "id_" + next + "_" + Date.now().toString(36);
  }

  /* ---------------------------------------------------------
     First-load seed data
     --------------------------------------------------------- */
  function seedIfEmpty() {
    if (localStorage.getItem(KEYS.USERS) === null) {
      const demoUsers = [
        {
          id: "user_student_demo",
          name: "Alex Rivera",
          email: "student@gmail.com",
          password: "1234",
          role: "student"
        },
        {
          id: "user_teacher_demo",
          name: "Dr. Morgan Lee",
          email: "teacher@gmail.com",
          password: "1234",
          role: "teacher"
        }
      ];
      writeJSON(KEYS.USERS, demoUsers);
    }
    if (localStorage.getItem(KEYS.QUERIES) === null) {
      writeJSON(KEYS.QUERIES, []);
    }
    if (localStorage.getItem(KEYS.APPOINTMENTS) === null) {
      writeJSON(KEYS.APPOINTMENTS, []);
    }
    if (localStorage.getItem(KEYS.ID_COUNTER) === null) {
      writeJSON(KEYS.ID_COUNTER, 1000);
    }
  }

  /* ---------------------------------------------------------
     XSS-safe HTML escaping — used by every page before
     injecting any user-supplied string into the DOM.
     --------------------------------------------------------- */
  function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---------------------------------------------------------
     Users
     --------------------------------------------------------- */
  function getUsers() {
    return readJSON(KEYS.USERS, []);
  }

  function getUserById(id) {
    return getUsers().find(function (u) { return u.id === id; }) || null;
  }

  function login(email, password) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const user = getUsers().find(function (u) {
      return u.email.toLowerCase() === normalizedEmail && u.password === password;
    });
    return user || null;
  }

  function setCurrentUser(user) {
    // Never persist the password hash/plaintext in the session record.
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    writeJSON(KEYS.CURRENT_USER, safeUser);
  }

  function getCurrentUser() {
    return readJSON(KEYS.CURRENT_USER, null);
  }

  function logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }

  /* ---------------------------------------------------------
     Queries
     --------------------------------------------------------- */
  function getQueries() {
    return readJSON(KEYS.QUERIES, []);
  }

  function saveQueries(list) {
    writeJSON(KEYS.QUERIES, list);
  }

  function addQuery(studentId, subject, question) {
    const trimmedSubject = String(subject || "").trim();
    const trimmedQuestion = String(question || "").trim();
    if (!studentId || !trimmedSubject || !trimmedQuestion) {
      throw new Error("Subject, question, and studentId are all required.");
    }
    const queries = getQueries();
    const record = {
      id: nextId(),
      studentId: studentId,
      subject: trimmedSubject,
      question: trimmedQuestion,
      answer: "",
      counselingRequired: false,
      status: STATUS.PENDING,
      createdAt: new Date().toISOString(),
      answeredAt: null
    };
    queries.push(record);
    saveQueries(queries);
    return record;
  }

  function getStudentQueries(studentId) {
    return getQueries()
      .filter(function (q) { return q.studentId === studentId; })
      .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }

  function getAllQueries() {
    const users = getUsers();
    return getQueries()
      .map(function (q) {
        const student = users.find(function (u) { return u.id === q.studentId; });
        return Object.assign({}, q, {
          studentName: student ? student.name : "Unknown Student"
        });
      })
      .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }

  function getQueryById(queryId) {
    return getQueries().find(function (q) { return q.id === queryId; }) || null;
  }

  function answerQuery(queryId, answer, counselingRequired) {
    const queries = getQueries();
    const idx = queries.findIndex(function (q) { return q.id === queryId; });
    if (idx === -1) {
      throw new Error("Query not found.");
    }
    const trimmedAnswer = String(answer || "").trim();
    queries[idx].answer = trimmedAnswer;
    queries[idx].counselingRequired = Boolean(counselingRequired);
    queries[idx].status = counselingRequired ? STATUS.COUNSELING : STATUS.ANSWERED;
    queries[idx].answeredAt = new Date().toISOString();
    saveQueries(queries);
    return queries[idx];
  }

  function markQueryCounselingScheduled(queryId) {
    const queries = getQueries();
    const idx = queries.findIndex(function (q) { return q.id === queryId; });
    if (idx === -1) return null;
    queries[idx].status = STATUS.COUNSELING;
    queries[idx].counselingRequired = true;
    saveQueries(queries);
    return queries[idx];
  }

  /* ---------------------------------------------------------
     Appointments
     --------------------------------------------------------- */
  function getAppointments() {
    return readJSON(KEYS.APPOINTMENTS, []);
  }

  function saveAppointments(list) {
    writeJSON(KEYS.APPOINTMENTS, list);
  }

  function createAppointment(studentId, teacherId, queryId, date, time, location, note) {
    const trimmedDate = String(date || "").trim();
    const trimmedTime = String(time || "").trim();
    const trimmedLocation = String(location || "").trim();
    const trimmedNote = String(note || "").trim();

    if (!studentId || !teacherId || !trimmedDate || !trimmedTime || !trimmedLocation) {
      throw new Error("Student, teacher, date, time, and location are required.");
    }

    const appointments = getAppointments();
    const record = {
      id: nextId(),
      studentId: studentId,
      teacherId: teacherId,
      queryId: queryId || null,
      date: trimmedDate,
      time: trimmedTime,
      location: trimmedLocation,
      note: trimmedNote,
      status: APPT_STATUS.SCHEDULED,
      createdAt: new Date().toISOString()
    };
    appointments.push(record);
    saveAppointments(appointments);

    if (queryId) {
      markQueryCounselingScheduled(queryId);
    }

    return record;
  }

  function getStudentAppointments(studentId) {
    const users = getUsers();
    return getAppointments()
      .filter(function (a) { return a.studentId === studentId; })
      .map(function (a) {
        const teacher = users.find(function (u) { return u.id === a.teacherId; });
        return Object.assign({}, a, {
          teacherName: teacher ? teacher.name : "Unassigned"
        });
      })
      .sort(function (a, b) {
        return new Date(a.date + "T" + (a.time || "00:00")) -
               new Date(b.date + "T" + (b.time || "00:00"));
      });
  }

  function getTeacherAppointments(teacherId) {
    const users = getUsers();
    return getAppointments()
      .filter(function (a) { return a.teacherId === teacherId; })
      .map(function (a) {
        const student = users.find(function (u) { return u.id === a.studentId; });
        return Object.assign({}, a, {
          studentName: student ? student.name : "Unknown Student"
        });
      })
      .sort(function (a, b) {
        return new Date(a.date + "T" + (a.time || "00:00")) -
               new Date(b.date + "T" + (b.time || "00:00"));
      });
  }

  /* ---------------------------------------------------------
     "Schedule Counseling" hand-off between teacher.html
     and appointment.html
     --------------------------------------------------------- */
  function setSelectedQuery(payload) {
    writeJSON(KEYS.SELECTED_QUERY, payload);
  }

  function getSelectedQuery() {
    return readJSON(KEYS.SELECTED_QUERY, null);
  }

  function clearSelectedQuery() {
    localStorage.removeItem(KEYS.SELECTED_QUERY);
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  seedIfEmpty();

  window.api = {
    STATUS: STATUS,
    APPT_STATUS: APPT_STATUS,

    // utility
    escapeHtml: escapeHtml,

    // auth
    login: login,
    logout: logout,
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,

    // users
    getUserById: getUserById,

    // queries
    addQuery: addQuery,
    getStudentQueries: getStudentQueries,
    getAllQueries: getAllQueries,
    getQueryById: getQueryById,
    answerQuery: answerQuery,

    // appointments
    createAppointment: createAppointment,
    getStudentAppointments: getStudentAppointments,
    getTeacherAppointments: getTeacherAppointments,

    // hand-off state for the scheduling flow
    setSelectedQuery: setSelectedQuery,
    getSelectedQuery: getSelectedQuery,
    clearSelectedQuery: clearSelectedQuery
  };
})();
