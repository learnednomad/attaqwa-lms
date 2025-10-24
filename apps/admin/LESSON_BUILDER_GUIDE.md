## Lesson Builder Implementation Guide

Complete documentation for the AttaqwaMasjid LMS Lesson Builder with multi-format content support.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Lesson Types](#lesson-types)
4. [Component Structure](#component-structure)
5. [Usage Guide](#usage-guide)
6. [Content Editors](#content-editors)
7. [Validation Rules](#validation-rules)
8. [API Integration](#api-integration)
9. [Future Enhancements](#future-enhancements)

---

## Overview

The Lesson Builder is a comprehensive content creation system that allows teachers and admins to create engaging lessons in multiple formats: video, audio, article, quiz, and interactive content.

### Key Capabilities

- **5 Lesson Types**: Video, Audio, Article, Quiz, Interactive
- **File Upload**: Direct upload for video and audio files
- **URL Support**: Embed from YouTube, Vimeo, or direct links
- **Rich Content**: Markdown editor for articles
- **Quiz Creation**: Multiple choice questions with auto-grading
- **Validation**: Comprehensive form and content validation
- **Accessibility**: Transcript support for video and audio

---

## Features

### ✅ Completed Features

1. **Lesson Form Component** (`components/lessons/lesson-form.tsx`)
   - Multi-type lesson support
   - Dynamic content editors based on lesson type
   - Form validation with error handling
   - File upload with type and size validation

2. **Lesson Creation Page** (`app/(dashboard)/courses/[id]/lessons/new/page.tsx`)
   - Context-aware (shows parent course name)
   - Multipart form data for file uploads
   - Success redirect to course edit page
   - Error display and handling

3. **Lesson Edit Page** (`app/(dashboard)/courses/[courseId]/lessons/[lessonId]/page.tsx`)
   - Pre-populated form with existing data
   - Update functionality
   - Loading and error states
   - Proper routing structure

4. **Course Integration**
   - "Add Lesson" buttons in course edit page
   - Lesson list with edit and delete actions
   - Empty state handling
   - Proper navigation flow

---

## Lesson Types

### 1. Video Lesson

**Purpose**: Video-based learning content

**Content Fields**:
- `videoUrl` (string): YouTube, Vimeo, or direct video URL
- `videoFile` (File): Uploaded video file (MP4, WebM, max 500MB)
- `videoTranscript` (string): Optional text transcript for accessibility

**Upload Modes**:
- URL Mode: Paste link to hosted video
- File Mode: Upload video directly

**Supported Platforms**:
- YouTube
- Vimeo
- Direct video URLs (MP4, WebM)

**Use Cases**:
- Quran recitation demonstrations
- Lecture recordings
- Instructional videos

---

### 2. Audio Lesson

**Purpose**: Audio-based learning content

**Content Fields**:
- `audioUrl` (string): Direct link to audio file
- `audioFile` (File): Uploaded audio file (MP3, WAV, OGG, max 100MB)
- `audioTranscript` (string): Optional text transcript

**Upload Modes**:
- URL Mode: Link to hosted audio
- File Mode: Upload audio directly

**Supported Formats**:
- MP3
- WAV
- OGG

**Use Cases**:
- Hadith narrations
- Arabic pronunciation guides
- Lecture audio

---

### 3. Article Lesson

**Purpose**: Text-based learning content with Markdown support

**Content Fields**:
- `articleBody` (string): Main content with Markdown formatting
- `articleImages` (string[]): Optional images (future enhancement)

**Markdown Support**:
- Headings (# H1, ## H2, ### H3)
- Bold text (**bold**)
- Italic text (*italic*)
- Bullet lists (- item)
- Numbered lists (1. item)
- Links ([text](url))
- Inline code (`code`)

**Use Cases**:
- Islamic jurisprudence explanations
- Seerah narratives
- Aqeedah texts
- Study guides

---

### 4. Quiz Lesson

**Purpose**: Interactive assessment with auto-grading

**Content Fields**:
- `questions` (QuizQuestion[]): Array of quiz questions
- `passingScore` (number): Minimum percentage to pass (0-100)
- `timeLimit` (number): Time limit in minutes (0 = unlimited)

**Question Structure**:
```typescript
interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice';
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}
```

**Features**:
- Multiple choice questions
- Color-coded answer feedback
- Explanations for correct answers
- Points per question
- Passing score threshold
- Optional time limits

**Use Cases**:
- Knowledge assessments
- Chapter reviews
- Certification tests

---

### 5. Interactive Lesson

**Purpose**: Engaging activities and exercises

**Content Fields**:
- `interactiveType` (string): Type of interactive content
- `interactiveData` (any): Configuration data

**Planned Features**:
- Drag-and-drop activities
- Flashcards
- Matching exercises
- Fill-in-the-blank
- Timeline builders

**Status**: 🚧 Coming Soon

---

## Component Structure

### LessonForm Component

**Location**: `components/lessons/lesson-form.tsx`

**Props**:
```typescript
interface LessonFormProps {
  initialData?: Partial<Lesson>;  // For edit mode
  courseId: string;                // Parent course ID
  onSubmit: (data: LessonFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
```

**Form Data**:
```typescript
interface LessonFormData {
  title: string;
  description: string;
  type: LessonType;
  duration: number;
  order: number;
  isRequired: boolean;
  content: LessonContent;
}
```

**Structure**:
1. **Basic Information Section**
   - Title input
   - Description textarea
   - Duration input
   - Order input
   - Required checkbox

2. **Lesson Type Selection**
   - 5 type buttons with icons
   - Visual indication of selected type

3. **Content Editor Section**
   - Dynamic editor based on selected type
   - Type-specific validation
   - File upload support

4. **Form Actions**
   - Cancel button
   - Submit button with loading state

---

### Content Editors

Each lesson type has a dedicated content editor component:

#### VideoContentEditor

**Features**:
- Toggle between URL and File upload modes
- URL input for YouTube/Vimeo/direct links
- File upload with drag-and-drop
- Transcript textarea for accessibility
- File validation (type and size)

**Validation**:
- Video URL or file required
- File type: video/*
- Max size: 500MB

---

#### AudioContentEditor

**Features**:
- Toggle between URL and File upload modes
- URL input for direct audio links
- File upload interface
- Transcript textarea
- File validation

**Validation**:
- Audio URL or file required
- File type: audio/*
- Max size: 100MB

---

#### ArticleContentEditor

**Features**:
- Large textarea for Markdown content
- Markdown quick reference guide
- Character count (future)
- Preview pane (future)

**Validation**:
- Article body required
- Minimum length: 20 characters

**Markdown Examples**:
```markdown
# Main Heading
## Subheading

**Bold text** and *italic text*

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2

[Link text](https://example.com)

`inline code`
```

---

#### QuizContentEditor

**Features**:
- Passing score input (0-100%)
- Time limit input (minutes, 0 = unlimited)
- Add/remove questions dynamically
- Per-question configuration:
  - Question text
  - 4 answer options
  - Correct answer
  - Explanation (optional)

**Validation**:
- At least 1 question required
- Question text required
- All options required
- Correct answer must match an option

**Quiz Settings**:
```typescript
{
  passingScore: 70,        // 70% to pass
  timeLimit: 30,           // 30 minutes
  questions: [
    {
      question: "What are the five pillars of Islam?",
      options: [
        "Shahada, Salah, Zakat, Sawm, Hajj",
        "Prayer, Fasting, Charity, Pilgrimage",
        "Faith, Prayer, Fasting, Alms, Pilgrimage",
        "All of the above"
      ],
      correctAnswer: "Shahada, Salah, Zakat, Sawm, Hajj",
      explanation: "The five pillars are Shahada (faith), Salah (prayer), Zakat (charity), Sawm (fasting), and Hajj (pilgrimage).",
      points: 10
    }
  ]
}
```

---

#### InteractiveContentEditor

**Status**: 🚧 Placeholder

**Planned Features**:
- Drag-and-drop activity builder
- Flashcard creator
- Matching exercise builder
- Timeline creator

---

## Usage Guide

### Creating a Video Lesson

1. Navigate to course edit page
2. Click "Add Lesson" button
3. Fill in basic information:
   - **Title**: "Introduction to Tajweed Rules"
   - **Description**: "Learn the fundamentals of proper Quranic recitation"
   - **Duration**: 15 minutes
   - **Order**: 1
   - **Required**: ✓ (checked)
4. Select "Video Lesson" type
5. Choose upload mode:
   - **URL Mode**: Paste YouTube link
   - **File Mode**: Upload MP4 file
6. Add optional transcript
7. Click "Create Lesson"

---

### Creating an Article Lesson

1. Navigate to course edit page
2. Click "Add Lesson"
3. Fill in basic information:
   - **Title**: "The Life of Prophet Muhammad (PBUH)"
   - **Description**: "A comprehensive overview of the Prophet's biography"
   - **Duration**: 20 minutes
   - **Order**: 2
   - **Required**: ✓
4. Select "Article" type
5. Write content using Markdown:
   ```markdown
   # Early Life

   Prophet Muhammad (peace be upon him) was born in **Mecca** in the year *570 CE*.

   ## Key Events
   - Born in the Year of the Elephant
   - Orphaned at a young age
   - Worked as a shepherd and trader

   [Learn more about the Year of the Elephant](https://example.com)
   ```
6. Click "Create Lesson"

---

### Creating a Quiz Lesson

1. Navigate to course edit page
2. Click "Add Lesson"
3. Fill in basic information:
   - **Title**: "Chapter 1 Quiz: Foundations of Islam"
   - **Description**: "Test your knowledge on the basics"
   - **Duration**: 10 minutes
   - **Order**: 3
   - **Required**: ✓
4. Select "Quiz" type
5. Set quiz settings:
   - **Passing Score**: 70%
   - **Time Limit**: 15 minutes
6. Click "Add Question"
7. Fill in question details:
   - **Question**: "How many pillars of Islam are there?"
   - **Option 1**: "Three"
   - **Option 2**: "Five"
   - **Option 3**: "Seven"
   - **Option 4**: "Ten"
   - **Correct Answer**: "Five"
   - **Explanation**: "Islam has five pillars: Shahada, Salah, Zakat, Sawm, and Hajj"
8. Add more questions as needed
9. Click "Create Lesson"

---

### Editing a Lesson

1. Navigate to course edit page
2. Find the lesson in the list
3. Click "Edit" button
4. Form pre-populated with existing data
5. Make changes
6. Click "Update Lesson"
7. Redirected to course edit page

---

### Deleting a Lesson

1. Navigate to course edit page
2. Find the lesson in the list
3. Click "Delete" button
4. Confirm deletion in dialog
5. Lesson removed (future: API implementation)

---

## Validation Rules

### Form-Level Validation

```typescript
const validateForm = () => {
  const errors = {};

  // Title validation
  if (!title.trim()) {
    errors.title = 'Lesson title is required';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  // Description validation
  if (!description.trim()) {
    errors.description = 'Description is required';
  }

  // Duration validation
  if (duration < 1) {
    errors.duration = 'Duration must be at least 1 minute';
  }

  return Object.keys(errors).length === 0;
};
```

---

### Content-Level Validation

**Video Lesson**:
- Video URL or file is required
- If file: must be video type, max 500MB

**Audio Lesson**:
- Audio URL or file is required
- If file: must be audio type, max 100MB

**Article Lesson**:
- Article body is required
- Minimum 20 characters

**Quiz Lesson**:
- At least 1 question is required
- Each question must have:
  - Question text
  - 4 options filled
  - Correct answer specified

---

## API Integration

### Create Lesson

```typescript
POST /api/lessons
Content-Type: multipart/form-data

FormData:
  data: JSON.stringify({
    title: "Introduction to Tajweed",
    description: "Learn proper Quran recitation",
    type: "video",
    duration: 15,
    order: 1,
    isRequired: true,
    content: {
      videoUrl: "https://youtube.com/watch?v=...",
      videoTranscript: "Full transcript..."
    },
    course: "course_id_here"
  })
  files.video: File (if uploading)
```

**Response**:
```json
{
  "data": {
    "id": "lesson_123",
    "title": "Introduction to Tajweed",
    "type": "video",
    "duration": 15,
    "order": 1,
    "isRequired": true,
    "content": { ... },
    "course": "course_id_here",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### Update Lesson

```typescript
PUT /api/lessons/:id
Content-Type: multipart/form-data

FormData:
  data: JSON.stringify({ ... })
  files.video: File (if uploading new file)
```

---

### Delete Lesson

```typescript
DELETE /api/lessons/:id

Response:
{
  "data": {
    "id": "lesson_123",
    "deleted": true
  }
}
```

---

## Future Enhancements

### High Priority

1. **Rich Text Editor** (WYSIWYG)
   - Replace Markdown textarea with rich editor
   - TipTap or Quill integration
   - Image upload within articles
   - Format toolbar

2. **Video Player**
   - Custom video player component
   - Playback controls
   - Speed adjustment
   - Subtitle support

3. **Quiz Enhancements**
   - True/False questions
   - Fill-in-the-blank
   - Matching questions
   - Question randomization
   - Answer shuffling

4. **Drag-and-Drop Lesson Ordering**
   - Reorder lessons visually
   - Auto-update order numbers
   - React DnD or Sortable.js

---

### Medium Priority

5. **Lesson Preview**
   - Preview before publishing
   - Student view simulation
   - Video/audio playback test

6. **Lesson Templates**
   - Pre-built lesson structures
   - Common quiz templates
   - Islamic education templates

7. **Bulk Import**
   - CSV import for quiz questions
   - Markdown file import for articles
   - Video playlist import

---

### Low Priority

8. **Lesson Analytics**
   - Completion rates
   - Average time spent
   - Quiz score distribution
   - Student feedback

9. **Collaboration**
   - Multi-author support
   - Comments and reviews
   - Version history
   - Draft/review/publish workflow

10. **Accessibility**
    - Screen reader optimization
    - Keyboard navigation
    - High contrast mode
    - Automatic captions

---

## Technical Details

### File Upload Flow

```typescript
// 1. User selects file
<input type="file" onChange={handleFileUpload} />

// 2. Validate file
const handleFileUpload = (e) => {
  const file = e.target.files[0];

  // Type validation
  if (!file.type.startsWith('video/')) {
    setError('Invalid file type');
    return;
  }

  // Size validation
  if (file.size > 500 * 1024 * 1024) { // 500MB
    setError('File too large');
    return;
  }

  // Store file
  onChange('videoFile', file);
};

// 3. Submit with FormData
const formData = new FormData();
formData.append('data', JSON.stringify(lessonData));
formData.append('files.video', videoFile);

await strapiClient.post('/lessons', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

---

### Markdown Rendering (Future)

```typescript
import ReactMarkdown from 'react-markdown';

function ArticleViewer({ content }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold" {...props} />,
        a: ({ node, ...props }) => <a className="text-primary-600 hover:underline" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

---

### Quiz Auto-Grading Logic

```typescript
function gradeQuiz(userAnswers: Record<string, string>, questions: QuizQuestion[]) {
  let correctCount = 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  questions.forEach((question) => {
    totalPoints += question.points;

    if (userAnswers[question.id] === question.correctAnswer) {
      correctCount++;
      earnedPoints += question.points;
    }
  });

  const percentage = (earnedPoints / totalPoints) * 100;
  const passed = percentage >= passingScore;

  return {
    correctCount,
    totalQuestions: questions.length,
    earnedPoints,
    totalPoints,
    percentage,
    passed
  };
}
```

---

## Troubleshooting

### Common Issues

**Issue**: "Video file upload fails"
**Solution**:
1. Check file size < 500MB
2. Verify file type is video/*
3. Check Strapi upload configuration
4. Verify upload plugin is installed

---

**Issue**: "Quiz questions not saving"
**Solution**:
1. Ensure at least 1 question added
2. Verify all question fields filled
3. Check correct answer matches an option
4. Review browser console for errors

---

**Issue**: "Markdown not rendering properly"
**Solution**:
1. Check Markdown syntax
2. Verify no special characters breaking format
3. Use Markdown preview tool
4. Future: Install react-markdown for preview

---

**Issue**: "Lesson order conflicts"
**Solution**:
1. Check order numbers are unique
2. Reorder lessons manually
3. Future: Implement drag-and-drop ordering

---

## Performance Optimization

### File Upload Optimization

```typescript
// Show upload progress
const [uploadProgress, setUploadProgress] = useState(0);

await strapiClient.post('/lessons', formData, {
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadProgress(percentCompleted);
  }
});
```

---

### Lazy Loading

```typescript
// Lazy load content editors
const VideoEditor = lazy(() => import('./VideoContentEditor'));
const AudioEditor = lazy(() => import('./AudioContentEditor'));

function renderContentEditor() {
  return (
    <Suspense fallback={<Spinner />}>
      {type === 'video' && <VideoEditor />}
      {type === 'audio' && <AudioEditor />}
    </Suspense>
  );
}
```

---

## Security Considerations

1. **File Upload Security**:
   - Validate file types on client and server
   - Enforce size limits
   - Scan for malware (future)
   - Store in isolated directory

2. **Content Validation**:
   - Sanitize Markdown input
   - Escape HTML in user content
   - Validate URLs (prevent XSS)

3. **Access Control**:
   - Only teachers and admins can create/edit
   - Students can only view published lessons
   - Validate course ownership

---

## Support

For technical support or feature requests:
- **Email**: support@attaqwa.com
- **Documentation**: /docs
- **Issue Tracker**: GitHub Issues

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
