# EQBAL Educational Platform API Documentation

**Version:** 1.0  
**Last Updated:** 2025-06-08

---

## Table of Contents

1. [Authentication](#authentication)
2. [Admin APIs](#admin-apis)
3. [Professor APIs](#professor-apis)
4. [Assistant APIs](#assistant-apis)
5. [Student APIs](#student-apis)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

---

## Authentication

### Register User

**Endpoint:** `POST /accounts/register/`

**Request Body:**
```json
{
    "username": "string",
    "password": "string",
    "password2": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "user_type": "string"  // admin, professor, assistant, student
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "username": "string",
        "email": "string",
        "first_name": "string",
        "last_name": "string",
        "user_type": "string"
    },
    "refresh": "string",
    "access": "string"
}
```

**Error Response:**
```json
{
    "error": "string",
    "detail": {
        "username": ["string"],
        "password": ["string"],
        "email": ["string"]
    }
}
```

### Login User

**Endpoint:** `POST /accounts/login/`

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "username": "string",
        "email": "string",
        "first_name": "string",
        "last_name": "string",
        "user_type": "string"
    },
    "refresh": "string",
    "access": "string"
}
```

**Error Response:**
```json
{
    "error": "Invalid credentials",
    "detail": "string"
}
```

### Refresh Token

**Endpoint:** `POST /accounts/token/refresh/`

**Request Body:**
```json
{
    "refresh": "string"
}
```

**Response:**
```json
{
    "access": "string"
}
```

**Error Response:**
```json
{
    "error": "Token is invalid or expired",
    "detail": "string"
}
```

### Get User Profile

**Endpoint:** `GET /accounts/profile/`

**Response:**
```json
{
    "id": 1,
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "user_type": "string",
    "profile": {
        "full_name": "string",
        "email": "string",
        "phone_number": "string",
        "department": "string"
    }
}
```

**Error Response:**
```json
{
    "error": "Authentication required",
    "detail": "string"
}
```

### Update User Profile

**Endpoint:** `PUT /accounts/profile/`

**Request Body:**
```json
{
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "profile": {
        "full_name": "string",
        "email": "string",
        "phone_number": "string",
        "department": "string"
    }
}
```

**Response:**
```json
{
    "id": 1,
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "user_type": "string",
    "profile": {
        "full_name": "string",
        "email": "string",
        "phone_number": "string",
        "department": "string"
    }
}
```

**Error Response:**
```json
{
    "error": "Authentication required",
    "detail": "string"
}
```

### Change Password

**Endpoint:** `POST /accounts/change-password/`

**Request Body:**
```json
{
    "old_password": "string",
    "new_password": "string",
    "new_password2": "string"
}
```

**Response:**
```json
{
    "message": "Password changed successfully"
}
```

**Error Response:**
```json
{
    "error": "Invalid password",
    "detail": {
        "old_password": ["string"],
        "new_password": ["string"]
    }
}
```

### Request Password Reset

**Endpoint:** `POST /accounts/reset-password-email/`

**Request Body:**
```json
{
    "email": "string"
}
```

**Response:**
```json
{
    "message": "Password reset email sent"
}
```

**Error Response:**
```json
{
    "error": "User not found",
    "detail": "string"
}
```

### Reset Password

**Endpoint:** `POST /accounts/reset-password/<token>/`

**Request Body:**
```json
{
    "token": "string",
    "new_password": "string",
    "new_password2": "string"
}
```

**Response:**
```json
{
    "message": "Password reset successfully"
}
```

**Error Response:**
```json
{
    "error": "Invalid or expired token",
    "detail": "string"
}
```

---

## Admin APIs

### Register

**Endpoint:** `POST /accounts/register/`

**Request Body:**
```json
{
    "username": "string",
    "email": "user@example.com",
    "password": "string",
    "password2": "string",
    "first_name": "string",
    "last_name": "string",
    "user_type": "admin/professor/assistant/student"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "username": "string",
        "email": "user@example.com",
        "user_type": "string"
    },
    "refresh": "string",
    "access": "string"
}
```

### Login

**Endpoint:** `POST /accounts/login/`

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "username": "string",
        "email": "user@example.com",
        "user_type": "string"
    },
    "refresh": "string",
    "access": "string"
}
```

### Token Refresh

**Endpoint:** `POST /accounts/token/refresh/`

**Request Body:**
```json
{
    "refresh": "string"
}
```

### Profile

**Endpoint:** `GET /accounts/profile/`

**Response:**
```json
{
    "id": 1,
    "username": "string",
    "email": "user@example.com",
    "first_name": "string",
    "last_name": "string",
    "user_type": "string"
}
```

### Change Password

**Endpoint:** `POST /accounts/change-password/`

**Request Body:**
```json
{
    "old_password": "string",
    "new_password": "string",
    "confirm_new_password": "string"
}
```

### Reset Password

**Endpoint:** `POST /accounts/reset-password-email/`

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

**Endpoint:** `POST /accounts/reset-password/<token>/`

**Request Body:**
```json
{
    "new_password": "string",
    "confirm_new_password": "string"
}
```

---

## Admin APIs

### User Management

#### List Users

**Endpoint:** `GET /accounts/admin/users/`

**Query Parameters:**
- `user_type`: Filter by user type (admin, professor, assistant, student)
- `is_active`: Filter by active status (true/false)
- `search`: Search by username, email, or full name
- `ordering`: Order by any field (e.g., username, email)

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/admin/users/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "username": "string",
            "email": "string",
            "first_name": "string",
            "last_name": "string",
            "user_type": "string",
            "is_active": true,
            "profile": {
                "full_name": "string",
                "email": "string",
                "phone_number": "string",
                "department": "string"
            }
        }
    ]
}
```

#### Create User

**Endpoint:** `POST /accounts/admin/users/`

**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
    "first_name": "string",
    "last_name": "string",
    "user_type": "string",
    "is_active": true
}
```

