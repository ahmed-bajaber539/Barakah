import { TimeBlock, Category, Priority, Language } from './types';

export const TIME_BLOCKS = [
  TimeBlock.FAJR,
  TimeBlock.PRE_DHUHR,
  TimeBlock.POST_DHUHR,
  TimeBlock.ASR,
  TimeBlock.MAGHRIB,
  TimeBlock.ISHA
];

export const CATEGORIES = [
  Category.WORK,
  Category.LEARNING,
  Category.SPIRITUAL,
  Category.HEALTH,
  Category.OPEN
];

export const PRIORITIES = [Priority.URGENT, Priority.NORMAL];

export const TRANSLATIONS = {
  [Language.ENGLISH]: {
    appName: 'Barakah',
    dashboard: 'Today',
    learning: 'Learning',
    settings: 'Settings',
    addTask: 'Add Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    save: 'Save',
    cancel: 'Cancel',
    title: 'Title',
    category: 'Category',
    priority: 'Priority',
    timeBlock: 'Time Block',
    urgent: 'Urgent',
    normal: 'Normal',
    completed: 'Completed',
    inProgress: 'In Progress',
    dailyWisdom: 'Daily Wisdom',
    source: 'Source',
    uploadJson: 'Upload JSON Content',
    uploadLearning: 'Upload Learning Plan',
    uploadHadith: 'Upload Hadith Collection',
    uploadDhikr: 'Upload Dhikr Collection',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    english: 'English',
    arabic: 'Arabic',
    allTasks: 'All Tasks',
    monthlyView: 'Monthly View',
    emptyState: 'No tasks for this time block. Enjoy the peace.',
    rolloverMessage: 'Unfinished tasks moved to today.',
    progress: 'Daily Progress',
    dailySummary: 'Daily Summary',
    viewSummary: 'View Summary',
    tasksCompleted: 'Tasks Completed',
    focusScore: 'Focus Score',
    achievements: 'Achievements',
    close: 'Close',
    timeBlocks: {
      [TimeBlock.FAJR]: 'Early Morning',
      [TimeBlock.PRE_DHUHR]: 'Late Morning',
      [TimeBlock.POST_DHUHR]: 'Early Afternoon',
      [TimeBlock.ASR]: 'Late Afternoon',
      [TimeBlock.MAGHRIB]: 'Evening',
      [TimeBlock.ISHA]: 'Night',
    }
  },
  [Language.ARABIC]: {
    appName: 'بركة',
    dashboard: 'اليوم',
    learning: 'التعلم',
    settings: 'الإعدادات',
    addTask: 'أضف مهمة',
    editTask: 'تعديل المهمة',
    deleteTask: 'حذف المهمة',
    save: 'حفظ',
    cancel: 'إلغاء',
    title: 'العنوان',
    category: 'الفئة',
    priority: 'الأولوية',
    timeBlock: 'الفترة',
    urgent: 'عاجل',
    normal: 'عادي',
    completed: 'مكتمل',
    inProgress: 'جاري',
    dailyWisdom: 'حكمة اليوم',
    source: 'المصدر',
    uploadJson: 'رفع محتوى JSON',
    uploadLearning: 'رفع خطة التعلم',
    uploadHadith: 'رفع مجموعة الأحاديث',
    uploadDhikr: 'رفع مجموعة الأذكار',
    theme: 'المظهر',
    language: 'اللغة',
    light: 'فاتح',
    dark: 'داكن',
    english: 'English',
    arabic: 'العربية',
    allTasks: 'كل المهام',
    monthlyView: 'عرض شهري',
    emptyState: 'لا توجد مهام في هذه الفترة. استمتع بالهدوء.',
    rolloverMessage: 'تم نقل المهام غير المكتملة لليوم.',
    progress: 'الإنجاز اليومي',
    dailySummary: 'ملخص اليوم',
    viewSummary: 'عرض الملخص',
    tasksCompleted: 'المهام المنجزة',
    focusScore: 'نسبة الإنجاز',
    achievements: 'الإنجازات',
    close: 'إغلاق',
    timeBlocks: {
      [TimeBlock.FAJR]: 'بعد الفجر',
      [TimeBlock.PRE_DHUHR]: 'قبل الظهر',
      [TimeBlock.POST_DHUHR]: 'بعد الظهر',
      [TimeBlock.ASR]: 'بعد العصر',
      [TimeBlock.MAGHRIB]: 'بعد المغرب',
      [TimeBlock.ISHA]: 'بعد العشاء',
    }
  }
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.WORK]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [Category.LEARNING]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  [Category.SPIRITUAL]: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  [Category.HEALTH]: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  [Category.OPEN]: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
};

// Fallback content if no JSON is uploaded
export const DEFAULT_HADITH = {
  id: 'default',
  arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
  english: 'Actions are judged by intentions.',
  source: 'Bukhari & Muslim'
};
