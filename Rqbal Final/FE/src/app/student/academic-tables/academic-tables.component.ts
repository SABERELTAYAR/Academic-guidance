import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
 interface CourseSchedule {
  day: string;
  period1: string;
  period2: string;
  period3: string;
  period4: string;
  period5?: string; // Added optional 5th period
}

 interface ExamSchedule {
  day: string;
  date: string;
  period1: string;
  period2: string;
  period3: string;
  location?: string; // Added exam location
}

 interface StudentSchedule {
  id: string;
  semester: string;
  academicYear: string;
  courseSchedule: CourseSchedule[];
  examSchedule: ExamSchedule[];
}
@Component({
  selector: 'app-academic-tables',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './academic-tables.component.html',
  styleUrl: './academic-tables.component.css'
})
export class AcademicTablesComponent {


 studentsSchedules: StudentSchedule[] = [
  {
    id: '2023001',
    semester: 'الترم الاول',
    academicYear: 'السنة الثالثة',
    courseSchedule: [
      {
        day: 'السبت',
        period1: 'Advanced DataBase',
        period2: 'Advanced Project Management',
        period3: 'Parallel Computing',
        period4: 'Advanced DataBase<br/>Section 1',
        period5: 'Office Hours<br/>(2:00-4:00)'
      },
      {
        day: 'الاحد',
        period1: 'Network Forensics',
        period2: 'Enterprise Architecture',
        period3: 'Network Programming',
        period4: 'Parallel Computing<br/>Section 1'
      },
      {
        day: 'الاثنين',
        period1: 'Research Methodology',
        period2: 'Cloud Computing',
        period3: 'Elective: AI Fundamentals',
        period4: 'Lab Session'
      },
      {
        day: 'الثلاثاء',
        period1: 'Network Programming',
        period2: 'Enterprise Architecture<br/>Section 1',
        period3: 'Advanced DataBase<br/>Section 2',
        period4: 'Parallel Computing<br/>Section 2'
      },
      {
        day: 'الاربعاء',
        period1: 'Network Programming<br/>Section 1',
        period2: 'Parallel Computing<br/>Section 3',
        period3: 'Network Forensics<br/>Section 1',
        period4: 'Network Forensics<br/>Section 2'
      },
      {
        day: 'الخميس',
        period1: 'Network Forensics',
        period2: 'Advanced DataBase<br/>Section 3',
        period3: 'Network Forensics<br/>Section 3',
        period4: 'Enterprise Architecture<br/>Section 2'
      }
    ],
    examSchedule: [
      {
        day: 'السبت',
        date: '23-3-2025',
        period1: 'Network Forensics',
        period2: 'Enterprise Architecture',
        period3: '',
        location: 'قاعة 101 - مبنى الكمبيوتر'
      },
      {
        day: 'الاحد',
        date: '24-3-2025',
        period1: 'Advanced Project Management',
        period2: '',
        period3: 'Network Programming',
        location: 'قاعة 203 - مبنى العلوم'
      },
      {
        day: 'الثلاثاء',
        date: '26-3-2025',
        period1: '',
        period2: 'Advanced DataBase',
        period3: '',
        location: 'قاعة 305 - المبنى الرئيسي'
      },
      {
        day: 'الاربعاء',
        date: '27-3-2025',
        period1: '',
        period2: 'Parallel Computing',
        period3: '',
        location: 'قاعة 102 - مبنى الكمبيوتر'
      },
      {
        day: 'الخميس',
        date: '28-3-2025',
        period1: 'Cloud Computing',
        period2: 'Research Methodology',
        period3: '',
        location: 'قاعة 201 - مبنى العلوم'
      }
    ]
  },
  {
    id: '2023002',
    semester: 'الترم الاول',
    academicYear: 'السنة الثانية',
    courseSchedule: [
      {
        day: 'السبت',
        period1: 'Data Structures',
        period2: 'Algorithms',
        period3: 'Operating Systems',
        period4: 'Data Structures<br/>Section 1',
        period5: 'Tutorial Session'
      },
      {
        day: 'الاحد',
        period1: 'Computer Networks',
        period2: 'Database Systems',
        period3: 'Discrete Mathematics',
        period4: 'Lab Session 1'
      },
      {
        day: 'الاثنين',
        period1: 'Software Engineering',
        period2: 'Web Development',
        period3: 'Elective: Cybersecurity',
        period4: 'Lab Session 2'
      },
      {
        day: 'الثلاثاء',
        period1: 'Computer Architecture',
        period2: 'Algorithms<br/>Section 1',
        period3: 'Database Systems<br/>Section 1',
        period4: 'Office Hours'
      },
      {
        day: 'الاربعاء',
        period1: 'Data Structures<br/>Section 2',
        period2: 'Computer Networks<br/>Section 1',
        period3: 'Software Engineering<br/>Section 1',
        period4: 'Tutorial Session'
      }
    ],
    examSchedule: [
      {
        day: 'السبت',
        date: '23-3-2025',
        period1: 'Data Structures',
        period2: 'Algorithms',
        period3: '',
        location: 'قاعة 301 - المبنى الرئيسي'
      },
      {
        day: 'الاحد',
        date: '24-3-2025',
        period1: 'Computer Networks',
        period2: '',
        period3: 'Database Systems',
        location: 'قاعة 202 - مبنى العلوم'
      },
      {
        day: 'الثلاثاء',
        date: '26-3-2025',
        period1: '',
        period2: 'Operating Systems',
        period3: '',
        location: 'قاعة 103 - مبنى الكمبيوتر'
      },
      {
        day: 'الاربعاء',
        date: '27-3-2025',
        period1: 'Software Engineering',
        period2: '',
        period3: 'Web Development',
        location: 'قاعة 204 - مبنى العلوم'
      }
    ]
  },
  {
    id: '2024001',
    semester: 'الترم الاول',
    academicYear: 'السنة الاولى',
    courseSchedule: [
      {
        day: 'السبت',
        period1: 'Programming Fundamentals',
        period2: 'Computer Essentials',
        period3: 'Mathematics 1',
        period4: 'Lab Session 1'
      },
      {
        day: 'الاحد',
        period1: 'English for IT',
        period2: 'Digital Logic',
        period3: 'Programming Fundamentals<br/>Section 1',
        period4: 'Tutorial Session'
      },
      {
        day: 'الاثنين',
        period1: 'Mathematics 1<br/>Section 1',
        period2: 'Computer Essentials<br/>Section 1',
        period3: 'Communication Skills',
        period4: 'Lab Session 2'
      },
      {
        day: 'الثلاثاء',
        period1: 'Digital Logic<br/>Section 1',
        period2: 'Programming Fundamentals<br/>Section 2',
        period3: 'Office Hours',
        period4: ''
      },
      {
        day: 'الاربعاء',
        period1: 'Mathematics 1<br/>Section 2',
        period2: 'English for IT<br/>Section 1',
        period3: 'Computer Essentials<br/>Section 2',
        period4: 'Tutorial Session'
      }
    ],
    examSchedule: [
      {
        day: 'السبت',
        date: '23-3-2025',
        period1: 'Programming Fundamentals',
        period2: 'Computer Essentials',
        period3: '',
        location: 'قاعة 001 - المبنى الجديد'
      },
      {
        day: 'الاحد',
        date: '24-3-2025',
        period1: 'Mathematics 1',
        period2: '',
        period3: 'Digital Logic',
        location: 'قاعة 002 - المبنى الجديد'
      },
      {
        day: 'الثلاثاء',
        date: '26-3-2025',
        period1: 'English for IT',
        period2: 'Communication Skills',
        period3: '',
        location: 'قاعة 101 - مبنى الكمبيوتر'
      }
    ]
  },
  {
    id: '2025001',
    semester: 'الترم الاول',
    academicYear: 'السنة الرابعة',
    courseSchedule: [
      {
        day: 'السبت',
        period1: 'Machine Learning',
        period2: 'Big Data Analytics',
        period3: 'Project Management',
        period4: 'Research Seminar',
        period5: 'Thesis Supervision'
      },
      {
        day: 'الاحد',
        period1: 'Cloud Security',
        period2: 'IoT Systems',
        period3: 'Elective: Blockchain',
        period4: 'Lab Session'
      },
      {
        day: 'الاثنين',
        period1: 'Advanced Algorithms',
        period2: 'Distributed Systems',
        period3: 'Professional Ethics',
        period4: 'Thesis Work'
      },
      {
        day: 'الثلاثاء',
        period1: 'Machine Learning<br/>Section 1',
        period2: 'Big Data Analytics<br/>Section 1',
        period3: 'Project Consultation',
        period4: ''
      },
      {
        day: 'الاربعاء',
        period1: 'IoT Systems<br/>Section 1',
        period2: 'Cloud Security<br/>Section 1',
        period3: 'Research Colloquium',
        period4: 'Thesis Supervision'
      }
    ],
    examSchedule: [
      {
        day: 'السبت',
        date: '23-3-2025',
        period1: 'Machine Learning',
        period2: 'Big Data Analytics',
        period3: '',
        location: 'قاعة 401 - مبنى الدراسات العليا'
      },
      {
        day: 'الاحد',
        date: '24-3-2025',
        period1: 'Cloud Security',
        period2: 'IoT Systems',
        period3: '',
        location: 'قاعة 402 - مبنى الدراسات العليا'
      },
      {
        day: 'الثلاثاء',
        date: '26-3-2025',
        period1: 'Advanced Algorithms',
        period2: 'Distributed Systems',
        period3: '',
        location: 'قاعة 403 - مبنى الدراسات العليا'
      },
      {
        day: 'الاربعاء',
        date: '27-3-2025',
        period1: 'Thesis Defense',
        period2: '',
        period3: '',
        location: 'قاعة المؤتمرات - المبنى الرئيسي'
      }
    ]
  }
];
 studentSchedule: StudentSchedule | null = null;
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadStudentSchedule();
  }

  loadStudentSchedule(): void {
    this.loading = true;
    this.error = null;
    
    try {
      // Get student ID from localStorage
      const studentId =  localStorage.getItem('ID');
      
      if (!studentId) {
        throw new Error('Student ID not found in localStorage');
      }
      
      // Find student schedule in our data
      const foundSchedule = this.studentsSchedules.find(s => s.id === studentId);
      
      if (foundSchedule) {
        this.studentSchedule = foundSchedule;
      } else {
        throw new Error('No schedule data found for this student');
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الجدول الدراسي';
      console.error('Error loading schedule:', err);
    } finally {
      this.loading = false;
    }
  }

  // Helper function to render HTML content safely
  renderHtml(content: string) {
    return { __html: content };
  }
}