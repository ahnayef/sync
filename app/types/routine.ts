export interface RoutineSchema {
  id: number;
  course_code: string;
  course_name: string;
  teacher_name: string;
  start_time: string; // "HH:MM"
  end_time: string;   // "HH:MM"
  room_number: string;
  day: string;
  is_lab: boolean;
  section: string;
  batch_session: string | null;
}
