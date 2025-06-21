import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FootAdminComponent } from "../foot-admin/foot-admin.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

interface Course {
  id: string;
  name: string;
  level: string;
}

interface ScheduleItem {
  id?: string; // Added for editing
  courseId: string;
  day: string;
  time: string;
  room: string;
  instructor: string;
  type: 'lecture' | 'section';
}

@Component({
  selector: 'app-study-schedule',
  imports: [CommonModule, FootAdminComponent,ReactiveFormsModule],
  templateUrl: './study-schedule.component.html',
  styleUrl: './study-schedule.component.css'
})


export class StudyScheduleComponent {
 
   selectedCourse: Course | null = null;
  selectedSchedule: ScheduleItem | null = null;
  isEditing = false;
  isAdding = false;
  scheduleForm: FormGroup;
  editForm: FormGroup;
  courseLevels: {[key: string]: Course[]} = {};
  // Sample courses data organized by level
coursesData: Course[] = [
  // المستوي الأول
  { id: 'personal-communication', name: 'التواصل الشخصي', level: 'المستوي الأول' },
  { id: 'english-language', name: 'لغة إنجليزية', level: 'المستوي الأول' },
  { id: 'computer-laws', name: 'قوانين الحاسب', level: 'المستوي الأول' },
  { id: 'mathematics-1', name: 'رياضيات 1', level: 'المستوي الأول' },
  { id: 'physics', name: 'الفيزياء', level: 'المستوي الأول' },
  { id: 'electronics', name: 'الإلكترونيات', level: 'المستوي الأول' },
  { id: 'introduction-to-computer-science', name: 'مقدمة في علوم الحاسب', level: 'المستوي الأول' },
  { id: 'programming-1', name: 'برمجة 1', level: 'المستوي الأول' },
  { id: 'computer-skills', name: 'مهارات الحاسب', level: 'المستوي الأول' },

  // المستوي الثاني
  { id: 'data-structures', name: 'هياكل البيانات', level: 'المستوي الثاني' },
  { id: 'algorithms', name: 'الخوارزميات', level: 'المستوي الثاني' },
  { id: 'programming-2', name: 'برمجة 2', level: 'المستوي الثاني' },
  { id: 'mathematics-2', name: 'رياضيات 2', level: 'المستوي الثاني' },
  { id: 'digital-logic', name: 'المنطق الرقمي', level: 'المستوي الثاني' },
  { id: 'computer-organization', name: 'تنظيم الحاسبات', level: 'المستوي الثاني' },
  { id: 'database-1', name: 'قواعد بيانات 1', level: 'المستوي الثاني' },
  { id: 'statistics', name: 'الإحصاء', level: 'المستوي الثاني' },

  // المستوي الثالث
  { id: 'operating-systems', name: 'نظم التشغيل', level: 'المستوي الثالث' },
  { id: 'computer-networks', name: 'شبكات الحاسب', level: 'المستوي الثالث' },
  { id: 'database-2', name: 'قواعد بيانات 2', level: 'المستوي الثالث' },
  { id: 'software-engineering', name: 'هندسة البرمجيات', level: 'المستوي الثالث' },
  { id: 'web-development', name: 'تطوير الويب', level: 'المستوي الثالث' },
  { id: 'artificial-intelligence', name: 'الذكاء الاصطناعي', level: 'المستوي الثالث' },
  { id: 'computer-graphics', name: 'رسوميات الحاسب', level: 'المستوي الثالث' },
  { id: 'theory-of-computation', name: 'نظرية الحوسبة', level: 'المستوي الثالث' },

  // المستوي الرابع
  { id: 'distributed-systems', name: 'النظم الموزعة', level: 'المستوي الرابع' },
  { id: 'compiler-design', name: 'تصميم المترجمات', level: 'المستوي الرابع' },
  { id: 'information-security', name: 'أمن المعلومات', level: 'المستوي الرابع' },
  { id: 'data-mining', name: 'تنقيب البيانات', level: 'المستوي الرابع' },
  { id: 'machine-learning', name: 'تعلم الآلة', level: 'المستوي الرابع' },
  { id: 'cloud-computing', name: 'الحوسبة السحابية', level: 'المستوي الرابع' },
  { id: 'mobile-development', name: 'تطوير التطبيقات النقالة', level: 'المستوي الرابع' },
  { id: 'graduation-project', name: 'مشروع التخرج', level: 'المستوي الرابع' },
  { id: 'professional-ethics', name: 'أخلاقيات المهنة', level: 'المستوي الرابع' }
];

