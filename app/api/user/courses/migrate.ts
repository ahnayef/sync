import db from "../../../lib/db";

async function migrate() {
  try {
    console.log("Starting migration: Create student_courses table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS student_courses (
        id int PRIMARY KEY AUTO_INCREMENT,
        student_id int NOT NULL,
        course_id int NOT NULL,
        teacher_id int NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_student_course_teacher (student_id, course_id, teacher_id),
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ student_courses table created successfully");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    process.exit();
  }
}

migrate();
