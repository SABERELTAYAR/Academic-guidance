import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../guest/auth.service';

// student.model.ts
export interface Course {
  code: string;
  name: string;
  hours: number;
  instructor: string;
}

export interface Student {
  // Personal Information
  arabicName: string;
  englishName: string;
  ID: string;
  admissionYear: string;
  enrollmentDuration: string;
  username: string;
  studentCode: string;
  nationalityCountry: string;
  gender: string;
  religion: string;
  birthDate: string;
  birthPlace: string;
  idType: string;
  maritalStatus: string;
  rfidNumber: string;
  financialSource: string;
  accountDisabled: string;
  notes: string;
  issueDate: string;
  issuePlace: string;
  secondNationality: string;
  feesNationality: string;
  specialNeedsType: string;
  
  // Family Information
  fatherName: string;
  fatherJob: string;
  motherName: string;
  motherJob: string;
  relationDegree: string;
  familyCity: string;
  familyAddress: string;
  familyNationality: string;
  homePhone: string;
  feeReductionReason: string;
  parentPhone: string;
  faxNumber: string;
  siblingsCount: number;
  
  // Education Information
  schoolNameArabic: string;
  schoolNameEnglish: string;
  qualificationType: string;
  graduationYear: string;
  qualificationRound: string;
  qualificationScore: string;
  sat1Score: string;
  seatNumber: string;
  transferApprovalNumber: string;
  admissionType: string;
  certificateNumber: string;
  computerSerialReport: string;
  secondLanguage: string;
  percentage: string;
  qualificationDate: string;
  sat2Score: string;
  transferApprovalDate: string;
  transferredFrom: string;
  schoolAddress: string;
  
  // Academic Information
  faculty: string;
  enrollmentYear: string;
  program: string;
  level: string;
  gpa: string;
  creditHours: string;
  previousYearGPA: string;
  previousYearGrade: string;
  lastCardPrint: string;
  graduationProjectAr: string;
  graduationProjectEn: string;
  courses: Course[];
  
