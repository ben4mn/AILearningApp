import { eras, topics, totalLessons } from '../content/curriculum';
import type { Era, Topic, Lesson } from '../types';

export { eras, topics, totalLessons };

export function getEra(eraId: string): Era | undefined {
  return eras.find((e) => e.id === eraId);
}

export function getTopicsByEra(eraId: string): Topic[] {
  return topics.filter((t) => t.eraId === eraId).sort((a, b) => a.linearOrder - b.linearOrder);
}

export function getTopic(topicSlug: string): Topic | undefined {
  return topics.find((t) => t.slug === topicSlug);
}

export function getLesson(topicSlug: string, lessonSlug: string): { topic: Topic; lesson: Lesson; lessonIndex: number } | undefined {
  const topic = getTopic(topicSlug);
  if (!topic) return undefined;
  const lessonIndex = topic.lessons.findIndex((l) => l.slug === lessonSlug);
  if (lessonIndex === -1) return undefined;
  return { topic, lesson: topic.lessons[lessonIndex], lessonIndex };
}

export function getLessonId(topicSlug: string, lessonSlug: string): string {
  return `${topicSlug}/${lessonSlug}`;
}

/** Get the next lesson across all topics (linear order) */
export function getNextLesson(topicSlug: string, lessonSlug: string): { topicSlug: string; lessonSlug: string } | null {
  const result = getLesson(topicSlug, lessonSlug);
  if (!result) return null;

  const { topic, lessonIndex } = result;

  // Next lesson in same topic
  if (lessonIndex < topic.lessons.length - 1) {
    return { topicSlug, lessonSlug: topic.lessons[lessonIndex + 1].slug };
  }

  // First lesson of next topic
  const sortedTopics = [...topics].sort((a, b) => a.linearOrder - b.linearOrder);
  const topicIndex = sortedTopics.findIndex((t) => t.slug === topicSlug);
  if (topicIndex < sortedTopics.length - 1) {
    const nextTopic = sortedTopics[topicIndex + 1];
    return { topicSlug: nextTopic.slug, lessonSlug: nextTopic.lessons[0].slug };
  }

  return null; // Last lesson of last topic
}

export function getPrevLesson(topicSlug: string, lessonSlug: string): { topicSlug: string; lessonSlug: string } | null {
  const result = getLesson(topicSlug, lessonSlug);
  if (!result) return null;

  const { topic, lessonIndex } = result;

  // Prev lesson in same topic
  if (lessonIndex > 0) {
    return { topicSlug, lessonSlug: topic.lessons[lessonIndex - 1].slug };
  }

  // Last lesson of previous topic
  const sortedTopics = [...topics].sort((a, b) => a.linearOrder - b.linearOrder);
  const topicIndex = sortedTopics.findIndex((t) => t.slug === topicSlug);
  if (topicIndex > 0) {
    const prevTopic = sortedTopics[topicIndex - 1];
    return { topicSlug: prevTopic.slug, lessonSlug: prevTopic.lessons[prevTopic.lessons.length - 1].slug };
  }

  return null;
}

/** Find the first unread/in-progress lesson for "Continue Reading" */
export function findContinuePoint(completedLessons: Set<string>): { topicSlug: string; lessonSlug: string } | null {
  const sortedTopics = [...topics].sort((a, b) => a.linearOrder - b.linearOrder);

  for (const topic of sortedTopics) {
    for (const lesson of topic.lessons) {
      const id = getLessonId(topic.slug, lesson.slug);
      if (!completedLessons.has(id)) {
        return { topicSlug: topic.slug, lessonSlug: lesson.slug };
      }
    }
  }

  return null; // All done!
}

export function getTopicCompletionCount(topicSlug: string, completedLessons: Set<string>): number {
  const topic = getTopic(topicSlug);
  if (!topic) return 0;
  return topic.lessons.filter((l) => completedLessons.has(getLessonId(topicSlug, l.slug))).length;
}

export function isTopicComplete(topicSlug: string, completedLessons: Set<string>): boolean {
  const topic = getTopic(topicSlug);
  if (!topic) return false;
  return topic.lessons.every((l) => completedLessons.has(getLessonId(topicSlug, l.slug)));
}
