-- ============================================================
--  Sync — Schedule Management App
--  Database Schema
--  Engine: MySQL 8+  |  Charset: utf8mb4
-- ============================================================

-- ─── 1. USERS ───────────────────────────────────────────────
CREATE TABLE `users` (
  `id`            int          PRIMARY KEY AUTO_INCREMENT,
  `name`          varchar(255) NOT NULL,
  `email`         varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255),
  `role`          enum('student','admin','moderator') NOT NULL DEFAULT 'student',
  `student_id`    varchar(50)  UNIQUE,           -- e.g. STU-2024-001 (NULL for non-students)
  `avatar_url`    varchar(500),
  `is_active`     boolean      NOT NULL DEFAULT true,
  `created_at`    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── 2. DEPARTMENTS ─────────────────────────────────────────
CREATE TABLE `departments` (
  `id`             int          PRIMARY KEY AUTO_INCREMENT,
  `name`           varchar(255) UNIQUE,               -- short name, e.g. CSE
  `full_name`      varchar(255) UNIQUE,               -- e.g. Computer Science & Engineering
  `created_at`     timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── 2.5 PROGRAMS ───────────────────────────────────────────
CREATE TABLE `programs` (
  `id`             int          PRIMARY KEY AUTO_INCREMENT,
  `department_id`  int          NOT NULL,
  `name`           varchar(255) NOT NULL,             -- e.g. Hons, MBA, MA
  `sheet_link`     varchar(1000) DEFAULT NULL,
  `sync_enabled`   boolean      NOT NULL DEFAULT false,
  `last_sync_at`   timestamp    NULL DEFAULT NULL,
  `created_at`     timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
);

-- ─── 3. TEACHERS ────────────────────────────────────────────
CREATE TABLE `teachers` (
  `id`            int          PRIMARY KEY AUTO_INCREMENT,
  `name`          varchar(255) NOT NULL,
  `short`         varchar(50)  UNIQUE NOT NULL,
  `department_id` int,
  `created_at`    timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL
);

-- ─── 4. BATCHES ─────────────────────────────────────────────
CREATE TABLE `batches` (
  `id`            int          PRIMARY KEY AUTO_INCREMENT,
  `name`          varchar(255) NOT NULL UNIQUE,
  `session`       varchar(255) NOT NULL,           -- e.g. "2021-2025"
  `program_id`    int          NOT NULL,
  UNIQUE KEY (`session`, `program_id`),
  `created_at`    timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE CASCADE
);

-- ─── 5. ROOMS ───────────────────────────────────────────────
CREATE TABLE `rooms` (
  `id`            int          PRIMARY KEY AUTO_INCREMENT,
  `number`        int          UNIQUE,
  `building_name` varchar(255) NOT NULL,
  `floor_number`  int          NOT NULL,
  `title`         varchar(255),                   -- optional friendly label, e.g. "AI Lab"
  `room_type`     varchar(255) NOT NULL,           -- e.g. classroom, lab, seminar
  `capacity`      int          NOT NULL,
  `created_at`    timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── 6. COURSES ─────────────────────────────────────────────
CREATE TABLE `courses` (
  `id`            int          PRIMARY KEY AUTO_INCREMENT,
  `name`          varchar(255),
  `code`          varchar(255) NOT NULL UNIQUE,   -- e.g. CSE-06134024
  `is_lab`        boolean      DEFAULT false,
  `program_id`    int,
  `created_at`    timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE CASCADE
);

-- ─── 7. SCHEDULES ───────────────────────────────────────────
CREATE TABLE `schedules` (
  `id`            int          PRIMARY KEY AUTO_INCREMENT,
  `course_id`     int,
  `teacher_id`    int,
  `batch_id`      int,
  `section`       varchar(255) NOT NULL DEFAULT 'none',
  `program_id`    int,
  `room_id`       int,
  `start_time`    time,
  `end_time`      time,
  `day`           enum('sunday','monday','tuesday','wednesday','thursday'),
  `created_at`    timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`course_id`)     REFERENCES `courses`(`id`)     ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`)    REFERENCES `teachers`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`batch_id`)      REFERENCES `batches`(`id`)     ON DELETE CASCADE,
  FOREIGN KEY (`program_id`)    REFERENCES `programs`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`room_id`)       REFERENCES `rooms`(`id`)       ON DELETE CASCADE
);

-- ─── 8. STUDENT–BATCH ASSIGNMENTS ───────────────────────────
-- Links a student user to their batch.
CREATE TABLE `student_batches` (
  `id`          int       PRIMARY KEY AUTO_INCREMENT,
  `student_id`  int       NOT NULL,
  `batch_id`    int       NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_student_batch` (`student_id`, `batch_id`),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`)   ON DELETE CASCADE,
  FOREIGN KEY (`batch_id`)   REFERENCES `batches`(`id`) ON DELETE CASCADE
);

-- ─── 9. STUDENT–COURSE ASSIGNMENTS ──────────────────────────
-- Links a student user to a specific course, teacher, and batch.
CREATE TABLE `student_courses` (
  `id`          int       PRIMARY KEY AUTO_INCREMENT,
  `student_id`  int       NOT NULL,
  `course_id`   int       NOT NULL,
  `teacher_id`  int       NOT NULL,
  `batch_id`    int,
  `created_at`  timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_student_course_teacher_batch` (`student_id`, `course_id`, `teacher_id`, `batch_id`),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`course_id`)  REFERENCES `courses`(`id`)  ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`batch_id`)   REFERENCES `batches`(`id`)  ON DELETE CASCADE
);