  // Additional fields
  nationality: string;
  universityID: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  height: string;
  weight: string;
  bloodType: string;
  disabilityStatus: string;
  chronicDiseases: string;
  lastMedicalCheckup: string;
  literacyStatus: string;
  literacyExemptionReason: string;
  literacyCenter: string;
  literacyCertificationYear: string;
}
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private students: Student[] =[
 {
  "arabicName": "سعيد عبدالله أحمد",
  "englishName": "Saeed Abdullah Ahmed",
  "ID": "1",
  "admissionYear": "2023",
  "enrollmentDuration": "3 سنة",
  "username": "saeed.ahmed2020",
  "studentCode": "STU201910015",
  "nationalityCountry": "مصر",
  "gender": "ذكر",
  "religion": "مسلم",
  "birthDate": "1998-11-17",
  "birthPlace": "القاهرة",
  "idType": "بطاقة شخصية",
  "maritalStatus": "أعزب",
  "rfidNumber": "RFID202015",
  "financialSource": "ذاتي",
  "accountDisabled": "نشط",
  "notes": "لا يوجد ملاحظات",
  "issueDate": "2019-09-01",
  "issuePlace": "القاهرة",
  "secondNationality": "لا يوجد",
  "feesNationality": "محلي",
  "specialNeedsType": "لا يوجد",
  "fatherName": "عبدالله أحمد محمد",
  "fatherJob": "مهندس",
  "motherName": "فاطمة محمود علي",
  "motherJob": "معلمة",
  "relationDegree": "أب",
  "familyCity": "القاهرة",
  "familyAddress": "123 شارع الجامعة، القاهرة",
  "familyNationality": "مصر",
  "homePhone": "0223456789",
  "feeReductionReason": "لا يوجد",
  "parentPhone": "01012345678",
  "faxNumber": "0223456780",
  "siblingsCount": 2,
  "schoolNameArabic": "مدرسة النصر الثانوية",
  "schoolNameEnglish": "Al-Nasr Secondary School",
  "qualificationType": "ثانوية عامة",
  "graduationYear": "2019",
  "qualificationRound": "أول",
  "qualificationScore": "95%",
  "sat1Score": "1400",
  "seatNumber": "123456",
  "transferApprovalNumber": "",
  "admissionType": "انتظام",
  "certificateNumber": "CER20190001",
  "computerSerialReport": "CSR20190001",
  "secondLanguage": "فرنسي",
  "percentage": "95%",
  "qualificationDate": "2019-07-01",
  "sat2Score": "",
  "transferApprovalDate": "",
  "transferredFrom": "",
  "schoolAddress": "شارع الجلاء، القاهرة، مصر",
  "faculty": "كلية الحاسبات والمعلومات",
  "enrollmentYear": "2019",
  "program": "علوم الحاسب",
  "level": "الثالث",
  "gpa": "3.7",
  "creditHours": "96",
  "previousYearGPA": "3.5",
  "previousYearGrade": "جيد جداً",
  "lastCardPrint": "2023-09-01",
  "graduationProjectAr": "نظام إدارة الطلاب",
  "graduationProjectEn": "Student Management System",
  "courses": [
    {
      "code": "CS301",
      "name": "هياكل البيانات",
      "hours": 3,
      "instructor": "د. محمد أحمد"
    },
    {
      "code": "CS302",
      "name": "قواعد البيانات",
      "hours": 3,
      "instructor": "د. علي محمود"
    },
    {
      "code": "CS303",
      "name": "الذكاء الاصطناعي",
      "hours": 3,
      "instructor": "د. أحمد علي"
    }
  ],
  "nationality": "مصري",
  "universityID": "201910015",
  "email": "student@university.edu",
  "phone": "01010101010",
  "alternatePhone": "01110101010",
  "address": "123 شارع الجامعة، القاهرة، مصر",
  "height": "175 سم",
  "weight": "70 كجم",
  "bloodType": "A+",
  "disabilityStatus": "لا يوجد",
  "chronicDiseases": "لا يوجد",
  "lastMedicalCheckup": "2023-09-15",
  "literacyStatus": "معفى",
  "literacyExemptionReason": "حاصل على شهادة محو أمية",
  "literacyCenter": "مركز محو الأمية بجامعة القاهرة",
  "literacyCertificationYear": "2019"
},
  {
    "arabicName": "أحمد محمد علي",
    "englishName": "Ahmed Mohamed Ali",
    "ID": "2",
    "admissionYear": "2023",
    "enrollmentDuration": "4 سنة",
    "username": "ahmed.ali2023",
    "studentCode": "STU20230001",
    "nationalityCountry": "مصر",
    "gender": "ذكر",
    "religion": "مسلم",
    "birthDate": "2000-01-01",
    "birthPlace": "القاهرة",
    "idType": "بطاقة شخصية",
    "maritalStatus": "أعزب",
    "rfidNumber": "RFID20230001",
    "financialSource": "ذاتي",
    "accountDisabled": "نشط",
    "notes": "لا يوجد ملاحظات",
    "issueDate": "2023-09-01",
    "issuePlace": "القاهرة",
    "secondNationality": "لا يوجد",
    "feesNationality": "محلي",
    "specialNeedsType": "لا يوجد",
    "fatherName": "محمد علي أحمد",
    "fatherJob": "مهندس",
    "motherName": "سميرة محمود حسن",
    "motherJob": "طبيبة",
    "relationDegree": "أب",
    "familyCity": "القاهرة",
    "familyAddress": "10 شارع النصر، القاهرة",
    "familyNationality": "مصر",
    "homePhone": "0223456701",
    "feeReductionReason": "لا يوجد",
    "parentPhone": "01012345001",
    "faxNumber": "0223456700",
    "siblingsCount": 2,
    "schoolNameArabic": "مدرسة القاهرة الثانوية",
    "schoolNameEnglish": "Cairo Secondary School",
    "qualificationType": "ثانوية عامة",
    "graduationYear": "2022",
    "qualificationRound": "أول",
    "qualificationScore": "90%",
    "sat1Score": "1487",
    "seatNumber": "20230001",
    "transferApprovalNumber": "",
    "admissionType": "انتظام",
    "certificateNumber": "CER20230001",
    "computerSerialReport": "CSR20230001",
    "secondLanguage": "ألماني",
    "percentage": "95%",
    "qualificationDate": "2022-07-01",
    "sat2Score": "",
    "transferApprovalDate": "",
    "transferredFrom": "",
    "schoolAddress": "شارع التحرير، القاهرة، مصر",
    "faculty": "كلية الحاسبات والمعلومات",
    "enrollmentYear": "2023",
    "program": "علوم الحاسب",
    "level": "الرابع",
    "gpa": "3.53",
    "creditHours": "120",
    "previousYearGPA": "3.61",
    "previousYearGrade": "جيد جداً",
    "lastCardPrint": "2026-09-01",
    "graduationProjectAr": "نظام ذكي لإدارة الحرم الجامعي",
    "graduationProjectEn": "Smart Campus Management System",
    "courses": [
      {
        "code": "CS401",
        "name": "تعلم الآلة",
        "hours": 3,
        "instructor": "د. محمد عبدالله"
      },
      {
        "code": "CS402",
        "name": "أمن المعلومات",
        "hours": 3,
        "instructor": "د. علي محمود"
      },
      {
        "code": "CS403",
        "name": "الواقع الافتراضي",
        "hours": 3,
        "instructor": "د. أحمد سعيد"
      }
    ],
    "nationality": "مصري",
    "universityID": "20230001",
    "email": "ahmed.ali@university.edu",
    "phone": "01010001001",
    "alternatePhone": "01110001001",
    "address": "10 شارع النصر، القاهرة، مصر",
    "height": "178 سم",
    "weight": "72 كجم",
    "bloodType": "B+",
    "disabilityStatus": "لا يوجد",
    "chronicDiseases": "لا يوجد",
    "lastMedicalCheckup": "2025-08-15",
    "literacyStatus": "معفى",
    "literacyExemptionReason": "حاصل على شهادة محو أمية",
    "literacyCenter": "مركز محو الأمية بجامعة القاهرة",
    "literacyCertificationYear": "2022"
  },
  {
    "arabicName": "فاطمة الزهراء محمود",
    "englishName": "Fatima Al-Zahra Mahmoud",
    "ID": "3",
    "admissionYear": "2025",
    "enrollmentDuration": "4 سنة",
    "username": "fatima.mahmoud2025",
    "studentCode": "STU20250002",
    "nationalityCountry": "مصر",
    "gender": "أنثى",
    "religion": "مسلمة",
    "birthDate": "2000-01-01",
    "birthPlace": "القاهرة",
    "idType": "بطاقة شخصية",
    "maritalStatus": "أعزب",
    "rfidNumber": "RFID20250002",
    "financialSource": "ذاتي",
    "accountDisabled": "نشط",
    "notes": "لا يوجد ملاحظات",
    "issueDate": "2025-09-01",
    "issuePlace": "القاهرة",
    "secondNationality": "لا يوجد",
    "feesNationality": "محلي",
    "specialNeedsType": "لا يوجد",
    "fatherName": "محمد علي أحمد",
    "fatherJob": "مهندس",
    "motherName": "سميرة محمود حسن",
    "motherJob": "طبيبة",
    "relationDegree": "أب",
    "familyCity": "القاهرة",
    "familyAddress": "10 شارع النصر، القاهرة",
    "familyNationality": "مصر",
    "homePhone": "0223456701",
    "feeReductionReason": "لا يوجد",
    "parentPhone": "01012345001",
    "faxNumber": "0223456700",
    "siblingsCount": 1,
    "schoolNameArabic": "مدرسة القاهرة الثانوية",
    "schoolNameEnglish": "Cairo Secondary School",
    "qualificationType": "ثانوية عامة",
    "graduationYear": "2024",
    "qualificationRound": "أول",
    "qualificationScore": "96%",
    "sat1Score": "1407",
    "seatNumber": "20250002",
    "transferApprovalNumber": "",
    "admissionType": "انتظام",
    "certificateNumber": "CER20250002",
    "computerSerialReport": "CSR20250002",
    "secondLanguage": "ألماني",
    "percentage": "91%",
    "qualificationDate": "2024-07-01",
    "sat2Score": "",
    "transferApprovalDate": "",
    "transferredFrom": "",
    "schoolAddress": "شارع التحرير، القاهرة، مصر",
    "faculty": "كلية الحاسبات والمعلومات",
    "enrollmentYear": "2025",
    "program": "علوم الحاسب",
    "level": "الرابع",
    "gpa": "3.84",
    "creditHours": "120",
    "previousYearGPA": "3.54",
    "previousYearGrade": "جيد جداً",
    "lastCardPrint": "2028-09-01",
    "graduationProjectAr": "نظام ذكي لإدارة الحرم الجامعي",
    "graduationProjectEn": "Smart Campus Management System",
    "courses": [
      {
        "code": "CS401",
        "name": "تعلم الآلة",
        "hours": 3,
        "instructor": "د. محمد عبدالله"
      },
      {
        "code": "CS402",
        "name": "أمن المعلومات",
        "hours": 3,
        "instructor": "د. علي محمود"
      },
      {
        "code": "CS403",
        "name": "الواقع الافتراضي",
        "hours": 3,
        "instructor": "د. أحمد سعيد"
      }
    ],
    "nationality": "مصرية",
    "universityID": "20250002",
    "email": "fatima.mahmoud@university.edu",
    "phone": "01010001002",
    "alternatePhone": "01110001002",
    "address": "10 شارع النصر، القاهرة، مصر",
    "height": "165 سم",
    "weight": "58 كجم",
    "bloodType": "A+",
    "disabilityStatus": "لا يوجد",
    "chronicDiseases": "لا يوجد",
    "lastMedicalCheckup": "2027-08-15",
    "literacyStatus": "معفى",
    "literacyExemptionReason": "حاصل على شهادة محو أمية",
    "literacyCenter": "مركز محو الأمية بجامعة القاهرة",
    "literacyCertificationYear": "2024"
  },
{
  "arabicName": "ياسمين حسن عبدالعزيز",
  "englishName": "Yasmin Hassan Abdelaziz",
  "ID": "4",
  "admissionYear": "2024",
  "enrollmentDuration": "4 سنة",
  "username": "yasmin.abdelaziz2024",
  "studentCode": "STU20240004",
  "nationalityCountry": "مصر",
  "gender": "أنثى",
  "religion": "مسلمة",
  "birthDate": "2002-11-15",
  "birthPlace": "دمنهور",
  "idType": "بطاقة شخصية",
  "maritalStatus": "أعزب",
  "rfidNumber": "RFID20240004",
  "financialSource": "منحة دراسية",
  "accountDisabled": "نشط",
  "notes": "متميزة في مشاريع الذكاء الاصطناعي",
  "issueDate": "2024-09-01",
  "issuePlace": "دمنهور",
  "secondNationality": "لا يوجد",
  "feesNationality": "محلي",
  "specialNeedsType": "لا يوجد",
  "fatherName": "حسن عبدالعزيز محمد",
  "fatherJob": "محاسب قانوني",
  "motherName": "منى علي عبد السلام",
  "motherJob": "معلمة",
  "relationDegree": "أب",
  "familyCity": "دمنهور",
  "familyAddress": "12 شارع الجيش، دمنهور",
  "familyNationality": "مصر",
  "homePhone": "0453356789",
  "feeReductionReason": "متفوقة علميًا",
  "parentPhone": "01055551234",
  "faxNumber": "0453356700",
  "siblingsCount": 2,
  "schoolNameArabic": "مدرسة الشهيد الثانوية بنات",
  "schoolNameEnglish": "El Shaheed Secondary School for Girls",
  "qualificationType": "ثانوية عامة",
  "graduationYear": "2023",
  "qualificationRound": "أول",
  "qualificationScore": "98%",
  "sat1Score": "1490",
  "seatNumber": "20240004",
  "transferApprovalNumber": "",
  "admissionType": "انتظام",
  "certificateNumber": "CER20240004",
  "computerSerialReport": "CSR20240004",
  "secondLanguage": "فرنسي",
  "percentage": "98%",
  "qualificationDate": "2023-07-01",
  "sat2Score": "",
  "transferApprovalDate": "",
  "transferredFrom": "",
  "schoolAddress": "شارع الجمهورية، دمنهور، مصر",
  "faculty": "كلية الحاسبات والمعلومات - جامعة دمنهور",
  "enrollmentYear": "2024",
  "program": "علوم الحاسب",
  "level": "الثالث",
  "gpa": "3.92",
  "creditHours": "90",
  "previousYearGPA": "3.85",
  "previousYearGrade": "ممتاز",
  "lastCardPrint": "2027-09-01",
  "graduationProjectAr": "نظام كشف الاحتيال البنكي باستخدام الذكاء الاصطناعي",
  "graduationProjectEn": "AI-Based Bank Fraud Detection System",
  "courses": [
    {
      "code": "CS301",
      "name": "الذكاء الاصطناعي",
      "hours": 3,
      "instructor": "د. أحمد عادل"
    },
    {
      "code": "CS302",
      "name": "معالجة الصور الرقمية",
      "hours": 3,
      "instructor": "د. ياسمين الشرقاوي"
    },
    {
      "code": "CS303",
      "name": "أنظمة التشغيل",
      "hours": 3,
      "instructor": "د. محمد شوقي"
    }
  ],
  "nationality": "مصرية",
  "universityID": "20240004",
  "email": "yasmin.abdelaziz@university.edu",
  "phone": "01022223344",
  "alternatePhone": "01122223344",
  "address": "12 شارع الجيش، دمنهور، مصر",
  "height": "164 سم",
  "weight": "59 كجم",
  "bloodType": "O+",
  "disabilityStatus": "لا يوجد",
  "chronicDiseases": "لا يوجد",
  "lastMedicalCheckup": "2026-08-15",
  "literacyStatus": "معفى",
  "literacyExemptionReason": "حاصل على شهادة محو أمية",
  "literacyCenter": "مركز محو الأمية بجامعة دمنهور",
  "literacyCertificationYear": "2023"
},
{
  "arabicName": "آية محمود عبد الله",
  "englishName": "Aya Mahmoud Abdallah",
  "ID": "5",
  "admissionYear": "2023",
  "enrollmentDuration": "4 سنة",
  "username": "aya.abdallah2023",
  "studentCode": "STU20230005",
  "nationalityCountry": "مصر",
  "gender": "أنثى",
  "religion": "مسلمة",
  "birthDate": "2003-06-10",
  "birthPlace": "طنطا",
  "idType": "بطاقة شخصية",
  "maritalStatus": "أعزب",
  "rfidNumber": "RFID20230005",
  "financialSource": "ذاتي",
  "accountDisabled": "نشط",
  "notes": "تشارك في الأنشطة الطلابية",
  "issueDate": "2023-09-01",
  "issuePlace": "طنطا",
  "secondNationality": "لا يوجد",
  "feesNationality": "محلي",
  "specialNeedsType": "لا يوجد",
  "fatherName": "محمود عبد الله عبد العزيز",
  "fatherJob": "مدير مالي",
  "motherName": "فاطمة سعيد عبد الفتاح",
  "motherJob": "صيدلانية",
  "relationDegree": "أب",
  "familyCity": "طنطا",
  "familyAddress": "24 شارع الجلاء، طنطا",
  "familyNationality": "مصر",
  "homePhone": "0403321122",
  "feeReductionReason": "لا يوجد",
  "parentPhone": "01099998877",
  "faxNumber": "0403321100",
  "siblingsCount": 3,
  "schoolNameArabic": "مدرسة البنات النموذجية",
  "schoolNameEnglish": "Model Girls School",
  "qualificationType": "ثانوية عامة",
  "graduationYear": "2022",
  "qualificationRound": "أول",
  "qualificationScore": "95%",
  "sat1Score": "1385",
  "seatNumber": "20230005",
  "transferApprovalNumber": "",
  "admissionType": "انتظام",
  "certificateNumber": "CER20230005",
  "computerSerialReport": "CSR20230005",
  "secondLanguage": "إسباني",
  "percentage": "95%",
  "qualificationDate": "2022-07-01",
  "sat2Score": "",
  "transferApprovalDate": "",
  "transferredFrom": "",
  "schoolAddress": "شارع الجيش، طنطا، مصر",
  "faculty": "كلية الحاسبات والمعلومات - جامعة دمنهور",
  "enrollmentYear": "2023",
  "program": "علوم الحاسب",
  "level": "الثاني",
  "gpa": "3.77",
  "creditHours": "60",
  "previousYearGPA": "3.60",
  "previousYearGrade": "جيد جداً",
  "lastCardPrint": "2025-09-01",
  "graduationProjectAr": "نظام تصنيف الأخبار باستخدام تعلم الآلة",
  "graduationProjectEn": "News Classification System Using Machine Learning",
  "courses": [
    {
      "code": "CS201",
      "name": "هياكل البيانات",
      "hours": 3,
      "instructor": "د. حسام فؤاد"
    },
    {
      "code": "CS202",
      "name": "البرمجة كائنية التوجه",
      "hours": 3,
      "instructor": "د. إيمان عبد الرحيم"
    },
    {
      "code": "CS203",
      "name": "الرياضيات المتقدمة للحاسبات",
      "hours": 3,
      "instructor": "د. خالد الصاوي"
    }
  ],
  "nationality": "مصرية",
  "universityID": "20230005",
  "email": "aya.abdallah@university.edu",
  "phone": "01088887766",
  "alternatePhone": "01188887766",
  "address": "24 شارع الجلاء، طنطا، مصر",
  "height": "162 سم",
  "weight": "55 كجم",
  "bloodType": "B+",
  "disabilityStatus": "لا يوجد",
  "chronicDiseases": "لا يوجد",
  "lastMedicalCheckup": "2024-08-15",
  "literacyStatus": "معفى",
  "literacyExemptionReason": "حاصل على شهادة محو أمية",
  "literacyCenter": "مركز محو الأمية بجامعة دمنهور",
  "literacyCertificationYear": "2022"
}


];
private studentsSubject = new BehaviorSubject<Student[]>(this.students);

getStudentsObservable() {
    return this.studentsSubject.asObservable();
  }
  getStudents(): Student[] {
    return this.students;
  }

  getStudentById(id: string): Student | undefined {
    return this.students.find(s => s.ID === id);
  }

  updateStudent(updatedStudent: Student): void {
    const index = this.students.findIndex(s => s.ID === updatedStudent.ID);
    if (index !== -1) {
      this.students[index] = updatedStudent;
      this.studentsSubject.next([...this.students]); // Emit updated list
    }
  }

  addStudent(newStudent: Student): void {
    this.students.push(newStudent);
  }

  deleteStudent(id: string): void {
    this.students = this.students.filter(s => s.ID !== id);
  }


}