  // Sample schedule data
 // Sample schedule data
scheduleData: ScheduleItem[] = [
  // المستوي الأول schedules
  {
    id: '1',
    courseId: 'personal-communication',
    day: 'الأحد',
    time: '08:00 - 10:00',
    room: 'قاعة 101',
    instructor: 'د. أحمد محمد',
    type: 'lecture'
  },
  {
    id:'2',
    courseId: 'personal-communication',
    day: 'الثلاثاء',
    time: '10:00 - 12:00',
    room: 'قاعة 102',
    instructor: 'د. أحمد محمد',
    type: 'section'
  },
  {
    courseId: 'english-language',
    day: 'الإثنين',
    time: '09:00 - 11:00',
    room: 'قاعة 201',
    instructor: 'د. سارة علي',
    type: 'lecture'
  },
  {
    courseId: 'english-language',
    day: 'الأربعاء',
    time: '11:00 - 13:00',
    room: 'قاعة 202',
    instructor: 'أ. محمد حسن',
    type: 'section'
  },
  {
    courseId: 'computer-laws',
    day: 'الأحد',
    time: '13:00 - 15:00',
    room: 'قاعة 301',
    instructor: 'د. خالد عبدالله',
    type: 'lecture'
  },
  {
    courseId: 'mathematics-1',
    day: 'الاثنين',
    time: '10:00 - 12:00',
    room: 'قاعة 302',
    instructor: 'د. محمود سعيد',
    type: 'lecture'
  },
  {
    courseId: 'mathematics-1',
    day: 'الأربعاء',
    time: '08:00 - 10:00',
    room: 'قاعة 303',
    instructor: 'د. محمود سعيد',
    type: 'section'
  },
  {
    courseId: 'introduction-to-computer-science',
    day: 'الثلاثاء',
    time: '13:00 - 15:00',
    room: 'معمل 101',
    instructor: 'د. علي محمود',
    type: 'lecture'
  },

  // المستوي الثاني schedules
  {
    courseId: 'data-structures',
    day: 'الأحد',
    time: '10:00 - 12:00',
    room: 'قاعة 401',
    instructor: 'د. نادية فاروق',
    type: 'lecture'
  },
  {
    courseId: 'data-structures',
    day: 'الثلاثاء',
    time: '08:00 - 10:00',
    room: 'معمل 201',
    instructor: 'د. نادية فاروق',
    type: 'section'
  },
  {
    courseId: 'algorithms',
    day: 'الإثنين',
    time: '13:00 - 15:00',
    room: 'قاعة 402',
    instructor: 'د. وائل كمال',
    type: 'lecture'
  },
  {
    courseId: 'database-1',
    day: 'الأربعاء',
    time: '10:00 - 12:00',
    room: 'معمل 202',
    instructor: 'د. هبة الله',
    type: 'lecture'
  },
  {
    courseId: 'database-1',
    day: 'السبت',
    time: '09:00 - 11:00',
    room: 'معمل 202',
    instructor: 'د. هبة الله',
    type: 'section'
  },

  // المستوي الثالث schedules
  {
    courseId: 'operating-systems',
    day: 'الأحد',
    time: '13:00 - 15:00',
    room: 'قاعة 501',
    instructor: 'د. عماد الدين',
    type: 'lecture'
  },
  {
    courseId: 'computer-networks',
    day: 'الثلاثاء',
    time: '10:00 - 12:00',
    room: 'معمل 301',
    instructor: 'د. ياسر عبدالرحمن',
    type: 'lecture'
  },
  {
    courseId: 'artificial-intelligence',
    day: 'الإثنين',
    time: '08:00 - 10:00',
    room: 'قاعة 502',
    instructor: 'د. منى سليمان',
    type: 'lecture'
  },
  {
    courseId: 'web-development',
    day: 'الأربعاء',
    time: '13:00 - 15:00',
    room: 'معمل 302',
    instructor: 'د. أحمد عصام',
    type: 'lecture'
  },

  // المستوي الرابع schedules
  {
    courseId: 'information-security',
    day: 'الأحد',
    time: '10:00 - 12:00',
    room: 'قاعة 601',
    instructor: 'د. محمد ناصر',
    type: 'lecture'
  },
  {
    courseId: 'machine-learning',
    day: 'الثلاثاء',
    time: '13:00 - 15:00',
    room: 'معمل 401',
    instructor: 'د. إيمان عبدالحميد',
    type: 'lecture'
  },
  {
    courseId: 'cloud-computing',
    day: 'الإثنين',
    time: '09:00 - 11:00',
    room: 'قاعة 602',
    instructor: 'د. خالد سامي',
    type: 'lecture'
  },
  {
    courseId: 'graduation-project',
    day: 'الأربعاء',
    time: '11:00 - 13:00',
    room: 'قاعة المشاريع',
    instructor: 'د. علياء محمد',
    type: 'section'
  }
];

days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  scheduleTypes = ['lecture', 'section'];
  constructor(private fb: FormBuilder) {
    this.scheduleForm = this.fb.group({
      studyType: ['lecture']
    });
    this.editForm = this.fb.group({
      day: ['', Validators.required],
      time: ['', Validators.required],
      room: ['', Validators.required],
      instructor: ['', Validators.required],
      type: ['lecture', Validators.required]
    });

    this.organizeCoursesByLevel();
  }


