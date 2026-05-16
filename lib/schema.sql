-- ============================================================
--  Loop — Schedule Management App
--  Database Schema
--  Engine: MySQL 8+  |  Charset: utf8mb4
-- ============================================================

-- ─── 1. USERS ───────────────────────────────────────────────
CREATE TABLE `users` (
  `id`            int          PRIMARY KEY AUTO_INCREMENT,
  `name`          varchar(255) NOT NULL,
  `email`         varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255),
  `role`          enum('student','admin', 'moderator') NOT NULL DEFAULT 'student',
  `student_id`    varchar(50)  UNIQUE,           -- e.g. STU-2024-001 (NULL for non-students)
  `avatar_url`    varchar(500),
  `is_active`     boolean      NOT NULL DEFAULT true,
  `created_at`    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── 2. DEPARTMENTS ─────────────────────────────────────────
CREATE TABLE `departments` (
  `id`         int          PRIMARY KEY AUTO_INCREMENT,
  `name`       varchar(255) UNIQUE,               -- short name, e.g. CSE
  `full_name`  varchar(255) UNIQUE,               -- e.g. Computer Science & Engineering
  `created_at` timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  `department_id` int          NOT NULL,
  UNIQUE (`session`, `department_id`),
  `created_at`    timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
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
  `department_id` int,
  `created_at`    timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
);

-- ─── 7. SCHEDULES ───────────────────────────────────────────
CREATE TABLE `schedules` (
  `id`            int          PRIMARY KEY AUTO_INCREMENT,
  `course_id`     int,
  `teacher_id`    int,
  `batch_id`      int,
  `section`       varchar(255) NOT NULL DEFAULT 'none',
  `department_id` int,
  `room_id`       int,
  `start_time`    time,
  `end_time`      time,
  `day`           enum('sunday','monday','tuesday','wednesday','thursday'),
  `created_at`    timestamp    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    timestamp    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`course_id`)     REFERENCES `courses`(`id`)     ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`)    REFERENCES `teachers`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`batch_id`)      REFERENCES `batches`(`id`)     ON DELETE CASCADE,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE,
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

-- ─── 9. SESSIONS ────────────────────────────────────────────
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

-- "All schedules for a department on a given day"
CREATE INDEX `idx_schedules_dept_day`
  ON `schedules` (`department_id`, `day`);

-- Fast session token lookup
CREATE INDEX `idx_sessions_user_expiry`
  ON `sessions` (`user_id`, `expires_at`);
