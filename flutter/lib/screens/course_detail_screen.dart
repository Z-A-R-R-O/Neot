import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../core/api_client.dart';
import '../models/models.dart';

class CourseDetailScreen extends StatefulWidget {
  final String courseId;

  const CourseDetailScreen({super.key, required this.courseId});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  final _api = ApiClient();
  Course? _course;
  List<Module> _modules = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCourse();
  }

  Future<void> _loadCourse() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _api.get('/courses/${widget.courseId}');
      if (response.statusCode == 200) {
        final data = response.data;
        _course = Course.fromJson(data);
        if (data['modules'] is List) {
          _modules =
              (data['modules'] as List).map((m) => Module.fromJson(m)).toList();
        }
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : _course == null
                  ? const Center(child: Text('Course not found'))
                  : CustomScrollView(
                      slivers: [
                        SliverAppBar(
                          expandedHeight: 200,
                          pinned: true,
                          flexibleSpace: FlexibleSpaceBar(
                            title: Text(_course!.title),
                            background: _course!.thumbnailUrl != null
                                ? CachedNetworkImage(
                                    imageUrl: _course!.thumbnailUrl!,
                                    fit: BoxFit.cover,
                                  )
                                : Container(
                                    color: Theme.of(context)
                                        .colorScheme
                                        .primaryContainer,
                                    child: Icon(
                                      Icons.book_outlined,
                                      size: 64,
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onPrimaryContainer,
                                    ),
                                  ),
                          ),
                        ),
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                if (_course!.description != null) ...[
                                  Text(
                                    _course!.description!,
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                  const SizedBox(height: 16),
                                ],
                                Row(
                                  children: [
                                    _InfoChip(
                                      icon: Icons.schedule,
                                      label:
                                          '${_course!.estimatedMinutes} min',
                                    ),
                                    const SizedBox(width: 8),
                                    _InfoChip(
                                      icon: Icons.trending_up,
                                      label: _course!.difficulty,
                                    ),
                                    if (_course!.subject.isNotEmpty) ...[
                                      const SizedBox(width: 8),
                                      _InfoChip(
                                        icon: Icons.subject,
                                        label: _course!.subject,
                                      ),
                                    ],
                                  ],
                                ),
                                const SizedBox(height: 24),
                                const Text(
                                  'Modules',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                ..._modules.map((module) => _ModuleCard(
                                      module: module,
                                      onTap: (lesson) => context.push(
                                          '/lesson/${lesson.id}'),
                                    )),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(fontSize: 12)),
        ],
      ),
    );
  }
}

class _ModuleCard extends StatelessWidget {
  final Module module;
  final Function(Lesson) onTap;

  const _ModuleCard({required this.module, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ExpansionTile(
        title: Text(module.title),
        subtitle: Text('${module.lessons.length} lessons'),
        children: module.lessons
            .map((lesson) => ListTile(
                  leading: Icon(
                    lesson.completed
                        ? Icons.check_circle
                        : Icons.play_circle_outline,
                    color: lesson.completed
                        ? Theme.of(context).colorScheme.primary
                        : null,
                  ),
                  title: Text(lesson.title),
                  subtitle: Text(lesson.type),
                  onTap: () => onTap(lesson),
                ))
            .toList(),
      ),
    );
  }
}
