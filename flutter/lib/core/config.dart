class AppConfig {
  static const String baseUrl = String.fromEnvironment(
    'NEOT_API_URL',
    defaultValue: 'http://localhost:3000',
  );

  static const String appName = 'NEOT';
  static const String appVersion = '1.0.0';

  static String get apiBase => '$baseUrl/api';
  static String get authBase => '$apiBase/auth';
  static String get coursesBase => '$apiBase/courses';
  static String get marketplaceBase => '$apiBase/marketplace';
}
