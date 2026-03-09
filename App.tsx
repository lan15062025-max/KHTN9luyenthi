import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  LayoutDashboard,
  GraduationCap,
  Timer,
  AlertCircle,
  Menu,
  Zap,
  X,
  Bot,
  Sparkles,
  User,
  Award,
  Settings,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Subject, QuizResult, Subject as SubjectType } from './types';
import { QUESTIONS, SUBJECTS, TOPICS_BY_SUBJECT } from './constants';
import { ADVANCED_KNOWLEDGE, AdvancedKnowledge } from './advancedKnowledge';
import { THEORY_SUMMARIES, TheorySummary } from './theoryData';

import AITutor from './components/AITutor';

type AppMode = 'home' | 'quiz' | 'result' | 'history' | 'profile' | 'topic_select' | 'ai_tutor';
type QuizType = 'mock' | 'mega' | 'subject' | 'topic';

interface UserProfile {
  fullName: string;
  username: string;
  birthDate: string;
  school: string;
  grade: string;
  joinedDate: string;
  avatarUrl?: string;
  profileColor?: string;
}

export default function App() {
  const [mode, setMode] = useState<AppMode>('home');
  const [quizType, setQuizType] = useState<QuizType>('mock');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Question['level'] | 'Tất cả'>('Tất cả');
  
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Nguyễn Văn Lan',
    username: 'lan15062025',
    birthDate: '2009-06-15',
    school: 'THCS Chu Văn An',
    grade: '9A1',
    joinedDate: '09/03/2026',
    avatarUrl: '',
    profileColor: '#3b82f6'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPickingDuration, setIsPickingDuration] = useState(false);
  const [durationTarget, setDurationTarget] = useState<{type: QuizType, subject?: SubjectType, topic?: string} | null>(null);
  const [selectedAdvancedKnowledge, setSelectedAdvancedKnowledge] = useState<AdvancedKnowledge | null>(null);
  const [selectedTheory, setSelectedTheory] = useState<TheorySummary | null>(null);

  // Load history and profile from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('khtn_quiz_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    const savedProfile = localStorage.getItem('khtn_user_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('khtn_user_profile', JSON.stringify(newProfile));
    setIsEditingProfile(false);
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'quiz' && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, isSubmitted, timeLeft]);

  const startQuiz = (type: QuizType, subject?: SubjectType, topic?: string, customDuration?: number) => {
    if ((type === 'mock' || type === 'mega') && !customDuration) {
      setDurationTarget({ type, subject, topic });
      setIsPickingDuration(true);
      return;
    }

    let filtered: Question[] = [];
    let duration = 0;

    const filterByLevel = (qs: Question[]) => {
      if (selectedLevel === 'Tất cả') return qs;
      return qs.filter(q => q.level === selectedLevel);
    };

    if (type === 'mock') {
      // Standard 40 questions mock exam
      const physics = QUESTIONS.filter(q => q.subject === 'Vật lí').sort(() => Math.random() - 0.5).slice(0, 14);
      const chemistry = QUESTIONS.filter(q => q.subject === 'Hóa học').sort(() => Math.random() - 0.5).slice(0, 14);
      const biology = QUESTIONS.filter(q => q.subject === 'Sinh học').sort(() => Math.random() - 0.5).slice(0, 12);
      
      filtered = [...physics, ...chemistry, ...biology].sort(() => Math.random() - 0.5);
      duration = (customDuration || 50) * 60;
    } else if (type === 'mega') {
      // Mega 120 questions mock exam
      const physics = QUESTIONS.filter(q => q.subject === 'Vật lí').sort(() => Math.random() - 0.5).slice(0, 42);
      const chemistry = QUESTIONS.filter(q => q.subject === 'Hóa học').sort(() => Math.random() - 0.5).slice(0, 42);
      const biology = QUESTIONS.filter(q => q.subject === 'Sinh học').sort(() => Math.random() - 0.5).slice(0, 36);
      
      filtered = [...physics, ...chemistry, ...biology].sort(() => Math.random() - 0.5);
      duration = (customDuration || 150) * 60;
    } else if (type === 'subject' && subject) {
      const subjectQuestions = QUESTIONS.filter(q => q.subject === subject);
      filtered = filterByLevel(subjectQuestions).sort(() => Math.random() - 0.5).slice(0, 20);
      duration = filtered.length * 90; // 90 seconds per question
    } else if (type === 'topic' && topic) {
      const topicQuestions = QUESTIONS.filter(q => q.topic === topic);
      filtered = filterByLevel(topicQuestions).sort(() => Math.random() - 0.5).slice(0, 20);
      duration = filtered.length * 90;
    }

    if (filtered.length === 0) {
      alert('Hiện chưa có câu hỏi cho phần này. Vui lòng chọn phần khác!');
      return;
    }

    setCurrentQuestions(filtered);
    setUserAnswers(new Array(filtered.length).fill(null));
    setCurrentIndex(0);
    setIsSubmitted(false);
    setTimeLeft(duration);
    setStartTime(Date.now());
    setQuizType(type);
    setMode('quiz');
  };

  const startSmartQuiz = () => {
    // Analyze history to find weak subjects/topics
    const subjectScores = SUBJECTS.map(subject => {
      const results = history.filter(h => h.subjectStats[subject]);
      const correct = results.reduce((acc, curr) => acc + curr.subjectStats[subject].correct, 0);
      const total = results.reduce((acc, curr) => acc + curr.subjectStats[subject].total, 0);
      return { subject, score: total > 0 ? correct / total : 1 }; // Default to 1 if no data
    });

    // Sort by lowest score
    subjectScores.sort((a, b) => a.score - b.score);
    
    // Pick top 2 weak subjects or all if not enough data
    const weakSubjects = subjectScores.filter(s => s.score < 0.8).map(s => s.subject);
    const targetSubjects = weakSubjects.length > 0 ? weakSubjects.slice(0, 2) : SUBJECTS;

    let smartQuestions: Question[] = [];
    targetSubjects.forEach(sub => {
      const subQs = QUESTIONS.filter(q => q.subject === sub).sort(() => Math.random() - 0.5).slice(0, 10);
      smartQuestions = [...smartQuestions, ...subQs];
    });

    if (smartQuestions.length === 0) {
      alert('Hãy làm một vài bài kiểm tra trước để AI có thể phân tích điểm yếu của bạn!');
      return;
    }

    setCurrentQuestions(smartQuestions.sort(() => Math.random() - 0.5));
    setUserAnswers(new Array(smartQuestions.length).fill(null));
    setCurrentIndex(0);
    setIsSubmitted(false);
    setTimeLeft(smartQuestions.length * 90);
    setStartTime(Date.now());
    setQuizType('mock'); // Treat as mock for results
    setMode('quiz');
  };

  const handleAnswer = (optionIndex: number) => {
    if (isSubmitted) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const score = userAnswers.reduce((acc, ans, idx) => {
      return ans === currentQuestions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);

    const subjectStats: any = {
      'Vật lí': { correct: 0, total: 0 },
      'Hóa học': { correct: 0, total: 0 },
      'Sinh học': { correct: 0, total: 0 }
    };

    currentQuestions.forEach((q, idx) => {
      subjectStats[q.subject].total++;
      if (userAnswers[idx] === q.correctAnswer) {
        subjectStats[q.subject].correct++;
      }
    });

    const result: QuizResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('vi-VN'),
      score,
      totalQuestions: currentQuestions.length,
      timeTaken,
      subjectStats
    };

    const newHistory = [result, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('khtn_quiz_history', JSON.stringify(newHistory));
    setMode('result');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHome = () => (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-3 bg-blue-100 rounded-2xl mb-2"
        >
          <GraduationCap className="w-12 h-12 text-blue-600" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Ôn Thi Lớp 10 KHTN 9</h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Hệ thống ôn luyện bám sát cấu trúc đề thi tuyển sinh lớp 10 THPT với đầy đủ 3 phân môn Vật lí, Hóa học và Sinh học.
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Smart Quiz Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl cursor-pointer relative overflow-hidden group"
            onClick={startSmartQuiz}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={160} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Luyện tập thông minh</h2>
                  <p className="text-indigo-100 mt-1">AI phân tích lỗ hổng kiến thức và tạo đề luyện tập riêng cho bạn</p>
                </div>
              </div>
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-lg">
                Bắt đầu phân tích <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          {/* Mock Exam Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl cursor-pointer relative overflow-hidden group"
          onClick={() => startQuiz('mock')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Thi Thử Tổng Hợp</h2>
              <p className="text-blue-100 mt-1">40 câu hỏi - Tùy chọn thời gian</p>
            </div>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors">
              Bắt đầu ngay <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Mega Mock Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl cursor-pointer relative overflow-hidden group"
          onClick={() => startQuiz('mega')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Mega Mock Exam</h2>
              <p className="text-indigo-100 mt-1">120 câu hỏi - Tùy chọn thời gian</p>
            </div>
            <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-indigo-50 transition-colors">
              Thử thách <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* History/Stats Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg cursor-pointer flex flex-col justify-between"
          onClick={() => setMode('history')}
        >
          <div className="space-y-4">
            <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Lịch Sử & Thống Kê</h2>
              <p className="text-gray-500 mt-1">Xem lại kết quả và tiến độ học tập của bạn</p>
            </div>
          </div>
          <div className="mt-6 flex items-center text-blue-600 font-semibold gap-2">
            Xem chi tiết <ChevronRight size={18} />
          </div>
        </motion.div>

        {/* AI Tutor Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl cursor-pointer relative overflow-hidden group"
          onClick={() => setMode('ai_tutor')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Bot size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Gia sư AI 24/7</h2>
              <p className="text-emerald-100 mt-1">Giải đáp thắc mắc KHTN tức thì</p>
            </div>
            <button className="bg-white text-emerald-600 px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-emerald-50 transition-colors">
              Hỏi ngay <Sparkles size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="text-blue-600" size={24} />
          Luyện Tập Theo Phân Môn
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SUBJECTS.map((subject) => (
            <motion.button
              key={subject}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedSubject(subject);
                setMode('topic_select');
              }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left space-y-3"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                subject === 'Vật lí' ? 'bg-purple-100 text-purple-600' :
                subject === 'Hóa học' ? 'bg-emerald-100 text-emerald-600' :
                'bg-rose-100 text-rose-600'
              }`}>
                {subject === 'Vật lí' ? <Timer size={20} /> : 
                 subject === 'Hóa học' ? <AlertCircle size={20} /> : 
                 <LayoutDashboard size={20} />}
              </div>
              <span className="block font-bold text-gray-800">{subject}</span>
              <span className="text-xs text-gray-500">
                {QUESTIONS.filter(q => q.subject === subject).length} câu hỏi có sẵn
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTopicSelect = () => {
    if (!selectedSubject) return null;
    const topics = TOPICS_BY_SUBJECT[selectedSubject];
    const levels: { label: string, value: Question['level'] | 'Tất cả' }[] = [
      { label: 'Tất cả', value: 'Tất cả' },
      { label: 'Nhận biết', value: 'NB' },
      { label: 'Thông hiểu', value: 'TH' },
      { label: 'Vận dụng', value: 'VD' }
    ];

    return (
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setMode('home');
                setSelectedLevel('Tất cả');
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-gray-900">Chọn chủ đề: {selectedSubject}</h2>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl self-start">
            {levels.map((l) => (
              <button
                key={l.value}
                onClick={() => setSelectedLevel(l.value)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedLevel === l.value 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startQuiz('subject', selectedSubject)}
            className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between group"
          >
            <div className="text-left">
              <h3 className="text-xl font-bold">Tất cả {selectedSubject}</h3>
              <p className="text-blue-100 text-sm">
                {QUESTIONS.filter(q => q.subject === selectedSubject && (selectedLevel === 'Tất cả' || q.level === selectedLevel)).length} câu hỏi phù hợp
              </p>
            </div>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {topics.map((topic) => {
            const advancedInfo = ADVANCED_KNOWLEDGE.find(ak => ak.subject === selectedSubject && ak.topic === topic);
            const theoryInfo = THEORY_SUMMARIES.find(ts => ts.subject === selectedSubject && ts.topic === topic);
            return (
              <div key={topic} className="relative group">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startQuiz('topic', selectedSubject, topic)}
                  className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left flex items-center justify-between pr-24"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{topic}</h3>
                    <p className="text-xs text-gray-500">
                      {QUESTIONS.filter(q => q.topic === topic && (selectedLevel === 'Tất cả' || q.level === selectedLevel)).length} câu hỏi phù hợp
                    </p>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 z-10">
                  {theoryInfo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTheory(theoryInfo);
                      }}
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                      title="Tóm tắt lý thuyết"
                    >
                      <BookOpen size={18} />
                    </button>
                  )}
                  {advancedInfo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAdvancedKnowledge(advancedInfo);
                      }}
                      className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
                      title="Kiến thức nâng cao"
                    >
                      <Sparkles size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    const question = currentQuestions[currentIndex];
    const progress = ((currentIndex + 1) / currentQuestions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm sticky top-0 z-20 border border-gray-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (confirm('Bạn có chắc muốn thoát bài thi? Kết quả sẽ không được lưu.')) {
                  setMode('home');
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div>
              <h2 className="font-bold text-gray-900">
                {quizType === 'mock' ? 'Thi Thử Tổng Hợp' : question.subject}
              </h2>
              <p className="text-xs text-gray-500">Câu {currentIndex + 1} / {currentQuestions.length}</p>
            </div>
          </div>
          <motion.div 
            animate={timeLeft < 60 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${
            timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
          }`}>
            <Clock size={18} />
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 relative"
          >
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3"
            />
          </motion.div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  {question.level}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {question.topic}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
                {question.content}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.01, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(idx)}
                  className={`p-5 rounded-2xl text-left transition-all border-2 flex items-center justify-between group ${
                    userAnswers[currentIndex] === idx
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <motion.span 
                      animate={userAnswers[currentIndex] === idx ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      userAnswers[currentIndex] === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </motion.span>
                    <span className="font-medium">{option}</span>
                  </div>
                  <AnimatePresence>
                    {userAnswers[currentIndex] === idx && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <CheckCircle2 size={20} className="text-blue-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="px-6 py-3 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all"
          >
            Quay lại
          </motion.button>
          
          {currentIndex === currentQuestions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Nộp bài
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2"
            >
              Tiếp theo <ChevronRight size={18} />
            </motion.button>
          )}
        </div>

        {/* Question Navigator Grid */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Danh sách câu hỏi</h4>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
            {currentQuestions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  currentIndex === idx ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                } ${
                  userAnswers[idx] !== null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const lastResult = history[0];
    if (!lastResult) return null;

    const percentage = Math.round((lastResult.score / lastResult.totalQuestions) * 100);
    
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center space-y-6"
        >
          <div className="relative inline-block">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-100"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={552.92}
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * percentage) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-blue-600"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-gray-900">{lastResult.score}/{lastResult.totalQuestions}</span>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Câu đúng</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {percentage >= 80 ? 'Xuất sắc!' : percentage >= 50 ? 'Khá tốt!' : 'Cần cố gắng thêm!'}
            </h2>
            <p className="text-gray-500">Bạn đã hoàn thành bài thi trong {formatTime(lastResult.timeTaken)}</p>
          </div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.5
                }
              }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
          >
            {Object.entries(lastResult.subjectStats).map(([subject, stats]: [any, any]) => (
              <motion.div 
                key={subject} 
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  show: { y: 0, opacity: 1 }
                }}
                className="p-4 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{subject}</p>
                <p className="text-xl font-bold text-gray-900">{stats.correct}/{stats.total}</p>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.correct / stats.total) * 100 || 0}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className={`h-full ${
                      subject === 'Vật lí' ? 'bg-purple-500' :
                      subject === 'Hóa học' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => setMode('home')}
              className="flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
            >
              Về trang chủ
            </button>
            <button
              onClick={() => startQuiz(quizType, selectedSubject || undefined, selectedTopic || undefined)}
              className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> Làm lại
            </button>
          </div>
        </motion.div>

        {/* Review Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Xem lại đáp án</h3>
          <div className="space-y-4">
            {currentQuestions.map((q, idx) => (
              <div key={idx} className={`p-6 bg-white rounded-3xl border-2 shadow-sm ${
                userAnswers[idx] === q.correctAnswer ? 'border-emerald-100' : 'border-rose-100'
              }`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">Câu {idx + 1} • {q.subject}</span>
                    <p className="font-bold text-gray-900">{q.content}</p>
                  </div>
                  {userAnswers[idx] === q.correctAnswer ? (
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                      <CheckCircle2 size={20} />
                    </div>
                  ) : (
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-full">
                      <XCircle size={20} />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, oIdx) => (
                    <div 
                      key={oIdx}
                      className={`p-3 rounded-xl text-sm ${
                        oIdx === q.correctAnswer 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                          : oIdx === userAnswers[idx]
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-blue-600 uppercase mb-1">Giải thích</p>
                  <p className="text-sm text-blue-800 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Lịch sử làm bài</h2>
        <button 
          onClick={() => setMode('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 space-y-4">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 size={40} className="text-gray-300" />
          </div>
          <p className="text-gray-500">Bạn chưa làm bài thi nào. Hãy bắt đầu ngay!</p>
          <button 
            onClick={() => setMode('home')}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold"
          >
            Về trang chủ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((res) => (
            <div key={res.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-bold text-gray-900">Kết quả: {res.score}/{res.totalQuestions}</p>
                <p className="text-xs text-gray-500">{res.date} • {formatTime(res.timeTaken)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-400 uppercase">Tỉ lệ</p>
                  <p className="font-bold text-blue-600">{Math.round((res.score / res.totalQuestions) * 100)}%</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  (res.score / res.totalQuestions) >= 0.8 ? 'bg-emerald-100 text-emerald-600' :
                  (res.score / res.totalQuestions) >= 0.5 ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {Math.round((res.score / res.totalQuestions) * 100)}
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={() => {
              if (confirm('Xóa toàn bộ lịch sử?')) {
                setHistory([]);
                localStorage.removeItem('khtn_quiz_history');
              }
            }}
            className="w-full py-4 text-rose-600 font-bold hover:bg-rose-50 rounded-2xl transition-colors"
          >
            Xóa lịch sử
          </button>
        </div>
      )}
    </div>
  );

  const renderDurationPicker = () => {
    if (!durationTarget) return null;

    const durations = [
      { label: '50 phút', value: 50 },
      { label: '90 phút', value: 90 },
      { label: '150 phút', value: 150 },
    ];

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="text-blue-600 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Chọn thời gian làm bài</h3>
            <p className="text-gray-500">
              Bạn đang chuẩn bị bắt đầu bài thi {durationTarget.type === 'mock' ? 'Thi Thử Tổng Hợp' : 'Mega Mock Exam'}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {durations.map((d) => (
              <button
                key={d.value}
                onClick={() => {
                  setIsPickingDuration(false);
                  startQuiz(durationTarget.type, durationTarget.subject, durationTarget.topic, d.value);
                }}
                className="w-full py-4 px-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left flex items-center justify-between group"
              >
                <span className="font-bold text-gray-700 group-hover:text-blue-700">{d.label}</span>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500" />
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsPickingDuration(false)}
            className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors"
          >
            Hủy bỏ
          </button>
        </motion.div>
      </div>
    );
  };

  const renderAdvancedKnowledgeModal = () => {
    if (!selectedAdvancedKnowledge) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                <Sparkles size={12} />
                Kiến thức vận dụng cao
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedAdvancedKnowledge.topic}</h3>
              <p className="text-sm text-gray-500">{selectedAdvancedKnowledge.subject}</p>
            </div>
            <button 
              onClick={() => setSelectedAdvancedKnowledge(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Nội dung trọng tâm</h4>
              <p className="text-gray-600 leading-relaxed">{selectedAdvancedKnowledge.content}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <Zap className="text-amber-500" size={20} />
                Mẹo & Chiến thuật giải nhanh
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {selectedAdvancedKnowledge.tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="bg-amber-50 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setSelectedAdvancedKnowledge(null)}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
          >
            Đã hiểu
          </button>
        </motion.div>
      </div>
    );
  };

  const renderTheoryModal = () => {
    if (!selectedTheory) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                <BookOpen size={12} />
                Tóm tắt lý thuyết
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedTheory.topic}</h3>
              <p className="text-sm text-gray-500">{selectedTheory.subject}</p>
            </div>
            <button 
              onClick={() => setSelectedTheory(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Kiến thức cần nhớ</h4>
              <ul className="space-y-2">
                {selectedTheory.summary.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-600 leading-relaxed">
                    <span className="text-blue-500 font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {selectedTheory.keyFormulas && (
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <GraduationCap size={20} />
                  Công thức quan trọng
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedTheory.keyFormulas.map((formula, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-blue-200 text-center font-mono text-sm font-bold text-blue-700">
                      {formula}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setSelectedTheory(null)}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Đã xem xong
          </button>
        </motion.div>
      </div>
    );
  };

  const renderProfile = () => {
    const totalQuizzes = history.length;
    const avgScore = totalQuizzes > 0 
      ? Math.round(history.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / totalQuizzes * 100) 
      : 0;
    const totalCorrect = history.reduce((acc, curr) => acc + curr.score, 0);
    const totalQuestions = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);

    const [editForm, setEditForm] = useState<UserProfile>(profile);

    if (isEditingProfile) {
      return (
        <div className="max-w-2xl mx-auto p-4 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h2>
            <button 
              onClick={() => setIsEditingProfile(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden"
                style={{ backgroundColor: editForm.profileColor || '#3b82f6' }}
              >
                {editForm.avatarUrl ? (
                  <img src={editForm.avatarUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-white font-black text-3xl">{editForm.fullName.charAt(0)}</span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase">Xem trước ảnh đại diện</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
                  <input 
                    type="text" 
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tên đăng nhập</label>
                  <input 
                    type="text" 
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL Ảnh đại diện</label>
                <input 
                  type="text" 
                  placeholder="https://example.com/avatar.jpg"
                  value={editForm.avatarUrl}
                  onChange={(e) => setEditForm({...editForm, avatarUrl: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Màu chủ đạo hồ sơ</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={editForm.profileColor}
                    onChange={(e) => setEditForm({...editForm, profileColor: e.target.value})}
                    className="w-12 h-12 rounded-lg border-none cursor-pointer p-0"
                  />
                  <input 
                    type="text" 
                    value={editForm.profileColor}
                    onChange={(e) => setEditForm({...editForm, profileColor: e.target.value})}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Ngày sinh</label>
                  <input 
                    type="date" 
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Lớp</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: 9A1"
                    value={editForm.grade}
                    onChange={(e) => setEditForm({...editForm, grade: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Trường học</label>
                <input 
                  type="text" 
                  value={editForm.school}
                  onChange={(e) => setEditForm({...editForm, school: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => saveProfile(editForm)}
                className="flex-1 py-3 text-white rounded-xl font-bold transition-colors shadow-lg"
                style={{ 
                  backgroundColor: editForm.profileColor || '#3b82f6',
                  boxShadow: `0 10px 15px -3px ${editForm.profileColor || '#3b82f6'}40`
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      );
    }

    const learningLevel = avgScore >= 90 ? 'Xuất sắc' : avgScore >= 80 ? 'Giỏi' : avgScore >= 65 ? 'Khá' : avgScore >= 50 ? 'Trung bình' : 'Cần cố gắng';
    const levelColor = avgScore >= 90 ? 'text-purple-600' : avgScore >= 80 ? 'text-blue-600' : avgScore >= 65 ? 'text-emerald-600' : avgScore >= 50 ? 'text-amber-600' : 'text-rose-600';

    return (
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h2>
          <button 
            onClick={() => setMode('home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 text-center space-y-4 overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 w-full h-24 opacity-20"
                style={{ backgroundColor: profile.profileColor || '#3b82f6' }}
              />
              <div className="relative inline-block mt-4">
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-white shadow-lg mx-auto overflow-hidden"
                  style={{ backgroundColor: profile.avatarUrl ? 'transparent' : (profile.profileColor || '#3b82f6') }}
                >
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-white font-black text-4xl">{profile.fullName.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{profile.fullName}</h3>
                <p className="text-gray-500 text-sm">@{profile.username}</p>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-center gap-4">
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                  style={{ 
                    backgroundColor: `${profile.profileColor || '#3b82f6'}15`,
                    color: profile.profileColor || '#3b82f6'
                  }}
                >
                  <Settings size={18} />
                  Chỉnh sửa
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <User style={{ color: profile.profileColor || '#3b82f6' }} size={20} />
                Thông tin chi tiết
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Ngày sinh</p>
                    <p className="text-sm font-bold text-gray-700">{new Date(profile.birthDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Lớp & Trường</p>
                    <p className="text-sm font-bold text-gray-700">{profile.grade} - {profile.school}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Tham gia từ</p>
                    <p className="text-sm font-bold text-gray-700">{profile.joinedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <Award className="text-yellow-500" size={20} />
                Thành tích
              </h4>
              <div className="space-y-3">
                {avgScore >= 80 && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-2xl">
                    <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                      <Trophy size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-yellow-700">Học bá KHTN</p>
                      <p className="text-[10px] text-yellow-600">Điểm trung bình trên 80%</p>
                    </div>
                  </div>
                )}
                {totalQuizzes >= 5 && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <Zap size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-700">Chăm chỉ</p>
                      <p className="text-[10px] text-blue-600">Hoàn thành hơn 5 bài thi</p>
                    </div>
                  </div>
                )}
                {totalQuizzes === 0 && (
                  <p className="text-sm text-gray-400 italic text-center py-4">Chưa có thành tích nào</p>
                )}
              </div>
            </div>
          </div>

          {/* Statistics and Performance */}
          <div className="md:col-span-2 space-y-8">
            {/* Main Stats Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Trophy size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Điểm trung bình</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">{avgScore}%</span>
                    <span className={`text-sm font-bold ${levelColor}`}>{learningLevel}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số bài đã làm</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">{totalQuizzes}</span>
                    <span className="text-sm font-bold text-gray-500">bài thi</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Câu đúng</p>
                  <p className="text-xl font-black text-gray-900">{totalCorrect}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <LayoutDashboard size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Tổng số câu</p>
                  <p className="text-xl font-black text-gray-900">{totalQuestions}</p>
                </div>
              </div>
            </div>

            {/* Performance by Subject */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Tỉ lệ trả lời đúng</h3>
                  <p className="text-sm text-gray-500">Chi tiết theo từng phân môn</p>
                </div>
                <BarChart3 className="text-gray-300" size={24} />
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {SUBJECTS.map(subject => {
                  const stats = history.filter(h => h.subjectStats[subject]);
                  const correct = stats.reduce((acc, curr) => acc + curr.subjectStats[subject].correct, 0);
                  const total = stats.reduce((acc, curr) => acc + curr.subjectStats[subject].total, 0);
                  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
                  
                  const color = subject === 'Vật lí' ? '#3b82f6' : subject === 'Hóa học' ? '#10b981' : '#f43f5e';
                  const bgColor = subject === 'Vật lí' ? 'bg-blue-50' : subject === 'Hóa học' ? 'bg-emerald-50' : 'bg-rose-50';
                  const textColor = subject === 'Vật lí' ? 'text-blue-700' : subject === 'Hóa học' ? 'text-emerald-700' : 'text-rose-700';

                  return (
                    <div key={subject} className="group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${bgColor} ${textColor} rounded-xl flex items-center justify-center font-black text-lg`}>
                            {subject.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-800 block leading-none mb-1">{subject}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{correct}/{total} câu đúng</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-gray-900">{percentage}%</span>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h3>
                <Clock className="text-gray-300" size={24} />
              </div>

              <div className="space-y-4">
                {history.length > 0 ? (
                  history.slice(-3).reverse().map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          result.score / result.totalQuestions >= 0.8 ? 'bg-green-100 text-green-600' :
                          result.score / result.totalQuestions >= 0.5 ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">Bài thi {new Date(result.date).toLocaleDateString('vi-VN')}</p>
                          <p className="text-xs text-gray-500">{result.totalQuestions} câu hỏi • {Math.floor(result.timeTaken / 60)} phút</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">{result.score}/{result.totalQuestions}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Điểm số</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-gray-400 italic">Chưa có hoạt động nào</p>
                    <button 
                      onClick={() => setMode('home')}
                      className="text-blue-600 font-bold text-sm hover:underline"
                    >
                      Bắt đầu luyện tập ngay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setMode('home');
              setSelectedLevel('Tất cả');
            }}
          >
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight text-gray-900">KHTN<span className="text-blue-600">9</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => {
              setMode('home');
              setSelectedLevel('Tất cả');
            }} className={`text-sm font-bold transition-colors ${mode === 'home' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Trang chủ</button>
            <button onClick={() => setMode('history')} className={`text-sm font-bold transition-colors ${mode === 'history' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Lịch sử</button>
            <button onClick={() => setMode('profile')} className={`text-sm font-bold transition-colors ${mode === 'profile' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Hồ sơ</button>
            <button onClick={() => setMode('ai_tutor')} className={`text-sm font-bold transition-colors ${mode === 'ai_tutor' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Gia sư AI</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end cursor-pointer" onClick={() => setMode('profile')}>
              <span className="text-xs font-bold text-gray-400 uppercase leading-none">Học sinh</span>
              <span className="text-sm font-bold text-gray-900">{profile.fullName}</span>
            </div>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-opacity-50 transition-all overflow-hidden"
              style={{ 
                backgroundColor: profile.avatarUrl ? 'transparent' : (profile.profileColor || '#3b82f6'),
                boxShadow: `0 0 0 2px ${profile.profileColor || '#3b82f6'}20`
              }}
              onClick={() => setMode('profile')}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-white font-bold">{profile.fullName.charAt(0)}</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4">
        {isPickingDuration && renderDurationPicker()}
        {selectedAdvancedKnowledge && renderAdvancedKnowledgeModal()}
        {selectedTheory && renderTheoryModal()}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {mode === 'home' && renderHome()}
            {mode === 'topic_select' && renderTopicSelect()}
            {mode === 'quiz' && renderQuiz()}
            {mode === 'result' && renderResult()}
            {mode === 'history' && renderHistory()}
            {mode === 'profile' && renderProfile()}
            {mode === 'ai_tutor' && (
              <div className="max-w-3xl mx-auto">
                <AITutor onClose={() => setMode('home')} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating AI Tutor Button */}
      {mode !== 'quiz' && mode !== 'ai_tutor' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMode('ai_tutor')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:bg-blue-700 transition-colors"
        >
          <Bot size={28} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </motion.button>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-100 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight">KHTN<span className="text-blue-600">9</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Ứng dụng hỗ trợ ôn tập kiến thức Khoa học tự nhiên lớp 9, chuẩn bị cho kỳ thi tuyển sinh vào lớp 10 THPT.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Phân môn</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><button onClick={() => startQuiz('subject', 'Vật lí')} className="hover:text-blue-600">Vật lí</button></li>
              <li><button onClick={() => startQuiz('subject', 'Hóa học')} className="hover:text-blue-600">Hóa học</button></li>
              <li><button onClick={() => startQuiz('subject', 'Sinh học')} className="hover:text-blue-600">Sinh học</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Liên hệ</h4>
            <p className="text-sm text-gray-500">Email: lan15062025@gmail.com</p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer">
                <LayoutDashboard size={16} />
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer">
                <BarChart3 size={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-50 text-center text-xs text-gray-400 font-medium">
          © 2026 KHTN9 Prep. All rights reserved. Built with Gemini AI.
        </div>
      </footer>
    </div>
  );
}