  private organizeCoursesByLevel(): void {
    this.courseLevels = this.coursesData.reduce((acc, course) => {
      if (!acc[course.level]) {
        acc[course.level] = [];
      }
      acc[course.level].push(course);
      return acc;
    }, {} as {[key: string]: Course[]});
  }

  selectCourse(name: string, id: string): void {
   

    this.selectedCourse = { name, id, level: '' }; // Level not needed for selection
  }

  getFilteredSchedule(): ScheduleItem[] {
    if (!this.selectedCourse) return [];
    
    const studyType = this.scheduleForm.get('studyType')?.value;
    
    return this.scheduleData.filter(item => 
      item.courseId === this.selectedCourse?.id && 
      (studyType === 'all' || item.type === studyType)
    );
  }

  getLevels(): string[] {
    return Object.keys(this.courseLevels);
  }

  getCoursesByLevel(level: string): Course[] {
    return this.courseLevels[level] || [];
  }
  addSchedule(): void {
    this.isAdding = true;
    this.selectedSchedule = null;
    this.editForm.reset({
      type: 'lecture'
    });
  }

  // Edit existing schedule item
  editSchedule(schedule: ScheduleItem): void {
    this.isEditing = true;
    this.isAdding = false;
    this.selectedSchedule = schedule;
    this.editForm.patchValue({
      day: schedule.day,
      time: schedule.time,
      room: schedule.room,
      instructor: schedule.instructor,
      type: schedule.type
    });
  }

  // Delete schedule item
  deleteSchedule(schedule: ScheduleItem): void {
    const index = this.scheduleData.findIndex(s => s === schedule);
    if (index !== -1) {
      this.scheduleData.splice(index, 1);
    }
  }

  // Submit form (for both add and edit)
  submitSchedule(): void {
    if (this.editForm.invalid || !this.selectedCourse) return;

    const formValue = this.editForm.value;
    const newSchedule: ScheduleItem = {
      courseId: this.selectedCourse.id,
      day: formValue.day,
      time: formValue.time,
      room: formValue.room,
      instructor: formValue.instructor,
      type: formValue.type
    };

    if (this.isEditing && this.selectedSchedule) {
      // Update existing
      const index = this.scheduleData.findIndex(s => s === this.selectedSchedule);
      if (index !== -1) {
        this.scheduleData[index] = { ...this.selectedSchedule, ...newSchedule };
      }
    } else {
      // Add new
      this.scheduleData.push(newSchedule);
    }

    this.cancelEdit();
  }

  // Cancel editing/adding
  cancelEdit(): void {
    this.isEditing = false;
    this.isAdding = false;
    this.selectedSchedule = null;
    this.editForm.reset();
  }
}