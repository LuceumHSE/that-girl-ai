const { useState, useEffect, useRef, createElement } = React;

// ========== ИКОНКИ (SVG компоненты) ==========
const Icons = {
    Chat: () => createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
        createElement('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })),
    Recipe: () => createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
        createElement('path', { d: 'M4 4h16v16H4z' }),
        createElement('circle', { cx: '12', cy: '12', r: '3' })),
    Schedule: () => createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
        createElement('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
        createElement('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
        createElement('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
        createElement('line', { x1: '3', y1: '10', x2: '21', y2: '10' })),
    Timer: () => createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
        createElement('circle', { cx: '12', cy: '12', r: '10' }),
        createElement('polyline', { points: '12 6 12 12 16 14' })),
    Workout: () => createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
        createElement('path', { d: 'M18 4L20 6L18 8' }),
        createElement('path', { d: 'M6 20L4 18L6 16' }),
        createElement('path', { d: 'M12 2v4M12 18v4' })),
    Water: () => createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
        createElement('path', { d: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' })),
    Book: () => createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 },
        createElement('path', { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' }),
        createElement('path', { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' }))
};

// ========== ГЛАВНЫЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ ==========
const ThatGirlApp = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [user, setUser] = useState({
        name: 'Девушка',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThatGirl',
        goal: 'Стать лучшей версией себя'
    });
    
    // Состояния для разных модулей
    const [waterAmount, setWaterAmount] = useState(0);
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState('');
    const [focusMinutes, setFocusMinutes] = useState(0);
    const [isFocusActive, setIsFocusActive] = useState(false);
    const [focusTimeLeft, setFocusTimeLeft] = useState(0);
    const [scheduleTasks, setScheduleTasks] = useState([]);
    const [recipes, setRecipes] = useState([
        { id: 1, name: 'Смузи "Утренняя сияние"', ingredients: ['Банан', 'Шпинат', 'Манго', 'Миндальное молоко'], time: 5, calories: 180 },
        { id: 2, name: 'Салат с авокадо и лососем', ingredients: ['Авокадо', 'Лосось', 'Руккола', 'Лимон'], time: 10, calories: 320 },
        { id: 3, name: 'Овсянка с ягодами', ingredients: ['Овсяные хлопья', 'Ягоды', 'Мёд', 'Орехи'], time: 7, calories: 250 }
    ]);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [chatMessages, setChatMessages] = useState([
        { role: 'assistant', content: 'Привет, красавица! ✨ Я твой персональный AI-коуч. Готова сегодня стать лучшей версией себя? 🌸' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    
    const chatEndRef = useRef(null);
    const timerInterval = useRef(null);
    
    // Авто-прокрутка чата
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);
    
    // Push уведомления
    const sendNotification = (title, body) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/assets/icon-192.png' });
        }
    };
    
    // Запрос разрешения на уведомления
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
        
        // Цитата дня (уведомление)
        const quoteInterval = setInterval(() => {
            const quotes = [
                'Ты уже достаточно. Ты уже делаешь достаточно. Ты уже — та самая девушка 💫',
                'Маленькие шаги каждый день приводят к большим переменам 🌱',
                'Выбери себя сегодня. И завтра. И всегда 💕',
                'Твоя энергия — твой самый ценный ресурс. Направляй её с любовью ✨'
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            sendNotification('Цитата дня', randomQuote);
        }, 3600000); // Каждый час
        
        return () => clearInterval(quoteInterval);
    }, []);
    
    // ========== ФУНКЦИИ AI ==========
    const sendToAI = async (message) => {
        setIsLoadingAI(true);
        setChatMessages(prev => [...prev, { role: 'user', content: message }]);
        
        // Имитация AI-ответа (в реальном проекте замените на API вызов)
        setTimeout(() => {
            let response = '';
            const lowerMsg = message.toLowerCase();
            
            if (lowerMsg.includes('тренировк') || lowerMsg.includes('спорт')) {
                response = 'Для идеальной формы рекомендую: 🏃‍♀️\n• 15 мин кардио утром\n• Планка 3 подхода\n• Растяжка вечером\nХочешь полный план на неделю? 💪';
            } else if (lowerMsg.includes('рецепт') || lowerMsg.includes('готовить')) {
                response = 'Вот лёгкий и полезный рецепт: 🥗\nСалат с киноа, авокадо и гранатом — полезно, красиво и готовится за 10 минут! Прислать подробный рецепт?';
            } else if (lowerMsg.includes('расписани') || lowerMsg.includes('план')) {
                response = 'Давай составим идеальное расписание! 📋\nКогда ты обычно просыпаешься? И сколько времени хочешь уделять саморазвитию?';
            } else if (lowerMsg.includes('вода') || lowerMsg.includes('пить')) {
                response = `Сегодня ты выпила ${waterAmount} мл воды из 2000 мл. Цель: 2 литра в день! 💧\nХочешь напоминания каждый час?`;
            } else if (lowerMsg.includes('книг') || lowerMsg.includes('читать')) {
                response = 'Чтение — это магия! ✨\nРекомендую "Atomic Habits" Джеймса Клира или "The Artist\'s Way" Джулии Кэмерон. Что тебе ближе?';
            } else {
                response = 'Я чувствую твою энергию, и она прекрасна 🌸\n\nДавай сегодня сделаем что-то особенное: выпей стакан воды с лимоном, сделай 10 приседаний и напиши одну вещь, за которую ты благодарна.\n\nТы справишься, я рядом ✨';
            }
            
            setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsLoadingAI(false);
        }, 1000);
    };
    
    // ========== ТАЙМЕР ФОКУСА ==========
    const startFocus = (minutes) => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        setFocusTimeLeft(minutes * 60);
        setIsFocusActive(true);
        
        timerInterval.current = setInterval(() => {
            setFocusTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerInterval.current);
                    setIsFocusActive(false);
                    sendNotification('Таймер завершён!', 'Отличная работа! Ты справилась 🎉');
                    setFocusMinutes(prevMinutes => prevMinutes + minutes);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    // ========== ГЕНЕРАЦИЯ ПЛАНА ТРЕНИРОВОК ==========
    const generateWorkoutPlan = (goal) => {
        const plans = {
            похудение: ['Кардио 20 мин', 'Приседания 3x15', 'Выпады 3x12', 'Планка 3x30 сек', 'Скакалка 10 мин'],
            тонус: ['Пилатес 15 мин', 'Ягодичный мостик 3x20', 'Отжимания 3x10', 'Растяжка 10 мин'],
            сила: ['Становая тяга 3x12', 'Жим гантелей 3x12', 'Тяга верхнего блока 3x12', 'Пресс 3x20'],
            гибкость: ['Йога 20 мин', 'Растяжка ног 10 мин', 'Прогибы спины 3x30 сек', 'Шпагат подготовка']
        };
        
        const selectedPlan = plans[goal] || plans.тонус;
        setWorkoutPlan({
            goal: goal,
            exercises: selectedPlan,
            duration: '30-40 минут',
            day: 'Сегодня'
        });
        sendNotification('План тренировок готов!', `${goal.toUpperCase()} — твоя цель 💪`);
    };
    
    // ========== КОМПОНЕНТЫ ==========
    const Dashboard = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <img src={user.avatar} alt="avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #e8cfc0' }} />
                <div>
                    <h2 style={{ color: '#5e4b3a', marginBottom: '4px' }}>Привет, {user.name}! ✨</h2>
                    <p style={{ color: '#9b7b6b' }}>{user.goal}</p>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <StatCard icon="💧" value={`${waterAmount} мл`} label="Вода сегодня" color="#b5d3e7" onClick={() => setActiveTab('habits')} />
                <StatCard icon="📚" value={books.length} label="Книг прочитано" color="#e8cfc0" onClick={() => setActiveTab('habits')} />
                <StatCard icon="🎯" value={`${focusMinutes} мин`} label="Время фокуса" color="#c9e4de" onClick={() => setActiveTab('timer')} />
                <StatCard icon="💪" value={workoutPlan ? 'Готов' : 'Не начат'} label="Тренировка" color="#f0d9cd" onClick={() => setActiveTab('workout')} />
            </div>
            
            <div style={{ background: 'white', borderRadius: '24px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '16px', color: '#5e4b3a' }}>Сегодняшние задачи 📋</h3>
                {scheduleTasks.length === 0 ? (
                    <p style={{ color: '#b9a394' }}>Добавь задачи в конструктор расписания ✨</p>
                ) : (
                    scheduleTasks.map((task, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0e6df' }}>
                            <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: '#e8cfc0' }} />
                            <span style={{ flex: 1 }}>{task}</span>
                            <span style={{ fontSize: '12px', color: '#b9a394' }}>•</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
    
    const StatCard = ({ icon, value, label, color, onClick }) => (
        <div onClick={onClick} style={{ background: color, borderRadius: '20px', padding: '16px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#4a372a' }}>{value}</div>
            <div style={{ fontSize: '14px', color: '#6b4f3e' }}>{label}</div>
        </div>
    );
    
    const AIChat = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', background: 'white', borderRadius: '24px', margin: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px', background: '#f9f0e8', borderBottom: '1px solid #e8cfc0' }}>
                <h3 style={{ color: '#5e4b3a' }}>🤍 Твой AI-коуч</h3>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {chatMessages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                        <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: '20px', background: msg.role === 'user' ? '#e8cfc0' : '#f5f0eb', color: msg.role === 'user' ? '#3a2a1f' : '#5e4b3a' }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoadingAI && <div style={{ textAlign: 'center', color: '#b9a394' }}>✨...</div>}
                <div ref={chatEndRef} />
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid #f0e6df', display: 'flex', gap: '12px' }}>
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendToAI(chatInput) && setChatInput('')} placeholder="Напиши что-нибудь..." style={{ flex: 1, padding: '12px', border: '1px solid #e8cfc0', borderRadius: '24px', outline: 'none', background: '#fefaf7' }} />
                <button onClick={() => { sendToAI(chatInput); setChatInput(''); }} style={{ background: '#e8cfc0', border: 'none', borderRadius: '24px', padding: '12px 20px', cursor: 'pointer', color: '#4a372a' }}>Отправить</button>
            </div>
        </div>
    );
    
    const RecipeBook = () => (
        <div style={{ padding: '20px' }}>
            <h3 style={{ color: '#5e4b3a', marginBottom: '16px' }}>📖 Книга рецептов</h3>
            {recipes.map(recipe => (
                <div key={recipe.id} style={{ background: 'white', borderRadius: '20px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ color: '#5e4b3a' }}>{recipe.name}</h4>
                        <span style={{ background: '#f0e6df', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{recipe.calories} ккал</span>
                    </div>
                    <p style={{ color: '#9b7b6b', fontSize: '14px', marginBottom: '8px' }}>⏱️ {recipe.time} мин</p>
                    <p style={{ color: '#6b4f3e' }}>🥑 {recipe.ingredients.join(' • ')}</p>
                </div>
            ))}
        </div>
    );
    
    const ScheduleBuilder = () => {
        const [newTask, setNewTask] = useState('');
        const addTask = () => {
            if (newTask.trim()) {
                setScheduleTasks([...scheduleTasks, newTask]);
                setNewTask('');
            }
        };
        return (
            <div style={{ padding: '20px' }}>
                <h3 style={{ color: '#5e4b3a', marginBottom: '16px' }}>📅 Конструктор расписания</h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Добавить задачу..." style={{ flex: 1, padding: '12px', border: '1px solid #e8cfc0', borderRadius: '24px', outline: 'none' }} />
                    <button onClick={addTask} style={{ background: '#e8cfc0', border: 'none', borderRadius: '24px', padding: '12px 20px', cursor: 'pointer' }}>+</button>
                </div>
                {scheduleTasks.map((task, idx) => (
                    <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '12px 16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="checkbox" style={{ width: '20px', height: '20px' }} />
                        <span style={{ flex: 1 }}>{task}</span>
                        <button onClick={() => setScheduleTasks(scheduleTasks.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#d4b8a8' }}>✕</button>
                    </div>
                ))}
            </div>
        );
    };
    
    const FocusTimer = () => (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#5e4b3a', marginBottom: '32px' }}>🎯 Таймер фокуса</h3>
            <div style={{ fontSize: '72px', fontWeight: '300', fontFamily: 'monospace', marginBottom: '32px', color: '#5e4b3a' }}>
                {isFocusActive ? formatTime(focusTimeLeft) : '25:00'}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => startFocus(5)} style={buttonStyle}>5 мин</button>
                <button onClick={() => startFocus(15)} style={buttonStyle}>15 мин</button>
                <button onClick={() => startFocus(25)} style={buttonStyle}>25 мин</button>
                <button onClick={() => startFocus(45)} style={buttonStyle}>45 мин</button>
            </div>
            {isFocusActive && (
                <button onClick={() => { clearInterval(timerInterval.current); setIsFocusActive(false); }} style={{ ...buttonStyle, marginTop: '20px', background: '#d4b8a8' }}>Остановить</button>
            )}
            <div style={{ marginTop: '32px', background: 'white', borderRadius: '20px', padding: '16px' }}>
                <p style={{ color: '#9b7b6b' }}>Сегодня ты сфокусировалась</p>
                <p style={{ fontSize: '32px', fontWeight: '600', color: '#5e4b3a' }}>{focusMinutes} минут</p>
            </div>
        </div>
    );
    
    const WorkoutPlanner = () => (
        <div style={{ padding: '20px' }}>
            <h3 style={{ color: '#5e4b3a', marginBottom: '16px' }}>💪 План тренировок</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {['похудение', 'тонус', 'сила', 'гибкость'].map(goal => (
                    <button key={goal} onClick={() => generateWorkoutPlan(goal)} style={{ background: '#f0e6df', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>{goal}</button>
                ))}
            </div>
            {workoutPlan && (
                <div style={{ background: 'white', borderRadius: '20px', padding: '20px' }}>
                    <h4 style={{ color: '#5e4b3a', marginBottom: '12px' }}>🎯 Цель: {workoutPlan.goal}</h4>
                    <p style={{ color: '#9b7b6b', marginBottom: '12px' }}>⏱️ Длительность: {workoutPlan.duration}</p>
                    {workoutPlan.exercises.map((ex, idx) => (
                        <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f0e6df' }}>✓ {ex}</div>
                    ))}
                </div>
            )}
        </div>
    );
    
    const HabitTracker = () => (
        <div style={{ padding: '20px' }}>
            <h3 style={{ color: '#5e4b3a', marginBottom: '16px' }}>📊 Трекер привычек</h3>
            
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '16px' }}>
                <h4 style={{ marginBottom: '12px' }}>💧 Вода</h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => setWaterAmount(Math.max(0, waterAmount - 250))} style={smallButton}>-250мл</button>
                    <div style={{ flex: 1, background: '#f0e6df', borderRadius: '12px', height: '12px' }}>
                        <div style={{ width: `${Math.min(100, (waterAmount / 2000) * 100)}%`, background: '#b5d3e7', borderRadius: '12px', height: '100%' }}></div>
                    </div>
                    <button onClick={() => setWaterAmount(waterAmount + 250)} style={smallButton}>+250мл</button>
                </div>
                <p style={{ textAlign: 'center', marginTop: '12px' }}>{waterAmount} / 2000 мл</p>
            </div>
            
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px' }}>
                <h4 style={{ marginBottom: '12px' }}>📚 Книги</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input type="text" value={newBook} onChange={e => setNewBook(e.target.value)} placeholder="Название книги..." style={{ flex: 1, padding: '8px', border: '1px solid #e8cfc0', borderRadius: '20px' }} />
                    <button onClick={() => { if (newBook.trim()) { setBooks([...books, newBook]); setNewBook(''); } }} style={smallButton}>+</button>
                </div>
                {books.map((book, idx) => (
                    <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f0e6df', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{book}</span>
                        <button onClick={() => setBooks(books.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#d4b8a8', cursor: 'pointer' }}>✕</button>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const buttonStyle = { background: '#e8cfc0', border: 'none', padding: '12px 24px', borderRadius: '32px', cursor: 'pointer', color: '#4a372a', fontWeight: '500' };
    const smallButton = { background: '#f0e6df', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' };
    
    const tabs = [
        { id: 'dashboard', label: 'Главная', icon: '🏠' },
        { id: 'chat', label: 'AI', icon: '🤍' },
        { id: 'recipes', label: 'Рецепты', icon: '🍳' },
        { id: 'schedule', label: 'Расписание', icon: '📅' },
        { id: 'timer', label: 'Таймер', icon: '⏱️' },
        { id: 'workout', label: 'Тренировки', icon: '💪' },
        { id: 'habits', label: 'Привычки', icon: '📊' }
    ];
    
    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fdf8f2', minHeight: '100vh', position: 'relative', paddingBottom: '80px' }}>
            <div style={{ background: 'white', padding: '20px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h1 style={{ fontSize: '24px', color: '#5e4b3a', textAlign: 'center' }}>✨ That Girl AI ✨</h1>
            </div>
            
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'chat' && <AIChat />}
            {activeTab === 'recipes' && <RecipeBook />}
            {activeTab === 'schedule' && <ScheduleBuilder />}
            {activeTab === 'timer' && <FocusTimer />}
            {activeTab === 'workout' && <WorkoutPlanner />}
            {activeTab === 'habits' && <HabitTracker />}
            
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', overflowX: 'auto', padding: '12px 16px', gap: '8px', boxShadow: '0 -2px 12px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto' }}>
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: 'none', border: 'none', padding: '8px 12px', borderRadius: '32px', cursor: 'pointer', color: activeTab === tab.id ? '#5e4b3a' : '#b9a394', fontWeight: activeTab === tab.id ? '600' : '400', fontSize: '14px', whiteSpace: 'nowrap' }}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Рендер приложения
ReactDOM.createRoot(document.getElementById('root')).render(createElement(ThatGirlApp));
