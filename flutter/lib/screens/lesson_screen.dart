import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

import '../core/api_client.dart';
import '../models/models.dart';

class LessonScreen extends StatefulWidget {
  final String lessonId;

  const LessonScreen({super.key, required this.lessonId});

  @override
  State<LessonScreen> createState() => _LessonScreenState();
}

class _LessonScreenState extends State<LessonScreen> {
  final _api = ApiClient();
  Lesson? _lesson;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadLesson();
  }

  Future<void> _loadLesson() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _api.get('/lessons/${widget.lessonId}');
      if (response.statusCode == 200) {
        _lesson = Lesson.fromJson(response.data);
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _completeLesson() async {
    try {
      await _api.post('/lessons/${widget.lessonId}/complete');
      setState(() {
        _lesson = Lesson(
          id: _lesson!.id,
          title: _lesson!.title,
          content: _lesson!.content,
          videoUrl: _lesson!.videoUrl,
          type: _lesson!.type,
          order: _lesson!.order,
          moduleId: _lesson!.moduleId,
          completed: true,
        );
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Lesson completed! +XP')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to complete: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _lesson != null ? Text(_lesson!.title) : const Text('Lesson'),
        actions: [
          if (_lesson != null && !_lesson!.completed)
            TextButton(
              onPressed: _completeLesson,
              child: const Text('Complete'),
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : _lesson == null
                  ? const Center(child: Text('Lesson not found'))
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (_lesson!.completed)
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Theme.of(context)
                                    .colorScheme
                                    .primaryContainer,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.check_circle,
                                    color: Theme.of(context)
                                        .colorScheme
                                        .onPrimaryContainer,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Completed',
                                    style: TextStyle(
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onPrimaryContainer,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          if (_lesson!.completed) const SizedBox(height: 16),
                          if (_lesson!.content != null)
                            MarkdownBody(
                              data: _lesson!.content!,
                              styleSheet: MarkdownStyleSheet(
                                h1: const TextStyle(fontSize: 24),
                                h2: const TextStyle(fontSize: 20),
                                h3: const TextStyle(fontSize: 18),
                                p: const TextStyle(fontSize: 16),
                              ),
                            ),
                        ],
                      ),
                    ),
    );
  }
}