#### Update User

**Endpoint:** `PUT /accounts/admin/users/<id>/`

**Request Body:**
```json
{
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "user_type": "string",
    "is_active": true
}
```

### Course Management

#### List Courses

**Endpoint:** `GET /accounts/admin/courses/`

**Query Parameters:**
- `department`: Filter by department
- `level`: Filter by course level
- `search`: Search by course code or title

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/admin/courses/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "code": "string",
            "title": "string",
            "credit_hours": 3,
            "department": "string",
            "level": "string"
        }
    ]
}
```---

## Professor APIs

### Course Management

#### List Professor Courses

**Endpoint:** `GET /accounts/professor/courses/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/professor/courses/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "course": {
                "id": 1,
                "code": "string",
                "title": "string"
            },
            "semester": "string",
            "year": "string",
            "is_primary_instructor": true
        }
    ]
}
```

#### List Professor Schedules

**Endpoint:** `GET /accounts/professor/schedules/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `day`: Filter by day of week

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/professor/schedules/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "course": {
                "id": 1,
                "title": "string"
            },
            "classroom": {
                "id": 1,
                "name": "string"
            },
            "time_slot": {
                "id": 1,
                "start_time": "string",
                "end_time": "string"
            },
            "day": "string",
            "semester": "string",
            "academic_year": "string"
        }
    ]
}
```

### Course Enrollment Management

#### List Course Enrollments

**Endpoint:** `GET /accounts/professor/course-enrollments/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `course`: Filter by course ID
- `status`: Filter by enrollment status

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/professor/course-enrollments/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "student": {
                "id": 1,
                "full_name": "string"
            },
            "course": {
                "id": 1,
                "code": "string",
                "title": "string"
            },
            "semester": "string",
            "year": "string",
            "grade": "string",
            "status": "string"
        }
    ]
}
```

### Schedule Enrollment Management

#### List Schedule Enrollments

**Endpoint:** `GET /accounts/professor/schedule-enrollments/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `schedule`: Filter by schedule ID
- `status`: Filter by enrollment status

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/professor/schedule-enrollments/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "student": {
                "id": 1,
                "full_name": "string"
            },
            "schedule": {
                "id": 1,
                "course": {
                    "id": 1,
                    "code": "string",
                    "title": "string"
                }
            },
            "semester": "string",
## Student APIs

### Course Enrollment Management

#### List Student Enrollments

**Endpoint:** `GET /accounts/student/enrollments/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `course`: Filter by course ID
- `status`: Filter by enrollment status

**Response:**
```json
{
    "count": 10,
    "next": "string",
    "previous": "string",
    "results": [
        {
            "id": 1,
            "course": {
                "id": 1,
                "title": "string",
                "code": "string",
                "credit_hours": 3
            },
            "semester": "string",
            "year": "string",
            "grade": "string",
            "status": "string"
        }
    ]
}

#### Enroll in Course

**Endpoint:** `POST /accounts/student/enrollments/`

**Request Body:**
```json
{
    "course": "integer",
    "semester": "string",
    "year": "string"
}
```

**Response:**
```json
{
    "id": 1,
    "course": {
        "id": 1,
        "title": "string",
        "code": "string",
        "credit_hours": 3
    },
    "semester": "string",
    "year": "string",
    "status": "string"
}

#### Withdraw from Course

**Endpoint:** `DELETE /accounts/student/enrollments/<id>/`

**Response:**
```json
{
    "message": "Successfully withdrawn from course"
}

### Available Courses

