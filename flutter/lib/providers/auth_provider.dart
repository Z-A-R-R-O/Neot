import 'package:flutter/foundation.dart';

import '../core/api_client.dart';
import '../models/models.dart';

class AuthProvider extends ChangeNotifier {
  final _api = ApiClient();
  User? _user;
  bool _isLoading = true;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  String? get error => _error;

  Future<void> init() async {
    await _api.init();
    await _checkSession();
  }

  Future<void> _checkSession() async {
    try {
      final response = await _api.get('/auth/me');
      if (response.statusCode == 200 && response.data['user'] != null) {
        _user = User.fromJson(response.data['user']);
      }
    } catch (e) {
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final cookies = response.headers['set-cookie'];
        if (cookies != null) {
          for (final cookie in cookies) {
            if (cookie.startsWith('neot_session=')) {
              final token = cookie.split('=')[1].split(';')[0];
              await _api.saveSessionToken(token);
              break;
            }
          }
        }

        await _checkSession();
        return true;
      } else {
        _error = response.data['error'] ?? 'Login failed';
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await _api.post('/auth/logout');
    } catch (_) {}
    await _api.clearSession();
    _user = null;
    notifyListeners();
  }
}