-- ─── 10. SESSIONS ───────────────────────────────────────────
-- Server-side auth tokens. Delete on logout or expiry.
CREATE TABLE `sessions` (
  `id`         int          PRIMARY KEY AUTO_INCREMENT,
  `user_id`    int          NOT NULL,
  `token_hash` varchar(255) UNIQUE NOT NULL,      -- SHA-256 of the raw token
  `expires_at` timestamp    NOT NULL,
  `created_at` timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- ============================================================
--  Indexes for common query patterns
-- ============================================================

-- "What is the schedule for batch X on day Y?"
CREATE INDEX `idx_schedules_batch_day`
  ON `schedules` (`batch_id`, `day`);

-- "What does teacher X teach today?"
CREATE INDEX `idx_schedules_teacher_day`
  ON `schedules` (`teacher_id`, `day`);

-- "Is room X already booked at a given time slot?"
CREATE INDEX `idx_schedules_room_day`
  ON `schedules` (`room_id`, `day`);

-- "All schedules for a program on a given day"
CREATE INDEX `idx_schedules_prog_day`
  ON `schedules` (`program_id`, `day`);

-- Fast session token lookup
CREATE INDEX `idx_sessions_user_expiry`
  ON `sessions` (`user_id`, `expires_at`);

-- Fast student course lookup
CREATE INDEX `idx_student_courses_course`
  ON `student_courses` (`course_id`);
CREATE INDEX `idx_student_courses_teacher`
  ON `student_courses` (`teacher_id`);

-- ─── 11. SHEET SYNC LOGS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sheet_sync_logs` (
  `id`            int          PRIMARY KEY AUTO_INCREMENT,
  `program_id`    int          NOT NULL,
  `status`        enum('success','error') NOT NULL,
  `message`       text,
  `created_at`    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE CASCADE
);

-- ─── 12. PASSWORD RESETS ───────────────────────────────────
-- Stores one-time codes for password reset (hashed) and expiry.
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id`          int          PRIMARY KEY AUTO_INCREMENT,
  `user_id`     int          NOT NULL,
  `code_hash`   varchar(255) NOT NULL,
  `expires_at`  timestamp    NOT NULL,
  `used`        boolean      NOT NULL DEFAULT false,
  `created_at`  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