#### List Available Courses

**Endpoint:** `GET /accounts/student/available-courses/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `department`: Filter by department
- `level`: Filter by course level

**Response:**
```json
{
    "count": 10,
    "next": "string",
    "previous": "string",
    "results": [
        {
            "id": 1,
            "code": "string",
            "title": "string",
            "credit_hours": 3,
            "department": "string",
            "level": "string"
        }
    ]
}

### Schedule Management

#### List Student Schedules

**Endpoint:** `GET /accounts/student/schedules/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `day`: Filter by day of week

**Response:**
```json
{
    "count": 10,
    "next": "string",
    "previous": "string",
    "results": [
        {
            "id": 1,
            "course": {
                "id": 1,
                "title": "string",
                "code": "string"
            },
            "professor": {
                "id": 1,
                "full_name": "string"
            },
            "classroom": {
                "id": 1,
                "name": "string",
                "building": "string"
            },
            "time_slot": {
                "id": 1,
                "start_time": "string",
                "end_time": "string"
            },
            "day": "string",
            "semester": "string",
            "academic_year": "string",
            "is_active": true
        }
    ]
}

#### List Course Schedules

**Endpoint:** `GET /accounts/student/course-schedules/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `course`: Filter by course ID

**Response:**
```json
{
    "count": 10,
    "next": "string",
    "previous": "string",
    "results": [
        {
            "id": 1,
            "course": {
                "id": 1,
                "title": "string",
                "code": "string"
            },
            "professor": {
                "id": 1,
                "full_name": "string"
            },
            "classroom": {
                "id": 1,
                "name": "string",
                "building": "string"
            },
            "time_slot": {
                "id": 1,
                "start_time": "string",
                "end_time": "string"
            },
            "day": "string",
            "semester": "string",
    ]
}
```

### Course Assistance Management

#### List Course Assistance

**Endpoint:** `GET /accounts/admin/course-assistance/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `assistant`: Filter by assistant ID
- `professor`: Filter by professor ID
- `course`: Filter by course ID

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/admin/course-assistance/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "assistant": {
                "id": 1,
                "full_name": "string"
            },
            "professor": {
                "id": 1,
                "full_name": "string"
            },
            "course": {
                "id": 1,
                "code": "string",
                "title": "string"
            },
            "semester": "string",
            "year": "string",
            "responsibilities": "string"
        }
    ]
}
```

### Course Enrollment Management

#### List Course Enrollments

**Endpoint:** `GET /accounts/admin/course-enrollment/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `student`: Filter by student ID
- `course`: Filter by course ID
- `status`: Filter by enrollment status

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/admin/course-enrollment/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "student": {
                "id": 1,
                "full_name": "string"
            },
            "course": {
                "id": 1,
                "code": "string",
                "title": "string"
            },
            "semester": "string",
            "year": "string",
            "grade": "string",
            "status": "string"
        }
    ]
}
```

### Classroom Management

#### List Classrooms

**Endpoint:** `GET /accounts/admin/classrooms/`

**Query Parameters:**
- `building`: Filter by building
- `floor`: Filter by floor
- `room_type`: Filter by room type

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/admin/classrooms/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "string",
            "building": "string",
            "floor": "string",
            "room_type": "string",
            "capacity": 30,
            "has_projector": true,
            "has_computer": true
        }
    ]
}
```

### Time Slot Management

#### List Time Slots

**Endpoint:** `GET /accounts/admin/time-slots/`

**Query Parameters:**
- `slot_type`: Filter by slot type
- `is_active`: Filter by active status

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/admin/time-slots/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "start_time": "string",
            "end_time": "string",
            "slot_type": "string",
            "is_active": true
        }
    ]
}
```

### Study Schedule Management

#### List Study Schedules

**Endpoint:** `GET /accounts/admin/schedules/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by academic year
- `professor`: Filter by professor ID
- `course`: Filter by course ID
- `day`: Filter by day of week
- `is_active`: Filter by active status

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/admin/schedules/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "course": {
                "id": 1,
                "code": "string",
                "title": "string"
            },
            "professor": {
                "id": 1,
                "full_name": "string"
            },
            "classroom": {
                "id": 1,
                "name": "string"
            },
            "time_slot": {
                "id": 1,
                "start_time": "string",
                "end_time": "string"
            },
            "day": "string",
            "semester": "string",
            "academic_year": "string",
            "is_active": true
        }
    ]
}
```

### Schedule Change Management

#### List Schedule Changes

**Endpoint:** `GET /accounts/admin/schedule-changes/`

**Query Parameters:**
- `schedule`: Filter by schedule ID
- `change_type`: Filter by change type
- `notification_sent`: Filter by notification status

**Response:**
```json
{
    "count": 10,
    "next": "http://api.example.com/accounts/admin/schedule-changes/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "schedule": {
                "id": 1
            },
            "change_type": "string",
            "new_date": "string",
            "new_time_slot": {
                "id": 1
            },
            "new_classroom": {
                "id": 1
            },
            "new_professor": {
                "id": 1
            },
            "reason": "string",
            "notification_sent": true
        }
    ]
}

