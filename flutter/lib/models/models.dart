class User {
  final String id;
  final String? email;
  final String? fullName;
  final String role;
  final String status;
  final String? avatarUrl;
  final int xp;
  final int level;
  final int currentStreak;

  User({
    required this.id,
    this.email,
    this.fullName,
    required this.role,
    required this.status,
    this.avatarUrl,
    this.xp = 0,
    this.level = 1,
    this.currentStreak = 0,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'],
      fullName: json['fullName'],
      role: json['role'] ?? 'student',
      status: json['status'] ?? 'active',
      avatarUrl: json['avatarUrl'],
      xp: json['xp'] ?? 0,
      level: json['level'] ?? 1,
      currentStreak: json['currentStreak'] ?? 0,
    );
  }
}

class Course {
  final String id;
  final String title;
  final String? description;
  final String? thumbnailUrl;
  final String teacherId;
  final String? teacherName;
  final String status;
  final int estimatedMinutes;
  final String difficulty;
  final String subject;
  final String? gradeLevel;

  Course({
    required this.id,
    required this.title,
    this.description,
    this.thumbnailUrl,
    required this.teacherId,
    this.teacherName,
    required this.status,
    this.estimatedMinutes = 0,
    this.difficulty = 'beginner',
    this.subject = '',
    this.gradeLevel,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      thumbnailUrl: json['thumbnailUrl'],
      teacherId: json['teacherId'] ?? '',
      teacherName: json['teacherName'],
      status: json['status'] ?? 'published',
      estimatedMinutes: json['estimatedMinutes'] ?? 0,
      difficulty: json['difficulty'] ?? 'beginner',
      subject: json['subject'] ?? '',
      gradeLevel: json['gradeLevel'],
    );
  }
}

class Lesson {
  final String id;
  final String title;
  final String? content;
  final String? videoUrl;
  final String type;
  final int order;
  final String moduleId;
  final bool completed;

  Lesson({
    required this.id,
    required this.title,
    this.content,
    this.videoUrl,
    required this.type,
    required this.order,
    required this.moduleId,
    this.completed = false,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'],
      videoUrl: json['videoUrl'],
      type: json['type'] ?? 'text',
      order: json['order'] ?? 0,
      moduleId: json['moduleId'] ?? '',
      completed: json['completed'] ?? false,
    );
  }
}

class Module {
  final String id;
  final String title;
  final String courseId;
  final int order;
  final List<Lesson> lessons;

  Module({
    required this.id,
    required this.title,
    required this.courseId,
    required this.order,
    this.lessons = const [],
  });

  factory Module.fromJson(Map<String, dynamic> json) {
    return Module(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      courseId: json['courseId'] ?? '',
      order: json['order'] ?? 0,
      lessons: (json['lessons'] as List?)
              ?.map((l) => Lesson.fromJson(l))
              .toList() ??
          [],
    );
  }
}