### Course Management

#### List Courses

**Endpoint:** `GET /accounts/admin/courses/`

**Query Parameters:**
- `department`: Filter by department
- `level`: Filter by level (Undergraduate/Graduate)

---

## Professor APIs

### Course Management

#### List Professor's Courses

**Endpoint:** `GET /accounts/professor/courses/`

**Query Parameters:**
- `semester`: Filter by semester
- `year`: Filter by year
- `is_primary`: Filter by primary instructor status

#### View Course Details

**Endpoint:** `GET /accounts/professor/courses/{course_id}/`

---

## Assistant APIs

### Schedule Management

#### View Schedule

**Endpoint:** `GET /accounts/assistant/schedule/`

**Query Parameters:**
- `date_from`: Start date
- `date_to`: End date

---

## Student APIs

### Course Enrollment

#### List Available Courses

**Endpoint:** `GET /accounts/student/available-courses/`

**Query Parameters:**
- `semester`: Current semester
- `year`: Current year
- `department`: Filter by department
- `level`: Filter by level

#### Enroll in Course

**Endpoint:** `POST /accounts/student/enrollments/`

**Request Body:**
```json
{
    "course": 1,
    "semester": "first",
    "year": "2024"
}
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
    "error": "validation_error",
    "message": "Invalid input data",
    "details": {
        "field_name": [
            "Error message"
        ]
    }
}
```

#### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

#### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

#### 404 Not Found
```json
{
    "detail": "Requested resource not found."
}
```

---

## Error Handling

### Common Error Responses

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Example Error Response
```json
{
    "error": "string",
    "detail": "string"
}
```

---

## Best Practices

### Authentication
- All requests (except login and register) must include an Authorization header:

### Admin APIs
- GET /accounts/admin/users/
- POST /accounts/admin/users/
- PUT /accounts/admin/users/<id>/
- DELETE /accounts/admin/users/<id>/
- GET /accounts/admin/courses/
- POST /accounts/admin/courses/
- PUT /accounts/admin/courses/<id>/
- DELETE /accounts/admin/courses/<id>/
- GET /accounts/admin/course-teaching/
- POST /accounts/admin/course-teaching/
- PUT /accounts/admin/course-teaching/<id>/
- DELETE /accounts/admin/course-teaching/<id>/
- GET /accounts/admin/course-assistance/
- POST /accounts/admin/course-assistance/
- PUT /accounts/admin/course-assistance/<id>/
- DELETE /accounts/admin/course-assistance/<id>/
- GET /accounts/admin/course-enrollment/
- POST /accounts/admin/course-enrollment/
- PUT /accounts/admin/course-enrollment/<id>/
- DELETE /accounts/admin/course-enrollment/<id>/
- GET /accounts/admin/classrooms/
- POST /accounts/admin/classrooms/
- PUT /accounts/admin/classrooms/<id>/
- DELETE /accounts/admin/classrooms/<id>/
- GET /accounts/admin/time-slots/
- POST /accounts/admin/time-slots/
- PUT /accounts/admin/time-slots/<id>/
- DELETE /accounts/admin/time-slots/<id>/
- GET /accounts/admin/schedules/
- POST /accounts/admin/schedules/
- PUT /accounts/admin/schedules/<id>/
- DELETE /accounts/admin/schedules/<id>/
- GET /accounts/admin/schedule-changes/
- POST /accounts/admin/schedule-changes/
- PUT /accounts/admin/schedule-changes/<id>/
- DELETE /accounts/admin/schedule-changes/<id>/

### Professor APIs
- GET /accounts/professor/courses/
- GET /accounts/professor/schedules/
- GET /accounts/professor/course-enrollments/
- PUT /accounts/professor/course-enrollments/<id>/
- GET /accounts/professor/schedule-enrollments/
- PUT /accounts/professor/schedule-enrollments/<id>/

### Assistant APIs
- GET /accounts/assistant/courses/
- GET /accounts/assistant/schedules/
- GET /accounts/assistant/course-enrollments/
- GET /accounts/assistant/schedule-enrollments/

### Student APIs
- GET /accounts/student/enrollments/
- POST /accounts/student/enrollments/
- DELETE /accounts/student/enrollments/<id>/
- GET /accounts/student/available-courses/
- GET /accounts/student/schedules/
- GET /accounts/student/course-schedules/

---
